/**
 * Answer-engine invariants.
 *
 * These read the built site rather than the source, because the things that
 * matter here only exist after rendering: whether a table-of-contents link
 * resolves, whether the question published as schema is a question the reader
 * can see, whether the graph's `@id`s actually point at each other.
 *
 * Run `npm run build` first. Without `dist/` every test is skipped rather than
 * failed, so a bare `npm test` on a clean checkout is not a false alarm.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/\/$/, '')
const built = existsSync(DIST)

/** Every built page, as paths relative to `dist/` (e.g. `blog/hello-you/index.html`). */
function builtPages(dir = DIST) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return builtPages(full)
    return entry.name === 'index.html' ? [full.slice(DIST.length + 1)] : []
  })
}

const pages = builtPages()
/** A blog post page, as opposed to the archive or one of its paginated pages. */
const isPost = (page) => /^blog\/[^/]+\/index\.html$/.test(page)

const read = (page) => readFileSync(join(DIST, page), 'utf8')
const jsonLdOf = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  )
/** Attribute values in the built HTML are entity-escaped; a snippet is not. */
const unescape = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const skip = { skip: built ? false : 'run `npm run build` first' }

test('every in-page link resolves to an element on the page', skip, () => {
  const broken = []
  for (const page of pages) {
    const html = read(page)
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]))
    for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
      if (!ids.has(fragment)) broken.push(`${page} -> #${fragment}`)
    }
  }
  assert.deepEqual(broken, [], `dangling fragment links:\n  ${broken.join('\n  ')}`)
})

test('every meta description fits a search snippet', skip, () => {
  const long = []
  for (const page of pages) {
    const description = read(page).match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
    if (unescape(description).length > 160) long.push(`${page} (${unescape(description).length})`)
  }
  assert.deepEqual(long, [], `descriptions over 160 characters:\n  ${long.join('\n  ')}`)
})

test('every page states who wrote it and points at the author', skip, () => {
  const missing = []
  for (const page of pages) {
    const html = read(page)
    if (!/<link rel="author"/.test(html)) missing.push(`${page} (no rel=author)`)
    if (!jsonLdOf(html).some((block) => block['@type'] === 'Person' && block['@id']?.endsWith('#person'))) {
      missing.push(`${page} (no Person node)`)
    }
  }
  assert.deepEqual(missing, [], `\n  ${missing.join('\n  ')}`)
})

test('posts render a visible answer above the fold', skip, () => {
  const posts = pages.filter(isPost)
  assert.ok(posts.length > 0, 'expected built posts')
  const missing = posts.filter((page) => !/<p[^>]*data-answer[^>]*>\s*\S/.test(read(page)))
  assert.deepEqual(missing, [], `posts without a dek: ${missing.length}`)
})

test('published questions are questions the reader can see', skip, () => {
  for (const page of pages.filter(isPost)) {
    const html = read(page)
    const faq = jsonLdOf(html).find((block) => block['@type'] === 'FAQPage')
    if (!faq) continue

    // The whole point of deriving this from the post source is that the answer
    // is on the page. Checking the first words of it appear in the rendered
    // prose catches schema that has drifted away from the copy.
    const asksSomething = [...html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/g)].map((match) =>
      unescape(match[1].replace(/<[^>]*>/g, '')).trim(),
    )
    for (const question of faq.mainEntity) {
      assert.ok(
        question.name.trim().endsWith('?'),
        `${page} publishes a non-question as a Question: ${JSON.stringify(question.name)}`,
      )
      assert.ok(
        question.acceptedAnswer.text.length >= 40,
        `${page} publishes a ${question.acceptedAnswer.text.length}-character answer`,
      )
      assert.ok(
        asksSomething.includes(question.name.trim()),
        `${page} publishes a Question with no matching heading: ${JSON.stringify(question.name)}`,
      )
      assert.ok(
        unescape(html).includes(question.acceptedAnswer.text.slice(0, 60)),
        `${page} publishes an answer that is not in the rendered prose`,
      )
    }
  }
})

test('the article graph resolves instead of dangling', skip, () => {
  for (const page of pages.filter(isPost)) {
    const html = read(page)
    const blocks = jsonLdOf(html)
    const ids = new Set(blocks.map((block) => block['@id']).filter(Boolean))
    const article = blocks.find((block) => block['@type'] === 'BlogPosting')
    assert.ok(article, `${page} has no BlogPosting`)

    const webPage = article.mainEntityOfPage?.['@id']
    assert.ok(ids.has(webPage), `${page}: mainEntityOfPage ${webPage} is not on the page`)

    // The breadcrumb node is rendered in the body, not the head, so it is not in
    // `blocks` — resolve it against the whole document.
    assert.ok(
      html.includes(`"@id":"${article.breadcrumb['@id']}"`),
      `${page}: breadcrumb ${article.breadcrumb['@id']} is not published`,
    )

    // Some posts really are this short — one is a 24-word link post around an
    // embedded talk — so the floor only rules out a counter that returned
    // nothing. The reading-time cross-check below is what actually has teeth.
    assert.ok(article.wordCount >= 1, `${page}: wordCount is ${article.wordCount}`)
    // The reading time a visitor reads on the page has to agree with the count
    // in the schema, or one of the two is lying to somebody.
    const minutes = article.timeRequired.match(/\d+/)?.[0]
    assert.equal(
      minutes,
      String(Math.max(1, Math.round(article.wordCount / 200))),
      `${page}: reading time ${minutes} does not match ${article.wordCount} words`,
    )
    assert.ok(
      article.publisher['@id'] && ids.has(article.publisher['@id']),
      `${page}: publisher is not a node on the page`,
    )
    assert.ok(
      article.author['@id'] && ids.has(article.author['@id']),
      `${page}: author is not a node on the page`,
    )
  }
})

test('the speakable selector points at something real', skip, () => {
  const broken = []
  for (const page of pages) {
    const html = read(page)
    const webPage = jsonLdOf(html).find(
      (block) => typeof block['@id'] === 'string' && block['@id'].endsWith('#webpage'),
    )
    for (const selector of webPage?.speakable?.cssSelector ?? []) {
      if (!html.includes(selector.replace(/[[\]]/g, ''))) broken.push(`${page} -> ${selector}`)
    }
  }
  assert.deepEqual(broken, [], `speakable selectors match nothing:\n  ${broken.join('\n  ')}`)
})
