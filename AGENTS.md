# AGENTS.md — yoosuf.github.io

Project instructions for AI coding agents. Read this before making changes.

## What this is

A Jekyll static site (GitHub Pages) for **Yoosuf Mohamed**, Systems Architect. Content is markdown; theme is custom SCSS + vanilla HTML. No JavaScript frameworks, no build pipeline beyond Jekyll.

## Commands

```bash
bundle exec jekyll serve          # local dev at http://localhost:4000
bundle exec jekyll build          # build to _site/ — always run this as a smoke test after edits
```

Always run `bundle exec jekyll build` after editing posts, layouts, includes, or config to confirm the site parses cleanly before finishing.

## Structure at a glance

- `_posts/*.md` — blog posts, named `YYYY-MM-DD-slug.md`
- `_layouts/` — `default.html` (shell, nav, footer, GA), `post.html`, `blog.html`, `home.html`, `page.html`
- `_includes/` — partials (breadcrumbs, post-list, social cards, analytics)
- `_data/navigation.yml` — nav links
- `_sass/` + `assets/css/main.scss` — styling
- `blog.md` — blog index; `about.md`, `contact.md` — pages; `llms.txt` — LLM index

## Editing blog posts

Follow the front matter schema and conventions documented in the `jekyll-blog` skill (load it when creating/editing posts):

- `title`, `author: Yoosuf Mohamed`, `date`, `layout: post`, `permalink: /blog/<slug>`, `published: true`, `description`, `categories`, `tags`.
- Filename date must match publish date. Permalink has no date or trailing slash.
- **Timezone gotcha:** Jekyll parses front matter `date` as UTC and skips posts with a *future* date. The dev machine is Asia/Colombo (UTC+5:30). A same-day post with `HH:MM` later than ~now minus 5:30 will be silently skipped with a "future date" warning. Use `00:00:00` (or an explicitly earlier time) for posts dated today, then verify with `bundle exec jekyll build`.
- Categories come from the existing set (`AI & Tech`, `Engineering`, `Personal`, ...). Reuse existing tags.

## Voice & style (critical)

This site is a personal blog. Write like a human, in first person, in Yoosuf's voice:

- Conversational, contractions, varied sentence length. Some short punchy sentences; some long rambling ones.
- First-person opinions and asides are welcome.
- Avoid AI tells: no balanced "The Good/Bad/Ugly" scaffolding repeated, no perfectly parallel bullet lists everywhere, no formulaic bold "thesis" statements repeated, no emojis.
- Reference real research/sources where relevant (Yoosuf cites ILO, WEF, Academy of Management studies in AI posts).

See the `jekyll-blog` skill for the full voice guide and workflow.

## Conventions & gotchas

- Never commit `_site/`, `Gemfile.lock`, `.jekyll-cache` (all gitignored).
- Keep the inline script in `_layouts/default.html` minimal; the site is intentionally framework-free.
- Social/meta tags, SEO, GA are wired through `_layouts/default.html` and `_includes/` — don't duplicate them in posts.
- `robots.txt` explicitly allows AI crawlers; do not remove them.
- Update `llms.txt` when adding a notable post.
- Markdown is kramdown; tables, blockquotes, fenced code blocks all work.
- Only commit when explicitly asked.

## Config files

- `_config.yml` — site config, plugins (jekyll-feed, seo-tag, paginate, etc.), GA id.
- `Gemfile` — Ruby/Jekyll deps. `Gemfile.lock` is gitignored.
- `CNAME` — holds `yoosuf.me`; do not remove.
