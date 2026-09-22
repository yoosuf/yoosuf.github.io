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
