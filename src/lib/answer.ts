/**
 * Answer-engine extraction.
 *
 * Everything here is derived from the post source at build time, so a question
 * can never be published as structured data unless the question and its answer
 * are literally in the prose the page renders. That constraint is the point:
 * the search post on this site argues that marking up things which are not
 * visible is a manual-action risk, so the markup here is derived, not authored.
 *
 * Heading ids are not derived here. The markdown processor owns them, and
 * `render()` hands them back on `headings` — reusing those slugs is what keeps
 * a table of contents from linking to sections that are not there.
 */

import type { MarkdownHeading } from 'astro'

import { decodeEntities } from './utils'

export interface Heading {
  depth: number
  text: string
  /** Slug as the markdown processor generated it on the rendered element. */
  id: string
}

export interface Question {
  depth: number
  text: string
  /** First prose paragraph of the section, empty when the section opens with a
   *  list, table, diagram or code block rather than an answer. */
  answer: string
}

export interface Citation {
  name: string
  url: string
}

const FRONT_MATTER = /\A---\r?\n[\s\S]*?\r?\n---/
const FENCE_MARK = /^[ \t]*(```+|~~~+)/
const HEADING_LINE = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/
/** Inline constructs that carry no words of their own. */
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g
const INLINE_LINK = /\[([^\]]*)\]\([^)]*\)/g
const REFERENCE_LINK = /\[([^\]]*)\]\[[^\]]*\]/g
const AUTOLINK = /<((?:https?:\/\/)[^>\s]+)>/g
const BARE_URL = /(?<![("'<])\b(https?:\/\/[^\s<>()[\]"']+)/g
const INLINE_CODE = /`+([^`]*)`+/g
const EMPHASIS = /[*_]{1,3}([^*_]+)[*_]{1,3}/g
const STRIKE = /~~([^~]+)~~/g
const NON_PROSE = /^[ \t]*(?:[-*+][ \t]|\d+\.[ \t]|>|\||!\[|<|#{1,6}[ \t])/m

/** Drop fenced code, keeping everything outside it intact. */
function stripFencedCode(source: string): string {
  const kept: string[] = []
  let fence: string | null = null

  for (const line of source.split(/\r?\n/)) {
    const mark = line.match(FENCE_MARK)
    if (mark) {
      const char = mark[1][0]
      fence = fence === null ? char : fence === char ? null : fence
      continue
    }
    if (fence === null) kept.push(line)
  }

  return kept.join('\n')
}

/**
 * Markdown to the words a reader actually reads. Inline syntax is unwrapped so
 * link and code text survives; entities are left for `decodeEntities` so that
 * literal `<` and `>` in a sentence are not mistaken for markup.
 */
export function proseFrom(markdown: string): string {
  return markdown
    .replace(HTML_TAG, ' ')
    .replace(IMAGE, ' ')
    .replace(INLINE_LINK, '$1')
    .replace(REFERENCE_LINK, '$1')
    .replace(INLINE_CODE, '$1')
    .replace(STRIKE, '$1')
    .replace(EMPHASIS, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The prose of a whole post, without front matter, code, diagrams or MDX. */
export function postProse(body: string): string {
  return decodeEntities(
    proseFrom(
      stripFencedCode(body.replace(FRONT_MATTER, ''))
        .replace(/^[ \t]*(?:import|export)\s[^\n]*$/gm, ' ')
        .replace(/^#{1,6}[ \t]+/gm, ' '),
    ),
  )
}

export function wordCountOf(prose: string): number {
  const words = prose.trim().split(/\s+/).filter(Boolean)
  return words.length
}

/** Reading time in whole minutes, floored at one. */
export function readingMinutesOf(words: number): number {
  return Math.max(1, Math.round(words / 200))
}

interface RawSection {
  depth: number
  text: string
  lines: string[]
}

/**
 * Level 2–4 headings and the lines that follow each one. Headings inside fenced
 * code are skipped, so a shell transcript containing `# comment` cannot invent a
 * section.
 */
function scanSections(body: string): RawSection[] {
  const sections: RawSection[] = []
  let current: RawSection | null = null
  let fence: string | null = null

  for (const line of body.replace(FRONT_MATTER, '').split(/\r?\n/)) {
    const mark = line.match(FENCE_MARK)
    if (mark) {
      const char = mark[1][0]
      fence = fence === null ? char : fence === char ? null : fence
      continue
    }
    if (fence !== null) {
      current?.lines.push(line)
      continue
    }

    const heading = line.match(HEADING_LINE)
    if (heading) {
      const depth = heading[1].length
      if (depth >= 2 && depth <= 4) {
        current = { depth, text: heading[2], lines: [] }
        sections.push(current)
      } else {
        current = null
      }
      continue
    }

    current?.lines.push(line)
  }

  return sections
}

/** The first run of prose lines after a heading, or `''` if it does not open in prose. */
function leadParagraph(lines: string[]): string {
  const kept: string[] = []
  let fence: string | null = null

  for (const line of lines) {
    const mark = line.match(FENCE_MARK)
    if (mark) {
      const char = mark[1][0]
      fence = fence === null ? char : fence === char ? null : fence
      continue
    }
    if (fence !== null) continue
    if (line.trim() === '') {
      if (kept.length > 0) break
      continue
    }
    kept.push(line)
  }

  const raw = kept.join('\n')
  if (raw.trim() === '' || NON_PROSE.test(raw)) return ''
  return decodeEntities(proseFrom(raw))
}

/**
 * A heading counts as a question only when it is punctuated as one. Matching on
 * interrogative openers too would sweep in headings like "Where this actually
 * lands", and publishing those as `Question` would be worse than publishing
 * nothing — it hands a retrieval system a question nobody asked.
 */
function asksSomething(text: string): boolean {
  return decodeEntities(text).replace(/[*_`~]/g, '').trim().endsWith('?')
}

export interface TocNode extends Heading {
  children: TocNode[]
}

/**
 * Outline for the rendered table of contents, as a tree.
 *
 * Built from the `headings` the markdown processor returns rather than from the
 * post source. The processor slugifies the text it actually renders — after
 * smart quotes, code spans and links are resolved — so reusing its slugs is the
 * only way to guarantee every entry here links to a section that exists.
 */
export function buildToc(
  headings: readonly MarkdownHeading[],
  maxDepth = 3,
): TocNode[] {
  const roots: TocNode[] = []
  const open: TocNode[] = []

  for (const heading of headings) {
    if (heading.depth < 2 || heading.depth > maxDepth) continue

    const node: TocNode = {
      depth: heading.depth,
      text: decodeEntities(heading.text),
      id: heading.slug,
      children: [],
    }

    while (open.length > 0 && open[open.length - 1].depth >= node.depth) open.pop()
    if (open.length === 0) roots.push(node)
    else open[open.length - 1].children.push(node)
    open.push(node)
  }

  return roots
}

/**
 * Question-shaped sections paired with the paragraph that answers them. A
 * heading only qualifies when the paragraph under it is really an answer, so
 * sections that open with a list or a diagram are left out rather than
 * half-answered.
 */
export function extractQuestions(body: string, minAnswerLength = 40): Question[] {
  return scanSections(body)
    .filter((section) => section.depth <= 3 && asksSomething(section.text))
    .map((section) => ({
      depth: section.depth,
      text: decodeEntities(proseFrom(section.text)),
      answer: leadParagraph(section.lines),
    }))
    .filter((question) => question.answer.length >= minAnswerLength)
}

/**
 * Outbound references the post makes. These become `citation` on the article
 * so a reader — or a model — can see what a claim is standing on.
 */
export function extractCitations(body: string, siteOrigin: string, limit = 12): Citation[] {
  const found = new Map<string, string>()

  const record = (url: string, name: string) => {
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return
    if (parsed.origin === new URL(siteOrigin).origin) return
    parsed.hash = ''
    const key = parsed.href
    if (!found.has(key)) found.set(key, name)
  }

  for (const [, text, url] of body.matchAll(/\[([^\]]*)\]\(\s*(https?:\/\/[^\s)]+)[^)]*\)/g)) {
    record(url, decodeEntities(proseFrom(text)))
  }
  for (const [, url] of body.matchAll(AUTOLINK)) record(url, '')
  for (const [, url] of body.matchAll(BARE_URL)) record(url, '')

  const fallback = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  return [...found]
    .slice(0, limit)
    .map(([url, name]) => ({ url, name: name.trim() || fallback(url) }))
}
