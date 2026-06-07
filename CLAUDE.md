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
