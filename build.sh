#!/usr/bin/env bash
# ============================================================
#  KylixAI Company Website — Workspace Build Script
#  Idempotent: safe to re-run. Never overwrites existing files.
#  Expected file count on clean run: ~40 files
# ============================================================
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATED=0
SKIPPED=0

# ─── Helper Functions ──────────────────────────────────────

write_file() {
  local path="$1"
  if [ ! -f "$path" ]; then
    mkdir -p "$(dirname "$path")"
    cat > "$path"
    echo "  [CREATED] $path"
    CREATED=$((CREATED + 1))
  else
    echo "  [SKIPPED] $path (already exists)"
    SKIPPED=$((SKIPPED + 1))
    cat > /dev/null
  fi
}

touch_file() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  if [ ! -f "$path" ]; then
    touch "$path"
    echo "  [CREATED] $path"
    CREATED=$((CREATED + 1))
  else
    echo "  [SKIPPED] $path"
    SKIPPED=$((SKIPPED + 1))
  fi
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  KylixAI Company Website — Workspace Builder"
echo "  Base: $BASE_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================
#  SECTION 0 — Root Files
# ============================================================
echo ""
echo "── Section 0: Root Files ──────────────────────────────"

write_file "$BASE_DIR/CLAUDE.md" << '__CLAUDE_MD__'
# KylixAI Company Website — Master Map

