# Typography Tokens v3.0 — Playfair Display × Helvetica Neue

Status: FINAL v3.0 (supersedes v2.0's Playfair + Lora pairing for this rebuild)

Aligns to `design/brand/kylix-thread-logo/BRAND-GUIDE.md`'s actual pairing logic: "Playfair (classical, high-contrast Didone) × Helvetica (Swiss precision) = timeless architecture, engineered systems."

```css
--font-display: 'Playfair Display', Georgia, serif;
--font-body:    'Helvetica Neue', Helvetica, Arial, sans-serif;
```

## Usage

- Display: hero headlines, page-label headings ("SERVICES", "APPS", "ABOUT", "RESOURCES"), the Thread philosophy pull-quote term
- Body: nav labels, paragraph copy, card titles/descriptions, footer, buttons, form labels

## Scale (fluid, unchanged base logic from v2.0 — clamp() driven)

```css
--text-xs:    clamp(0.75rem, 0.72rem + 0.15vw, 0.85rem);
--text-sm:    clamp(0.875rem, 0.84rem + 0.2vw, 1rem);
--text-base:  clamp(1rem, 0.96rem + 0.25vw, 1.125rem);
--text-md:    clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
--text-lg:    clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem);
--text-xl:    clamp(2.25rem, 1.8rem + 2vw, 3.25rem);
--text-hero:  clamp(3rem, 2.2rem + 4vw, 6rem);
```

## Google Fonts import

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,700&display=swap" rel="stylesheet">
```
Helvetica Neue is a system font (no web-font load needed) — fallback chain covers it.
