import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { SITE } from '../config'
import { decodeEntities } from '../lib/utils'

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((p) => p.data.published !== false)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: decodeEntities(post.data.title),
      pubDate: post.data.date,
      description: post.data.description,
      link: post.data.permalink,
      id: post.data.permalink,
      categories: post.data.categories,
      customData: `<author>${SITE.email} (${SITE.author})</author>`,
    })),
  })
}