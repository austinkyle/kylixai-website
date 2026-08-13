# Typography Tokens v4.0 — Libre Caslon Display × Archivo

Status: FINAL v4.0 (supersedes v3.0's Playfair Display × Helvetica Neue pairing — rebrand to match theaustinkyle.com)

Aligns to the editorial logic of the personal-brand system: classical editorial display + Swiss-clean body + technical mono labels = timeless-but-technical, matching KylixAI's AI-agency positioning.

```css
--font-display: 'Libre Caslon Display', Georgia, serif;
--font-body:    'Archivo', -apple-system, Helvetica, Arial, sans-serif;
--font-mono:    'IBM Plex Mono', ui-monospace, monospace;
```

The editorial serif display face, Libre Caslon Display, pairs with Archivo's clean geometric-humanist sans for body and UI. IBM Plex Mono supplies the uppercase, letter-spaced "machine voice" continuation used for labels and kickers.

## Usage

- Display: hero headlines, section headings, page-label headings ("SERVICES", "APPS", "ABOUT", "RESOURCES"), and the CTA band heading
- Body: nav labels, paragraph copy, card titles/descriptions, footer, buttons, form labels and inputs
- Mono: `.eyebrow`, `.hero__scroll-cue`, `.trusted__label`, `.cta-band__eyebrow`, `.footer__col-title`, `.form__label`, plus any other uppercase/letter-spaced kicker text

## Scale (fluid, unchanged from v3.0 — font-family swap only, no size/scale changes)

```css
  /* Type scale */
  --text-xs:   clamp(0.75rem,  1.5vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 2vw,   1rem);
  --text-base: clamp(1rem,     2.2vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 2.5vw, 1.25rem);
  --text-xl:   clamp(1.25rem,  3vw,   1.5rem);
  --text-2xl:  clamp(1.5rem,   4vw,   2rem);
  --text-3xl:  clamp(2rem,     5vw,   3rem);
  --text-4xl:  clamp(2.5rem,   7vw,   4.5rem);
  --text-hero: clamp(2.8rem,   9vw,   6.5rem);
```

## Google Fonts import

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Libre+Caslon+Display&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Unlike v3.0's Helvetica Neue (a system font, with no webfont load needed), Archivo is a Google-hosted webfont here. All three families load via the single combined CSS2 link — there is no system-font shortcut available for body text now.

The old metric-matched `Playfair-Fallback` `@font-face` override was removed. It was calibrated to Playfair Display's specific metrics versus Georgia and would have been wrong for Libre Caslon Display; display now falls back straight to `Georgia, serif` with no CLS-mitigation override in place. This is a possible v4.1 follow-up if CLS becomes a measured problem.
