#!/usr/bin/env node
/**
 * scripts/build-blog.js — Miser blog markdown→HTML pipeline.
 *
 * Reads blog-posts/*.md, renders each to blog/<slug>.html, regenerates
 * blog/index.html, and updates the blog URLs in sitemap.xml
 * (non-blog URLs are preserved).
 *
 * Usage:
 *   npm install         # one-time, installs marked + gray-matter
 *   npm run blog        # rebuild all posts + index + sitemap
 *
 * Frontmatter schema (blog-posts/*.md):
 *   ---
 *   slug:        url-slug-with-dashes      (required, becomes blog/<slug>.html)
 *   title:       Post title with *emphasis* (required; markdown emphasis renders as <em>)
 *   description: Short SEO/social blurb     (required, used in <meta> and listing)
 *   date:        2026-05-17                 (required, ISO YYYY-MM-DD)
 *   category:    Behavioral                 (required, shown as eyebrow + listing tag)
 *   author:      Gardar Stefansson, founder (optional, default below)
 *   readTime:    6                          (optional, auto-computed from word count)
 *   next:        slug-of-next-post          (optional, controls "Read next" link)
 *   ---
 *
 * Pull quotes:   use a markdown blockquote ("> ...")
 * Callouts:      use a raw HTML <div class="callout">...</div> block
 * Tables:        use GitHub-flavoured markdown with alignment (:---:, ---:, etc.)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog-posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const TODAY = new Date().toISOString().slice(0, 10);

const DEFAULT_AUTHOR = 'Magdalena, co-founder and CEO';
const SITE_URL = 'https://misersavings.com';
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const GA_ID = 'G-76HDNX2NG5';

// ── marked renderer extensions ─────────────────────────────────────────────
// Make blockquotes render as the site's pull-quote pattern (single <blockquote>
// with .pull-quote class so we keep semantics, but CSS handles the styling).
const renderer = new marked.Renderer();
const origTable = renderer.table.bind(renderer);
renderer.blockquote = function (quote) {
  return `<blockquote class="pull-quote">${quote.trim()}</blockquote>\n`;
};
marked.setOptions({ renderer, gfm: true, breaks: false });

// ── Read posts ────────────────────────────────────────────────────────────
function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    throw new Error(`blog-posts/ directory not found at ${POSTS_DIR}`);
  }
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
    .map(f => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
      const { data, content } = matter(raw);
      // Drafts: set `draft: true` in frontmatter to keep a post out of the build.
      if (data.draft === true) return null;
      const required = ['slug', 'title', 'description', 'date', 'category'];
      for (const k of required) {
        if (!data[k]) throw new Error(`${f}: missing required frontmatter field "${k}"`);
      }
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      // gray-matter (via js-yaml) auto-parses ISO date strings into JS Date
      // objects. Coerce back to "YYYY-MM-DD" string regardless of input shape.
      const dateStr = data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date).slice(0, 10);
      return {
        slug:        data.slug,
        title:       data.title,
        description: data.description,
        date:        dateStr,
        category:    data.category,
        author:      data.author || DEFAULT_AUTHOR,
        readTime:    data.readTime || Math.max(1, Math.round(wordCount / 250)),
        next:        data.next || null,
        body:        content,
        sourceFile:  f,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

// ── Helpers ───────────────────────────────────────────────────────────────
function renderInline(md) {
  return marked.parseInline(md);
}
function dateLong(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function escapeAttr(s) {
  // For double-quoted HTML attributes — same as escapeHtml minus single-quote
  return escapeHtml(s);
}

// ── Shared partials ───────────────────────────────────────────────────────
function navHtml() {
  return `<nav>
  <a class="nav-wm" href="../index.html">mı<span class="d">$</span>er</a>
  <ul class="nav-links">
    <li><a href="../index.html#how">How it works</a></li>
    <li><a href="../index.html#quit">Quit</a></li>
    <li><a href="../index.html#groups">Groups</a></li>
    <li><a href="../index.html#ranks">Ranks</a></li>
    <li><a href="index.html" class="active">Blog</a></li>
    <li><a href="../faq.html">FAQ</a></li>
  </ul>
  <a class="nav-cta" href="../index.html#waitlist">Join waitlist</a>
</nav>`;
}
function footerHtml() {
  return `<footer>
  <div class="footer-inner">
    <div class="footer-wm">mı<span class="d">$</span>er</div>
    <div class="footer-links-row">
      <a href="../index.html">Home</a>
      <a href="../index.html#how">How it works</a>
      <a href="../index.html#quit">Quit</a>
      <a href="../index.html#groups">Groups</a>
      <a href="../index.html#ranks">Ranks</a>
      <a href="index.html">Blog</a>
      <a href="../faq.html">FAQ</a>
      <a href="../about.html">About</a>
      <a href="../terms.html">Terms</a>
      <a href="../privacy.html">Privacy</a>
    </div>
    <div class="footer-copy">
      © 2026 MiserSavings Inc. · Austin, TX · mi$er is a financial technology company, not a bank.
    </div>
  </div>
</footer>`;
}
function gaHtml() {
  return `<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;
}
function faviconsHtml() {
  return `<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<link rel="manifest" href="../site.webmanifest">`;
}

// ── Post template ─────────────────────────────────────────────────────────
function renderPost(post, nextPost) {
  const titlePlain = post.title.replace(/[*_`]/g, '');
  const titleHtml = renderInline(post.title);
  const bodyHtml = marked.parse(post.body);
  const url = `${SITE_URL}/blog/${post.slug}.html`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: titlePlain,
    description: post.description,
    image: OG_IMAGE,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author.split(',')[0].trim() },
    publisher: {
      '@type': 'Organization',
      name: 'Miser',
      url: SITE_URL + '/',
      logo: { '@type': 'ImageObject', url: OG_IMAGE }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  });

  const nextBlock = nextPost ? `
  <div class="post-next">
    <div class="post-next-label">Read next</div>
    <a href="${nextPost.slug}.html">${escapeHtml(nextPost.title.replace(/[*_`]/g, ''))} →</a>
  </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(titlePlain)} — Miser</title>
<meta name="description" content="${escapeAttr(post.description)}">
<link rel="canonical" href="${url}">

<meta property="og:title" content="${escapeAttr(titlePlain)}">
<meta property="og:description" content="${escapeAttr(post.description)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${post.date}T09:00:00-05:00">
<meta property="article:author" content="${escapeAttr(post.author.split(',')[0].trim())}">
<meta property="article:section" content="${escapeAttr(post.category)}">
<meta name="theme-color" content="#1C3D2B">

${faviconsHtml()}
<link rel="stylesheet" href="blog.css">

${gaHtml()}

<script type="application/ld+json">
${jsonLd}
</script>
</head>
<body>

${navHtml()}

<section class="post-hero">
  <div class="post-hero-inner">
    <a class="back-link" href="index.html">← All posts</a>
    <div class="post-eyebrow">${escapeHtml(post.category)}</div>
    <h1 class="post-h1">${titleHtml}</h1>
    <p class="post-meta">${dateLong(post.date)}<span class="sep">·</span>${post.readTime} min read<span class="sep">·</span>By ${escapeHtml(post.author)}</p>
  </div>
</section>

<section class="post-body">
  <div class="post-inner">
${bodyHtml.trim()}
  </div>
${nextBlock}
</section>

${footerHtml()}

</body>
</html>
`;
}

// ── Listing template ──────────────────────────────────────────────────────
function renderListing(posts) {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Miser Blog',
    description: 'Essays on saving, spending, and the friction in between.',
    url: SITE_URL + '/blog/',
    publisher: {
      '@type': 'Organization',
      '@id': SITE_URL + '/#organization',
      name: 'Miser',
      url: SITE_URL + '/'
    }
  });

  const rows = posts.map(p => {
    const titlePlain = p.title.replace(/[*_`]/g, '');
    return `    <a class="post-row" href="${p.slug}.html">
      <div class="post-row-meta">${p.date}<span class="sep">·</span>${p.readTime} min read<span class="sep">·</span>${escapeHtml(p.category)}</div>
      <h2 class="post-row-title">${escapeHtml(titlePlain)}</h2>
      <p class="post-row-desc">${escapeHtml(p.description)}</p>
      <span class="post-arrow">Read →</span>
    </a>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog — Miser</title>
<meta name="description" content="Essays on saving, spending, and the friction in between. Plain talk about why most personal-finance advice fails — and what actually changes behavior.">
<link rel="canonical" href="${SITE_URL}/blog/">

<meta property="og:title" content="The Miser Blog">
<meta property="og:description" content="Essays on saving, spending, and the friction in between.">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:url" content="${SITE_URL}/blog/">
<meta name="theme-color" content="#1C3D2B">

${faviconsHtml()}
<link rel="stylesheet" href="blog.css">

${gaHtml()}

<script type="application/ld+json">
${jsonLd}
</script>
</head>
<body>

${navHtml()}

<section class="blog-hero">
  <div class="blog-hero-inner">
    <div class="blog-eyebrow">Blog</div>
    <h1 class="blog-h1">Notes on saving, spending, and the <em>friction</em> in between.</h1>
    <p class="blog-lede">Most personal-finance advice fails because it asks for the wrong kind of decision at the wrong moment. We write about what actually changes behavior — and what doesn't.</p>
  </div>
</section>

<section class="blog-body">
  <div class="blog-inner">

${rows}

  </div>
</section>

${footerHtml()}

</body>
</html>
`;
}

// ── Sitemap update ────────────────────────────────────────────────────────
function updateSitemap(posts) {
  let xml = fs.readFileSync(SITEMAP, 'utf-8');
  // Strip all existing blog URLs (the index + posts) so we regenerate cleanly.
  xml = xml.replace(/\s*<url>\s*<loc>https:\/\/misersavings\.com\/blog\/[^<]*<\/loc>[\s\S]*?<\/url>/g, '');

  const blogBlock = [
    `  <url>
    <loc>${SITE_URL}/blog/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
    ...posts.map(p => `  <url>
    <loc>${SITE_URL}/blog/${p.slug}.html</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  ].join('\n');

  xml = xml.replace(/<\/urlset>\s*$/, `${blogBlock}\n</urlset>\n`);
  fs.writeFileSync(SITEMAP, xml);
}

// ── Prune stale HTML ──────────────────────────────────────────────────────
// Delete any blog/<slug>.html that no longer has a matching posts/<slug>.md.
// Keeps blog/index.html (the listing) and blog/blog.css always. Run after we
// generate the current set so the live site stays in sync when a post is
// removed or renamed.
function pruneStaleHtml(validSlugs) {
  const removed = [];
  for (const f of fs.readdirSync(BLOG_DIR)) {
    if (!f.endsWith('.html')) continue;
    if (f === 'index.html') continue;
    const slug = f.slice(0, -5); // strip .html
    if (!validSlugs.has(slug)) {
      fs.unlinkSync(path.join(BLOG_DIR, f));
      removed.push(f);
    }
  }
  return removed;
}

// ── Main ──────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const posts = loadPosts();
  if (posts.length === 0) {
    console.log('No posts found in blog-posts/. Nothing to build.');
    return;
  }

  // Build the "next post" link: by frontmatter override, else next-in-time wrap-around.
  const bySlug = Object.fromEntries(posts.map(p => [p.slug, p]));
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const nextPost = p.next
      ? bySlug[p.next] || null
      : posts[(i + 1) % posts.length];
    const html = renderPost(p, nextPost && nextPost.slug !== p.slug ? nextPost : null);
    fs.writeFileSync(path.join(BLOG_DIR, `${p.slug}.html`), html);
    console.log(`  ✓ blog/${p.slug}.html`);
  }

  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), renderListing(posts));
  console.log(`  ✓ blog/index.html  (${posts.length} posts)`);

  updateSitemap(posts);
  console.log(`  ✓ sitemap.xml      (blog URLs refreshed)`);

  const removed = pruneStaleHtml(new Set(posts.map(p => p.slug)));
  for (const f of removed) {
    console.log(`  ✗ blog/${f}        (stale, removed)`);
  }

  console.log(`\nDone. Built ${posts.length} post${posts.length === 1 ? '' : 's'} at ${TODAY}${removed.length ? ` (pruned ${removed.length} stale file${removed.length === 1 ? '' : 's'})` : ''}.`);
}

try {
  main();
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
