# AGENTS.md — yoosuf.github.io (Astro rebuild)

Project instructions for AI coding agents. Read this before making changes.

## What this is

A static site for **Yoosuf Mohamed**, Systems Architect. Rebuilt from Jekyll on the
`feature/astro-tailwind` branch: **Astro 7 + StyleX (`@stylexjs/stylex`) + React 19
islands + TypeScript**. **Tailwind CSS has been fully removed** from the pipeline
(uninstalled; `global.css` now provides the reset, design tokens, `.prose`
typesetting, and shared component/composite classes). Vanilla HTML/SCSS conventions
from the Jekyll era no longer apply here.

Live site: https://yoosuf.me (CNAME in `public/CNAME`).

## Commands

```bash
nvm use 22                    # system node is v20 — Node 22 required
npm run dev                   # local dev at http://localhost:4000
npm run build                 # build to dist/ — always run as a smoke test after edits
npx tsc --noEmit              # typecheck all TS/TSX (zero errors expected)
python3 -m http.server 8098   # serve dist/ for browser checks
```

Always run `npm run build` + `npx tsc --noEmit` after editing layouts, components,
islands, content, or config. Build must finish with **no errors or warnings** (currently 51
pages; the blog paginates 10 posts per page, so the total grows by one page per 10 posts).

## Structure at a glance

- `src/layouts/` — `BaseLayout.astro` (shell, head/meta, GA, `ClientRouter`), `PostLayout.astro`, `post.html`/`blog.html` equivalents
- `src/components/` — Astro components + React islands
  - `header/Header.astro` — vanilla header (sticky bar, desktop nav, hamburger +
    full-page dialog). Dialog behaviour (focus trap, Escape, scroll lock,
    stagger entrance) is a bundled vanilla script inside the component — no
    React runtime, so react-dom only ships to pages with actual islands.
  - `services/ServicesAccordion.tsx` — React island (`client:idle`): accessible accordion
  - `ReactIcon.tsx` — typed inline SVG icon set for React islands (Astro components use `Icon.astro`)
  - `EngagementPricing.astro` — structural component that mounts the services island
- `src/pages/` — route pages; `src/pages/blog/[...slug].astro` renders posts
- `src/content/blog/*.md` — blog posts, named `YYYY-MM-DD-slug.md`
- `src/content.config.ts` — content collection schemas (authoritative front matter contract)
- `src/data/services.ts` — service data shared by Astro + React
- `src/config.ts` — `SITE`, `NAV`, socials (single source of truth)
- `src/styles/` — `tokens.stylex.ts` (single source of palette; semantic tokens,
  `light-dark()` colours resolved via `color-scheme` on `:root`), `global.css`
  (preflight-equivalent reset, `--color-*` design tokens, `.prose` markdown
  typesetting, motion keyframes, group-hover composites)
- `src/components/ui/` — StyleX style modules + shared primitives: `primitives.ts`
  (srOnly, kicker, headings, body, buttons, pills, chips, stat, dividers),
  `Breadcrumbs.tsx`, `page.stylex.ts` (page shell), plus per-area
  modules (`home`, `postCard`, `post`, `blog`, `services`, `header`, `footer`, `shell`)
- `astro.config.mjs` — `stylexVite` plugin only (no Tailwind), prefetch,
  `inlineStylesheets: 'always'`, pinned `lightningcssOptions.targets`

## Editing blog posts

Load the `astro-blog` skill when creating or editing posts. Front matter follows `src/content.config.ts`:

- `title`, `author: Yoosuf Mohamed`, `date`, `subTitle?`, `permalink: /blog/<slug>`,
  `published: true`, `description`, `categories`, `tags`.
- Filename date must match `date`. Permalink: lowercase kebab-case, no date, no trailing slash.
- **No Jekyll timezone gotcha anymore:** Astro doesn't skip future-dated posts. Just use a
  sane UTC `date` for the publish day.
- Categories come from the existing set (`AI & Tech`, `Engineering`, `Personal`, ...).
  Reuse existing tags.
