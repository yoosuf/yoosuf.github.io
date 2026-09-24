# Astro and StyleX Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Astro 7 and StyleX migration warning-free, mechanically enforced, fully idiomatic, and safe across static, interactive, responsive, and diagram-bearing pages.

**Architecture:** A dependency-free Node 22 architecture checker owns source/output invariants, while ESLint owns StyleX authoring correctness. Astro and React call sites apply full StyleX attribute objects; component-local styles live in StyleX modules and global CSS is restricted to documented cross-cutting selectors. Mermaid remains progressive enhancement but is isolated behind a content-aware, idempotent loader and a separately budgeted client chunk.

**Tech Stack:** Astro 7 static output, StyleX 0.19 with Vite unplugin, React 19 islands, TypeScript 7, Node 22 built-in test runner, ESLint with the StyleX plugin.

**Spec:** `docs/superpowers/specs/2026-09-15-astro-stylex-production-hardening-design.md`

## Global Constraints

- Preserve the existing dirty checkout: never stash, reset, checkout, or discard unrelated changes.
- Do not commit unless the user explicitly asks.
- Do not reintroduce Tailwind CSS or Tailwind utility strings.
- Use `nvm use 22` before Node, npm, typecheck, lint, build, or browser commands.
- All React host elements use `{...stylex.props(...)}`; all Astro elements preserve the full `stylex.attrs(...)` result.
- `*.stylex.ts` and `*.stylex.tsx` use named StyleX exports, semantic tokens, logical properties, and no `!important`.
- `global.css` is limited to reset, root theme selection, markdown/prose, browser-generated DOM, motion, and documented cross-component selectors.
- Do not set `color-scheme` on `body`; it inherits the active root scheme.
- Build and typecheck must finish with no errors or warnings; responsive checks cover 320, 375, 768, and 1024px with no horizontal overflow.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `tests/stylex-architecture.test.mjs` | Node 22 regression tests for StyleX integration and accidental routes |
| `scripts/check-stylex-architecture.mjs` | Reusable source/output architecture checker with machine-readable diagnostics |
| `scripts/build-without-warnings.mjs` | Runs Astro build, rejects warnings, and verifies the generated route/output budget |
| `eslint.config.mjs` | Flat ESLint configuration for Astro/TypeScript/StyleX source rules |
| `src/components/ui/notFound.stylex.ts` | Non-route StyleX module for the 404 page |
| `src/components/ui/page.stylex.ts` | Sole canonical site-width container and page shell styles |
| `src/components/header/header.stylex.ts` | Header-specific styling composed with the canonical container |
| `src/components/services/servicesAccordion.stylex.ts` | Local root/heading styles for the React services island |
| `src/components/services/ServicesAccordion.tsx` | Fully idiomatic React StyleX integration |
| Astro layouts/pages/components using StyleX | Full `attrs()` application, preserving `style` and diagnostic fields |
| `src/layouts/PostLayout.astro` | Idempotent, content-aware Mermaid enhancer and full Astro StyleX attributes |
| `astro.config.mjs` | Explicit diagram-only bundle budget and stable StyleX compilation configuration |
| `package.json` / `package-lock.json` | Lint/test/check commands and ESLint dependencies |
| `src/styles/tokens.stylex.ts` / `src/styles/global.css` | Verified public theme-token parity and documented global-CSS exceptions |

## Task 1: Establish executable architecture regressions

**Files:**
- Create: `tests/stylex-architecture.test.mjs`
- Create: `scripts/check-stylex-architecture.mjs`
- Create: `scripts/build-without-warnings.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `inspectSource({ rootDir }): Diagnostic[]`, where `Diagnostic` is `{ code: string, file: string, message: string }`.
- Produces: `assertCleanSource({ rootDir }): void`, which throws the joined diagnostics.
- Produces: `runBuild({ cwd, command }): Promise<void>`, which rejects on a build warning, a nonzero exit, `dist/notFound.stylex`, or Mermaid in a normal post’s HTML asset references.
- Consumes: Node 22 `node:test`, `node:assert/strict`, `node:child_process`, and `node:fs/promises`; add no testing dependency.

- [ ] **Step 1: Write the failing source-invariant tests**

Create `tests/stylex-architecture.test.mjs` with temporary-fixture tests that expect these diagnostics:

```js
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { inspectSource } from '../scripts/check-stylex-architecture.mjs'

