# Astro and StyleX production hardening

## Status and scope

This design hardens the in-progress Astro 7, StyleX, and React-island migration
without changing the site's visual language, content model, route structure, or
static hosting model. It is intentionally a consolidation pass, not a redesign.

The checkout is already dirty with the migration. Every change in this work must
compose with that existing work: do not stash, reset, revert, or commit unrelated
files.

## Goals

1. A production build completes with no Astro, Vite, or router warnings.
2. TypeScript stays strict and clean.
3. Component-local UI styles use StyleX; global CSS is limited to documented
   global concerns.
4. The CSS-variable palette used by static HTML/prose and StyleX semantic tokens
   cannot drift silently.
5. Every StyleX result is applied through its full attribute contract, never by
   extracting only its class-name field.
6. Diagram JavaScript loads only on pages that need it; regular pages do not
   inherit Mermaid's client bundle.
7. The canonical page container is shared by shell, page, post, and island
   chrome, preventing viewport-specific width drift.
8. Existing accessibility behavior remains intact: landmarks, skip link, dialog
   focus management, desktop active state, and accordion keyboard navigation.

## Non-goals

- No Tailwind reintroduction.
- No visual rebrand, typography replacement, CMS migration, server rendering,
  or analytics change.
- No replacement of native markdown/prose styling with an all-StyleX system.
- No new testing framework or dependency unless an existing verification path
  cannot express the required regression guard.

## Findings that drive the design

### Route leakage

`src/pages/notFound.stylex.ts` is interpreted as an Astro endpoint. The current
production build emits `/notFound.stylex` and warns that it has no `GET` handler.
Route-adjacent StyleX modules must therefore live outside `src/pages/`.

### Incomplete StyleX migration

`ServicesAccordion.tsx` contains legacy Tailwind class strings for its root stack
and heading reset. This bypasses the token system and makes CSS ownership unclear.
The other `svc-*` rules remain justified global CSS because they deliberately
express descendant, state, and animation selectors across React-rendered markup.

There are also 177 places where a StyleX `attrs()` or `props()` result is reduced
to `.class` or `.className`. That discards the `style` and diagnostic attributes
which StyleX returns for non-class styles. This happens to work for today's
mostly-static rules, but is not the supported integration contract and will fail
silently as dynamic values or variables are introduced.

### Duplicate layout and palette values

`pageStyles.container` and `headerStyles.container` independently encode a 68rem
content width and responsive padding. `tokens.stylex.ts` and `global.css` also
repeat colour literals. Neither duplication has a mechanical guard.

### Client bundle boundary

The production build reports a minified chunk above 500 kB. Output inspection
shows Mermaid and its diagram engines as the largest emitted JavaScript assets.
Post diagram hydration must preserve progressive enhancement while placing the
Mermaid import behind a content-aware dynamic boundary.

### Verification gap

The repository has build and type-check commands but no automated invariant check
for source ownership, accidental route files, output warnings, or token parity.
The project instructions additionally require a responsive overflow sweep after
layout work.

## Design

### 1. Style ownership model

Use these explicit ownership rules:

| Concern | Owner | Reason |
| --- | --- | --- |
| Component layout, spacing, colour, responsive declarations, and component states | StyleX module adjacent to its component or in `components/ui/` | Static, typed, composable component styles |
| Reset, `:root` theme selection, prose/markdown, Shiki, Mermaid-rendered DOM, view transitions, reduced-motion override, and cross-component descendant selectors | `src/styles/global.css` | These selectors are global by nature or target markup generated outside the component compiler |
| Design values | semantic StyleX variables plus matching public CSS custom properties | StyleX consumers and static/prose CSS both need them |

The codebase also adopts these non-negotiable StyleX authoring standards:

- Every React DOM element applies styles with a direct
  `{...stylex.props(base, conditional)}` spread. It never reads only
  `.className`.
- Every Astro element uses the full `stylex.attrs()` result. If an intentional
  global hook must be composed (for example `prose` or `page-enter`), the
  generated attributes are spread first and the class is composed with
  `class:list`; the serialized StyleX `style` and diagnostic attributes remain
  intact.
- `*.stylex.ts`/`*.stylex.tsx` modules hold StyleX styles and variables only.
  They use named exports, logical CSS properties, semantic tokens, and stable
  descriptive names. Raw palette literals, arbitrary spacing, physical
  directional properties, and `!important` are prohibited in component modules.
- `class` and `className` are reserved for intentional global hooks documented
  in the ownership table. They may not encode a utility framework or
  component-local styling.
- Style composition order is explicit: base first, variant/state second, and a
  caller-supplied `style` prop last unless the component deliberately protects a
  required invariant. This follows StyleX's deterministic last-applied-wins
  semantics.
- `global.css` may not grow a component-local single-element rule merely to
  avoid creating a StyleX module. Every exception is named and explained in a
  nearby comment.

Create a named StyleX stack/heading style for `ServicesAccordion` and remove the
remaining Tailwind utilities. Keep the `svc-*` global rules, but group and label
them as an intentional React-island exception rather than an incomplete migration.

Migrate every existing narrowed `attrs(...).class` / `props(...).className`
application to the appropriate full-attribute form. This is a mechanical change
with browser-output verification, not a visual change.

Move `notFound.stylex.ts` to `src/components/ui/notFound.stylex.ts` and update the
404 page import. This removes its accidental routing meaning.

