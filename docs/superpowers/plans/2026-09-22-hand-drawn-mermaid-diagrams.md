# Hand-Drawn Mermaid Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reusable Astro-only Mermaid diagram system with deterministic hand-drawn rendering, StyleX-owned visual design, Markdown compatibility, and safe Astro navigation behavior.

**Architecture:** Keep Mermaid source as the source of truth and render it client-side through one shared lazy renderer. Add a semantic Astro component for explicit diagrams, adapt existing Markdown Mermaid fences to the same renderer, and use existing StyleX tokens plus a small diagram token layer for paper surfaces, variants, themes, and responsive containment.

**Tech Stack:** Astro 7, TypeScript, Mermaid 11, StyleX 0.19, MDX, Astro ClientRouter, browser-native lifecycle events.

**Spec:** `docs/superpowers/specs/2026-09-22-hand-drawn-mermaid-diagrams-design.md`

## Global Constraints

- Mermaid syntax remains the diagram source of truth.
- Mermaid is dynamically imported and initialized once; it is not loaded globally on pages without diagrams.
- StyleX is the primary styling system; do not add React, Tailwind, CSS Modules, styled-components, Emotion, or component CSS.
- Use Mermaid `look: 'handDrawn'` and fixed `handDrawnSeed: 42` by default.
- Preserve native Mermaid frontmatter/config overrides.
- Preserve existing Markdown Mermaid fences.
- Do not commit unless explicitly requested.

## Review Focus

- Existing Markdown Mermaid fences must still render independently and retain their source config.
- Multiple explicit and Markdown diagrams must not collide or duplicate SVGs after Astro navigation.
- A malformed diagram must not prevent later diagrams from rendering.
- The StyleX surface must contain overflow at 320px without shrinking labels into unreadability.
- Production build must keep Mermaid lazy/separate and emit the new StyleX rules.

---

### Task 1: Add diagram semantic tokens and component styles

**Files:**
- Create: `src/styles/diagramTokens.stylex.ts`
- Create: `src/components/diagrams/MermaidDiagram.stylex.ts`

**Interfaces:**
- Produces `diagramTokens` and `mermaidDiagramStyles` for Astro `stylex.attrs()` composition.
- Consumes existing `colors`, `space`, `fonts`, `radii`, and `weights` from `src/styles/tokens.stylex.ts`.

- [ ] Define semantic light/dark diagram variables for pencil and marker surfaces, ink, muted ink, borders, grid, and error state using existing palette values wherever possible.
- [ ] Define StyleX styles for root, header, title, surface, render target, caption, pending, ready, error, pencil, marker, default, and wide variants.
- [ ] Use responsive StyleX media-query syntax for surface padding and keep `overflowX: 'auto'` scoped to the surface.
- [ ] Add a subtle two-axis engineering-paper grid only to the pencil surface; keep marker surface clean.
- [ ] Run `npx tsc --noEmit` and confirm the new StyleX modules compile before adding markup.

### Task 2: Add the explicit Astro Mermaid component

**Files:**
- Create: `src/components/diagrams/MermaidDiagram.astro`

**Interfaces:**
- Produces the public `MermaidDiagram.astro` API from the spec.
- Emits a stable `data-mermaid-diagram` target with source code in a non-flashing render target.

- [ ] Implement `code`, optional title/caption/ariaLabel, `pencil`/`marker`, `default`/`wide`, and passthrough `class` props.
- [ ] Generate deterministic per-instance IDs from Astro component metadata or a stable source hash with collision-safe suffixing.
- [ ] Render semantic `<figure>`, optional heading, surface, render target, and `<figcaption>` using `stylex.attrs()` only.
- [ ] Connect title/caption/aria label attributes correctly and ensure a diagram with no visible title still has an accessible label when supplied.
- [ ] Keep raw source out of visible layout while retaining it in a renderer-readable attribute/element.
- [ ] Run `npx tsc --noEmit`.

### Task 3: Centralize Mermaid defaults and variant theme mapping

**Files:**
- Create: `src/lib/mermaid/config.ts`

**Interfaces:**
- Produces typed default config, variant type, and Mermaid theme-variable mapping consumed by the renderer.

- [ ] Export the fixed defaults with `startOnLoad: false`, `securityLevel: 'strict'`, `look: 'handDrawn'`, `handDrawnSeed: 42`, and `theme: 'base'`.
- [ ] Export a small `pencil`/`marker` adapter using the semantic Mermaid ink, line, border, and surface values.
- [ ] Keep config shallow enough that diagram-native frontmatter can override Mermaid defaults without source rewriting.
- [ ] Run `npx tsc --noEmit`.

