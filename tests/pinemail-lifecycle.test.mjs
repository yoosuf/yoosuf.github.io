import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const routeSource = await readFile(new URL('../src/pages/pinemail.astro', import.meta.url), 'utf8')
const source = await readFile(new URL('../src/scripts/pinemail.ts', import.meta.url), 'utf8')
const blogRouteSource = await readFile(new URL('../src/components/BlogIndex.astro', import.meta.url), 'utf8')
const infiniteSource = await readFile(new URL('../src/scripts/infiniteScroll.ts', import.meta.url), 'utf8')
const postLayoutSource = await readFile(new URL('../src/layouts/PostLayout.astro', import.meta.url), 'utf8')
const baseLayoutSource = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')
const mermaidSource = await readFile(new URL('../src/scripts/mermaid.ts', import.meta.url), 'utf8').catch(() => '')
const mermaidRendererSource = await readFile(new URL('../src/lib/mermaid/render.ts', import.meta.url), 'utf8')

test('Pine Mail page script is safe to reinitialize across Astro navigation', () => {
  assert.match(routeSource, /<script src="\.\.\/scripts\/pinemail\.ts"><\/script>/)
  assert.match(source, /astro:page-load/)
  assert.match(source, /dataset\.initialized/)
  assert.match(source, /setupInstallTabs/)
})

test('Pine Mail initial render does not start a compositor animation loop', () => {
  assert.doesNotMatch(source, /\.animate\(/)
  assert.doesNotMatch(source, /IntersectionObserver/)
})

test('Astro page scripts reinitialize and clean up across view transitions', () => {
  assert.match(blogRouteSource, /<script src="\.\.\/scripts\/infiniteScroll\.ts"><\/script>/)
  assert.match(infiniteSource, /data-blog-page-list/)
  assert.doesNotMatch(infiniteSource, /ul\.divide-y/)
  assert.match(infiniteSource, /astro:page-load/)
  assert.match(infiniteSource, /astro:before-swap/)
  assert.doesNotMatch(postLayoutSource, /<script src="\.\.\/scripts\/mermaid\.ts"><\/script>/)
  assert.match(baseLayoutSource, /<script src="\.\.\/scripts\/mermaid\.ts"><\/script>/)
  assert.match(mermaidRendererSource, /astro:page-load/)
  assert.match(mermaidRendererSource, /astro:before-swap/)
  assert.match(mermaidSource, /scheduleMermaidRender/)
})