async function fixture(files) {
  const rootDir = await mkdtemp(join(tmpdir(), 'stylex-architecture-'))
  await Promise.all(Object.entries(files).map(async ([file, contents]) => {
    const path = join(rootDir, file)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, contents)
  }))
  return rootDir
}

test('rejects StyleX modules inside Astro routes', async () => {
  const rootDir = await fixture({ 'src/pages/notFound.stylex.ts': 'export const x = 1' })
  assert.deepEqual(inspectSource({ rootDir }).map(({ code }) => code), ['STYLEX_ROUTE_FILE'])
})

test('rejects narrowed StyleX attributes', async () => {
  const rootDir = await fixture({
    'src/pages/index.astro': 'class={stylex.attrs(styles.root).class}',
  })
  assert.deepEqual(inspectSource({ rootDir }).map(({ code }) => code), ['NARROWED_STYLEX_ATTRS'])
})

test('rejects narrowed StyleX React props and legacy utility strings', async () => {
  const rootDir = await fixture({
    'src/components/Menu.tsx': 'className={stylex.props(styles.root).className}\\n<div className="flex gap-3" />',
  })
  assert.deepEqual(
    inspectSource({ rootDir }).map(({ code }) => code),
    ['NARROWED_STYLEX_PROPS', 'LEGACY_UTILITY_CLASS'],
  )
})
```

- [ ] **Step 2: Run the test and verify it fails for the missing module**

Run: `nvm use 22 && node --test tests/stylex-architecture.test.mjs`

Expected: failure with `ERR_MODULE_NOT_FOUND` for `scripts/check-stylex-architecture.mjs`.

- [ ] **Step 3: Implement the smallest reusable checker**

Create `scripts/check-stylex-architecture.mjs`. It must recursively read only
`src/`, ignore `node_modules` and generated directories such as `.astro` and
`dist`, include `.astro`, `.ts`, and `.tsx` source, return sorted diagnostics,
and implement these exact checks:

```js
const routeStylex = /^src\/pages\/.*\.stylex\.[cm]?[jt]sx?$/
const narrowedAttrs = /stylex\.attrs\([\s\S]*?\)\.class\b/g
const narrowedProps = /stylex\.props\([\s\S]*?\)\.className\b/g
const legacyUtility = /class(?:Name)?=["'][^"']*\b(?:flex|grid|gap-\d+|m-0|p-\d+|text-[\w-]+|bg-[\w-]+)\b/

export function inspectSource({ rootDir }) { /* return sorted Diagnostic[] */ }
export function assertCleanSource(options) {
  const diagnostics = inspectSource(options)
  if (diagnostics.length) throw new Error(diagnostics.map((d) => `${d.code} ${d.file}: ${d.message}`).join('\n'))
}
```

The production checker must use line numbers in its messages and reject
`STYLEX_ROUTE_FILE`, `NARROWED_STYLEX_ATTRS`, `NARROWED_STYLEX_PROPS`, and
`LEGACY_UTILITY_CLASS`.

- [ ] **Step 4: Run the test and verify it passes**

Run: `nvm use 22 && node --test tests/stylex-architecture.test.mjs`

Expected: three passing tests.

- [ ] **Step 5: Add the production build wrapper and package commands**

Implement `scripts/build-without-warnings.mjs` using `spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { stdio: ['ignore', 'pipe', 'pipe'] })`. It must buffer stdout/stderr, replay them, and throw on `/\[WARN\]|\[WARN\]|warning:/i`, nonzero status, or `dist/notFound.stylex`.

Add these scripts to `package.json`:

```json
{
  "test:architecture": "node --test tests/stylex-architecture.test.mjs",
  "check:architecture": "node scripts/check-stylex-architecture.mjs",
  "build:clean": "node scripts/build-without-warnings.mjs",
  "check": "npm run test:architecture && npm run check:architecture && npm run lint && npx tsc --noEmit && npm run build:clean"
}
```

When executed directly, `check-stylex-architecture.mjs` must call
`assertCleanSource({ rootDir: process.cwd() })`.

- [ ] **Step 6: Run the production check and capture the expected red result**

Run: `nvm use 22 && npm run check:architecture`

Expected: failure listing the current `STYLEX_ROUTE_FILE`, narrowed attributes,
narrowed React props, and the two legacy utility strings in `ServicesAccordion.tsx`.

- [ ] **Step 7: Review the task boundary**

Run: `git diff --check && git diff -- tests/stylex-architecture.test.mjs scripts/check-stylex-architecture.mjs scripts/build-without-warnings.mjs package.json`

Expected: no whitespace errors. Do not commit without explicit user authorization.

## Task 2: Make all Astro and React StyleX application idiomatic

**Files:**
- Create: `src/components/services/servicesAccordion.stylex.ts`
- Modify: all `src/**/*.{astro,tsx}` files reported by `NARROWED_STYLEX_ATTRS` or `NARROWED_STYLEX_PROPS`
- Modify: `src/components/services/ServicesAccordion.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `assertCleanSource()` from Task 1.
- Produces: zero `NARROWED_STYLEX_ATTRS`, `NARROWED_STYLEX_PROPS`, and `LEGACY_UTILITY_CLASS` diagnostics.
- Produces: `servicesAccordionStyles.stack` and `servicesAccordionStyles.heading`.

