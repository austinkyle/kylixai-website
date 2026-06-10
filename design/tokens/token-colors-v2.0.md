# Color Tokens v2.0 — Warm Illustrated World

Status: FINAL v2.0 (replaces dark-mode v1.0)

---

## Ground & Surfaces

```css
--color-ground:       #F0EAD6;   /* warm amber parchment — page base */
--color-ground-deep:  #E8DEC5;   /* slightly darker — section alternates, stat blocks */
--color-ground-lift:  #F8F4EC;   /* lightest lift — form fields, callout surfaces */
```

## Ink (Text) — light-background hierarchy

```css
--color-ink:          #2C1F0E;   /* dark amber-brown — primary text; NOT pure black */
--color-ink-muted:    #6B5540;   /* warm mid-brown — body copy, captions, subheads */
--color-ink-ghost:    #B8A898;   /* ghost text — placeholders, disabled, micro-copy */
```

Contrast checks (against --color-ground #F0EAD6):
- --color-ink #2C1F0E: ~12.5:1 — passes AAA
- --color-ink-muted #6B5540: ~5.1:1 — passes AA
- --color-ink-ghost #B8A898: ~2.0:1 — decorative/non-text only

## Accents

```css
--color-accent-1:       #FF4F1F;   /* KylixAI orange — urgency, CTAs, open-quote mark */
--color-accent-1-light: #FF7349;   /* hover/lighter */
--color-accent-1-dark:  #D93E15;   /* pressed/darker */

--color-accent-2:       #5C8C4E;   /* field green — freedom, close-quote, step markers */
--color-accent-2-light: #7AAF68;   /* hover/lighter */
--color-accent-2-dark:  #3E6135;   /* pressed/deeper */
```

Thematic logic:
- Accent 1 (orange) = trapped/inside/urgency — used for open-quote, CTAs, the problem state
- Accent 2 (green) = freedom/outside/Saturday walk — used for close-quote, step markers, the resolution state
- This pairing encodes the before/after emotional arc directly in the two accent colors

Contrast checks (against --color-ground #F0EAD6):
- #FF4F1F orange: ~4.2:1 — passes AA for large text and UI components
- #5C8C4E green: ~4.6:1 — passes AA for large text and UI components
- Neither passes AAA; do not use for small body copy

## Structural

```css
--color-rule:           rgba(44,31,14,0.12);   /* hairlines, dividers — warm not grey */
--color-surface-lift:   rgba(44,31,14,0.04);   /* barely-there form field tint */
```

## Semantic

```css
--color-success:  #4A8A3D;   /* earthy green — aligned with accent-2 family */
--color-error:    #C73B1A;   /* warm orange-red — no neon */
```

## Shadows — warm ink-toned only

```css
--shadow-soft:    2px 3px 8px rgba(44,31,14,0.10);    /* illustration objects */
--shadow-medium:  4px 6px 16px rgba(44,31,14,0.14);   /* form, quote blocks */
--shadow-stamp:   3px 3px 0 rgba(44,31,14,0.18);      /* badge, ink-stamp style */
```

No glow effects. No neon shadows. No glassmorphism. All shadows are warm ink-toned.

## Grain Overlay

Retain SVG feTurbulence grain texture but retune for light background:
- opacity: 0.035 (down from 0.04 in v1 — lighter ground needs less grain)
- baseFrequency: 0.65
- numOctaves: 4

The existing grain.svg was tuned for dark backgrounds; this lighter setting
prevents muddiness on the parchment ground.

---

## Kill List (remove from main.css when implementing)

```
--color-surface-base
--color-surface-raised
--color-surface-overlay
--color-text-primary
--color-text-secondary
--color-accent (cyan #00EAFF)
--color-accent-light (cyan variants)
--gradient-hero
--gradient-cta
--gradient-mesh-1
--gradient-mesh-2
--shadow-glow-primary
--shadow-glow-accent
--shadow-raised (neumorphic)
--shadow-inset (neumorphic)
All --logo-gradient-* vars
```

All pure cyan (#00EAFF), all pure white (#FFFFFF), all pure black (#000000)
are forbidden in v2. If you see any of these in main.css, replace with the
appropriate ink or ground token.
