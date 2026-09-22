import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('site metadata has a concise organic-search description', () => {
  const source = read('src/config.ts')
  const match = source.match(/description:\s*\n?\s*'([^']+)'/)

  assert.ok(match, 'SITE.description should be defined')
  assert.ok(match[1].length <= 160, 'SITE.description should fit a search snippet')
})

test('base layout emits canonical page schema and crawl metadata', () => {
  const source = read('src/layouts/BaseLayout.astro')

  assert.match(source, /<link rel="canonical" href=\{canonicalUrl\}/)
  assert.match(source, /max-snippet:-1/)
  assert.match(source, /'@type': 'WebPage'/)
  assert.match(source, /JSON\.stringify\(webPageJsonLd\)/)
})

test('sitemap excludes the duplicate first blog pagination URL', () => {
  const source = read('astro.config.mjs')

  assert.match(source, /filter:\s*\(page\) => !page\.endsWith\('\/blog\/page\/1\/'\)/)
})
