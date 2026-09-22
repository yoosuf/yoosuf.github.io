# Hand-Drawn Mermaid Diagrams Design

## Goal

Add a reusable Astro-first Mermaid diagram system that renders hand-drawn engineering diagrams with Mermaid's native `look: 'handDrawn'` mode, StyleX-owned presentation, responsive containment, accessible figure markup, and safe Astro client-navigation behavior.

## Existing context

- The site uses Astro 7.3.2, static output, MDX, Astro `ClientRouter`, and the official `@stylexjs/unplugin/vite` integration.
- StyleX 0.19 is already compiled through Astro's Vite pipeline. Existing semantic tokens live in `src/styles/tokens.stylex.ts` and resolve light/dark colors with `light-dark()` against the document shell's color scheme.
- Mermaid 11.17.2 is already a dependency and is dynamically imported by `src/scripts/mermaid.ts` for Mermaid code fences in blog posts.
- Markdown Mermaid fences are emitted as `pre[data-language="mermaid"]` by the existing MDX component path.
- The current Mermaid implementation initializes Mermaid with the default theme, replaces code blocks with generic `.mermaid` elements, uses page-local numeric IDs, and has global layout rules in `BaseLayout.astro`.

## Design

### Component boundary

Create `src/components/diagrams/MermaidDiagram.astro` with this public API:

```ts
interface Props {
  code: string
  title?: string
  caption?: string
  ariaLabel?: string
  variant?: 'pencil' | 'marker'
  size?: 'default' | 'wide'
  class?: string
}
```

The component owns semantic structure and stable render metadata, but does not hydrate a framework island. It emits a `figure` containing an optional heading, a StyleX-styled scroll container, a hidden/pending source element or render target, and an optional `figcaption`. The renderer owns replacing the target contents with Mermaid SVG.

Titles are connected with `aria-labelledby`; captions use `figcaption`; diagrams without visible titles receive the supplied `aria-label`. Mermaid SVG is not the only accessible description: the figure metadata and preserved source/error path provide a meaningful fallback.

### StyleX design system

Add focused diagram token/theme modules under the existing `src/styles` convention, reusing `colors`, `space`, `fonts`, `radii`, and `weights` wherever possible. New semantic variables are limited to diagram-specific surface, ink, line, grid, padding, and state values that have no existing equivalent.

Create `src/components/diagrams/MermaidDiagram.stylex.ts` with composable styles for:

- figure root, header, title, surface, render target, caption, pending, ready, and error states;
- pencil and marker variants;
- default and wide sizing;
- responsive padding and contained horizontal overflow;
- subtle engineering-paper grid using StyleX background properties;
- reduced-motion-safe visibility transitions, without loading animation.

Theme values follow the document's light/dark system through semantic `light-dark()` variables rather than component-level media-query detection. The pencil variant uses softer graphite contrast and an off-white grid surface; marker uses a cleaner surface and stronger ink/edge contrast. Both remain restrained and readable.

### Mermaid configuration and theme adapter

Create `src/lib/mermaid/config.ts` with one strict default configuration:

```ts
{
  startOnLoad: false,
  securityLevel: 'strict',
  look: 'handDrawn',
  handDrawnSeed: 42,
  theme: 'base'
}
```

The renderer merges this default with a small variant-aware `themeVariables` adapter. Mermaid owns nodes, edges, arrows, labels, layout, and hand-drawn geometry; StyleX owns the surrounding paper, spacing, typography, responsive behavior, and states. Diagram-native frontmatter/config is preserved because the source is passed to Mermaid unchanged; the global defaults only apply where a diagram does not override them.

### Renderer lifecycle

Create `src/lib/mermaid/render.ts` as a browser-only bootstrap utility. It will:

1. lazily import Mermaid only when matching render targets exist;
2. initialize Mermaid once per page/document lifecycle;
3. discover both `MermaidDiagram.astro` targets and existing Markdown Mermaid blocks;
4. use stable collision-safe IDs from component metadata or a module counter scoped to the current document;
5. render each target independently so one malformed diagram cannot block later diagrams;
6. mark targets as rendered to prevent duplicate SVGs;
7. expose restrained pending/ready/error state changes through data attributes/classes already emitted by StyleX;
8. log parser details to the console while showing a short user-facing error message;
9. register `astro:page-load` and clean up before swaps so Page A → Page B → Page A does not retain stale targets or duplicate listeners.

The existing `src/scripts/mermaid.ts` will become the thin page bootstrap or be replaced by the shared renderer entry point. Mermaid remains dynamically imported so pages without diagrams do not load the Mermaid parser into their initial runtime path.

### Markdown integration

Existing Mermaid fences remain supported as the first integration target. Their `<pre data-language="mermaid">` source will be moved into the same styled render target and passed unchanged to the shared renderer. The implementation will not introduce a new Markdown AST pipeline or require consumers to rewrite current posts.

The explicit `MermaidDiagram.astro` component is the preferred authoring API for pages and future content that needs title, caption, variant, size, or accessible-label control.

### Demo route

Add an internal static route at `src/pages/examples/diagrams.astro` using the component to demonstrate flowchart, architecture, sequence, and state diagrams. Exercise both `pencil` and `marker` variants and include at least one diagram with a Mermaid-native config override.

### CSS exception

No component stylesheet or `<style>` block will be added. Existing broad `.mermaid` rules in `BaseLayout.astro` will be removed or reduced to a minimal generated-SVG fallback only if Mermaid theme variables cannot cover a necessary selector. Any remaining selector will be scoped to the component's data attribute and documented next to the rule.

### Verification

Required checks:

- `npx tsc --noEmit`;
- `npm run build` with no errors or warnings;
- existing architecture tests and `npm run build:clean` when available;
- preview/browser checks for one and multiple diagrams, all four diagram types, both variants, system light/dark mode, reload, Astro navigation, invalid Mermaid, and mobile widths;
- overflow sweep at 320, 375, 768, and 1024 pixels, confirming page `innerWidth === document.documentElement.clientWidth`;
- production output inspection confirming StyleX styles are emitted and Mermaid remains in a lazy/separate chunk.

## Non-goals

- No React/Vue/Svelte island for Mermaid.
- No Tailwind, CSS Modules, styled-components, Emotion, Excalidraw, Rough.js, CDN Mermaid, or custom SVG renderer.
- No broad redesign of the site's existing palette or typography.
- No automatic conversion of every Markdown fence into a new AST/component system.
- No commit as part of this work unless explicitly requested.

## Known limitations

Mermaid SVG text and internal geometry remain controlled by Mermaid's theme/configuration APIs, so StyleX cannot guarantee pixel-level styling of every generated SVG element. Browser verification may require a free local port and a running production preview server; blocked browser checks will be reported as unverified rather than passed.
