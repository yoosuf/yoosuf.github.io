---
name: astro-dev
description: Develop, refactor, or debug code on yoosuf.me (yoosuf.github.io), an Astro 7 (static) site styled with StyleX (@stylexjs/stylex) and featuring React 19 islands. Use when editing layouts, components, islands, hooks, styles, Astro config, or running the build/typecheck/overflow/load-motion verification. Not for blog post content — use astro-blog for that.
---

# astro-dev — building the Astro site

Stack: Astro 7 (static) + StyleX (`@stylexjs/stylex`, via the `stylexVite` unplugin) + React 19 islands + TypeScript, built with `@astrojs/react`, `@astrojs/sitemap`, view transitions (`ClientRouter`), prefetch, and `build.inlineStylesheets: 'always'`. **There is no Tailwind CSS** — do not write utility classes or add Tailwind packages.

## Environment

```bash
nvm use 22      # Node 22 required (system node is v20)
```

## When to use React (islands) vs vanilla

Only interactive components become React islands; everything else stays Astro/StyleX:

- `header/Header.tsx` — `client:load`, full-page mobile dialog menu (`useMenuDialog`).
- `services/ServicesAccordion.tsx` — `client:idle`, roving-tabindex accordion.
- Keep mermaid and the postwire WAAPI flow script vanilla — don't chase React for its own sake.

Dependencies for islands: `@astrojs/react` in `astro.config.mjs` `integrations`, `react`, `react-dom`, `@types/react`. If they're missing, that's the first thing to check.

## Rules for islands

- **Never reference `window`/`document` at render time.** SSR renders server-side. Server values (e.g. `currentPath`) must arrive as props from the Astro wrapper, or from a `useEffect`/event handler.
- Style island markup with StyleX modules: React islands use `stylex.props(styles.key).className`; Astro components use `stylex.attrs(styles.key).class`. Sophisticated island chrome (e.g. `.svc-*`) lives in `src/styles/global.css` `@layer components` — scoped `.astro` `<style>` can't reach React-rendered DOM.
- Styles live in StyleX modules (compiled by `stylexVite`); the unplugin only transforms `.js/.jsx/.ts/.tsx`, so `.astro` files import the compiled style module.
- Typed icons for islands: `ReactIcon.tsx` (union of `IconName`). Astro components use `Icon.astro` — don't cross-use.

## a11y standards (non-negotiable)

- Modal dialog (mobile menu): `role="dialog"` + `aria-modal="true"`, labelled, focus trap, `Escape` closes, scroll lock, focus restored on close. Reference: `src/hooks/useMenuDialog.ts`.
- Accordion: `<button>` triggers with `aria-expanded`/`aria-controls`; `role="region"` panel labelled by trigger; roving tabindex + Arrow/Home/End. Reference: `ServicesAccordion.tsx`.
- Nav links: `aria-current="page"`. Shell: skip-link, landmarks, `main` focus target.
- Don't remove the `prefers-reduced-motion` guards in `global.css`.

## Responsive & layout (critical)

- **No horizontal page scroll at any width** (320px up). The single content width comes from `pageStyles.container` in `src/components/ui/page.stylex.ts` (68rem max, auto-centred, responsive inline padding) — compose it onto any page/article shell.
- Wide tables must be wrapped in a scroll container (`display:block; overflow-x:auto; white-space:nowrap` on cells) — see postwire `.pm-doc-table`.
- Verify after any layout change with the CDP overflow sweep: every page must report `innerW == htmlW == vw` at 320/375/768/1024.

## Load motion (single entrance, no jerk)

The page-load reveal is intentionally ONE clean motion — a pure opacity fade on `main#site-main` (`.yt-first .page-enter` → `@keyframes page-fade`, 0.45s, **no translate**). It runs only on a true first load / hard reload, because `.yt-first` is set synchronously in `BaseLayout.astro` (head script checks `sessionStorage 'yt-nav'`); view-transition navigations skip it and rely on the cross-fade.

- Hero children must **not** animate separately on load. A per-element stagger held each element at `opacity: 0` (headline invisible ~230ms) while the page slid beneath it — compound motion that read as a jerky load. The classes were removed; don't re-introduce them.
- `@keyframes page-enter` (with the 10px rise) still exists and is used only by `.svc-panel` accordion panels — don't merge it back into the page reveal.
- Always gate new motion behind `prefers-reduced-motion`.
- Verify load motion with the frame-trace script (CDP/Playwright `addInitScript` + `requestAnimationFrame` sampler): at the first frame the headline must already be `opacity: 1`, `main` must have `transform: none` while it fades 0→1 by ~450ms, and there must be no long tasks (`PerformanceObserver('longtask')`) or rAF gaps > 25ms while the animation runs. CLS must stay 0.

## Performance invariants (don't regress)

- CSS fully inlined by Astro — no external stylesheet request.
- GA loads only after idle or first pointerdown (PROD only).
- Mermaid deferred via `requestIdleCallback` in `PostLayout.astro`.
- `transition:persist` is only safe on the (Astro) footer — never on a React island (stale-hydration bug).
- The `stylexVite` unplugin re-processes collected CSS through Lightning CSS with old browserslist defaults, which lower `light-dark()` into a broken `var()` polyfill. The pinned `lightningcssOptions.targets` in `astro.config.mjs` prevents that — don't touch it.

## Verification workflow (always do this)

1. `npx tsc --noEmit` — clean.
2. `nvm use 22 && npm run build` — no errors or warnings.
3. If layouts/islands changed, run the CDP overflow sweep at 320/375/768/1024 (headless Chrome; assert `innerW == htmlW` on `/`, `/services/`, `/blog/`, `/about/`).
4. If you touched load motion, run the frame-trace check above (headline visible at frame one, fade-only, no long tasks).
5. If a page's behavior is interactive, verify the hydrated island in the browser (hydration markers, keyboard + dialog behavior) — SSR output alone is not proof.
6. Do not commit unless explicitly asked.