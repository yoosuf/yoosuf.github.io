# AGENTS.md — yoosuf.github.io (Astro rebuild)

Project instructions for AI coding agents. Read this before making changes.

## What this is

A static site for **Yoosuf Mohamed**, Systems Architect. Rebuilt from Jekyll on the
`feature/astro-tailwind` branch: **Astro 7 + Tailwind CSS v4 + React 19 islands +
TypeScript**. Vanilla HTML/SCSS conventions from the Jekyll era no longer apply here.

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
  - `header/Header.tsx` — React island (`client:load`): desktop nav + full-page dialog menu
  - `services/ServicesAccordion.tsx` — React island (`client:idle`): accessible accordion
  - `ReactIcon.tsx` — typed inline SVG icon set for React islands (Astro components use `Icon.astro`)
  - `EngagementPricing.astro` — structural component that mounts the services island
- `src/hooks/` — `useMenuDialog.ts` (focus trap, Escape, scroll lock, focus restore)
- `src/pages/` — route pages; `src/pages/blog/[...slug].astro` renders posts
- `src/content/blog/*.md` — blog posts, named `YYYY-MM-DD-slug.md`
- `src/content.config.ts` — content collection schemas (authoritative front matter contract)
- `src/data/services.ts` — service data shared by Astro + React
- `src/config.ts` — `SITE`, `NAV`, socials (single source of truth)
- `src/styles/global.css` — design tokens, `.site-container`, motion, component classes
- `astro.config.mjs` — integrations, prefetch, `inlineStylesheets: 'always'`

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

- Islands for interaction: `header/Header.tsx` (`client:load`), `services/ServicesAccordion.tsx`
  (`client:idle`). Keep mermaid + pinemail (`WAAPI`) logic vanilla — not every component needs React.
- **Never call `window`/`document` during render.** SSR renders server-side; server-pinned
  values (like `currentPath`) must come in as props from the Astro wrapper.
- Hooks in `src/hooks/`; shared typed icons in `ReactIcon.tsx`; markup is Tailwind utilities
  with component classes in `global.css` `@layer components` for the island styles.
- No inline `style` in Astro components for island markup; put those classes in `global.css`
  (scoped styles can't reach React-rendered DOM).

## a11y standards (non-negotiable)

- Modals (mobile menu): `role="dialog"` + `aria-modal="true"`, labelled,
  focus-trapped, `Escape` closes, scroll-lock, focus restores to trigger.
  Reference implementation: `useMenuDialog.ts`.
- Accordions: button triggers with `aria-expanded`/`aria-controls`, `role="region"`
  panel labelled by the trigger, roving tabindex + arrow/Home/End. Reference: `ServicesAccordion.tsx`.
- Desktop nav links: `aria-current="page"`. Page shell: skip-link, landmarks, `main` focus target.

## Responsive & layout (critical)

- **No horizontal scroll allowed at any width** (320px up). `.site-container`
  (max-width 68rem) is the single content width — used by header, footer, and page wrappers.
- Wide tables/docs (e.g. pinemail `.pm-doc-table`) must be wrapped for contained
  horizontal scrolling, never left loose in the page flow.
- After layout changes, verify with the CDP overflow sweep across 320/375/768/1024:
  every page must report `innerW == htmlW == vw`.
- **Do not create a class named `.container`** — it collides with Tailwind v4's built-in
  `container` utility.

## Gotchas

- `transition:persist` on a React island header caused stale-hydration bugs — islands
  re-hydrate fully per navigation, so the mobile menu is handled entirely in React state.
- `@astrojs/react` must stay in `astro.config.mjs` `integrations`; removing it breaks the islands.
- View transitions: `<ClientRouter/>` from `astro:transitions`; prefetch via config.
- `build.inlineStylesheets: 'always'` inlines CSS into HTML (no render-blocking CSS request).
- Keep GA deferred (idle/pointerdown, PROD only) so third-party JS stays off the critical path.
- Never commit `dist/`, `.astro/` (gitignored).
- Only commit when explicitly asked.

## Verification checklist (end of any task)

1. `npx tsc --noEmit` — clean.
2. `npm run build` — no warnings.
3. Responsive sweep if layouts changed — no horizontal overflow at 320+.
4. If a post is notable, add it to `public/llms.txt`.