- Diagrams may use **mermaid** fenced blocks (` ```mermaid `) — rendering is deferred
  with `requestIdleCallback` in `PostLayout.astro`.

## Voice & style (critical)

This is a personal blog. Write like a human, first person, in Yoosuf's voice:

- Conversational, contractions, varied sentence length. Short punches and long rambles.
- First-person opinions and asides welcome.
- No AI tells: no repeated "The Good/Bad/Ugly" scaffolding, no perfectly parallel bullets
  everywhere, no formulaic bold thesis lines, no emojis.
- Reference real research/sources where relevant (ILO, WEF, Academy of Management, etc.).

See the `astro-blog` skill for the full voice guide and workflow.

## React + TypeScript conventions (islands)

- Islands for interaction: `services/ServicesAccordion.tsx` (`client:idle`). The header
  is deliberately **vanilla** (bundled script in `Header.astro`) so react-dom does not
  ship on pages without islands. Keep mermaid + postwire (`WAAPI`) logic vanilla — not every component needs React.
- **Never call `window`/`document` during render.** SSR renders server-side; server-pinned
  values (like `currentPath`) must come in as props from the Astro wrapper.
- Shared typed icons in `ReactIcon.tsx`. React island markup
  uses `stylex.props(styles.key).className`; Astro components use
  `stylex.attrs(styles.key).class`. Put sophisticated island chrome (e.g. `.svc-*`)
  in `global.css` `@layer components` — scoped styles can't reach React-rendered DOM.
- Styles must live in StyleX modules (compiled by `stylexVite`); the unplugin only
  transforms `.js/.jsx/.ts/.tsx`, so `.astro` files import the compiled style module.
- **Never write Tailwind utility classes** — the packages are uninstalled.

## a11y standards (non-negotiable)

- Modals (mobile menu): `role="dialog"` + `aria-modal="true"`, labelled,
  focus-trapped, `Escape` closes, scroll-lock, focus restores to trigger.
  Reference implementation: the bundled vanilla script in `Header.astro`.
- Accordions: button triggers with `aria-expanded`/`aria-controls`, `role="region"`
  panel labelled by the trigger, roving tabindex + arrow/Home/End. Reference: `ServicesAccordion.tsx`.
- **FAQ/disclosure lists:** there is ONE site-wide native-`<details>` FAQ design
  (services `Common questions` + the postwire FAQ). Use the shared hooks
  `data-faq-item` / `data-faq-chevron` / `data-faq-body` — the open-state chrome
  (marker removal, item dividers, chevron rotate → accent, body reveal) is
  composited once in `BaseLayout.astro`. Don't fork a variant (no plus/minus
  toggles, no per-page hooks).
- Desktop nav links: `aria-current="page"`. Page shell: skip-link, landmarks, `main` focus target.

## Responsive & layout (critical)

- **No horizontal scroll allowed at any width** (320px up). The single content width
  comes from `pageStyles.container` in `page.stylex.ts` (max 68rem, auto-centred,
  responsive inline padding) — compose it onto any page/article shell (or use
  `primitives`/`page` keys) like `services.astro`, `BlogIndex.astro`, `PostLayout.astro`,
  `404.astro`, and `index.astro` do.
- Wide tables/docs (e.g. postwire `.pm-doc-table`) must be wrapped for contained
  horizontal scrolling, never left loose in the page flow.
- After layout changes, verify with the CDP overflow sweep across 320/375/768/1024:
  every page must report `innerW == htmlW == vw`.

## StyleX + global.css conventions (no Tailwind)

- **Tokens** are the single source of palette: `tokens.stylex.ts` for StyleX (`defineVars`
  with `light-dark()` values), and the matching `--color-*` custom properties in
  `global.css:root` (plus a `prefers-color-scheme: dark` override) for plain-CSS rules.
  Keep the two in lockstep.
- **Hand-written `.prose`** in `global.css` `@layer components` replaces the removed
  `@tailwindcss/typography` plugin; style markdown there, not via utilities.
- **The preflight-equivalent reset lives inside a `@layer base` block.** Unlayered CSS
  outranks *every* layer, so any unlayered reset would silently kill `.prose` and
  StyleX styling (e.g. `h1..h6 { font-size: inherit }`). Keep it in the layer.
- **Never set `color-scheme` on `body`** — it must inherit from `:root` so `light-dark()`
  (used by the StyleX tokens applied on `body`) resolves to the active scheme. `:root`
  declares `color-scheme: light` with a dark override in the media query.
- Shared styles: reuse `primitives.ts` before inventing classes; compose with
  `stylex.attrs(a, b).class`. Descendant/group-hover composites (`.product-card:hover
  .y-product-title`, `.y-post-card:hover .y-post-title`, ...) remain in `global.css` —
  StyleX can't express them.

## Load motion (single entrance — no jerk)

The page-load reveal is intentionally **one clean motion**: a pure opacity fade on
`main#site-main` (`.yt-first .page-enter` → `@keyframes page-fade`, 0.45s, **no translate**),
fired only on a true first load / hard reload (`.yt-first` is set synchronously in
`BaseLayout.astro` via `sessionStorage 'yt-nav'`). View-transition navigations skip it.

- Hero children must **not** animate separately on load — the old per-element stagger
  kept the headline invisible ~230ms while the whole page slid beneath it; that compound
  motion reads as a jerky load. The `hero-enter`/`--hero-index` classes are gone; don't
  re-introduce them.
- `@keyframes page-enter` (10px rise) exists only for the `.svc-panel` accordion panels —
  keep it separate from the page reveal.
- Any new motion must be gated behind `prefers-reduced-motion` and verified with the
  frame-trace check: headline visible at frame one, `main` fades 0→1 with `transform: none`,
  no long tasks / rAF gaps > 25ms while it runs, CLS stays 0.

## Gotchas

- `transition:persist` on the former React header island caused stale-hydration bugs; the
  header is now vanilla (no hydrating state), so the dialog restarts closed per navigation.
- `@astrojs/react` must stay in `astro.config.mjs` `integrations`; removing it breaks the islands.
- View transitions: `<ClientRouter/>` from `astro:transitions`; prefetch via config.
- `build.inlineStylesheets: 'always'` inlines CSS into HTML (no render-blocking CSS request).
- Keep GA deferred (idle/pointerdown, PROD only) so third-party JS stays off the critical path.
- The `stylexVite` unplugin re-processes collected CSS through Lightning CSS with old
  browserslist defaults, which lower `light-dark()` into a broken `var()` polyfill. The
  pinned `lightningcssOptions.targets` in `astro.config.mjs` prevents that.
- Never commit `dist/`, `.astro/` (gitignored).
- Only commit when explicitly asked.

## Verification checklist (end of any task)

1. `npx tsc --noEmit` — clean.
2. `npm run build` — no warnings.
3. Responsive sweep if layouts changed — no horizontal overflow at 320+.
4. If you touched load motion, run the frame-trace check (headline at frame one, fade-only,
   no long tasks) — see "Load motion" above.
5. If a post is notable, add it to `public/llms.txt`.