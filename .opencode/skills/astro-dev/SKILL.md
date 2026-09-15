---
name: astro-dev
description: Develop, refactor, or debug code on yoosuf.me (yoosuf.github.io), an Astro 7 site with Tailwind CSS v4 and React 19 islands. Use when editing layouts, components, islands, hooks, styles, Astro config, or running the build/typecheck/overflow verification. Not for blog post content — use astro-blog for that.
---

# astro-dev — building the Astro site

Stack: Astro 7 (static) + Tailwind CSS v4 + React 19 islands + TypeScript, built with
`@astrojs/react`, `@astrojs/sitemap`, view transitions (`ClientRouter`), and
`build.inlineStylesheets: 'always'`.

## Environment

```bash
nvm use 22      # Node 22 required (system node is v20)
```

## When to use React (islands) vs vanilla

Only interactive components become React islands; everything else stays Astro/Tailwind:

- `header/Header.tsx` — `client:load`, full-page mobile dialog menu (`useMenuDialog`).
- `services/ServicesAccordion.tsx` — `client:idle`, roving-tabindex accordion.
- Keep mermaid and the pinemail WAAPI flow script vanilla — don't chase React for its own sake.

Dependencies for islands: `@astrojs/react` in `astro.config.mjs` `integrations`, `react`,
`react-dom`, `@types/react`. If they're missing, that's the first thing to check.

## Rules for islands

- **Never reference `window`/`document` at render time.** SSR renders server-side. Server
  values (e.g. `currentPath`) must arrive as props from the Astro wrapper, or from a
  `useEffect`/event handler.
- Style island markup with Tailwind utilities + component classes defined in
  `src/styles/global.css` `@layer components`. Scoped `.astro` `<style>` can't reach
  React-rendered DOM, but can leak via `is:inline` (use carefully; it's global).
- Typed icons for islands: `ReactIcon.tsx` (union of `IconName`). Astro components use
  `Icon.astro` — don't cross-use.

## a11y standards (non-negotiable)

- Modal dialog (mobile menu): `role="dialog"` + `aria-modal="true"`, labelled, focus trap,
  `Escape` closes, scroll lock, focus restored on close. Reference: `src/hooks/useMenuDialog.ts`.
- Accordion: `<button>` triggers with `aria-expanded`/`aria-controls`; `role="region"`
  panel labelled by trigger; roving tabindex + Arrow/Home/End. Reference: `ServicesAccordion.tsx`.
- Nav links: `aria-current="page"`. Shell: skip-link, landmarks, `main` focus target.
- Don't remove the `prefers-reduced-motion` guards in `global.css`.

## Responsive & layout (critical)

- **No horizontal page scroll at any width** (320px up). `.site-container` is the single
  content width (68rem max). Never add a `.container` class (Tailwind v4 reserved).
- Wide tables must be wrapped in a scroll container (`display:block; overflow-x:auto;
  white-space:nowrap` on cells) — see pinemail `.pm-doc-table`.
- Verify after any layout change with the CDP overflow sweep: every page must report
  `innerW == htmlW == vw` at 320/375/768/1024.

## Performance invariants (don't regress)

- CSS fully inlined by Astro — no external stylesheet request.
- GA loads only after idle or first pointerdown (PROD only).
- Mermaid deferred via `requestIdleCallback` in `PostLayout.astro`.
- `transition:persist` is only safe on the (Astro) footer — never on a React island
  (stale-hydration bug).

## Verification workflow (always do this)

1. `npx tsc --noEmit` — clean.
2. `npm run build` — no errors or warnings.
3. If layouts/islands changed, run the CDP overflow sweep at 320/375/768/1024
   (headless Chrome; assert `innerW == htmlW` on `/`, `/services/`, `/blog/`, `/pinemail/`, `/about/`).
4. If a page's behavior is interactive, verify the hydrated island in the browser
   (hydration markers, keyboard + dialog behavior) — SSR output alone is not proof.
5. Do not commit unless explicitly asked.