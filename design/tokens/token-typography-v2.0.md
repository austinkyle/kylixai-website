# Typography Tokens v2.0 — Editorial Warm Serif

Status: FINAL v2.0 (replaces v1.0 Clash Display + Satoshi)

---

## Fonts

```css
--font-display: 'Playfair Display', Georgia, serif;
--font-body:    'Lora', Georgia, serif;
```

### Why these replacements

**Playfair Display replaces Clash Display:**
Clash Display is a geometric sans designed for dark-mode tech aesthetics. On a
warm parchment ground it fights the environment — geometric letterforms read as
"dashboard app with an analog skin." Playfair Display is a high-contrast editorial
serif with strong ink traps, pronounced stroke weight contrast, and a theatrical
quality at hero sizes. It reads as chosen by a person, not picked from a template.
The italic variants (especially 900 italic) have the quality of hand-set type from
the 1920s — correct register for a business with 20 years experience and skin in
the game. At 7–8rem for quote marks, the thick/thin contrast is dramatic and
architectural without needing decoration around it.

**Lora replaces Satoshi:**
Satoshi is a clean neutral sans. On a warm ground any sans-serif body font creates
a temperature mismatch — it reads as "website" rather than "world." Lora is a
well-kerned text serif designed for screen reproduction. Old-style construction,
ink-trap details, warm texture. At body sizes on parchment ground it reads like
words printed on paper. The italic is especially strong for testimonials and
founder quotes — it has the cadence of a written letter, not a UI component.

Both are Google Fonts, free for commercial use, no Fontshare dependency.

## Google Fonts Load Snippet

Replace ALL existing font @import and <link> tags in index.html:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

Remove:
- Fontshare links (Clash Display, Satoshi)
- Plus Jakarta Sans Google link
- Space Grotesk Google link (if present)

---

## Type Scale

Retain the existing clamp() fluid scale — values unchanged:

```css
--text-xs:    clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm:    clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
--text-base:  clamp(1rem, 0.9rem + 0.45vw, 1.125rem);
--text-lg:    clamp(1.125rem, 1rem + 0.55vw, 1.25rem);
--text-xl:    clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem);
--text-2xl:   clamp(1.5rem, 1.25rem + 1.1vw, 2rem);
--text-3xl:   clamp(2rem, 1.6rem + 1.8vw, 3rem);
--text-4xl:   clamp(2.5rem, 2rem + 2.2vw, 4.5rem);
--text-hero:  clamp(3rem, 2.2rem + 3.5vw, 7rem);
```

## Leading Adjustments (update from v1 values)

```css
--leading-tight:   1.05;   /* Playfair at display sizes — tall ascenders need less gap */
--leading-snug:    1.2;
--leading-normal:  1.5;
--leading-relaxed: 1.75;   /* Lora body — old-style serif needs air between lines */
```

v1 used 1.1 for tight and 1.7 for relaxed. These adjusted values are tuned for
Playfair and Lora specifically — do not carry over v1 values without updating.

---

## Usage Rules

| Element | Font | Weight | Size token | Leading |
|---|---|---|---|---|
| Hero headline | Playfair Display | 900 | --text-hero | --leading-tight |
| Section h2 | Playfair Display | 700 | --text-3xl or --text-4xl | --leading-tight |
| Step headings (h3) | Playfair Display | 700 | --text-xl | --leading-snug |
| Body paragraphs | Lora | 400 | --text-base or --text-lg | --leading-relaxed |
| Founder quote / blockquote | Lora italic | 400 | --text-lg | --leading-relaxed |
| CTA button text | Playfair Display | 900 | --text-lg | — |
| Marquee band | Playfair Display | 700 | --text-sm | — |
| Form labels | Lora | 500 | --text-sm | --leading-normal |
| Micro-copy / captions | Lora | 400 | --text-xs | --leading-normal |
| Stat callout numbers | Playfair Display | 900 | --text-4xl | --leading-tight |
| Theatrical quote marks | Playfair Display | 900 | ~7rem (fixed, not token) | — |
| Attribution line | Lora | 500 | --text-sm | --leading-normal |
| Nav corner links | Lora | 400 | --text-sm | — |
| Footer tagline | Lora italic | 400 | --text-base | --leading-relaxed |

### CTA button specifics
- Font: Playfair Display 900
- Letter-spacing: 0.02em
- No all-caps (Playfair 900 has enough presence at natural case)

### Marquee band specifics
- Font: Playfair Display 700, ALL-CAPS
- Letter-spacing: 0.12em
- Playfair all-caps reads as archaic editorial — correct register for the band

---

## Kill List (remove from main.css when implementing)

```
--font-display: 'Clash Display'  → replace with 'Playfair Display'
--font-body: 'Satoshi'           → replace with 'Lora'
--font-mono                      → remove (not used in v2 design)
Plus Jakarta Sans references
Space Grotesk references
```

All body text set in a sans-serif font (Satoshi, Clash, Jakarta, Grotesk) is
wrong in v2. If you see `font-family: var(--font-display)` on elements that
are NOT headings, CTAs, or marquee — audit and correct.