- [ ] **Step 1: Confirm the invariant check is red for the actual source**

Run: `nvm use 22 && npm run check:architecture`

Expected: failure exactly identifies every current narrowed application and the
services utility strings; save this output with the task notes.

- [ ] **Step 2: Convert Astro call sites without dropping attributes**

For each Astro component/layout, bind StyleX output once and spread it. For a
plain element use:

```astro
---
const articleAttrs = stylex.attrs(pageStyles.page, pageStyles.container)
---
<article {...articleAttrs}>...</article>
```

For an intentional global hook, preserve attributes while composing its class:

```astro
---
const proseAttrs = stylex.attrs(postStyles.prose)
---
<div {...proseAttrs} class:list={['prose', proseAttrs.class]}>
  <Content />
</div>
```

Use this form for every global hook present in the migration: `page-enter`,
`prose`, `y-post-card`, `y-post-date`, `y-post-heading`, `y-post-title`,
`y-latest-title`, `latest-wash`, `cta-band`, `y-menu-overlay`, `y-menu-link`,
`faq-list`, `ep-item`, `ep-item-soft`, and `ep-chevron`. Never replace
`style={attrs.style}` manually: the spread retains all StyleX attributes.

- [ ] **Step 3: Convert React host elements to props spreads**

Replace all `className={stylex.props(...).className}` forms with direct spreads:

```tsx
<button {...stylex.props(headerStyles.iconBtn)} type="button" aria-label="Close menu" />
```

When a global hook is required, obtain the complete props first and compose only
the class name while preserving any StyleX inline style:

```tsx
const overlayProps = stylex.props(headerStyles.menuOverlay)
<div {...overlayProps} className={`${overlayProps.className} y-menu-overlay`} />
```

Apply base styles before active/variant styles in every `stylex.props()` call.

- [ ] **Step 4: Replace the services utility strings with a co-located module**

Create `src/components/services/servicesAccordion.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex'
import { space } from '../../styles/tokens.stylex'

export const servicesAccordionStyles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: space['3'] },
  heading: { marginBlock: 0 },
})
```

Use `{...stylex.props(servicesAccordionStyles.stack)}` on the accordion root
and `{...stylex.props(servicesAccordionStyles.heading)}` on each heading. Keep
the existing `svc-*` hooks, but add a `global.css` comment immediately before
them explaining that these are intentional cross-descendant island styles.

- [ ] **Step 5: Run the source test and architecture check to verify green**

Run: `nvm use 22 && npm run test:architecture && npm run check:architecture`

Expected: all Node tests pass and the production source checker exits zero.

- [ ] **Step 6: Run focused compile verification**

Run: `nvm use 22 && npx tsc --noEmit`

Expected: zero TypeScript errors.

- [ ] **Step 7: Review the task boundary**

