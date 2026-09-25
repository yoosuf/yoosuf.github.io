// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import stylexVite from '@stylexjs/unplugin/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const blogDir = join(process.cwd(), 'src/content/blog')

// lastmod for every blog post URL, derived from the front matter. A post is
// immutable until it declares `updated`, so an untouched post advertises its
// publish date with a yearly changefreq, while a revised post advertises the
// real edit date and can be crawled more often. Reads the markdown at config
// time.
const postLastmod = new Map()
for (const f of readdirSync(blogDir)) {
  if (!f.endsWith('.mdx')) continue
  const md = readFileSync(join(blogDir, f), 'utf8')
  const dateMatch = md.match(/^date:\s*["']?([\d-]+)/m)
  const updatedMatch = md.match(/^updated:\s*["']?([\d-]+)/m)
  const permMatch = md.match(/^permalink:\s*"?([^"\s]+)"?/m)
  if (!dateMatch) continue
  const slug = permMatch
    ? permMatch[1].replace(/^\/?blog\//, '').replace(/\/+$/, '')
    : f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
  const lastmod = updatedMatch && updatedMatch[1] > dateMatch[1] ? updatedMatch[1] : dateMatch[1]
  postLastmod.set(`/blog/${slug}/`, { date: lastmod, revised: lastmod !== dateMatch[1] })
}

const HIGH_PRIORITY = new Set(['/', '/blog/', '/services/', '/about/', '/contact/', '/postwire/'])

function pathFor(url) {
  return new URL(url).pathname
}

export default defineConfig({
  site: 'https://yoosuf.me',
  output: 'static',
  compressHTML: true,
  prefetch: true,
  build: {
    // StyleX extracts and inlines the generated rules; there is no global stylesheet.
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      entryLimit: 50_000,
      // Page one is already represented by the canonical /blog/ route.
      // Keeping /blog/page/1/ out avoids advertising a duplicate URL.
      filter: (page) => !page.endsWith('/blog/page/1/'),
      serialize(item) {
        const path = pathFor(item.url)
        const post = postLastmod.get(path)
        if (post) {
          item.lastmod = `${post.date}T00:00:00Z`
          item.changefreq = post.revised ? 'monthly' : 'yearly'
          item.priority = 0.7
        } else if (path === '/') {
          item.priority = 1.0
          item.changefreq = 'weekly'
        } else if (HIGH_PRIORITY.has(path)) {
          item.priority = 0.9
          item.changefreq = 'monthly'
        } else if (path.startsWith('/blog/page/')) {
          item.priority = 0.4
          item.changefreq = 'weekly'
        } else {
          item.priority = 0.5
          item.changefreq = 'monthly'
        }
        return item
      },
    }),
  ],
  vite: {
    build: {
      // Mermaid is loaded only by diagram posts after idle time. Its parser
      // bundle is intentionally isolated from the initial graph and is just
      // above Vite's generic 500 kB warning threshold.
      chunkSizeWarningLimit: 700,
    },
    plugins: [
      // StyleX compiles inline and extracted rules and inlines the result.
      stylexVite({
        useCSSLayers: true,
        // The unplugin re-processes collected rules through Lightning CSS
        // with its own (old) browserslist defaults, which lower the
        // `light-dark()` colour tokens into a broken var() polyfill. Pin
        // modern targets so light-dark() survives and resolves via the
        // color-scheme declared on the document root.
        lightningcssOptions: {
          targets: {
            chrome: 123 << 16,
            edge: 123 << 16,
            firefox: 120 << 16,
            safari: (17 << 16) | (5 << 8),
            ios_saf: (17 << 16) | (5 << 8),
          },
        },
      }),
    ],
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
})
