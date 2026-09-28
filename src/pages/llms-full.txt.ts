import type { APIContext } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE } from '../config'
import { decodeEntities, ensureTrailingSlash, formatShortDate } from '../lib/utils'

/**
 * `/llms.txt` is the hand-maintained map of the site. This is the companion
 * full-text file the llms.txt convention expects: every post's body rendered as
 * plain text, generated from the content collection so it can never fall out of
 * date with the archive.
 */
export async function GET({ site }: APIContext) {
  const origin = site?.href.replace(/\/$/, '') ?? SITE.url
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.published !== false)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  assertLlmsTxtListsEveryPost(posts)

  const sections: string[] = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    `> Full text of ${posts.length} published posts. Written by ${SITE.author}. Based in Colombo, Sri Lanka.`,
    '',
    '## Pages',
    '',
    `- [Home](${origin}/): Personal site — AI automation, systems architecture, and AI-first products`,
    `- [Services](${origin}/services/): Engagement models and starting prices`,
    `- [About](${origin}/about/): Background, skills, and architectural philosophy`,
    `- [Contact](${origin}/contact/): How to reach ${SITE.author}`,
    `- [Yoosuf](${origin}/yoosuf/): Canonical identity page`,
    `- [Postwire](${origin}/postwire/): Open-source local auth testing tool`,
    `- [Messenger](${origin}/messenger/): Open-source relational chat schema`,
    `- [Blog](${origin}/blog/): All posts`,
    `- [Terms](${origin}/terms/): Terms of service`,
    `- [Terms and payments](${origin}/terms-payments/): How engagements are billed`,
    `- [Privacy](${origin}/privacy/): What is collected, which is almost nothing`,
    '',
  ]

  for (const post of posts) {
    const url = `${origin}${ensureTrailingSlash(post.data.permalink)}`
    const tags = [post.data.categories, post.data.tags].flat().filter(Boolean)

    sections.push(
      '---',
      '',
      `## ${decodeEntities(post.data.title)}`,
      '',
      `URL: ${url}`,
      `Published: ${formatShortDate(post.data.date)}`,
      ...(post.data.updated
        ? [`Updated: ${formatShortDate(post.data.updated)}`]
        : []),
      ...(tags.length > 0 ? [`Topics: ${tags.join(', ')}`] : []),
      '',
      post.data.description ?? '',
      '',
      toPlainText(post.body ?? ''),
      '',
    )
  }

  sections.push('---', '')

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

/**
 * `/llms.txt` is grouped by topic rather than generated, because the grouping
 * is the part that makes it worth reading. That curation is also the one place
 * on this site where publishing a post can go unnoticed — nothing else breaks
 * when a post is missing from a list. So the omission is caught here instead, by
 * name, at build time rather than by a crawler noticing months later.
 */
function assertLlmsTxtListsEveryPost(posts: CollectionEntry<'blog'>[]) {
  const index = readFileSync(join(process.cwd(), 'public', 'llms.txt'), 'utf8')
  const missing = posts
    .map((post) => `${SITE.url}${ensureTrailingSlash(post.data.permalink)}`)
    .filter((url) => !index.includes(url))

  if (missing.length > 0) {
    throw new Error(
      `[llms.txt] ${missing.length} published post(s) are not listed. Add them to public/llms.txt:\n  ${missing.join('\n  ')}`,
    )
  }
}

/**
 * Strips the MDX/Markdown surface down to readable prose: front matter, code
 * fences, JSX/import noise, and inline markup all go, while link text and list
 * structure survive so the answer reads like the post.
 */
function toPlainText(body: string): string {
  return body
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/^import\s.+$/gm, '')
    .replace(/^export\s.+$/gm, '')
    // Diagram source is noise in a prose digest; the rendered page has the picture.
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang: string | undefined, code: string) =>
      lang === 'mermaid' ? '[diagram]' : code.trim(),
    )
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '• ')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
