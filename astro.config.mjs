// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import stylexVite from '@stylexjs/unplugin/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const blogDir = join(process.cwd(), 'src/content/blog')

// lastmod for every blog post URL, derived from the post date in front matter.
// Sitemaps should only advertise change when content actually changes; posts
// are immutable, so mark them yearly. Reads the markdown at config time.
const postLastmod = new Map()
for (const f of readdirSync(blogDir)) {
  if (!f.endsWith('.md')) continue
  const md = readFileSync(join(blogDir, f), 'utf8')
  const dateMatch = md.match(/^date:\s*["']?([\d-]+)/m)
  const permMatch = md.match(/^permalink:\s*"?([^"\s]+)"?/m)
  if (!dateMatch) continue
  const slug = permMatch
    ? permMatch[1].replace(/^\/?blog\//, '').replace(/\/+$/, '')
    : f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
  postLastmod.set(`/blog/${slug}/`, { date: dateMatch[1], priority: 0.7 })
}

const HIGH_PRIORITY = new Set(['/', '/blog/', '/services/', '/about/', '/contact/', '/pinemail/'])

function pathFor(url) {
  return new URL(url).pathname
}

export default defineConfig({
  site: 'https://yoosuf.me',
  output: 'static',
  compressHTML: true,
  prefetch: true,
  build: {
    // Global CSS is tiny; inline it so there is no render-blocking stylesheet request.
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    sitemap({
      entryLimit: 50_000,
      serialize(item) {
        const path = pathFor(item.url)
        const post = postLastmod.get(path)
        if (post) {
          item.lastmod = `${post.date}T00:00:00Z`
          item.changefreq = 'yearly'
          item.priority = post.priority
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
      // StyleX compiles inline+extracted rules; extracted CSS is appended to
      // the global.css asset and inlined by `inlineStylesheets: 'always'`.
      stylexVite({
        useCSSLayers: true,
        // The unplugin re-processes collected rules through Lightning CSS
        // with its own (old) browserslist defaults, which lower the
        // `light-dark()` colour tokens into a broken var() polyfill. Pin
        // modern targets so light-dark() survives and resolves via the
        // color-scheme declared on :root in global.css.
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
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
})
