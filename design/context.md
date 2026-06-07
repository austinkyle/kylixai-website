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
