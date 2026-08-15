---
name: jekyll-blog
description: Create or edit blog posts on yoosuf.me (yoosuf.github.io), a Jekyll/GitHub Pages site. Use when writing, editing, or proofreading posts in _posts/, when checking front matter or permalink conventions, or when asked to "write a blog post", "add a post", "draft a blog entry", or match the site's voice.
---

# jekyll-blog — writing posts for yoosuf.me

This site is a personal Jekyll blog. Posts live in `_posts/*.md`, named `YYYY-MM-DD-slug.md`. This skill covers the workflow, the front matter schema, and the writing voice.

## Before writing

1. Read one or two recent posts to absorb the voice (e.g. `_posts/2023-05-25-frugal-lifestyle.md`, `_posts/2024-09-18-working-on-rails-4-2-6-in-2024.md`).
2. Check `_data/` and `blog.md` so categories/tags stay consistent.
3. For AI/topic posts, reference real sources where plausible (Yoosuf cites ILO, WEF, Academy of Management studies in AI posts) and include them as inline links or plain mentions.

## File & front matter conventions

- Filename date **must equal** the publish date in front matter.
- `layout: post` always.
- `permalink: /blog/<slug>` — lowercase kebab-case, **no date, no trailing slash**.
- Keep `excerpt: ""` as-is.
- Categories from the existing set. Reuse existing tags; add new ones only when needed (Title Case).
- **Timezone gotcha:** Jekyll parses front matter `date` as UTC. The dev machine is Asia/Colombo (UTC+5:30), so a `HH:MM` later than roughly *now minus 5:30* gets treated as a future date and the post is silently skipped ("Skipping: ... has a future date"). Use `00:00:00` for posts dated today and verify with `bundle exec jekyll build`.

### Template

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

> Note: `subTitle` (capital T) is the key used by `_layouts/post.html`. It renders as a lead-in paragraph under the title.

## Voice & style — write like a human

This is a personal blog, not a corporate tech blog. Write in **first person**, as Yoosuf, with personality.

Do:

- Use contractions (`I'm`, `doesn't`, `you'll`).
- Mix sentence lengths: short punches next to long rambling ones.
- Add first-person opinions, asides, and mild skepticism (e.g. "I've been around long enough to be suspicious of clean narratives").
- Prefer plain section headers (`## The good`) over formulaic scaffolding.
- Ground claims with concrete examples and numbers when available.
- End with a strong, specific takeaway — ideally a closing line that lands.

Don't:

- No emojis.
- No formulaic "The Good/Bad/Ugly" or perfectly parallel bullet lists repeated everywhere.
- No repeated bold thesis statements per paragraph.
- No "It's important to note that..." filler, no "In conclusion" summary.
- No balanced pros-and-cons-for-the-sake-of-balance sections.
- No corporate/AI vocabulary ("leverage", "delve", "in today's fast-paced world", "game-changer").

## Markdown notes

- kramdown is the parser; tables, blockquotes, fenced code blocks, and nested lists all work.
- Don't duplicate social/meta tags — they're already wired into `_layouts/default.html` and `_includes/`.

## Verification workflow (always do this)

1. Write or edit the post in `_posts/`.
2. Run `bundle exec jekyll build` — it must complete with no errors/warnings.
3. Optionally `bundle exec jekyll serve` and check the post renders at its permalink.
4. If the post is notable, add it to `llms.txt` under the right section.
5. Do not commit unless explicitly asked.