> **Session Protocol — Token Efficiency Rule**
> Read CLAUDE.md first. Then read ONLY the `context.md` of the workspace relevant to the current task.
> Never load all workspaces simultaneously. Use the LOCAL ROUTING TABLE in each `context.md` to navigate.
> Four workspaces in order of the build sequence: **design/** → **content/** → **build/** → **deploy/**

---

## WAT Framework

| Layer | Definition |
|-------|-----------|
| **W — Workflows** | Step-by-step pipelines in each workspace: design tokens → copy → build → deploy |
| **A — Agent** | Claude Code: reads CLAUDE.md first, then one workspace context.md at a time — never all at once |
| **T — Tools** | Markdown context files, the frontend-design skill, GSAP CDN, Web3Forms, routing tables |

---

## Skills Registered

| Skill | Path | When to Load |
|-------|------|-------------|
| **frontend-design** | `/mnt/skills/public/frontend-design/SKILL.md` | Before ANY design or markup work — non-negotiable |
| **find-skills** | `/Users/user/.agents/skills/find-skills/SKILL.md` | When additional capabilities are needed |

**Fallback path for frontend-design** (if /mnt path not found):
`/Users/user/Documents/Projects VS Code/DEMO LEAD QUALIFIER - FULL STACK/.agents/skills/frontend-design/SKILL.md`

---

## Visual Asset Decision — LOCKED: Code-Generated (Option B)

No image-generation skill was available at project initialization. Visual character is delivered entirely through code:
- CSS/SVG gradient meshes and soft animated blobs
- Noise/grain overlay via SVG `feTurbulence` or CSS pseudo-element
- Soft-UI / neumorphic shadow systems on key interactive elements
- GSAP-animated decorative SVG shapes and gradient halos
- Layered transparent shapes, glows, and geometric accents

Richer custom illustration work is deferred to v2 — documented in `design/brand/brand-system-v1.0.md`.

---

## Global Naming Conventions

| Document Type | Pattern | Example |
|---|---|---|
| Design tokens | `token-[type]-v[version].md` | `token-colors-v1.0.md` |
| Copy drafts | `copy-[section]-draft-v[version].md` | `copy-hero-draft-v1.0.md` |
| Copy finals | `copy-[section]-final-v[version].md` | `copy-hero-final-v1.0.md` |
| Build source | Standard web naming | `index.html`, `main.css`, `main.js` |
| Deploy docs | `deploy-[platform]-v[version].md` | `deploy-cloudflare-v1.0.md` |
| Specs | `spec-[topic]-v[version].md` | `spec-motion-v1.0.md` |
| Changelogs | `[workspace]-changelog.md` | `build-changelog.md` |
| Versions | Minor (v1.1) = refinements; Major (v2.0) = structural rewrites | — |

---

## Build Order (enforce this sequence — do not skip steps)

1. **Read** the frontend-design skill — internalize the quality bar before touching anything
2. **design/** — commit to exact palette (hex → CSS vars), two fonts, motion language; write decorative asset code
3. **content/** — write all copy following the Hormozi arc before touching markup
4. **build/** — HTML semantic skeleton, mobile-first at 380px
5. **build/** — visual layer: color, type, soft-UI tactility, decorative code-elements
6. **build/** — GSAP motion: page-load orchestrated reveal, scrollytelling arc, hover states; test 60fps at 380px
7. **build/** — Web3Forms lead capture + hCaptcha
8. **build/** — SEO meta, Open Graph, favicon, accessibility pass
9. **deploy/** — Cloudflare Pages + kylixai.com DNS

---

## Directory Map

```
KYLIX AI WEBSITE/
├── CLAUDE.md                           ← YOU ARE HERE (read every session — nothing else first)
├── .env                                ← API keys — NEVER commit
├── .env.example                        ← Safe-to-commit key list
├── .gitignore
├── build.sh                            ← Idempotent structure generator
│
├── design/                             ← WORKSPACE 1: Design system, tokens, brand, decorative assets
│   ├── context.md                      ← Load FIRST in this workspace (routing table inside)
│   ├── tokens/                         ← CSS variable files: colors, typography, spacing scale
│   ├── brand/                          ← Brand identity docs, v2 illustration plans
│   ├── assets/                         ← Code-generated SVG/CSS decorative elements
│   └── specs/                          ← Motion spec, animation language guide
│
├── content/                            ← WORKSPACE 2: All copy (Hormozi arc) — separate from markup
│   ├── context.md                      ← Load FIRST in this workspace
│   ├── copy/                           ← Final approved copy sections
│   ├── drafts/                         ← Work-in-progress copy
│   └── research/                       ← Audience pain research, competitor notes
│
├── build/                              ← WORKSPACE 3: Site source code (HTML / CSS / JS)
│   ├── context.md                      ← Load FIRST in this workspace (quality bar checklist inside)
│   ├── src/                            ← index.html, main.css, main.js
│   ├── components/                     ← Reusable HTML/CSS/JS components
│   ├── assets/                         ← Fonts, icons, generated images (if any)
│   └── skills/                         ← Local skill reference copies
│
├── deploy/                             ← WORKSPACE 4: Infrastructure, DNS, forms, SEO
│   ├── context.md                      ← Load FIRST in this workspace
│   ├── cloudflare/                     ← Cloudflare Pages setup + kylixai.com DNS guide
│   ├── forms/                          ← Web3Forms setup + hCaptcha config
│   ├── seo/                            ← Meta tags, Open Graph, robots.txt, sitemap
│   └── checklist/                      ← Pre-launch quality checklist
│
└── temp/                               ← Staging — gitignored, never committed
    ├── outputs/                        ← Generated files awaiting review
    └── resources/                      ← Raw reference material, screenshots
```
__CLAUDE_MD__

write_file "$BASE_DIR/.env" << '__ENV__'
# KylixAI Website — Local Environment Variables
# DO NOT COMMIT THIS FILE — it is gitignored
# Copy from .env.example and fill in real values

WEB3FORMS_ACCESS_KEY=
CALENDAR_BOOKING_URL=
SITE_URL=https://kylixai.com
__ENV__

write_file "$BASE_DIR/.env.example" << '__ENV_EXAMPLE__'
# KylixAI Website — Required Environment Variables
# Safe to commit. Copy to .env and fill in real values.

# Web3Forms access key — get free at https://web3forms.com
# Used in the free-audit lead-capture form (HTML data-access-key attribute)
WEB3FORMS_ACCESS_KEY=

# Optional: calendar booking link fallback (Calendly, Cal.com, etc.)
CALENDAR_BOOKING_URL=

# Canonical site URL (used for Open Graph and sitemap)
SITE_URL=https://kylixai.com
__ENV_EXAMPLE__

write_file "$BASE_DIR/.gitignore" << '__GITIGNORE__'
# ─── Secrets ───────────────────────────────────────────────
.env

# ─── Staging / Temp ────────────────────────────────────────
/temp/

# ─── Python ────────────────────────────────────────────────
__pycache__/
*.pyc
*.pyo
*.pyd

# ─── OS files ──────────────────────────────────────────────
.DS_Store
Thumbs.db
desktop.ini

# ─── Editor ────────────────────────────────────────────────
.vscode/settings.json
.idea/
*.swp
*.swo

# ─── Node (if tooling added later) ─────────────────────────
node_modules/
npm-debug.log*
__GITIGNORE__

# ============================================================
#  SECTION 1 — Temp Directory
# ============================================================
echo ""
echo "── Section 1: Temp Directory ──────────────────────────"

touch_file "$BASE_DIR/temp/outputs/.gitkeep"
touch_file "$BASE_DIR/temp/resources/.gitkeep"

# ============================================================
#  SECTION 2 — design/ Workspace
# ============================================================
echo ""
echo "── Section 2: design/ Workspace ──────────────────────"

write_file "$BASE_DIR/design/context.md" << '__DESIGN_CONTEXT__'
# design/ — Design System Workspace

> **MANDATORY**: Load the frontend-design skill BEFORE any work in this workspace.
> Primary path: `/mnt/skills/public/frontend-design/SKILL.md`
> Fallback path: `/Users/user/Documents/Projects VS Code/DEMO LEAD QUALIFIER - FULL STACK/.agents/skills/frontend-design/SKILL.md`
>
> Read this context.md, then navigate to the specific task file using the routing table below.
> Never load content/, build/, or deploy/ while working in design/.

---

## Visual Asset Decision — Code-Generated (Option B, LOCKED)

No image-generation skill is available. All visual character is delivered through code:
- **Gradient meshes**: CSS `background` with multiple radial-gradient layers
- **Animated blobs**: SVG `<path>` with GSAP morphSVG or CSS keyframe animation
- **Noise/grain overlay**: SVG `<feTurbulence>` filter on a pseudo-element
- **Soft-UI**: layered `box-shadow` with light/dark offsets (no hard borders on key CTAs/cards)
- **Glow halos**: `filter: blur()` on coloured absolutely-positioned divs behind elements

Custom illustration (hand-drawn, character-driven) is v2 work. Document ideas in `brand/brand-system-v1.0.md`.

---

## Design Pipeline

```
1. BRIEF REVIEW     → Re-read CLAUDE.md brand brief: bright/saturated dopamine design,
                       optimistic relief, Y2K-adjacent, soft-UI tactility, NOT sterile.
                       Load and internalize the frontend-design skill quality bar.

2. TOKEN DEFINITION → Commit to: exact hex palette → CSS custom properties,
                       two fonts (display + body, NO Inter/Roboto/Arial),
                       spacing scale, border-radius system.
                       Write to tokens/token-colors-v1.0.md and token-typography-v1.0.md.

3. ASSET CREATION   → Build code-generated decorative elements:
                       gradient mesh backgrounds, animated blobs, grain overlay.
                       Write to assets/ as standalone SVG or CSS snippet files.

4. SPEC SIGN-OFF    → Document the motion language (GSAP timeline, stagger values,
                       ScrollTrigger scrub settings, easing curves).
                       Write to specs/spec-motion-v1.0.md.
                       Confirm quality bar: does this look like a real designer made it?
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| Define color palette + CSS custom properties | `tokens/token-colors-v*.md` (latest), `CLAUDE.md` | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Select and spec typography pair | `tokens/token-typography-v*.md` (latest), `CLAUDE.md` | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Define spacing scale + border-radius system | `tokens/token-colors-v*.md`, `tokens/token-typography-v*.md` | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Create code-generated decorative assets | `assets/` (all), `tokens/token-colors-v*.md` | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Write motion language spec | `specs/spec-motion-v*.md` (latest), `tokens/token-colors-v*.md` | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Brand system review / v2 illustration planning | `brand/brand-system-v*.md` (latest), `tokens/` (all) | All `content/`, `build/`, `deploy/` | **frontend-design** (REQUIRED first) |
| Update / refine existing tokens | Latest file in `tokens/` that is being changed only | All other `tokens/`, `brand/`, `specs/`, all other workspaces | **frontend-design** (REQUIRED first) |
__DESIGN_CONTEXT__

write_file "$BASE_DIR/design/tokens/token-colors-v1.0.md" << '__TOKEN_COLORS__'
# token-colors-v1.0.md — Color Palette & CSS Custom Properties

**Status**: DRAFT — fill in values before any build work begins.
**Constraint**: Bright, saturated dopamine design. Neon-leaning gradients. High contrast.
               Energetic, not chaotic. No muted pastels. No corporate blues.

---

## Palette Decision

> Agent: Commit to a specific, bold palette before filling in values below.
> Consider: vivid coral/orange + electric cyan, or neon lime + deep violet,
> or saturated magenta + warm gold. Pick one strong direction. Make it memorable.

```css
/* ─── KylixAI Brand Palette ─────────────────────────────── */
:root {
  /* Primary — the hero color, used for CTAs and key moments */
  --color-primary:          ; /* e.g. #FF4F1F */
  --color-primary-light:    ; /* lighter tint for hover states */
  --color-primary-dark:     ; /* darker shade for pressed states */

  /* Accent — the surprise, used sparingly for maximum impact */
  --color-accent:           ; /* e.g. #00E5FF */
  --color-accent-light:     ;

  /* Surface — backgrounds and card surfaces */
  --color-surface-base:     ; /* main page background */
  --color-surface-raised:   ; /* card / raised element surface */
  --color-surface-overlay:  ; /* glass / frosted overlay */

  /* Text */
  --color-text-primary:     ; /* main body text */
  --color-text-secondary:   ; /* secondary labels, captions */
  --color-text-on-primary:  ; /* text on --color-primary background */
  --color-text-on-accent:   ; /* text on --color-accent background */

  /* Semantic */
  --color-success:          ;
  --color-error:            ;

  /* Gradients */
  --gradient-hero:          ; /* e.g. linear-gradient(135deg, #FF4F1F, #FF9E00) */
  --gradient-cta:           ;
  --gradient-mesh-1:        ; /* radial for mesh backgrounds */
  --gradient-mesh-2:        ;

  /* Soft-UI shadows (neumorphic) */
  --shadow-raised:          ; /* e.g. 8px 8px 16px rgba(0,0,0,.15), -4px -4px 12px rgba(255,255,255,.08) */
  --shadow-inset:           ; /* pressed / active state */
  --shadow-glow-primary:    ; /* e.g. 0 0 32px rgba(255,79,31,.4) */
  --shadow-glow-accent:     ;
}
```

---

## Usage Notes

- Use `--color-primary` for the single most important CTA on the page.
- Use `--color-accent` for maximum 2–3 moments — the element that surprises.
- Soft-UI shadows: apply `--shadow-raised` to the main CTA button and key feature cards only — not everything.
- Gradient meshes: layer two `radial-gradient` values in `background` to create depth.

---

## Accessibility Check

Confirm before finalizing:
- [ ] Primary text on surface-base: WCAG AA contrast ≥ 4.5:1
- [ ] Text on primary (CTA button): WCAG AA contrast ≥ 4.5:1
- [ ] Text on accent: WCAG AA contrast ≥ 4.5:1
__TOKEN_COLORS__

write_file "$BASE_DIR/design/tokens/token-typography-v1.0.md" << '__TOKEN_TYPE__'
# token-typography-v1.0.md — Typography System

**Status**: DRAFT — select fonts before any build work begins.
**Constraint**: NO Inter, Roboto, Arial, or system fonts. Pair an expressive display font
               with a refined body font. Both must be free for commercial use.

---

## Font Selection

> Agent: Choose a distinctive pairing. Good starting points from Fontshare:
> Display candidates: Clash Display, Cabinet Grotesk, Bricolage Grotesque, Zodiak, Boska
> Body candidates: Satoshi, General Sans, Switzer
> Google Fonts alternatives: Syne (display), DM Sans (body), Plus Jakarta Sans (body)
> Verify commercial-free license before finalizing. Self-host via @font-face or CDN.

| Role | Family | Weight(s) | Source / URL |
|------|--------|-----------|-------------|
| Display / Headings | [TO BE CHOSEN] | 700, 800 | [Fontshare/Google Fonts URL] |
| Body | [TO BE CHOSEN] | 400, 500 | [Fontshare/Google Fonts URL] |

---

## Type Scale (CSS Custom Properties)

```css
:root {
  /* Font families */
  --font-display: '[Display Font Name]', sans-serif;
  --font-body:    '[Body Font Name]', sans-serif;

  /* Type scale — mobile first (clamp for fluid sizing) */
  --text-xs:    clamp(0.75rem,  1.5vw, 0.875rem);   /* 12–14px */
  --text-sm:    clamp(0.875rem, 2vw,   1rem);         /* 14–16px */
  --text-base:  clamp(1rem,     2.5vw, 1.125rem);     /* 16–18px */
  --text-lg:    clamp(1.125rem, 2.5vw, 1.25rem);      /* 18–20px */
  --text-xl:    clamp(1.25rem,  3vw,   1.5rem);        /* 20–24px */
  --text-2xl:   clamp(1.5rem,   4vw,   2rem);          /* 24–32px */
  --text-3xl:   clamp(2rem,     5vw,   3rem);          /* 32–48px */
  --text-4xl:   clamp(2.5rem,   7vw,   4.5rem);        /* 40–72px */
  --text-hero:  clamp(3rem,     10vw,  7rem);           /* 48–112px */

  /* Line heights */
  --leading-tight:  1.1;
  --leading-snug:   1.3;
  --leading-normal: 1.5;
  --leading-relaxed:1.7;

  /* Letter spacing */
  --tracking-tight:  -0.03em;
  --tracking-normal:  0em;
  --tracking-wide:    0.05em;
  --tracking-wider:   0.1em;
}
```

---

## Usage Rules

- Hero headings: `--font-display`, `--text-hero`, `--leading-tight`, `--tracking-tight`
- Section headings (H2): `--font-display`, `--text-3xl`, `--leading-snug`
- Subheadings (H3): `--font-display`, `--text-2xl`, `--leading-snug`
- Body copy: `--font-body`, `--text-base`, `--leading-relaxed`
- Labels / captions: `--font-body`, `--text-sm`, `--tracking-wide`
- CTA buttons: `--font-display`, `--text-lg`, `--tracking-wide`, font-weight: 700
__TOKEN_TYPE__

write_file "$BASE_DIR/design/brand/brand-system-v1.0.md" << '__BRAND__'
# brand-system-v1.0.md — KylixAI Brand System

## Brand Voice

- **Tone**: Warm, direct, human. Never cold, technical, or jargon-heavy.
- **Register**: The company voice — bright, optimistic, playful-but-intentional.
  (Distinct from the founder's personal YouTube brand, which is calmer and more introspective.)
- **One sentence**: "We give you your business back."

## Emotional Promise

Landing on this site, a tired small-business owner should feel:
**Optimistic relief** — not a technical product pitch, but a sense that their situation
has a solution and that solution is accessible, warm, and on their side.

## Aesthetic Direction

- Bright, saturated "dopamine design" — Y2K-adjacent optimism without nostalgia gimmickry
- Neon-leaning gradients, high-contrast pairings, playful but intentional
- Tactility: soft-UI / neumorphism on moments that matter (CTAs, key cards) — not everything
- Reference sensibility: ensemblelapalatine.com — editorial personality, every element with character
  (Adapt the SENSIBILITY, not the visual language — our palette is bright, not vintage)

## Logo Direction (v1)

No logo asset exists at project init. For v1 launch:
- Use wordmark only: "KylixAI" in the display font, styled with the primary gradient
- Consider a simple geometric mark (circle with inner motion lines?) as a future logomark
- Document any logo iteration ideas below for the designer's reference

## Visual Assets — v2 Roadmap

**Deferred from v1** (code-generated visual character used instead):
- Custom hand-drawn spot illustrations for each pain-point recognition section
- Animated character / mascot concept (optional)
- Bespoke icon set with on-brand rounded style
- Custom photography / lifestyle imagery of real business owners

**When an image-generation skill becomes available**, use it to create:
- Abstract gradient mesh hero image (no photography)
- Decorative blob/shape set in brand palette for section backgrounds
- Simple geometric logomark variations

## Competitor / Reference Notes

| Reference | What to Learn | What to Avoid |
|-----------|--------------|--------------|
| ensemblelapalatine.com | Hand-crafted editorial personality; every element tells a story | Vintage illustration style (wrong register for KylixAI) |
| Linear.app | Masterful motion; purposeful, not decorative | Dark/minimal theme (wrong energy for KylixAI) |
| Generic SaaS templates | N/A — study to know what to avoid | Purple-gradient-on-white, stock imagery, hero → features → pricing |
__BRAND__

write_file "$BASE_DIR/design/specs/spec-motion-v1.0.md" << '__SPEC_MOTION__'
# spec-motion-v1.0.md — Motion Language

**Status**: DRAFT — fill in values after committing to GSAP implementation.
**Constraint**: 60fps on a mid-range phone at 380px. prefers-reduced-motion MUST be respected.
**Library**: GSAP (CDN) + ScrollTrigger + SplitText (all free since April 2025)

---

## Core Principles

1. **Motion tells the story** — the "trapped → discovered → freed" arc unfolds through scroll
2. **Orchestrated, not scattered** — one well-timed page-load sequence creates more delight than many micro-animations
3. **Physics-feeling** — easing should feel like objects with weight, not generic linear transitions
4. **Mobile-first** — test every animation at 380px before desktop; reduce complexity on mobile if needed

---

## Easing Vocabulary

```js
// GSAP ease strings — commit to these and use them consistently
const EASE = {
  enter:    'power3.out',          // Elements entering: quick start, gentle arrival
  exit:     'power2.in',           // Elements leaving: gentle start, quick exit
  spring:   'elastic.out(1, 0.5)', // Satisfying bounce for CTA and interactive elements
  smooth:   'sine.inOut',          // Smooth, continuous motion (blob animations, mesh drift)
  reveal:   'expo.out',            // Text reveals: explosive start, precise landing
};
```

---

## Page-Load Orchestration (Fill in values)

```js
// Master timeline — runs once on DOMContentLoaded
const tl = gsap.timeline({ defaults: { ease: EASE.enter } });

