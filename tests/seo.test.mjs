import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const BLOG = new URL('../src/content/blog/', import.meta.url).pathname

const posts = readdirSync(BLOG)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => ({ file, source: readFileSync(join(BLOG, file), 'utf8') }))

// YAML front matter here is hand-written and inconsistently quoted, so accept
// any form and strip the quotes afterwards. Matching the value character by
// character would break on the apostrophes in titles like "what happened to
// Mohamed's domain".
const field = (source, name) =>
  source
    .match(new RegExp(`^${name}:[ \\t]*(.+?)[ \\t]*$`, 'm'))?.[1]
    ?.replace(/^["']|["']$/g, '')

test('site metadata has a concise organic-search description', () => {
  const source = read('src/config.ts')
  const match = source.match(/description:\s*\n?\s*'([^']+)'/)

  assert.ok(match, 'SITE.description should be defined')
  assert.ok(match[1].length <= 160, 'SITE.description should fit a search snippet')
})

test('base layout emits canonical page schema and crawl metadata', () => {
  const source = read('src/layouts/BaseLayout.astro')

  assert.match(source, /<link rel="canonical" href=\{pageUrl\}/)
  assert.match(source, /max-snippet:-1/)
  // The page type is a prop so an article can declare itself; the default has
  // to be the generic one or every page over-claims what it is.
  assert.match(source, /pageType = 'WebPage'/)
  assert.match(source, /'@type': pageType/)
  assert.match(source, /JSON\.stringify\(webPageJsonLd\)/)
})

test('base layout points crawlers and agents at the machine-readable surfaces', () => {
  const source = read('src/layouts/BaseLayout.astro')
  const head = read('src/layouts/PostLayout.astro')

  assert.match(source, /rel="author"/, 'pages should credit a human author to rel=author')
  assert.match(source, /rel="me"/, 'the author profile should be verifiable via rel=me')
  assert.match(source, /llms\.txt/, 'llms.txt should be advertised in the head')
  assert.match(head, /data-answer/, 'posts should expose the dek as the extractable answer')
})

test('sitemap excludes the duplicate first blog pagination URL', () => {
  const source = read('astro.config.mjs')

  assert.match(source, /filter:\s*\(page\) => !page\.endsWith\('\/blog\/page\/1\/'\)/)
})

test('every post describes itself inside a search snippet', () => {
  assert.ok(posts.length > 0, 'expected posts')
  const problems = posts
    .map((post) => ({ file: post.file, description: field(post.source, 'description') }))
    .filter(({ description }) => !description || description.length > 160)
    .map(({ file, description }) => `${file} (${description?.length ?? 0})`)

  assert.deepEqual(problems, [], `post descriptions that are missing or too long:\n  ${problems.join('\n  ')}`)
})

test('post permalinks are dated and well formed', () => {
  // Two things this deliberately does not assert:
  //
  // - That the permalink has no trailing slash. 23 posts carry one. Those URLs
  //   have been live and indexed since 2007, so the slash is a historical fact
  //   to preserve, not a defect to fix. New posts are written without one.
  // - That the permalink slug matches the filename. Four posts were deliberately
  //   re-slugged after publication — a typo fixed, a clearer name — and those
  //   URLs are the ones now in backlinks and the sitemap. The filename is a
  //   dated label, not a promise about the URL.
  //
  // What does hold everywhere, and is what actually breaks: the date prefix
  // matches the filename, and the URL is stable, unique, and indexed.
  const problems = posts
    .map((post) => {
      const permalink = field(post.source, 'permalink')
      const date = field(post.source, 'date')

      if (!/^\/blog\/[a-z0-9]+(-[a-z0-9]+)*\/?$/.test(permalink ?? '')) {
        return `${post.file} (${permalink})`
      }
      // Compare the YYYY-MM-DD prefix as a string. Parsing these into a Date
      // first is how posts silently shift a day and stop matching their
      // filename, which is the exact trap the date is meant to avoid.
      if (date?.slice(0, 10) !== post.file.slice(0, 10)) {
        return `${post.file} (date ${date} does not match filename)`
      }
      return null
    })
    .filter(Boolean)

  const duplicates = posts
    .map((post) => field(post.source, 'permalink'))
    .filter((permalink, index, all) => all.indexOf(permalink) !== index)

  assert.deepEqual(problems, [], `malformed permalinks:\n  ${problems.join('\n  ')}`)
  assert.deepEqual(duplicates, [], `duplicate permalinks: ${duplicates.join(', ')}`)
})

test('llms.txt lists every published post', () => {
  const index = read('public/llms.txt')
  // 23 posts carry a trailing slash in their permalink, so the trailing slash
  // has to be normalised before comparing against the indexed URL.
  const url = (permalink) => `https://yoosuf.me${permalink.replace(/\/?$/, '/')}`

  const missing = posts
    .map((post) => field(post.source, 'permalink'))
    .filter(Boolean)
    .filter((permalink) => !index.includes(url(permalink)))
    .map(url)

  assert.deepEqual(missing, [], `published posts absent from llms.txt:\n  ${missing.join('\n  ')}`)
})

test('robots.txt advertises the sitemap and allows AI crawlers', () => {
  const robots = read('public/robots.txt')

  assert.match(robots, /^Sitemap: https:\/\/yoosuf\.me\/sitemap-index\.xml$/m)
  for (const agent of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    assert.match(robots, new RegExp(`^User-agent: ${agent}\\nAllow: /$`, 'm'), `${agent} should be allowed`)
  }
})