### Task 4: Replace the page-local renderer with a shared lifecycle renderer

**Files:**
- Create or modify: `src/lib/mermaid/render.ts`
- Modify: `src/scripts/mermaid.ts`

**Interfaces:**
- `renderMermaidDiagrams(root?: ParentNode): Promise<void>` discovers and renders targets.
- The script bootstrap listens to `astro:page-load` and `astro:before-swap` and delegates to the renderer.

- [ ] Dynamically import Mermaid only after discovering targets and cache the import/init promise.
- [ ] Initialize Mermaid exactly once per document lifecycle with the centralized defaults.
- [ ] Discover explicit component targets and legacy `pre[data-language="mermaid"]` blocks.
- [ ] Convert Markdown blocks into the same scoped surface/target structure without changing Mermaid source text.
- [ ] Use unique IDs, mark rendered nodes, and skip already-rendered SVGs.
- [ ] Render nodes independently with per-node try/catch; restore or expose a restrained error state for failures and log parser errors.
- [ ] Preserve Mermaid frontmatter/config by passing original source to Mermaid unchanged.
- [ ] Schedule rendering after idle time with a timeout fallback, while avoiding raw Mermaid flash.
- [ ] Ensure `astro:before-swap` invalidates pending work and `astro:page-load` can render Page A → Page B → Page A without duplicate handlers.
- [ ] Run `npx tsc --noEmit`.

### Task 5: Integrate with existing layout and remove obsolete Mermaid styling

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/PostLayout.astro`
- Modify: `src/components/markdown/Pre.astro` or the smallest existing Markdown wrapper needed for stable Mermaid metadata.

**Interfaces:**
- Existing posts continue to load the bootstrap only when Mermaid fences are present.
- No broad global Mermaid selectors remain.

- [ ] Replace broad `.mermaid` layout rules with only the minimal generated-SVG fallback that cannot be expressed through StyleX, or remove them if the component target covers all paths.
- [ ] Keep the existing conditional Mermaid script loading behavior for posts with Mermaid source.
- [ ] Ensure Markdown-generated `pre[data-language="mermaid"]` remains discoverable and does not acquire syntax-highlighting styles that flash before replacement.
- [ ] Confirm `ClientRouter` navigation and script execution semantics do not register duplicate bootstraps.
- [ ] Run `npm run test:architecture`, `npx tsc --noEmit`, and `npm run build`.

### Task 6: Add the diagram gallery route

**Files:**
- Create: `src/pages/examples/diagrams.astro`

**Interfaces:**
- Produces a static internal gallery using `MermaidDiagram.astro` only.

- [ ] Add flowchart, architecture, sequence, and state-machine sources.
- [ ] Show both pencil and marker variants, including a wide diagram and a native Mermaid classic-look override.
- [ ] Use existing page shell/container and typography primitives; do not invent page-level styling.
- [ ] Run `npx tsc --noEmit` and `npm run build`.

### Task 7: Document usage and verify production/runtime behavior

**Files:**
- Modify: `README.md` if present, otherwise add the smallest existing project documentation page or a focused `docs/` guide.
- Inspect: `dist/` after build without committing generated output.

- [ ] Document explicit component usage, variants, accessibility fields, Markdown fence behavior, and Mermaid frontmatter overrides.
- [ ] Run `npm run build:clean` when available and confirm zero build warnings.
- [ ] Inspect generated HTML/CSS/chunks for StyleX output and a separate/lazy Mermaid chunk.
- [ ] Start a production preview on an available local port and verify the gallery, a blog page with multiple Mermaid blocks, reload, and navigation.
- [ ] Run the 320/375/768/1024 overflow sweep and record results.
- [ ] Verify invalid Mermaid, light/dark mode, both variants, no raw-code flash, no duplicate SVGs, and no browser console errors.
- [ ] Report any environment-blocked browser checks as unverified rather than passed.

## Completion Criteria

The explicit component and existing Markdown fences both render deterministic hand-drawn Mermaid SVGs, all styles are emitted by StyleX, the page remains horizontally contained on mobile, navigation is idempotent, malformed diagrams fail locally, typecheck/build pass without warnings, and production output retains Mermaid as a lazy/separate bundle.