// Sequence (adjust durations after testing on mobile):
// tl.from('.hero-badge',       { y: 20, opacity: 0, duration: ___, delay: 0.1 })
//   .from('.hero-headline',    { y: 40, opacity: 0, duration: ___, stagger: ___ }, '-=___')
//   .from('.hero-subtext',     { y: 20, opacity: 0, duration: ___ }, '-=___')
//   .from('.hero-cta',         { scale: 0.9, opacity: 0, duration: ___, ease: EASE.spring }, '-=___')
//   .from('.hero-decoration',  { opacity: 0, duration: ___ }, '-=___');
```

---

## ScrollTrigger — Scrollytelling Arc

```js
// "Trapped → Discovered → Freed" narrative
// Section: The Hook (above fold) — no ScrollTrigger, part of page-load timeline above

// Section: Recognition (name the pain)
// ScrollTrigger.create({ trigger: '.section-recognition', ... })

// Section: Reframe (hope enters)
// ScrollTrigger.create({ trigger: '.section-reframe', ... })

// Section: How It Works
// ScrollTrigger.create({ trigger: '.section-how-it-works', ... })

// Fill in scrub values, pin settings, and animation details after testing
```

---

## SplitText — Text Reveals

```js
// For hero headline and key section headings:
// const split = new SplitText('.hero-headline', { type: 'lines,words' });
// gsap.from(split.words, { y: '110%', opacity: 0, stagger: 0.04, duration: 0.8, ease: EASE.reveal });
```

---

## Hover States

```js
// CTA button — satisfying spring scale
// button.addEventListener('mouseenter', () => gsap.to(button, { scale: 1.04, ease: EASE.spring, duration: 0.4 }));
// button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1,    ease: EASE.spring, duration: 0.4 }));
```

---

## prefers-reduced-motion

```js
// Wrap ALL GSAP initialization:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  // all GSAP timeline + ScrollTrigger code here
}
// Elements must be visible at their end-state without animation (no opacity:0 traps)
```

---

## Performance Notes

- Test on real mid-range phone (or throttle CPU 4× in DevTools) before declaring done
- Avoid animating `width`, `height`, `top`, `left` — use `transform` and `opacity` only
- Blob animations: use `will-change: transform` sparingly (only on the primary blob)
- Target ≤ 3 simultaneously animating elements on mobile
__SPEC_MOTION__

touch_file "$BASE_DIR/design/tokens/.gitkeep"
touch_file "$BASE_DIR/design/brand/.gitkeep"
touch_file "$BASE_DIR/design/assets/.gitkeep"
touch_file "$BASE_DIR/design/specs/.gitkeep"

# ============================================================
#  SECTION 3 — content/ Workspace
# ============================================================
echo ""
echo "── Section 3: content/ Workspace ─────────────────────"

write_file "$BASE_DIR/content/context.md" << '__CONTENT_CONTEXT__'
# content/ — Copy Workspace

> **Session Protocol**: Read this context.md, then navigate to the specific copy file using the routing table.
> Do NOT load design/, build/, or deploy/ while writing copy.
> The frontend-design skill is NOT required here — this is pure copywriting.

---

## The Reader

**Who they are**: Small-business owners and founders. Started their business dreaming of freedom.
Instead became a slave to it. Calendar full. Repetitive work endless. Original dream faded.
Successful on paper, trapped in practice. Likely reading on a phone.

**What they need to feel within 3 seconds**: "This page gets me." Then: "Oh — there's a way out."

**Language rules**:
- Simple, human. Speak like a trusted friend who runs a business, not a consultant.
- Never explain AI technology. Explain the freedom.
- Zero jargon: no "workflow automation solutions", no "AI-powered ecosystem".
- Lead with the dream outcome. Follow with the pain. End with the invitation.
- Automation should feel like a natural answer to their pain — not a product being sold.

---

## Hormozi Narrative Arc (copy must follow this structure)

```
1. THE HOOK          → Dream outcome + the quiet pain. Make them feel seen immediately.
                        "What would your business look like if it ran itself?"

