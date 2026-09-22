import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const routeSource = await readFile(new URL('../src/pages/pinemail.astro', import.meta.url), 'utf8')
const source = await readFile(new URL('../src/scripts/pinemail.ts', import.meta.url), 'utf8')
const blogRouteSource = await readFile(new URL('../src/components/BlogIndex.astro', import.meta.url), 'utf8')
const infiniteSource = await readFile(new URL('../src/scripts/infiniteScroll.ts', import.meta.url), 'utf8')
const postLayoutSource = await readFile(new URL('../src/layouts/PostLayout.astro', import.meta.url), 'utf8')
const mermaidSource = await readFile(new URL('../src/scripts/mermaid.ts', import.meta.url), 'utf8').catch(() => '')

test('Pine Mail simulator tears down work before Astro swaps the page', () => {
  assert.match(routeSource, /<script src="\.\.\/scripts\/pinemail\.ts"><\/script>/)
  assert.match(source, /astro:before-swap/)
  assert.match(source, /clearTimeout\([^)]*\)/)
  assert.match(source, /\.disconnect\(\)/)
  assert.match(source, /\.cancel\(\)/)
  assert.match(source, /clearTimeouts|pendingTimers|timeouts/)
})

test('Astro page scripts reinitialize and clean up across view transitions', () => {
  assert.match(blogRouteSource, /<script src="\.\.\/scripts\/infiniteScroll\.ts"><\/script>/)
  assert.match(infiniteSource, /astro:page-load/)
  assert.match(infiniteSource, /astro:before-swap/)
  assert.match(postLayoutSource, /<script src="\.\.\/scripts\/mermaid\.ts"><\/script>/)
  assert.match(mermaidSource, /astro:page-load/)
  assert.match(mermaidSource, /astro:before-swap/)
})
