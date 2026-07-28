# seo-config-v1.1.md — SEO, Open Graph, Structured Data & AEO Setup

> Supersedes `seo-config-v1.0.md`. Changes: fixed stale tagline/OG example, replaced single-page sitemap example with the real 8-page sitemap, added the Structured Data & AEO section below.

---

## Meta Tags Template (live pattern, all 8 pages)

```html
<!-- Primary Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="[page-specific description]" />
<meta name="robots" content="index, follow" />

<!-- Canonical URL -->
<link rel="canonical" href="https://kylixai.com/[page].html" />

<!-- Favicon -->
<link rel="icon" href="assets/favicon/kylix-favicon-32x32.png" sizes="32x32" type="image/png" />
<link rel="icon" href="assets/favicon/kylix-favicon-16x16.png" sizes="16x16" type="image/png" />
<link rel="apple-touch-icon" href="assets/favicon/kylix-favicon-512x512.png" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://kylixai.com/[page].html" />
<meta property="og:site_name" content="KylixAI" />
<meta property="og:title" content="[Page Title] — KylixAI" />
<meta property="og:description" content="[page-specific description]" />
<meta property="og:image" content="https://kylixai.com/assets/kylix-og-image-dark-1200x630.png" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Page Title] — KylixAI" />
<meta name="twitter:description" content="[page-specific description]" />
<meta name="twitter:image" content="https://kylixai.com/assets/kylix-og-image-dark-1200x630.png" />

<title>[Page Title] — KylixAI</title>
```

Current live tagline is **"Applied AI for modern business"** (index.html) — the old "KylixAI — Get Your Business Back" example in v1.0 was stale and never matched the shipped copy.

---

## robots.txt

Live at `build/src/robots.txt`. Wildcard allow, plus explicit named allows for AI crawlers (belt-and-suspenders — the wildcard already permits them, but naming them signals intent to AEO/LLM crawlers specifically):

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://kylixai.com/sitemap.xml
```

---

## sitemap.xml

Live at `build/src/sitemap.xml`, all 8 pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kylixai.com/</loc><priority>1.0</priority></url>
  <url><loc>https://kylixai.com/services.html</loc><priority>0.8</priority></url>
  <url><loc>https://kylixai.com/services-development.html</loc><priority>0.8</priority></url>
  <url><loc>https://kylixai.com/services-automation.html</loc><priority>0.8</priority></url>
  <url><loc>https://kylixai.com/services-consulting.html</loc><priority>0.8</priority></url>
  <url><loc>https://kylixai.com/about.html</loc><priority>0.6</priority></url>
  <url><loc>https://kylixai.com/apps.html</loc><priority>0.6</priority></url>
  <url><loc>https://kylixai.com/resources.html</loc><priority>0.6</priority></url>
</urlset>
```

(Each entry also carries `<lastmod>` and `<changefreq>monthly</changefreq>` in the live file — omitted above for brevity.)

---

## Structured Data & AEO

Added in this pass to make the site citable by LLM answer engines (ChatGPT, Claude, Perplexity, Gemini), not just crawlable by search engines.

**Schema types in use (JSON-LD, all in `<head>`):**

| Page(s) | Schema types |
|---|---|
| All 8 pages | `Organization` (shared block, hand-synced — marked with `<!-- @partial:schema-org -->` / `<!-- @partial:schema-org:end -->` comments, same convention as `@partial:nav`) |
| index.html | + `WebSite`, `FAQPage` (4 Q&As) |
| about.html | + `Person` × 2 (Austin Kyle, Ciara Nicole), `FAQPage` (4 Q&As) |
| services.html | + `BreadcrumbList`, `Service` with `OfferCatalog` linking to the 3 sub-services |
| services-development.html | + `BreadcrumbList`, `Service` with `AggregateOffer` ($3k–$15k+), `FAQPage` (7 Q&As) |
| services-consulting.html | + `BreadcrumbList`, `Service` with `OfferCatalog` (hourly $350, coaching $500/mo, training $250/session), `FAQPage` (7 Q&As) |
| services-automation.html | + `BreadcrumbList`, `Service` with `Offer` ($10k), `FAQPage` (7 Q&As) |
| apps.html, resources.html | Organization schema only — no `SoftwareApplication`/`ItemList` schema yet (deferred; would need re-verified per-app details first) |

**Rule enforced throughout:** every `FAQPage` question/answer string is copied verbatim from the page's own visible `<details>` markup — structured data must match on-page text exactly, or it actively hurts trust with answer engines instead of helping.

**Known issue to resolve before/at launch:** `services.html`'s pricing card lists the Automation offering as "Starting at $1,000," while `services-automation.html`'s own FAQ copy says implementations "start around $10k for a focused single-channel agent." These are two different real numbers for the same offering on two live pages. The schema on each page currently reflects that page's own displayed number ($1,000 on services.html's `Service.hasOfferCatalog`, $10,000 on services-automation.html's `Service.offers`) rather than picking one — but the underlying content conflict is a truthfulness problem independent of schema and should be reconciled by whoever owns pricing.

**llms.txt:** live at `build/src/llms.txt` — the emerging llms.txt convention (llmstxt.org-style). H1 site name, one-line summary, linked sections for Services/About/Apps/Resources, and a short "facts for citation" list. Sourced only from already-established copy, no new claims.

---

## Verification Steps

- [ ] Open Graph preview: paste URL at opengraph.xyz
- [ ] Favicon visible in browser tab (Chrome, Safari, Firefox)
- [ ] robots.txt accessible at https://kylixai.com/robots.txt
- [ ] sitemap.xml accessible at https://kylixai.com/sitemap.xml, lists all 8 pages
- [ ] llms.txt accessible at https://kylixai.com/llms.txt
- [ ] Every JSON-LD block validates in Google's Rich Results Test / schema.org validator
- [ ] Every FAQPage question/answer string matches its page's visible `<details>` text exactly
- [ ] Submit sitemap to Google Search Console
- [ ] Description under 160 characters