2. THE RECOGNITION   → Name specific pains in their language. "That's exactly me."
                        Examples: chasing invoices, re-explaining tasks, scheduling back-and-forth,
                        copy-pasting data, following up manually, doing the same thing for the 100th time.

3. THE REFRAME       → It doesn't have to be this way. The business CAN run without consuming them.
                        Hope enters. Shift from "this is just how it is" to "wait — that's fixable."

4. HOW IT WORKS      → The free audit. Three clear steps:
                        (1) We audit — find exactly what's costing the most time and money.
                        (2) We show you the numbers — exact hours/dollars reclaimed.
                        (3) We build it. You pay nothing until it's working and saving you money.

5. THE PROOF         → Placeholder for testimonials + case studies. For launch:
                        → Founder credibility: 20 years entrepreneurial experience, B2B local businesses.
                        → "Coming soon" that feels intentional, not empty.

6. THE INVITATION    → Warm, low-friction, singular CTA: Book a free audit.
                        Make reaching out feel like their own idea, not a sales pressure.
                        No "limited spots" urgency gimmicks. Just warmth and confidence.
```

---

## Content Pipeline

```
1. AUDIENCE BRIEF    → Re-read the reader description above before writing a single word
2. DRAFT             → Write section by section in drafts/ following the arc above
3. EDIT              → Simplify; remove jargon; read aloud; cut anything that doesn't earn its place
4. FINAL             → Copy approved copy to copy/ with -final- in the filename
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| Write hero section (The Hook) | `drafts/copy-hero-draft-v*.md`, `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None — pure copywriting |
| Write recognition/pain section | `drafts/copy-recognition-draft-v*.md`, `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None |
| Write reframe section | `drafts/copy-reframe-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write How It Works section | `drafts/copy-howitworks-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write proof/trust section | `drafts/copy-proof-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write CTA section | `drafts/copy-cta-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Approve + finalize a section | Read the specific draft only → write to `copy/copy-[section]-final-v*.md` | All other sections, all other workspaces | None |
| Edit all copy for voice consistency | `copy/` (all finals), `drafts/` (all in-progress) | All `design/`, `build/`, `deploy/` | None |
| Audience research / pain-point mining | `research/` (all), `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None |
__CONTENT_CONTEXT__

write_file "$BASE_DIR/content/drafts/copy-hero-draft-v1.0.md" << '__COPY_HERO__'
# copy-hero-draft-v1.0.md — The Hook (Above-Fold Hero)

**Arc position**: #1 — The Hook
**Goal**: Dream outcome + the quiet pain. Make a tired business owner feel SEEN within 3 seconds.
**Rule**: Lead with feeling, not features. No AI terminology. Emotion before explanation.

---

## Elements to write

### Pre-headline badge / eyebrow
Short, warm label above the main headline. Sets the register.
Examples: "Free audit — no risk" / "For business owners who've had enough" / "You built this. Now let it run."

```
DRAFT:
```

### Hero headline (largest text on the page)
The single most important line of copy. Should communicate the dream outcome OR the pain with unexpected clarity.
Must work in 5–8 words. Will be SplitText-animated letter by letter.

```
DRAFT:
```

### Hero subheadline (1–2 sentences)
Expand on the headline. Name the situation without naming the technology.

```
DRAFT:
```

### CTA button label
The single action on the page. Warm, specific, low-friction.
Avoid: "Get Started", "Learn More", "Contact Us"
Consider: "Book my free audit", "See what's costing you", "Let's find your time back"

```
DRAFT:
```

### Below-CTA reassurance micro-copy
One line. Removes the last objection.
Examples: "No cost until it's working. No obligation to continue."

```
DRAFT:
```

---

## Rejected ideas (document so they don't resurface)

_Add any attempts that didn't feel right and why._
__COPY_HERO__

write_file "$BASE_DIR/content/drafts/copy-recognition-draft-v1.0.md" << '__COPY_RECOG__'
# copy-recognition-draft-v1.0.md — The Recognition

**Arc position**: #2 — The Recognition
**Goal**: Name the specific pains in their language. Visitor says "that's exactly me."
**Rule**: Be specific. Vague pain is invisible. Name the actual tasks, the actual moments.

---

## Section heading

```
DRAFT:
```

## Pain statements (aim for 4–6 specific, recognizable moments)

Each should be a short, vivid line the reader has literally thought before.
NOT: "Inefficient business processes slow you down."
YES: "You've explained the same task to three different people this month."

```
DRAFT:
1.
2.
3.
4.
5.
6.
```

## Closing beat (the emotional weight)

One sentence that lands after the list. Acknowledges the toll — not to make them feel worse, but to validate.

```
DRAFT:
```
__COPY_RECOG__

write_file "$BASE_DIR/content/drafts/copy-reframe-draft-v1.0.md" << '__COPY_REFRAME__'
# copy-reframe-draft-v1.0.md — The Reframe

**Arc position**: #3 — The Reframe
**Goal**: Hope enters. Shift from resignation ("this is just how it is") to possibility.
**Rule**: Don't pitch yet. This is the emotional pivot. Make the possibility feel real and personal.

---

## Section heading

```
DRAFT:
```

## Reframe body (2–3 short paragraphs max)

The transition from pain to possibility. What would their life look like if the repetitive work disappeared?
Speak to the dream they had when they started the business. Bring it back.

```
DRAFT:
```

## Transition line (bridges to How It Works)

Sets up the next section. Should feel like a natural next step, not a sales segue.

```
DRAFT:
```
__COPY_REFRAME__

write_file "$BASE_DIR/content/drafts/copy-howitworks-draft-v1.0.md" << '__COPY_HIW__'
# copy-howitworks-draft-v1.0.md — How It Works

**Arc position**: #4 — How It Works (the free audit, 3 steps)
**Goal**: Make the process feel simple, safe, and certain. The no-risk guarantee is the headline here.
**Rule**: "You pay nothing until it's working and saving you money" must be unmistakable.

---

## Section heading

```
DRAFT:
```

## Section subheadline (the guarantee in plain language)

```
DRAFT:
```

## Step 1 — The Audit

**Step label** (short, bold):
```
DRAFT:
```
**Step description** (2–3 sentences, plain language):
```
DRAFT:
```

## Step 2 — The Numbers

**Step label**:
```
DRAFT:
```
**Step description**:
```
DRAFT:
```

## Step 3 — The Build

**Step label**:
```
DRAFT:
```
**Step description** (include the guarantee clearly):
```
DRAFT:
```

## Below-steps reassurance

Optional: one additional line reinforcing the risk-free nature before moving on.

```
DRAFT:
```
__COPY_HIW__

write_file "$BASE_DIR/content/drafts/copy-proof-draft-v1.0.md" << '__COPY_PROOF__'
# copy-proof-draft-v1.0.md — Proof & Trust

**Arc position**: #5 — The Proof
**Goal**: Build credibility for launch with founder bio; hold space gracefully for future social proof.
**Rule**: The "coming soon" must feel intentional, not like a gap. Founder story carries the launch.

---

## Section heading

```
DRAFT:
```

## Founder credibility block

20 years entrepreneurial experience. Started in B2B serving local businesses.
Write this as a warm first-person statement or a brief third-person bio. Not a resume.

```
DRAFT:
```

## Testimonial placeholder (for v2)

A single, well-designed placeholder card that signals future social proof without feeling empty.
Consider: "We're collecting our first client results. Check back soon — or become one of them."

```
DRAFT:
```

## Trust signals (if applicable at launch)

Any logos, press mentions, associations, or other credibility markers available at launch.

```
DRAFT:
```
__COPY_PROOF__

write_file "$BASE_DIR/content/drafts/copy-cta-draft-v1.0.md" << '__COPY_CTA__'
# copy-cta-draft-v1.0.md — The Invitation (Final CTA)

**Arc position**: #6 — The Invitation
**Goal**: Warm, low-friction, singular action. Make reaching out feel like their own idea.
**Rule**: No urgency gimmicks ("limited spots!"). No pressure. Just warmth and confidence.
         The CTA button must be the most tactile, satisfying element on the page.

---

## Section heading (the invitation, not the pitch)

```
DRAFT:
```

## Body copy (2–3 sentences max)

Restate the promise simply. Make the next step feel obvious and safe.

```
DRAFT:
```

## Primary CTA button label

Same as or refined from the hero CTA. Must be specific and action-oriented.

```
DRAFT:
```

## Below-CTA micro-copy (removes last objection)

```
DRAFT:
```

## Fallback option (for visitors not ready to book)

A secondary, softer path. Could be an email link, a "learn more" anchor, or nothing if the primary CTA is strong enough.

```
DRAFT:
```

## Footer / closing line (optional)

The very last thing they read before leaving. Should leave them with warmth.

```
DRAFT:
```
__COPY_CTA__

touch_file "$BASE_DIR/content/copy/.gitkeep"
touch_file "$BASE_DIR/content/drafts/.gitkeep"
touch_file "$BASE_DIR/content/research/.gitkeep"

# ============================================================
#  SECTION 4 — build/ Workspace
# ============================================================
echo ""
echo "── Section 4: build/ Workspace ────────────────────────"

write_file "$BASE_DIR/build/context.md" << '__BUILD_CONTEXT__'
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
__BUILD_CONTEXT__

touch_file "$BASE_DIR/build/src/.gitkeep"
touch_file "$BASE_DIR/build/components/.gitkeep"
touch_file "$BASE_DIR/build/assets/.gitkeep"
touch_file "$BASE_DIR/build/skills/.gitkeep"

# ============================================================
#  SECTION 5 — deploy/ Workspace
# ============================================================
echo ""
echo "── Section 5: deploy/ Workspace ───────────────────────"

write_file "$BASE_DIR/deploy/context.md" << '__DEPLOY_CONTEXT__'
# deploy/ — Deployment & Infrastructure Workspace

> **Session Protocol**: Read this context.md, then navigate using the routing table.
> The frontend-design skill is NOT required for deployment tasks.
> Do NOT load design/ or content/ while working in deploy/.

---

## Stack Summary

| Component | Tool | Cost |
|-----------|------|------|
| Hosting | Cloudflare Pages | Free (unlimited bandwidth) |
| Domain | kylixai.com | Existing (bring your own registrar) |
| SSL | Auto-provisioned by Cloudflare | Free |
| Lead capture | Web3Forms free tier | Free (250 submissions/month) |
| Spam protection | hCaptcha | Free |
| Analytics | Cloudflare Pages built-in | Free |

---

## Deploy Pipeline

```
1. PRE-FLIGHT       → Run all quality bar checks from build/context.md
                       Confirm all copy is in final state (content/copy/, not drafts)
                       Confirm design tokens are in build/src/main.css
                       Confirm Web3Forms access key is documented