Run: `git diff --check && git diff -- src/components src/layouts src/pages src/styles/global.css`

Expected: only StyleX application and documented-global-hook changes; do not commit.

## Task 3: Remove route leakage and consolidate the canonical container

**Files:**
- Move: `src/pages/notFound.stylex.ts` to `src/components/ui/notFound.stylex.ts`
- Modify: `src/pages/404.astro`
- Modify: `src/components/ui/page.stylex.ts`
- Modify: `src/components/header/header.stylex.ts`

**Interfaces:**
- Consumes: `pageStyles.container` as the only standard 68rem responsive inline-size primitive.
- Produces: no file matching `src/pages/**/*.stylex.ts` and no `dist/notFound.stylex` output.

- [ ] **Step 1: Verify the route-leak invariant remains red before the move**

Run: `nvm use 22 && npm run check:architecture`

Expected: failure with `STYLEX_ROUTE_FILE src/pages/notFound.stylex.ts` if Task 2
has otherwise cleared the source diagnostics.

- [ ] **Step 2: Move and rewire the 404 StyleX module**

Move the file with `mv src/pages/notFound.stylex.ts src/components/ui/notFound.stylex.ts`.
Update `src/pages/404.astro` to import:

```ts
import { notFoundStyles } from '../components/ui/notFound.stylex'
```

Do not change any 404 values or markup semantics in this task.

- [ ] **Step 3: Split header layout from shared container ownership**

Keep the complete width/padding definition only in `pageStyles.container`. In
`headerStyles`, remove `marginInline*`, `maxWidth`, `paddingInline*`, and `width`
from `container`; replace it with `inner` that contains only:

```ts
inner: {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  paddingBlock: space['4'],
},
```

At each header call site, compose `pageStyles.container` before
`headerStyles.inner` with `stylex.props`/`attrs`, so responsive inline padding
has exactly one source.

- [ ] **Step 4: Verify green source and output behavior**

Run: `nvm use 22 && npm run check:architecture && npm run build:clean`

Expected: both commands exit zero; `dist/notFound.stylex` is absent; no Astro/Vite/router warning appears.

- [ ] **Step 5: Review the task boundary**

Run: `git diff --check && git status --short`

Expected: the old route module is deleted, the UI module is untracked/added, and unrelated dirty files remain untouched.

## Task 4: Enforce tokens and StyleX source standards with ESLint

