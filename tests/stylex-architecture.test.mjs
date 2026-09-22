import assert from 'node:assert/strict'
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { assertBuildOutput } from '../scripts/build-without-warnings.mjs'
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
    'src/components/Menu.tsx': 'className={stylex.props(styles.root).className}\n<div className="flex gap-3" />',
  })

  assert.deepEqual(
    inspectSource({ rootDir }).map(({ code }) => code),
    ['NARROWED_STYLEX_PROPS', 'LEGACY_UTILITY_CLASS'],
  )
})

test('allows documented global hooks that contain utility-like words', async () => {
  const rootDir = await fixture({
    'src/layouts/ProductLayout.astro': '<div class="pm-hero-grid">Product content</div>',
  })

  assert.deepEqual(inspectSource({ rootDir }), [])
})

test('keeps services accordion presentation out of global CSS and literal class hooks', async () => {
  const servicesIsland = await readFile(new URL('../src/components/services/ServicesAccordion.tsx', import.meta.url), 'utf8')
  const baseLayout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')

  await assert.rejects(access(new URL('../src/styles/global.css', import.meta.url)))
  assert.doesNotMatch(baseLayout, /styles\/global\.css/)
  assert.doesNotMatch(servicesIsland, /className=\{?['"`]svc-/)
})

test('keeps Markdown and generated Pinemail content on explicit StyleX attributes', async () => {
  const postLayout = await readFile(new URL('../src/layouts/PostLayout.astro', import.meta.url), 'utf8')
  const pinemailBody = await readFile(new URL('../src/components/product/PinemailBody.astro', import.meta.url), 'utf8')
  const generator = await readFile(new URL('../scripts/generate-pinemail-body.mjs', import.meta.url), 'utf8')

  assert.match(postLayout, /<Content components=\{markdownComponents\}/)
  assert.doesNotMatch(postLayout, /class:list=\{\['prose'/)
  assert.match(pinemailBody, /\{\.\.\.stylex\.attrs\(styles\./)
  assert.doesNotMatch(pinemailBody, /pmCls\(/)
  assert.match(generator, /class:list=/)
})

test('keeps Pinemail descendant presentation in StyleX keys', async () => {
  const productStyles = await readFile(new URL('../src/components/ui/product.stylex.ts', import.meta.url), 'utf8')
  const pinemailBody = await readFile(new URL('../src/components/product/PinemailBody.astro', import.meta.url), 'utf8')

  assert.match(productStyles, /pmFaqSummary:/)
  assert.match(productStyles, /pmTableCell:/)
  assert.match(productStyles, /pmFlowLogLine:/)
  assert.match(pinemailBody, /styles\.pmFaqSummary/)
  assert.match(pinemailBody, /styles\.pmTableCell/)
  assert.match(pinemailBody, /styles\.pmFlowLogLine/)
})

test('defines the Mermaid diagram visual system in StyleX modules', async () => {
  const tokens = await readFile(new URL('../src/styles/diagramTokens.stylex.ts', import.meta.url), 'utf8')
  const styles = await readFile(new URL('../src/components/diagrams/MermaidDiagram.stylex.ts', import.meta.url), 'utf8')

  assert.match(tokens, /defineVars/)
  assert.match(tokens, /pencil/)
  assert.match(tokens, /marker/)
  assert.match(styles, /stylex\.create/)
  assert.match(styles, /overflowX: ['"]auto['"]|overflowX: ['"]scroll['"]|overflowX:/)
  assert.match(styles, /justifyContent: ['"]center['"]|justifyContent:/)
  assert.doesNotMatch(styles, /backgroundColor:\s*['"]#/)
})

test('exposes an Astro-first accessible Mermaid diagram component', async () => {
  const component = await readFile(new URL('../src/components/diagrams/MermaidDiagram.astro', import.meta.url), 'utf8')

  assert.match(component, /<figure/)
  assert.match(component, /data-mermaid-diagram/)
  assert.match(component, /stylex\.attrs\(/)
  assert.match(component, /aria-labelledby|aria-label/)
  assert.match(component, /figcaption/)
  assert.doesNotMatch(component, /client:(load|idle|visible|media)/)
})

test('centralizes deterministic hand-drawn Mermaid defaults', async () => {
  const config = await readFile(new URL('../src/lib/mermaid/config.ts', import.meta.url), 'utf8')

  assert.match(config, /startOnLoad:\s*false/)
  assert.match(config, /securityLevel:\s*['"]strict['"]|securityLevel:/)
  assert.match(config, /look:\s*['"]handDrawn['"]|look:/)
  assert.match(config, /handDrawnSeed:\s*42/)
  assert.match(config, /themeVariables/)
})

test('gives pencil Mermaid labels a handwriting font fallback', async () => {
  const config = await readFile(new URL('../src/lib/mermaid/config.ts', import.meta.url), 'utf8')

  assert.match(config, /pencilFontFamily/)
  assert.match(config, /Segoe Print/)
  assert.match(config, /Bradley Hand/)
  assert.match(config, /fontFamily: pencilFontFamily/)
})

test('provides one navigation-safe shared Mermaid renderer', async () => {
  const renderer = await readFile(new URL('../src/lib/mermaid/render.ts', import.meta.url), 'utf8')
  const bootstrap = await readFile(new URL('../src/scripts/mermaid.ts', import.meta.url), 'utf8')
  const baseLayout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')

  assert.match(renderer, /import\(['"]mermaid['"]\)/)
  assert.match(renderer, /data-mermaid-target/)
  assert.match(renderer, /mermaidState/)
  assert.match(renderer, /renderMermaidDiagrams/)
  assert.match(renderer, /astro:page-load/)
  assert.match(renderer, /astro:before-swap/)
  assert.doesNotMatch(bootstrap, /mermaid\.initialize\(/)
  assert.match(baseLayout, /<script src="\.\.\/scripts\/mermaid\.ts"><\/script>/)
})

test('keeps Mermaid parser failures out of the rendered page', async () => {
  const renderer = await readFile(new URL('../src/lib/mermaid/render.ts', import.meta.url), 'utf8')
  const styles = await readFile(new URL('../src/components/diagrams/MermaidDiagram.stylex.ts', import.meta.url), 'utf8')

  assert.doesNotMatch(renderer, /Unable to render diagram\. Check the Mermaid syntax\./)
  assert.match(renderer, /target\.replaceChildren\(\)/)
  assert.match(renderer, /setAttribute\(['"]aria-hidden['"], ['"]true['"]\)/)
  assert.match(styles, /error:\s*\{[\s\S]*display: ['"]none['"]/)
})

test('starts Mermaid rendering eagerly and retries lifecycle entry points', async () => {
  const renderer = await readFile(new URL('../src/lib/mermaid/render.ts', import.meta.url), 'utf8')

  assert.match(renderer, /Render eagerly/)
  assert.match(renderer, /render\(\)\n  document\.addEventListener\(['"]DOMContentLoaded['"]/)
  assert.match(renderer, /document\.addEventListener\(['"]astro:page-load['"]/)
  assert.match(renderer, /renderMermaidDiagrams\(\)\.catch\(hideRenderFailure\)/)
  assert.match(renderer, /mermaidRendering === ['"]true['"]|mermaidRendering/)
})

test('normalizes horizontal flowcharts to vertical Mermaid layouts', async () => {
  const renderer = await readFile(new URL('../src/lib/mermaid/render.ts', import.meta.url), 'utf8')

  assert.match(renderer, /normalizeDiagramSource/)
  assert.match(renderer, /flowchart\|graph/)
  assert.match(renderer, /LR\|RL/)
  assert.match(renderer, /direction/)
  assert.match(renderer, /TB/)
})

test('routes Markdown Mermaid fences through the StyleX diagram surface', async () => {
  const pre = await readFile(new URL('../src/components/markdown/Pre.astro', import.meta.url), 'utf8')
  const baseLayout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')

  assert.match(pre, /data-language|mermaid/)
  assert.match(pre, /data-mermaid-target|MermaidDiagram/)
  assert.doesNotMatch(baseLayout, /\.mermaid\s*\{/)
})

test('ships a Mermaid diagram gallery covering the supported diagram forms', async () => {
  const gallery = await readFile(new URL('../src/pages/examples/diagrams.astro', import.meta.url), 'utf8')

  assert.match(gallery, /MermaidDiagram/)
  assert.match(gallery, /flowchart LR/)
  assert.match(gallery, /sequenceDiagram/)
  assert.match(gallery, /stateDiagram-v2/)
  assert.match(gallery, /variant="marker"/)
  assert.match(gallery, /variant="pencil"/)
})

test('uses the homepage CTA pattern for services conversion', async () => {
  const engagement = await readFile(new URL('../src/components/EngagementPricing.astro', import.meta.url), 'utf8')

  assert.match(engagement, /homeStyles\.ctaBand/)
  assert.match(engagement, /homeStyles\.ctaHeading/)
  assert.match(engagement, /homeStyles\.ctaBody/)
  assert.match(engagement, /homeStyles\.ctaActions/)
  assert.match(engagement, /href="\/contact\/"/)
  assert.doesNotMatch(engagement, /mailto:/)
})

test('keeps the availability pulse animation idempotent and centered', async () => {
  const motion = await readFile(new URL('../src/scripts/motion.ts', import.meta.url), 'utf8')
  const homeStyles = await readFile(new URL('../src/components/ui/home.stylex.ts', import.meta.url), 'utf8')

  assert.match(motion, /pulseAnimations = new WeakMap<HTMLElement, Animation>\(\)/)
  assert.match(motion, /pulseAnimations\.has\(element\)/)
  assert.match(motion, /duration: 1600/)
  assert.match(homeStyles, /inset: 0/)
  assert.match(homeStyles, /transformOrigin: 'center'/)
})

test('keeps emitted content free of malformed attributes and duplicate classes', async () => {
  const dist = new URL('../dist/', import.meta.url)
  if (!existsSync(dist)) return

  for (const route of ['index.html', 'blog/hello-you/index.html', 'terms/index.html', 'pinemail/index.html']) {
    const html = await readFile(new URL(route, dist), 'utf8')
    assert.doesNotMatch(html, /\[object Object\]|<[^>]*class="[^"]*"[^>]*class="/)
  }
})

test('rejects build output warnings and accidental StyleX route output', () => {
  assert.throws(
    () => assertBuildOutput({ stderr: '[WARN] [router] unexpected route', stdout: '', routeFiles: [] }),
    /Build emitted a warning/,
  )
  assert.throws(
    () => assertBuildOutput({ stderr: '', stdout: '', routeFiles: ['notFound.stylex'] }),
    /dist\/notFound\.stylex/,
  )
})