2. DEPLOY           → Connect Git repo to Cloudflare Pages
                       Set build output directory (root or /build/src/ depending on final structure)
                       Trigger first deployment; verify site loads at *.pages.dev URL

3. DNS              → In Cloudflare dashboard: add kylixai.com as custom domain
                       Update DNS records at registrar (CNAME or A record) per Cloudflare instructions
                       SSL certificate auto-provisions (can take 1-5 minutes)

4. FORMS            → Get Web3Forms access key (free at web3forms.com)
                       Add to form HTML: data-access-key="YOUR_KEY"
                       Add hCaptcha site key
                       Test: submit form -> confirm email arrives in founder's inbox

5. SEO / OG         → Verify Open Graph tags render correctly (use opengraph.xyz to preview)
                       Submit sitemap to Google Search Console
                       Verify robots.txt is accessible

6. MONITOR          → Cloudflare Pages dashboard: check analytics after first real traffic
                       Confirm form submissions arriving in inbox (not spam)
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| First Cloudflare Pages deployment | `cloudflare/deploy-cloudflare-v*.md` (full doc) | All `design/`, all `content/`, all `build/` | None |
| Connect kylixai.com custom domain + DNS | `cloudflare/deploy-cloudflare-v*.md` (DNS section) | All `design/`, all `content/`, all `build/` | None |
| Configure Web3Forms lead capture | `forms/forms-web3forms-v*.md`, `.env.example` (for key name) | All `design/`, all `content/`, all `build/`, `deploy/cloudflare/` | None |
| Write / update SEO meta + Open Graph | `seo/seo-config-v*.md`, `build/src/index.html` | All `design/`, all `content/drafts/`, `deploy/cloudflare/`, `deploy/forms/` | None |
| Run pre-launch quality checklist | `checklist/checklist-prelaunch-v*.md`, `build/context.md` (quality bar) | All `design/`, all `content/drafts/` | None |
| Debug form not delivering submissions | `forms/forms-web3forms-v*.md`, `build/src/index.html` (form HTML) | All `design/`, all `content/`, `deploy/seo/`, `deploy/cloudflare/` | None |
| Update deployment or re-deploy | `cloudflare/deploy-cloudflare-v*.md` | All `design/`, all `content/`, all `build/` | None |
__DEPLOY_CONTEXT__