**Files:**
- Create: `eslint.config.mjs`
- Modify: `scripts/check-stylex-architecture.mjs`
- Modify: `tests/stylex-architecture.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/styles/tokens.stylex.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `npm run lint`.
- Produces: `TOKEN_PARITY` diagnostics when `--color-*` values in the CSS root
  theme and `colors` variables in `tokens.stylex.ts` diverge.

- [ ] **Step 1: Add failing token-parity cases**

Extend the fixture test with a CSS light/dark pair and an intentionally divergent
StyleX token. Assert `inspectSource()` returns `TOKEN_PARITY` and the public
token name. Add a second fixture with matching pairs and assert no diagnostic.

- [ ] **Step 2: Run the focused test and confirm the new test fails**

Run: `nvm use 22 && node --test tests/stylex-architecture.test.mjs`

Expected: the token test fails because `TOKEN_PARITY` is not implemented.

- [ ] **Step 3: Implement deterministic token parsing**

Extend the checker to parse only explicit root colour declarations:

```js
const cssLight = extractBlock(css, ':root {', '@media (prefers-color-scheme: dark)')
const cssDark = extractBlock(css, '@media (prefers-color-scheme: dark) {', '}')
const cssToken = /--color-([a-z-]+):\s*(#[0-9a-fA-F]{3,8});/g
const stylexToken = /(\w+):\s*'light-dark\((#[0-9a-fA-F]{3,8}),\s*(#[0-9a-fA-F]{3,8})\)'/g
```

Map `paper→bg`, `ink→text`, `mid→textMuted`, `sub→textDim`, `faint→textFaint`,
`line→border`, and direct names for `wash`, `accent`, and `accentStrong`.
Emit `TOKEN_PARITY` when a named mapping is missing or its light/dark hex values
differ. Do not parse derived `color-mix()` tokens.

- [ ] **Step 4: Install and configure the official StyleX lint rules**

Run: `nvm use 22 && npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-astro @stylexjs/eslint-plugin`

Create `eslint.config.mjs` with JavaScript, TypeScript, Astro, and StyleX
recommended configuration. Keep lint syntax-level and deterministic: it does not
enable TypeScript project-service or type-aware linting because `npx tsc --noEmit`
remains the dedicated strict type check. Append this exact `**/*.{ts,tsx}` block:

```js
import stylex from '@stylexjs/eslint-plugin'

{
  files: ['src/**/*.{ts,tsx}'],
  plugins: { '@stylexjs': stylex },
  rules: {
    '@stylexjs/valid-styles': 'error',
    '@stylexjs/valid-shorthands': ['error', { preferInline: true }],
    '@stylexjs/no-unused': 'error',
    '@stylexjs/enforce-extension': ['error', { themeFileExtension: '.stylex.ts' }],
  },
}
```

Add `"lint": "eslint ."` to `package.json`. Scope ignores to generated
`.astro/`, `dist/`, and `node_modules/`; do not ignore source files.

- [ ] **Step 5: Make the actual token pair pass the new guard**

Adjust only the explicit semantic values in `tokens.stylex.ts` or `global.css`
so all mapped public tokens match exactly. Keep derived alpha/color-mix tokens
in StyleX and public CSS-only rules unchanged.

- [ ] **Step 6: Run the complete source-quality gate**

Run: `nvm use 22 && npm run test:architecture && npm run check:architecture && npm run lint && npx tsc --noEmit`

Expected: every command exits zero with no warnings.

- [ ] **Step 7: Review the task boundary**

Run: `git diff --check && git diff -- package.json package-lock.json eslint.config.mjs scripts tests src/styles`

Expected: dependency changes only support source-quality enforcement; no app behavior changed.

## Task 5: Isolate Mermaid from ordinary pages and make it navigation-safe

**Files:**
- Modify: `src/layouts/PostLayout.astro`
- Modify: `astro.config.mjs`
- Modify: `tests/stylex-architecture.test.mjs`
- Modify: `scripts/build-without-warnings.mjs`

**Interfaces:**
- Produces: `window.__yoosufRenderMermaid(root?: ParentNode): Promise<void>` defined only on Mermaid posts.
- Produces: idempotently marked diagram nodes with `data-mermaid-rendered="true"`.
- Consumes: `astro:page-load` to re-run enhancement after client-router navigation.

- [ ] **Step 1: Write output-level Mermaid regression tests**

Add tests that load fixture HTML strings and assert:

```js
assert.match(diagramPostHtml, /__yoosufRenderMermaid/)
assert.doesNotMatch(normalPostHtml, /__yoosufRenderMermaid|mermaid\.core/)
assert.match(diagramPostHtml, /data-mermaid-rendered/)
assert.match(diagramPostHtml, /astro:page-load/)
```

The fixture test must fail first because current output does not use an idempotent
initializer or navigation lifecycle event.

- [ ] **Step 2: Run the test and confirm it fails for the intended missing behavior**

Run: `nvm use 22 && node --test tests/stylex-architecture.test.mjs`

Expected: Mermaid output assertions fail, while prior source tests remain green.

- [ ] **Step 3: Implement the idempotent lazy enhancer**

Replace the current inline Mermaid script with a Mermaid-post-only script that:

```js
window.__yoosufRenderMermaid = async (root = document) => {
  const blocks = [...root.querySelectorAll('pre[data-language="mermaid"]')]
    .filter((block) => !block.dataset.mermaidRendered)
  if (!blocks.length) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'default' })
  const nodes = blocks.map((pre, index) => {
    const node = document.createElement('div')
    node.className = 'mermaid'
    node.id = `mermaid-${crypto.randomUUID()}-${index}`
    node.textContent = pre.textContent
    node.dataset.mermaidRendered = 'true'
    pre.replaceWith(node)
    return node
  })
  await mermaid.run({ nodes })
}
```

Wrap its first invocation in `requestIdleCallback` with a 3000ms timeout and the
existing `setTimeout` fallback. Catch failures, log one `console.error` with a
`[mermaid]` prefix, and leave an unprocessed code block visible by marking and
replacing a block only after the dynamic import resolves. Register one
`document.addEventListener('astro:page-load', () => scheduleMermaidRender())`
listener; the idempotent selector prevents double rendering.

- [ ] **Step 4: Make the bundle budget explicit without hiding shared bloat**

In `astro.config.mjs`, set `build.chunkSizeWarningLimit` to `700` only after
`build-without-warnings.mjs` verifies that the only asset above 500 kB is a
Mermaid-only lazy chunk and that no normal post preloads/references it. The script
must reject a >500 kB non-Mermaid chunk and reject any Mermaid reference from a
normal post. This removes Vite’s non-actionable lazy-vendor warning while keeping
a meaningful production budget.

- [ ] **Step 5: Run red-to-green output verification**

Run: `nvm use 22 && node --test tests/stylex-architecture.test.mjs && npm run build:clean`

Expected: tests and warning-free build pass; a normal post has no Mermaid script
or Mermaid asset reference; a diagram post has the deferred enhancer.

- [ ] **Step 6: Review the task boundary**

Run: `git diff --check && git diff -- src/layouts/PostLayout.astro astro.config.mjs tests scripts`

Expected: no content/frontmatter changes and no eager Mermaid import.

## Task 6: Full production verification and browser acceptance

**Files:**
- Modify only if a verification failure identifies a defect inside this plan’s scope.

**Interfaces:**
- Consumes: `npm run check`, static `dist/`, and the local production server.
- Produces: dated verification evidence recorded in the final handoff.

- [ ] **Step 1: Run the complete non-browser gate**

Run: `nvm use 22 && npm run check`

Expected: architecture tests, source checker, ESLint, TypeScript, and warning-free
build all exit zero.

- [ ] **Step 2: Serve the exact production output**

Run: `python3 -m http.server 8099 --directory dist`

Expected: local server responds to `http://127.0.0.1:8099/`. If 8099 is occupied,
select an unused port and record it; do not reuse a server whose output directory
cannot be verified.

