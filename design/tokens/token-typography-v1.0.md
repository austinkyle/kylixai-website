# token-typography-v1.0.md — Typography System

**Status**: FINAL v1.0
**Direction**: Clash Display × Satoshi (both via Fontshare — free for commercial use)
**Rationale**: Clash Display's geometric letterforms read as "early-2000s futuristic updated for now" —
               the Y2K-adjacent energy without being retro. Satoshi is warm and humanist,
               grounding the brand voice ("we give you your business back") in readability.

---

## Font Selection

| Role | Family | Weight(s) | Source |
|------|--------|-----------|--------|
| Display / Headings | **Clash Display** | 600, 700 | Fontshare CDN |
| Body | **Satoshi** | 400, 500 | Fontshare CDN |

### Load Snippet (place in `<head>` before any CSS)

```html
<!-- Clash Display — display headings -->
<link rel="preconnect" href="https://api.fontshare.com">
<link
  rel="stylesheet"
  href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
>
<!-- Satoshi — body copy -->
<link
  rel="stylesheet"
  href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap"
>
```

---

## Type Scale (CSS Custom Properties)

```css
:root {
  /* ─── Font Families ─────────────────────────────────── */
  --font-display: 'Clash Display', sans-serif;
  --font-body:    'Satoshi',       sans-serif;

  /* ─── Fluid Type Scale (mobile → desktop) ──────────── */
  /* clamp(min, preferred, max) — no breakpoint needed     */
  --text-xs:    clamp(0.75rem,   1.5vw,  0.875rem);  /*  12 → 14px */
  --text-sm:    clamp(0.875rem,  2vw,    1rem);        /*  14 → 16px */
  --text-base:  clamp(1rem,      2.5vw,  1.125rem);    /*  16 → 18px */
  --text-lg:    clamp(1.125rem,  2.5vw,  1.25rem);     /*  18 → 20px */
  --text-xl:    clamp(1.25rem,   3vw,    1.5rem);       /*  20 → 24px */
  --text-2xl:   clamp(1.5rem,    4vw,    2rem);          /*  24 → 32px */
  --text-3xl:   clamp(2rem,      5vw,    3rem);          /*  32 → 48px */
  --text-4xl:   clamp(2.5rem,    7vw,    4.5rem);        /*  40 → 72px */
  --text-hero:  clamp(3rem,      10vw,   7rem);           /*  48 →112px */

  /* ─── Line Heights ──────────────────────────────────── */
  --leading-tight:   1.1;
  --leading-snug:    1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.7;

  /* ─── Letter Spacing ────────────────────────────────── */
  --tracking-tight:  -0.03em;
  --tracking-normal:  0em;
  --tracking-wide:    0.05em;
  --tracking-wider:   0.10em;
  --tracking-widest:  0.18em;  /* all-caps labels / badges */
}
```

---

## Usage Rules

| Element | Font | Size | Leading | Tracking | Weight |
|---------|------|------|---------|----------|--------|
| Hero headline | `--font-display` | `--text-hero` | `--leading-tight` | `--tracking-tight` | 700 |
| H2 section heading | `--font-display` | `--text-3xl` | `--leading-snug` | `--tracking-tight` | 700 |
| H3 subheading | `--font-display` | `--text-2xl` | `--leading-snug` | `--tracking-normal` | 600 |
| Body copy | `--font-body` | `--text-base` | `--leading-relaxed` | `--tracking-normal` | 400 |
| Lead paragraph | `--font-body` | `--text-lg` | `--leading-relaxed` | `--tracking-normal` | 400 |
| CTA button | `--font-display` | `--text-lg` | `--leading-tight` | `--tracking-wide` | 700 |
| Label / badge | `--font-body` | `--text-xs` | `--leading-normal` | `--tracking-widest` | 500 |
| Caption | `--font-body` | `--text-sm` | `--leading-normal` | `--tracking-wide` | 400 |

---

## Wordmark Rendering

KylixAI wordmark (v1 — text only, no logo asset):
- Font: `--font-display`, weight 700
- Apply `--gradient-hero` as a `background-clip: text` gradient
- Tracking: `--tracking-tight`
- Size: `--text-2xl` in nav, `--text-3xl` in footer
