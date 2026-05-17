#!/usr/bin/env node
/**
 * scripts/new-post.js — scaffold a new blog post markdown file.
 *
 * Usage:
 *   npm run new-post -- "Post slug here" "Behavioral"
 *
 * Creates blog-posts/<today>-<slug>.md with frontmatter filled in.
 * You then write the post body and run `npm run blog` to publish.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run new-post -- "Post title" "Category"');
  console.error('Example: npm run new-post -- "Why we killed the tier system" "Built in public"');
  process.exit(1);
}

const [title, category] = args;
const today = new Date().toISOString().slice(0, 10);
const slug = title
  .toLowerCase()
  .replace(/['"]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const file = path.join(__dirname, '..', 'blog-posts', `${today}-${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`File already exists: ${file}`);
  process.exit(1);
}

const template = `---
slug: ${slug}
title: ${title}
description: One-paragraph SEO/social description goes here. Keep it under 160 chars for Twitter.
date: ${today}
category: ${category}
---

Opening paragraph — hook with a concrete fact, a contrarian claim, or a specific number. No "In this post we'll discuss..." preamble.

## A section heading

Body paragraph. Markdown works as expected. Use **bold** for emphasis on key terms, and *single emphasis* for the green-accent words.

> A blockquote becomes the gold-bordered pull-quote on the live page.

<div class="callout">
<p><strong>The honest caveat:</strong> use a raw HTML callout block for asides you want to set apart in a box.</p>
</div>

| Column A | Column B | Right-aligned |
|----------|----------|--------------:|
| Foo      | Bar      |        $1,234 |

Closing paragraph. Keep it short. No exclamation marks unless one is genuinely worth it.
`;

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, template);
console.log(`✓ Created ${path.relative(process.cwd(), file)}`);
console.log(`  Edit the file, then run: npm run blog`);
