# yoosuf.github.io

The personal site and blog of **Yoosuf Mohamed** — Systems Architect specializing in AI automation, LLM, RAG, Go, Elixir, FastAPI, and AI-first products.

Live at [https://yoosuf.me](https://yoosuf.me), deployed via GitHub Pages.

## Stack

- **Static site generator:** [Jekyll](https://jekyllrb.com/) (Ruby)
- **Markdown:** kramdown
- **Styling:** custom SCSS under `_sass/`, compiled to `assets/css/main.css`
- **Fonts:** Inter, Merriweather, JetBrains Mono (loaded from Google Fonts)
- **Hosting:** GitHub Pages (CNAME → `yoosuf.me`)

## Local development

Requirements: Ruby + Bundler (see `Gemfile` for the version).

```bash
bundle install
bundle exec jekyll serve          # http://localhost:4000
bundle exec jekyll serve --livereload
bundle exec jekyll build          # build into _site/ (also a good smoke test)
```

The generated site goes into `_site/` (gitignored).

## Project structure

| Path                 | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `_posts/*.md`        | Blog posts. Filename: `YYYY-MM-DD-slug.md`                         |
| `_layouts/*.html`    | Layouts: `default`, `home`, `blog`, `page`, `post`                 |
| `_includes/*.html`   | Reusable partials (nav, footer, breadcrumbs, social cards, etc.)   |
| `_data/`             | YAML data: `navigation.yml`                                        |
| `_sass/`             | SCSS partials + `screen.scss`                                     |
| `assets/css/main.scss` | Entry point that imports the `_sass` partials                    |
| `blog.md`            | Blog index page (renders all posts via `_layouts/blog.html`)       |
| `about.md`, `contact.md` | Static pages                                                   |
| `index.md`           | Home page                                                          |
| `llms.txt`           | LLM-friendly index of the site's pages and posts                   |
| `sitemap.xml`        | Sitemap                                                           |
| `robots.txt`         | Robots rules; AI crawlers are explicitly allowed                   |
| `CNAME`              | Custom domain `yoosuf.me`                                          |

## Writing a post

1. Create `_posts/YYYY-MM-DD-your-slug.md` (date must be today or earlier, in `YYYY-MM-DD`).
2. Use the front matter template below.
3. Write in a **personal, first-person voice** (see skill/AGENTS guidance).
4. Run `bundle exec jekyll build` to confirm it parses without warnings.
5. Commit and push; GitHub Pages deploys automatically.

### Front matter template

```yaml
---
title: "Your Post Title"
subTitle: "Optional one-line summary shown under the title"
author: Yoosuf Mohamed
date: 2026-08-15 08:00:00
excerpt: ""
layout: post
permalink: /blog/your-post-slug
published: true
description: "SEO/meta description of the post."
categories: ["AI & Tech"]
tags: ["AI", "Productivity", "Management"]
---
```

Conventions:

- `permalink` is `/blog/<slug>` (no trailing slash, no date).
- `categories` from the existing set: `AI & Tech`, `Engineering`, `Personal`, `Photography`, `Lifestyle`, etc.
- `tags` are comma-free, Title Case, existing tags reused where possible.
- `date` should be the publish date. Jekyll parses it as **UTC** — a date later than "now minus 5:30" (dev machine is Asia/Colombo) is treated as future and the post is skipped. Use `00:00:00` for same-day posts and confirm with `bundle exec jekyll build`.
- Keep the post's first paragraph self-contained — it doubles as the intro/excerpt.

## Deployment

Pushing to the `main` branch triggers GitHub Pages via the Actions/Jekyll build. No manual deploy step. CNAME is committed so the custom domain is preserved.

## Notes

- Don't commit `Gemfile.lock` or `_site/` (gitignored).
- The site intentionally uses zero JavaScript frameworks; keep edits to the vanilla inline script in `_layouts/default.html` minimal.
- Update `llms.txt` when adding notable posts so LLM crawlers can find them.
