# Blog posts (markdown source)

This folder holds the markdown source for the Miser blog. The build script
(`scripts/build-blog.js`) converts every `*.md` file here into a fully styled
HTML post under `/blog/<slug>.html`, regenerates `/blog/index.html`, and
refreshes the blog URLs in `/sitemap.xml`.

## One-time setup

```bash
npm install
```

Installs the two build-time dependencies (`marked` and `gray-matter`) into
`node_modules/`. Not needed at runtime — the live site is still static HTML
served by GitHub Pages.

## Publishing a new post

```bash
# 1. Scaffold the file (replace title + category)
npm run new-post -- "Why we killed the tier system" "Built in public"

# 2. Edit blog-posts/<date>-<slug>.md — write the post body in markdown

# 3. Build (regenerates blog/ + sitemap.xml)
npm run blog

# 4. Review the diff, commit, push
git add blog-posts/ blog/ sitemap.xml
git commit -m "Blog: <post title>"
git push
```

GitHub Pages rebuilds in ~60s.

## Frontmatter reference

```yaml
---
slug:        url-slug-with-dashes        # required → blog/<slug>.html
title:       Post title with *emphasis*  # required; markdown *emphasis* renders as gold <em>
description: Short SEO/social blurb      # required; <160 chars ideal
date:        2026-05-17                  # required; ISO YYYY-MM-DD
category:    Behavioral                  # required; shown as eyebrow + listing tag
author:      Magdalena, co-founder and CEO  # optional; default in build-blog.js
readTime:    6                           # optional; auto-computed from word count
next:        slug-of-next-post           # optional; controls "Read next" link
---
```

## Rich content

- **Pull quotes** — use a markdown blockquote (`> ...`). Renders gold-bordered.
- **Callouts** — use a raw HTML `<div class="callout">...</div>` block. Markdown supports
  raw HTML inline.
- **Tables** — use GitHub-flavoured markdown tables. Use `:------:` / `------:` for column
  alignment; right-aligned columns get the tabular-numeric monetary styling automatically.
- **Code** — backtick-fenced blocks render in deep green with parchment text.
- **Bold** (`**word**`) for key terms; **single emphasis** (`*word*`) for gold-accented words.

## Conventions

- File name: `blog-posts/<YYYY-MM-DD>-<slug>.md`. The date prefix keeps `ls blog-posts/` sorted
  chronologically; the build script reads the actual date from frontmatter.
- Don't reuse a slug — it overwrites the published HTML.
- Slugs are URL-permanent. Once a post is live, don't rename it without setting up a
  redirect (GitHub Pages doesn't support 301s; consider adding a `<meta http-equiv="refresh">`
  in the old file if you must).
- Files prefixed with `_` (e.g. `_draft-foo.md`) are skipped by the build — handy for drafts.
