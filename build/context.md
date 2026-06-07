# build/ — Site Code Workspace

> **MANDATORY**: Load the frontend-design skill BEFORE any markup or styling work.
> Primary path: `/mnt/skills/public/frontend-design/SKILL.md`
> Fallback path: `/Users/user/Documents/Projects VS Code/DEMO LEAD QUALIFIER - FULL STACK/.agents/skills/frontend-design/SKILL.md`
>
> Read this context.md, then navigate to the specific task using the routing table.
> Do NOT load content/drafts/ or deploy/ while actively coding.

---

## Quality Bar — Answer YES to ALL before marking any task done

- [ ] Looks like a real designer with a point of view made it — not a template, not generic AI output
- [ ] Tired business owner feels SEEN within 3 seconds on a phone screen
- [ ] Emotional promise (optimistic relief, freedom) communicated through design BEFORE words are read
- [ ] Free-audit offer crystal clear; CTA is the most satisfying tactile element on the page
- [ ] Motion is smooth and delightful on a mid-range phone at 380px viewport (test this, don't assume)
- [ ] Navigation is exploratory and memorable — NO standard Home/About/Services/Contact bar
- [ ] Copy speaks to pain and desire in simple human language — zero jargon, zero AI terminology
- [ ] Proof section gracefully holds "coming soon" and is ready for real case studies
- [ ] prefers-reduced-motion respected — all animations wrapped in the media query check
- [ ] Avoids every generic AI aesthetic the frontend-design skill warns against
- [ ] Soft-UI applied only to moments that matter (CTA button, key cards) — NOT everything
- [ ] Grain/noise overlay present — adds tactile depth to backgrounds

---

## Tech Stack (use exactly these — no additions without justification)

| Tool | Source | Purpose |
|------|--------|---------|
| HTML / CSS / JS | Native | No framework — static marketing site |
| GSAP core | CDN: `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` | Animation engine |
| GSAP ScrollTrigger | CDN: `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js` | Scroll-based storytelling |
| GSAP SplitText | CDN: `https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js` | Text letter/word reveals |
| Lenis | CDN (optional) | Smooth scroll — add ONLY if CSS + GSAP feel insufficient |
| Fontshare / Google Fonts | CDN or self-hosted | Display + body font pair |
| Lucide / Phosphor | CDN (if icons needed) | Icon set |
| Web3Forms | API endpoint | Lead capture form (no backend) |
| hCaptcha | CDN | Spam protection for the form |

---

## Build Pipeline

```
1. TOKEN IMPORT     → Copy CSS custom properties from design/tokens/ into :root in main.css
                       Import @font-face or CDN link for the chosen fonts

2. STRUCTURE        → Build semantic HTML in src/index.html
                       Mobile-first: design at 380px, then scale up with min-width media queries
                       Section order mirrors the Hormozi arc (hero → recognition → reframe → how-it-works → proof → CTA)
                       No traditional nav bar — use a non-linear approach (hidden drawer, radial menu, or anchor-scroll CTA only)

3. VISUAL LAYER     → Apply CSS custom properties throughout
                       Add soft-UI shadows to CTA and key cards
                       Implement gradient mesh backgrounds (layered radial-gradient in CSS)
                       Add grain overlay pseudo-element (SVG feTurbulence or CSS)
                       Layer code-generated decorative assets from design/assets/

4. MOTION           → Load GSAP plugins via CDN (BEFORE closing </body>)
                       Register ScrollTrigger: gsap.registerPlugin(ScrollTrigger, SplitText)
                       Implement page-load orchestration timeline per spec-motion-v1.0.md
                       Implement scrollytelling sections per spec-motion-v1.0.md
                       Add hover states to CTA and interactive elements
                       Wrap all GSAP code in prefers-reduced-motion check
                       Test: throttle CPU 4x in DevTools — still 60fps?

5. LEAD CAPTURE     → Web3Forms HTML form (see deploy/forms/forms-web3forms-v1.0.md for exact setup)
                       hCaptcha widget integrated
                       Success state: animated confirmation (GSAP)
                       Error state: clear, friendly error message

6. QA PASS          → Test every quality bar checkbox above
                       Test at 380px, 768px, 1280px viewports
                       Test with prefers-reduced-motion: reduce enabled
                       Validate HTML (no unclosed tags, proper ARIA labels)
                       Check tab order and focus states

7. SHIP             → Hand off completed src/ to deploy/ instructions
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| Build HTML skeleton (first pass) | `content/copy/` (all finals), `design/tokens/token-colors-v*.md`, `design/tokens/token-typography-v*.md` | `content/research/`, `design/brand/`, `design/specs/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Style with CSS (colors, type, layout) | `src/index.html`, `src/main.css`, `design/tokens/` (all) | `content/drafts/`, `design/brand/`, `design/specs/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Implement GSAP page-load timeline | `src/main.js`, `design/specs/spec-motion-v*.md` | All `content/`, `design/tokens/`, `design/brand/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Implement scrollytelling (ScrollTrigger) | `src/main.js`, `design/specs/spec-motion-v*.md`, `content/copy/` (section order reference) | `content/drafts/`, `design/brand/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Add decorative visual character (grain, blobs, mesh) | `design/assets/` (all), `src/main.css`, `design/tokens/token-colors-v*.md` | All `content/`, `design/specs/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Build Web3Forms lead capture | `src/index.html`, `deploy/forms/forms-web3forms-v*.md`, `content/copy/copy-cta-final-v*.md` | `content/drafts/`, `design/specs/`, `design/brand/`, `deploy/cloudflare/`, `deploy/seo/` | **frontend-design** (REQUIRED) |
| Mobile QA pass (380px viewport) | `src/` (all files), quality bar checklist above | All `design/specs/`, `design/brand/`, all `content/`, all `deploy/` | **frontend-design** (REQUIRED) |
| Accessibility + SEO meta pass | `src/index.html`, `deploy/seo/seo-config-v*.md` | All `design/`, all `content/drafts/`, `deploy/cloudflare/`, `deploy/forms/` | None |
| Add or refine a component | `components/` (the specific component), `src/main.css`, `design/tokens/` (all) | `content/drafts/`, `design/brand/`, all `deploy/` | **frontend-design** (REQUIRED) |