write_file "$BASE_DIR/deploy/cloudflare/deploy-cloudflare-v1.0.md" << '__DEPLOY_CF__'
# deploy-cloudflare-v1.0.md — Cloudflare Pages Deployment Guide

## Prerequisites

- [ ] Git repository initialized with the project (or push to GitHub/GitLab)
- [ ] Cloudflare account (free at cloudflare.com)
- [ ] kylixai.com domain registered (at any registrar)
- [ ] Site code complete in `build/src/`

---

## Step 1: Push Project to Git

```bash
cd "/path/to/KYLIX AI WEBSITE"
git init
git add -A
git commit -m "Initial commit: KylixAI website v1"
# Push to GitHub: create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/kylixai-website.git
git push -u origin main
```

---

## Step 2: Connect to Cloudflare Pages

1. Log in to dash.cloudflare.com
2. Click **Workers & Pages** -> **Pages** -> **Connect to Git**
3. Authorize Cloudflare to access your GitHub account
4. Select the `kylixai-website` repository
5. Configure build settings:
   - **Framework preset**: None (static site)
   - **Build command**: _(leave blank — no build step)_
   - **Build output directory**: `build/src` (or `/` if index.html is at root)
6. Click **Save and Deploy**
7. Wait for the first deployment — Cloudflare provides a `*.pages.dev` URL to preview