- [ ] **Step 3: Perform the responsive overflow sweep**

Use the project’s browser/CDP tooling at 320, 375, 768, and 1024px for `/`,
`/services/`, `/blog/`, `/blog/10-event-driven-architecture-questions/`,
`/blog/hello-you/`, `/postwire/`, and `/404.html`. At every checkpoint evaluate:

```js
({
  viewport: innerWidth,
  documentWidth: document.documentElement.scrollWidth,
  ok: innerWidth === document.documentElement.scrollWidth,
})
```

Expected: `ok: true` for all 28 page/viewport combinations.

- [ ] **Step 4: Perform interaction and reduced-motion checks**

At 375px: open the header menu, verify `role="dialog"`, focus moves inside,
Tab wraps, Escape closes, the trigger regains focus, and resize to 768px closes
the menu. On `/services/`, verify the first accordion button starts expanded,
ArrowDown focuses the next trigger, Home focuses the first, End focuses the last,
and the associated panel has `role="region"` plus matching ARIA IDs. Enable
reduced motion and verify page/accordion transitions resolve immediately.

- [ ] **Step 5: Perform the load-motion and Mermaid navigation checks**

Hard reload the home page and capture first-frame/computed styles: headline is
visible, `main#site-main` has `transform: none`, and only opacity transitions.
Hard load a Mermaid post, wait for idle rendering, then navigate away and back
through the Astro client router; each diagram renders once, and a normal post
does not request Mermaid.

- [ ] **Step 6: Inspect final changes before handoff**

Run: `git diff --check && git status --short && find dist -maxdepth 1 -name 'notFound.stylex' -print`

Expected: no whitespace errors, no `dist/notFound.stylex`, no generated `dist/`
or `.astro/` staged/tracked changes, and only scoped source/config/test/docs edits.

- [ ] **Step 7: Hand off without committing**

Report the exact commands, exit statuses, responsive results, interaction results,
and any unavailable browser-performance connector. Do not claim completion until
every required check has current evidence. Do not commit unless explicitly asked.