Extract the common 68rem responsive container into `pageStyles.container` as the
only canonical primitive. Header uses that primitive plus a header-only vertical
padding style; it must not redefine width or inline spacing.

### 2. Token consistency contract

Retain the current semantic names and system colour-scheme behavior. Do not set
`color-scheme` on `body`; StyleX `light-dark()` values depend on inheriting the
scheme selected at `:root`.

Add a small dependency-free Node verification script that reads the canonical
theme declaration and asserts that all public colour variables consumed by
`global.css` are represented in `tokens.stylex.ts`, including both light and dark
values. The script reports the exact missing or mismatched token and exits nonzero.
It is a build-quality guard, not a runtime dependency.

Add a `check` package script that runs the static invariant checks, TypeScript,
and production build. The build stage must fail the check if warning output is
introduced. Existing direct `build` and `astro` commands remain unchanged for
local development.

Add ESLint with the official StyleX plugin and enforce `valid-styles`,
`valid-shorthands` with logical directions preferred, `no-unused`, and
`enforce-extension` for `.stylex.ts`. Configure it as an error-level CI check.
This gives the migration a durable, source-level guard beyond TypeScript's
structural checks.

### 3. Astro delivery and Mermaid isolation

Keep static output, compression, inlined stylesheets, `ClientRouter`, sitemap,
and deferred analytics exactly as they are.

In `PostLayout.astro`, determine whether the rendered content includes Mermaid
fences or Mermaid placeholders before emitting its client activation code. Only
then emit a minimal inline loader that dynamically imports Mermaid after idle
time. The loader must:

- render diagrams in place without blocking first paint;
- work after Astro client-router navigation as well as on the first page load;
- avoid a second initialization of diagrams that were already rendered;
- tolerate an import/render failure without hiding the original code block;
- respect reduced motion by not adding animation behavior.

The implementation must be verified against a post with Mermaid and a post
without it. A diagram-only chunk is acceptable; a shared initial chunk over the
Vite warning threshold is not.

### 4. Accessibility and responsive invariants

Preserve the established dialog and accordion patterns. During the implementation
verify the mobile menu's focus trap, Escape close, focus restore, body scroll lock,
and desktop resize close. Verify accordion `aria-expanded`, `aria-controls`,
regions, roving tab order, Arrow/Home/End navigation, and native link behavior.

At widths 320, 375, 768, and 1024 pixels, every checked page must satisfy:

```
window.innerWidth === document.documentElement.scrollWidth === viewport.width
```

The browser check covers home, services, blog index, a Mermaid post, a normal
post, Pinemail, and 404. It also confirms the page-load reveal remains opacity
only, with the headline visible in the first frame.

## Implementation sequence

1. Add regression checks that fail for route leakage, token mismatch, or build
   warnings; add StyleX lint rules and run each guard to capture expected
   failures.
2. Move the 404 style module and consolidate the canonical container.
3. Convert all StyleX call sites to full `attrs()`/`props()` application.
4. Complete the `ServicesAccordion` StyleX migration, leaving documented global
   selectors only where StyleX cannot express the relationship.
5. Make CSS/StyleX token parity mechanically checked.
6. Refactor Mermaid activation into a content-aware, idempotent lazy boundary.
7. Run static checks, lint, TypeScript, production build, responsive sweep, interaction
   checks, and the required motion frame trace.

## Acceptance criteria

- `npx tsc --noEmit` exits zero.
- `npm run build` exits zero with no warnings, produces 51 expected pages (plus
  normal pagination growth), and does not produce `dist/notFound.stylex`.
- `npm run check` exits zero and detects deliberately introduced route/token/
  warning regressions during its test-first development.
- `npm run lint` exits zero with the StyleX rules enabled.
- No `.astro`, `.stylex.ts`, or output artifact is accidentally treated as a
  route beyond intended `src/pages` entry files.
- No Tailwind utility string remains in React islands.
- No StyleX call site discards `attrs()`/`props()` fields by accessing only
  `.class` or `.className`.
- Every StyleX module conforms to the authoring standards above; component-local
  styles do not leak back into global CSS.
- The canonical container is used by all standard site shells without horizontal
  overflow from 320px upward.
- Mermaid is absent from a normal post's initial client asset graph and functions
  correctly on a diagram post after hard and client-router navigations.
- Existing a11y behavior continues to work at keyboard-only interaction and
  reduced-motion settings.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Generated CSS ordering changes when consolidating StyleX modules | Preserve StyleX composition order and compare production output/browser layout at all required widths |
| Mermaid loader races after client-router navigation | Use a single idempotent initializer bound to Astro navigation lifecycle events |
| A parity checker overfits formatting rather than values | Parse only the explicit semantic variable declarations and test diagnostics with fixture-like temporary edits |
| Existing dirty migration overlaps target files | Inspect each diff before patching; confine edits to the agreed files and never discard existing changes |

## Files expected to change

- `astro.config.mjs`
- `package.json`, `package-lock.json`
- `eslint.config.*`
- `src/layouts/PostLayout.astro`
- `src/components/services/ServicesAccordion.tsx`
- `src/components/ui/page.stylex.ts`
- `src/components/header/header.stylex.ts`
- `src/pages/404.astro`
- `src/pages/notFound.stylex.ts` moved to `src/components/ui/notFound.stylex.ts`
- `src/styles/tokens.stylex.ts`
- `src/styles/global.css`
- New dependency-free quality-check script and focused tests/fixtures where the
  existing toolchain supports them

No content, product microsite styling, or unrelated legacy files are in scope.
