# seo-config-v1.0.md — SEO, Open Graph & Technical Setup

---

## Meta Tags Template (paste into `<head>` in index.html)

```html
<!-- Primary Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="KylixAI gives small business owners their time back. Free automation audit — you only pay when it's working and saving you money." />
<meta name="author" content="KylixAI" />
<meta name="robots" content="index, follow" />

<!-- Canonical URL -->
<link rel="canonical" href="https://kylixai.com" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://kylixai.com" />
<meta property="og:title" content="KylixAI — Get Your Business Back" />
<meta property="og:description" content="Free audit for small business owners. We find what's costing you the most time and money — then build the automation. You only pay when it's working." />
<meta property="og:image" content="https://kylixai.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="KylixAI" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://kylixai.com" />
<meta name="twitter:title" content="KylixAI — Get Your Business Back" />
<meta name="twitter:description" content="Free audit. You only pay when it's working and saving you money." />
<meta name="twitter:image" content="https://kylixai.com/og-image.png" />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<!-- Theme color — UPDATE to match --color-primary -->
<meta name="theme-color" content="#FF4F1F" />

<title>KylixAI — Get Your Business Back</title>
```

---

## OG Image Requirements

Create `build/src/og-image.png`:
- Dimensions: 1200x630px
- Include: KylixAI wordmark/name, tagline, brand colors
- Keep it bold and legible at small sizes (Slack/iMessage preview thumbnails are tiny)

---

## Favicon Setup

Create in `build/src/`:
- `favicon.svg` — SVG version (scales perfectly, preferred by modern browsers)
- `favicon.png` — 32x32 PNG fallback
- `apple-touch-icon.png` — 180x180 PNG for iOS home screen

Simple v1 approach: the letter "K" or "KX" in a circle, in brand primary color, on a contrasting background.

---

## robots.txt

Create `build/src/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://kylixai.com/sitemap.xml
```

---

## sitemap.xml

Create `build/src/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kylixai.com/</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Verification Steps

- [ ] Open Graph preview: paste URL at opengraph.xyz
- [ ] Favicon visible in browser tab (Chrome, Safari, Firefox)
- [ ] robots.txt accessible at https://kylixai.com/robots.txt
- [ ] sitemap.xml accessible at https://kylixai.com/sitemap.xml
- [ ] Submit sitemap to Google Search Console
- [ ] Description under 160 characters
