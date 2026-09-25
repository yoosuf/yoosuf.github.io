import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
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
