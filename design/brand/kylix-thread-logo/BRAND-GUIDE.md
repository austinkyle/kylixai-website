# KYLIX AI — Brand Guide
## The Thread Identity · Final v2.0

---

## THE LOGO

**The Thread**: One continuous circuit runs through KYLIX at its optical center — a true cut through the letterforms, visible only where it crosses each letter's mass. Two orange nodes mark the signal path: **entry on the K stem, exit at the X crossing**. AI sits clean in bronze, untouched. Five letters, one connected system.

The letterforms are fully outlined paths (no font dependency) with the thread genuinely cut out by boolean geometry — the logo works on ANY background, light, dark, photo, or texture.

**Dual system**: Light and dark versions are equal citizens. Use whichever fits the context.

---

## COLOR PALETTE

### Primary
| Color | Hex | RGB | CMYK | Role |
|-------|-----|-----|------|------|
| **Ink** | `#1C1B19` | 28, 27, 25 | 0/3/11/89 | KYLIX letterforms (light bg), backgrounds (dark mode) |
| **Bronze** | `#A8763E` | 168, 118, 62 | 0/30/63/34 | AI letterforms — both modes |
| **Orange** | `#FF4F1F` | 255, 79, 31 | 0/69/88/0 | The two signal nodes ONLY |
| **Linen** | `#F2EEE7` | 242, 238, 231 | 0/2/5/5 | Backgrounds (light mode), KYLIX letterforms (dark mode) |

### Secondary
| Color | Hex | RGB | Role |
|-------|-----|-----|------|
| **Tagline Gray** | `#8A857B` | 138, 133, 123 | SYSTEMS \| DESIGN — both modes |

### Quick copy
```
#1C1B19   Ink
#A8763E   Bronze
#FF4F1F   Orange
#F2EEE7   Linen
#8A857B   Tagline Gray
```

### CSS variables
```css
:root {
  --kylix-ink:    #1C1B19;
  --kylix-bronze: #A8763E;
  --kylix-orange: #FF4F1F;
  --kylix-linen:  #F2EEE7;
  --kylix-gray:   #8A857B;
}
```

### Color rules
- Orange appears ONLY as the two nodes. Never as text, never as a fill, never a third place.
- Bronze is AI's color. Don't bronze anything else in the lockup.
- No gradients on the logo, ever. The flat cut is the identity.
- Backgrounds: Linen or Ink preferred. White acceptable. Never mid-grays (kills the thread cut contrast).

---

## TYPOGRAPHY

### Wordmark — Playfair Display (weight 500)
- **In the logo files**: already converted to outlined paths — no font needed to USE the logo.
- **For everything else** (headlines, web, documents): Playfair Display, free via Google Fonts.
- **Font file included**: `FONTS/PlayfairDisplay.ttf` (variable font, all weights) + OFL license.

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap" rel="stylesheet">
```
```css
h1 { font-family: 'Playfair Display', Didot, Georgia, serif; font-weight: 500; }
```

### Tagline / Body — Helvetica Neue
- Lockup tagline is outlined in the logo files (set in an Arial-metric face for portability).
- For live text: Helvetica Neue → Helvetica → Arial → sans-serif.

```css
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
.tagline { font-weight: 300; letter-spacing: 0.6em; text-transform: uppercase; color: var(--kylix-gray); }
```

### The pairing logic
Playfair (classical, high-contrast Didone) × Helvetica (Swiss precision) = the brand in two fonts: **timeless architecture, engineered systems.**

---

## SPACING SYSTEM (locked, symmetric)

- Equal gap between every KYLIX letter (26 units at 100-unit cap size)
- One clear word-space before AI (62 units)
- Tagline letterspaced to span EXACTLY the wordmark width — left edge of S aligns with K, right edge of N aligns with the I of AI
- Thread sits at 46% of cap height (optical center)
- Clear space around logo: minimum = height of the K on all sides
- Minimum sizes: full lockup 280px wide · wordmark-only 200px wide · monogram 16px

---

## FILE GUIDE

### SVG-MASTERS/ (source of truth — fully outlined, scale infinitely)
| File | Use |
|------|-----|
| 01-THREAD-PRIMARY-LIGHT | Main logo, light backgrounds |
| 02-THREAD-PRIMARY-DARK | Main logo, dark backgrounds |
| 03/04-THREAD-WORDMARK-* | No tagline — tight spaces, headers |
| 05/06-THREAD-STACKED-* | Square contexts — social, print |
| 07/08-THREAD-MONOGRAM-* | K + thread + node — favicon, avatar |
| 09/10-THREAD-MONO-* | Single color, transparent — embroidery, stamps, engraving |

### PNG-EXPORT/ (ready to use)
- **WEB/**: 200, 400 square · 1200w light + dark · 32px mark
- **SOCIAL-MEDIA/**: OG 1200×630 (light + dark) · avatars 400 (light + dark) · IG 1080 (light + dark) · story 1080×1350
- **PRINT-300DPI/**: 3000², 2400² stacked · 4800w wide
- **FAVICON/**: 16, 32, 64, 512
- **MONOCHROME/**: black + white wordmark, 2000w, transparent

### FONTS/
- PlayfairDisplay.ttf (variable, OFL licensed — free commercial use, included legally)
- OFL-LICENSE.txt

---

## FAVICON INSTALL

```html
<link rel="icon" type="image/png" sizes="32x32" href="/kylix-favicon-32x32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/kylix-favicon-64x64.png">
<link rel="apple-touch-icon" href="/kylix-favicon-512x512.png">
```

---

## THE SIGNATURE ANIMATION (for the website)

The Thread gives you a page-load animation no one else has:

1. Letters fade in, solid (0–0.4s)
2. The thread draws itself left→right through the word (0.4–1.1s) — stroke-dashoffset on a line that masks the cut
3. The K node lights as the thread enters (0.5s), the X node lights as it exits (1.1s) — tiny scale overshoot
4. AI fades in last, already complete (1.2s)

Story told in motion: *the signal threads your business together.*
Implementation: GSAP timeline, prefers-reduced-motion gated, in your existing stack.

---

## DO / DON'T

**DO**
- Use light and dark versions as equals
- Keep both nodes orange, always
- Use the monogram below 200px width
- Maintain K-height clear space

**DON'T**
- Recolor the nodes or add a third
- Put the thread in any letter of AI
- Stretch, skew, outline, shadow, or gradient anything
- Recreate the wordmark from the live font — use the outlined files (the cut won't match)

---

**Version 2.0 · The Thread · June 2025**
