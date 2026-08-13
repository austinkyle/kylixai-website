# Color Tokens v4.0 — Editorial Teal/Rust

Status: FINAL v4.0 (supersedes v3.0's "Dark Thread" orange/bronze palette — rebrand to match theaustinkyle.com's editorial teal/rust brand system)

Structural pattern carried forward from v3.0 (dark hero/CTA bands, light content sections between them) — the palette is now KylixAI's editorial Ink/Paper/Signal system, aligned to theaustinkyle.com brand direction.

## Dark surfaces (hero, nav, CTA bands, footer)

```css
:root {
  /* Surfaces — dark (Ink) */
  --color-surface-base:   #0E2931;
  --color-surface-raised: #1A3941;
  --color-surface-lift:   #213C43;
  --color-surface-deep:   #12484C;
}
```

- `--color-surface-base`: hero, nav, footer, and page background — Ink.
- `--color-surface-raised`: nav bar and dark cards — a lightened tint of Ink.
- `--color-surface-lift`: hover state on dark surfaces.
- `--color-surface-deep`: a disciplined dark surface for two specific contexts: (1) the lead-capture / quote-request section (`.section--deep`), and (2) the hero background animation lines. It signals a distinct, important dark moment; do not use it for ordinary nav, card, or other dark-surface fills outside those contexts.

## Light surfaces (content sections between dark bands)

```css
  /* Surfaces — light (Paper) */
  --color-content-bg:   #F8F7F5;
  --color-content-card: #FFFFFF;
```

Paper is the warm off-white content-section background; white is reserved for cards on light sections.

## Text

```css
  --color-text-on-dark:  #F8F7F5;
  --color-text-on-light: #0E2931;
  --color-text-muted:    #4F6467;
```

On-dark text uses Paper, on-light text uses Ink, and muted Graphite handles subheads, captions, metadata, and supporting copy in both modes.

## Accents

```css
  /* Accent — signal rust (the ONE highlight color) */
  --color-accent:       #861211;
  --color-accent-light: #A83A2E;
  --color-accent-dark:  #6B0E0D;

  /* Secondary accent — muted teal */
  --color-bronze:       #2B7574;
  --color-bronze-light: #3D9B99;
```

Signal rust is the sole highlight color. Signal stays under ~2% of total surface area — used for hover states (primary button hover, `.nav__cta` hover), focus states, active nav underlines, and one accent moment per screen max. Never a large default fill — primary buttons default to Ink, not rust.

The `--color-bronze` / `--color-bronze-light` variable names are kept from v3.0 for backward compatibility with existing call sites in `main.css`, but they now hold the muted teal secondary-accent values, not bronze. Do not let the legacy names create a bronze color system by implication. Use them for secondary accents, active-state underlines on dark, and dividers.

## Semantic

```css
  /* Semantic (unchanged from v3.0) */
  --color-success: #4A9D5C;
  --color-error:   #FF5A3C;
```

These values were left as-is since they are semantic states, not part of the given brand palette.

## Structural

```css
  /* Rules */
  --color-rule-dark:  rgba(248,247,245,0.10);
  --color-rule-light: rgba(14,41,49,0.10);
```

Rule colors are now warm-tinted: Paper-tinted on dark surfaces and Ink-tinted on light surfaces. This replaces the old flat gray-ish approach so light-surface hairlines do not read cold or clinical.

## Shadows

```css
  /* Shadows */
  --shadow-dark-soft:    0 8px 24px rgba(0,0,0,0.35);
  --shadow-dark-glow:    0 0 32px rgba(134,18,17,0.25);
  --shadow-light-soft:   2px 3px 8px rgba(28,27,25,0.08);
  --shadow-light-medium: 4px 6px 16px rgba(28,27,25,0.12);
```

The glow shadow is now rust-tinted and is reserved for primary CTA hover only.

## Usage

- Ink is the default dark surface; Paper is the default light content background.
- Signal rust is a controlled interaction and emphasis signal, not a default button fill.
- Muted teal supports secondary accents, active-state underlines on dark, and dividers.
- Deep is for the quote-request / lead-capture section only.

## Kill list (do not carry over from v3.0)

```
--color-accent as a default large fill
```

Accent-as-default-button-background is deprecated. Use Ink-default / rust-hover for primary buttons so nobody reintroduces solid-rust buttons by habit.

Brand discipline rules carried forward from the personal-brand brief:
- Signal rust stays under 2% of surface area — the moment it shows up in three places on one screen it stops signaling anything.
- `--color-surface-deep` is reserved for the lead-capture / quote section and hero background animation lines — these are distinct, important dark moments, not a default dark surface.
- No gradients on the logo itself, ever.
