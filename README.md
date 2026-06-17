# KylixAI — Company Website

> Marketing site for **KylixAI**, an AI automation studio for small business owners.
> Live at **[kylixai.com](https://kylixai.com)**.

A single-page, conversion-focused landing site built as a hand-crafted static experience — no framework, no build step, no runtime dependencies. Every pixel and every animation is authored by hand for a warm, editorial, paper-grain aesthetic, and tuned to hold 60fps down to a 380px viewport.

---

## ✦ Highlights

- **Zero-framework static site** — plain semantic HTML, CSS custom properties, and vanilla JS. Deploys as flat files.
- **Editorial design system** — warm "paper" palette, Playfair Display + Lora typography, soft-UI tactility, SVG grain overlay, all code-generated (no raster art).
- **Cinematic GSAP motion** — orchestrated page-load reveal, scrollytelling narrative arc, character-level headline animation, and an idle-loaded Three.js hero field ("The Current").
- **Accessibility-first motion** — full `prefers-reduced-motion` fallbacks; animation never blocks content or input.
- **Lead capture** — Web3Forms submission gated behind a solved hCaptcha challenge.
- **Production SEO** — meta + Open Graph + Twitter cards, favicon set, `robots.txt`, `sitemap.xml`, OG image.

---

## 🧱 Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| **Markup** | Semantic HTML5 | Mobile-first, authored at 380px baseline |
| **Styling** | Modern CSS | Custom properties (design tokens), no preprocessor, no framework |
| **Motion** | [GSAP 3](https://gsap.com/) | `ScrollTrigger` + `SplitText`, loaded via CDN |
| **3D hero** | [Three.js](https://threejs.org/) | Dynamically `import()`ed at idle — never blocks first paint |
| **Typography** | Playfair Display + Lora | Google Fonts, `display=swap`, self-described fallbacks |
| **Forms** | [Web3Forms](https://web3forms.com/) | Serverless form endpoint, no backend to maintain |
| **Spam protection** | [hCaptcha](https://www.hcaptcha.com/) | Submit blocked until challenge solved |
| **Hosting** | [Cloudflare Pages](https://pages.cloudflare.com/) | Static deploy + `kylixai.com` DNS |
| **Tooling** | None required | No npm install, no bundler — open `index.html` and go |

### Design tokens (excerpt)

```
--color-ink:        #2C1F0E   /* deep espresso text   */
--color-ground:     #F0EAD6   /* warm paper base      */
--color-error:      #C73B1A   /* signal / accent      */
--font-display: 'Playfair Display', serif
--font-body:    'Lora', serif
```

---

## 📁 Project Structure

This repo follows a **WAT (Workflows · Agent · Tools)** four-workspace pipeline — design flows into content, content into build, build into deploy. Each workspace carries its own `context.md` routing table.

```
KYLIX AI WEBSITE/
├── CLAUDE.md          # Master map + session protocol
├── build.sh           # Idempotent project-structure generator
│
├── design/            # 1 · Design system — tokens, brand, motion specs, code-gen assets
├── content/           # 2 · All copy (written before markup), audience research
├── build/             # 3 · Site source
│   └── src/
│       ├── index.html # The page
│       ├── main.css   # Design system + layout + soft-UI
│       ├── main.js    # GSAP orchestration + Three.js hero + form logic
│       ├── favicon.svg, og-image.png, robots.txt, sitemap.xml
│
└── deploy/            # 4 · Cloudflare Pages, Web3Forms, hCaptcha, SEO, pre-launch checklist
```

### Page narrative (Hormozi arc)

The copy and scroll experience move through a deliberate sequence:

`recognition` → `reframe` → `how` → `proof` → `audit (CTA)`

---

## 🚀 Local Development

No install step. It's static.

```bash
# Clone
git clone https://github.com/austinkyle/kylixai-website.git
cd kylixai-website

# Serve the build directory (any static server works)
cd build/src
python3 -m http.server 8000
# → open http://localhost:8000
```

> A static server is recommended over opening the file directly so the dynamic
> `import()` of Three.js and the Google Fonts requests resolve correctly.

---

## 🔌 Configuration

Secrets are **not** committed. `.env` is gitignored; `.env.example` lists the expected keys.

Client-side public identifiers live directly in `index.html` (this is by design — they are meant to be public):

- **Web3Forms access key** — public form endpoint identifier
- **hCaptcha site key** — public, paired with a secret key held in the hCaptcha dashboard

---

## 🌐 Deployment

Hosted on **Cloudflare Pages** as a static site with `kylixai.com` DNS.

1. Connect the repository to a Cloudflare Pages project.
2. Build command: _none_. Output directory: `build/src`.
3. Point `kylixai.com` at the Pages project (see [`deploy/cloudflare/`](deploy/cloudflare/)).

Full setup notes, the forms guide, SEO config, and a pre-launch checklist live under [`deploy/`](deploy/).

---

## 📄 License

© KylixAI. All rights reserved.