---

## Step 3: Connect kylixai.com Custom Domain

### Option A: Domain registered at Cloudflare (easiest)
1. In Cloudflare Pages -> your project -> **Custom Domains** -> **Set up a custom domain**
2. Enter `kylixai.com` and click Continue
3. Cloudflare auto-adds the DNS record — done

### Option B: Domain at external registrar (GoDaddy, Namecheap, etc.)
1. In Cloudflare Pages -> **Custom Domains** -> **Set up a custom domain** -> enter `kylixai.com`
2. Cloudflare will show you the required DNS record (CNAME pointing to `kylixai-website.pages.dev`)
3. Log in to your domain registrar's DNS settings
4. Add the CNAME record:
   - **Name**: `@` (or `www` for www subdomain)
   - **Value**: `kylixai-website.pages.dev`
5. DNS propagation: 1-24 hours (usually under 10 minutes with Cloudflare nameservers)

### SSL Certificate
- Cloudflare auto-provisions a free SSL certificate within 1-5 minutes of custom domain setup
- No configuration required — HTTPS is automatic

---

## Step 4: Environment Variables (if needed)

1. In Cloudflare Pages -> your project -> **Settings** -> **Environment Variables**
2. Add any variables from `.env.example` that are needed at runtime
   - Note: For a static HTML site, variables are typically only used during build time
   - Web3Forms access key goes DIRECTLY in the HTML (it's a public key by design)

---

## Step 5: Verify Deployment

- [ ] `https://kylixai.com` loads over HTTPS
- [ ] `https://www.kylixai.com` redirects correctly
- [ ] All CSS, JS, and font assets load (no 404s in browser console)
- [ ] GSAP animations play on first load
- [ ] Form submits successfully (see forms guide)
- [ ] Mobile: test at 380px — layout intact, motion smooth

---

## Ongoing Deployments

Every `git push` to the `main` branch triggers an automatic redeployment on Cloudflare Pages.
Zero manual steps after initial setup. Build time for a static site: ~5 seconds.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on all pages | Check build output directory setting in Cloudflare Pages |
| SSL not provisioning | Wait 5 min; if stuck, check DNS propagation at dnschecker.org |
| Custom domain not working | Verify CNAME record at registrar; flush DNS cache |
| Assets 404 | Check file paths in HTML are relative, not absolute |
__DEPLOY_CF__

write_file "$BASE_DIR/deploy/forms/forms-web3forms-v1.0.md" << '__DEPLOY_FORMS__'
# forms-web3forms-v1.0.md — Web3Forms Lead Capture Setup

## Why Web3Forms

- **Free tier**: 250 submissions/month, emails every submission directly to your inbox
- **No backend**: pure HTML form — works on any static site
- **Data safety**: each lead is emailed to the founder immediately; the 30-day dashboard
  submission history limit does NOT cause data loss since leads live in your email inbox
- **hCaptcha**: supported natively, free

---

## Step 1: Get Your Free Access Key

1. Go to web3forms.com
2. Enter your email address -> click "Create Access Key"
3. Check email for the access key (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
4. Save the key in your local `.env` file as `WEB3FORMS_ACCESS_KEY=your_key_here`
   (The key goes IN the HTML — it's a public key by design, not a secret)

---

## Step 2: HTML Form Template

Paste this into `build/src/index.html` in the CTA section.
Replace `YOUR_ACCESS_KEY_HERE` with your actual key.

```html
<form
  id="audit-form"
  action="https://api.web3forms.com/submit"
  method="POST"
  novalidate
>
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
  <input type="hidden" name="subject" value="New Free Audit Request — KylixAI" />
  <input type="hidden" name="botcheck" />

  <div class="form-group">
    <label for="name">Your name</label>
    <input type="text" id="name" name="name" placeholder="Jane Smith" required autocomplete="name" />
  </div>

  <div class="form-group">
    <label for="email">Business email</label>
    <input type="email" id="email" name="email" placeholder="jane@yourbusiness.com" required autocomplete="email" />
  </div>

  <div class="form-group">
    <label for="business">What does your business do?</label>
    <input type="text" id="business" name="business" placeholder="e.g. HVAC contractor, law firm, retail store" />
  </div>

  <div class="h-captcha" data-captcha="true"></div>

  <button type="submit" class="cta-button">Book my free audit</button>

  <div id="form-result" aria-live="polite" hidden></div>
</form>

<script src="https://web3forms.com/client/script.js" async defer></script>
```

---

## Step 3: JavaScript Success/Error Handling

```html
<script>
  const form = document.getElementById('audit-form');
  const result = document.getElementById('form-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.hidden = false;
    result.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: json,
      });
      const data = await response.json();
      if (data.success) {
        result.textContent = "You're in. Check your inbox — we'll be in touch shortly.";
        form.reset();
      } else {
        result.textContent = 'Something went wrong. Try emailing us directly at hello@kylixai.com';
      }
    } catch {
      result.textContent = 'Connection error. Please try again or email hello@kylixai.com';
    }
  });
</script>
```

---

## Step 4: Test the Form

1. Deploy to Cloudflare Pages (or open index.html locally)
2. Submit a test entry with your own name/email
3. Confirm the email arrives in the founder's inbox within 60 seconds
4. Check the Web3Forms dashboard to confirm the submission appears
5. If email doesn't arrive: check spam folder; verify access key is correct in HTML

---

## Fallback: Calendar / Email Link

If Web3Forms is unavailable or the form feels like too much friction:
- Calendar link: `<a href="${CALENDAR_BOOKING_URL}">Book directly</a>`
- Email fallback: `<a href="mailto:hello@kylixai.com?subject=Free Audit Request">Email instead</a>`

---

## Free Tier Limits

| Limit | Value |
|-------|-------|
| Submissions/month | 250 |
| Email delivery | Every submission, immediately, no limit |
| Dashboard history | 30 days (emails are permanent — no data loss) |

At 250+ leads/month, upgrade to Web3Forms Pro ($9/month).
__DEPLOY_FORMS__

write_file "$BASE_DIR/deploy/seo/seo-config-v1.0.md" << '__DEPLOY_SEO__'
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
__DEPLOY_SEO__

write_file "$BASE_DIR/deploy/checklist/checklist-prelaunch-v1.0.md" << '__CHECKLIST__'
# checklist-prelaunch-v1.0.md — Pre-Launch Quality Checklist

Run through every item before publishing to kylixai.com.
No exceptions — this is the full quality bar for v1 launch.

---

## Design & Visual Quality

- [ ] Site does NOT look like a SaaS template or generic AI output
- [ ] Color palette is bold, saturated, and distinctly KylixAI (not generic purple gradients)
- [ ] No Inter, Roboto, Arial, or system fonts anywhere on the page
- [ ] Display font is expressive and memorable; body font is refined and readable
- [ ] Soft-UI / neumorphic shadows applied to CTA and key cards — not everywhere
- [ ] Grain/noise overlay present on at least one background section
- [ ] Gradient mesh or layered radial gradients present — no flat solid-color backgrounds
- [ ] Code-generated decorative elements (blobs, shapes) add visual character

---

## Copywriting & Emotional Impact

- [ ] Tired business owner feels SEEN within 3 seconds
- [ ] Hero headline is 5-8 words, emotionally resonant, zero jargon
- [ ] Copy uses "you" language, not "our clients" language
- [ ] "Free audit — you only pay when it's working" is unmistakably clear
- [ ] No AI terminology anywhere: no "AI-powered", "workflow automation solutions", "ecosystem"
- [ ] All six Hormozi arc sections present and flow naturally

---

## Motion & Interaction

- [ ] Page-load timeline runs on first visit
- [ ] ScrollTrigger scrollytelling unfolds the trapped → discovered → freed arc
- [ ] CTA button hover state is satisfying and tactile (GSAP spring scale)
- [ ] Navigation approach is exploratory — no standard nav bar
- [ ] Motion tested at 380px on mid-range device (or 4x CPU throttle in DevTools)
- [ ] prefers-reduced-motion: all animations skip cleanly; content still visible

---

## Lead Capture

- [ ] Web3Forms form present in CTA section
- [ ] hCaptcha widget renders correctly
- [ ] Test submission received in founder's inbox
- [ ] Success state is friendly and animated
- [ ] Error state provides fallback contact method
- [ ] Calendar/email fallback documented and present

---

## Technical Quality

- [ ] HTML validates — no unclosed tags, proper heading hierarchy
- [ ] All CSS custom properties in :root — no hardcoded hex values in stylesheet
- [ ] GSAP loaded via CDN — no npm bundle
- [ ] All images have alt attributes
- [ ] All form inputs have associated label elements
- [ ] Tab order logical; focus states visible
- [ ] No console errors in browser DevTools
- [ ] No 404 errors for assets (Network tab)
- [ ] Lighthouse: Performance >= 90, Accessibility >= 90

---

## SEO & Metadata

- [ ] title set and meaningful
- [ ] meta description under 160 characters and compelling
- [ ] Open Graph image (1200x630) renders correctly at opengraph.xyz
- [ ] Favicon visible in browser tab
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Canonical URL set

---

## Deployment

- [ ] Site live at https://kylixai.com (not just *.pages.dev)
- [ ] HTTPS/SSL certificate active — no browser security warning
- [ ] www.kylixai.com redirects correctly
- [ ] Site loads under 3 seconds on mobile connection (Lighthouse)
- [ ] Cloudflare Pages auto-deploy from main branch working

---

## Final Human Check

- [ ] Read the full page aloud top to bottom — does it flow?
- [ ] Show the hero section to someone outside tech — do they immediately understand the offer?
- [ ] Would a tired small-business owner, on a phone, feel hopeful?

**If yes to all: launch. If no: fix first.**
__CHECKLIST__

touch_file "$BASE_DIR/deploy/cloudflare/.gitkeep"
touch_file "$BASE_DIR/deploy/forms/.gitkeep"
touch_file "$BASE_DIR/deploy/seo/.gitkeep"
touch_file "$BASE_DIR/deploy/checklist/.gitkeep"

# ============================================================
#  Summary
# ============================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Build complete."
echo "  Files created : $CREATED"
echo "  Files skipped : $SKIPPED (already existed — untouched)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Next steps:"
echo "  1. git init && git add -A && git commit -m 'chore: init workspace blueprint'"
echo "  2. Open design/context.md -> load frontend-design skill -> define tokens"
echo "  3. Open content/context.md -> write hero copy first"
echo "  4. Open build/context.md -> build when design + copy are ready"
echo "  5. Open deploy/context.md -> deploy to Cloudflare Pages"
echo ""
