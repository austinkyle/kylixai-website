# token-spacing-v1.0.md — Spacing Scale, Border-Radius & Z-Index

**Status**: FINAL v1.0
**Base unit**: 4px (all values are multiples of 4)

---

## Spacing Scale (CSS Custom Properties)

```css
:root {
  /* ─── Spacing Scale ─────────────────────────────────── */
  --space-1:   4px;    /* tight icon padding, hairline gaps */
  --space-2:   8px;    /* inline element gaps, badge padding */
  --space-3:  12px;    /* compact list item gaps */
  --space-4:  16px;    /* standard component padding */
  --space-5:  24px;    /* card inner padding, form field gaps */
  --space-6:  32px;    /* section sub-grouping */
  --space-7:  48px;    /* component-to-component vertical rhythm */
  --space-8:  64px;    /* section padding (mobile) */
  --space-9:  96px;    /* section padding (desktop) */
  --space-10: 128px;   /* large section gaps */
  --space-11: 192px;   /* hero vertical space */
  --space-12: 256px;   /* max decorative offset / parallax range */

  /* ─── Layout ────────────────────────────────────────── */
  --container-max:    1200px;   /* max content width */
  --container-pad:    clamp(var(--space-5), 5vw, var(--space-9));
                                /* responsive horizontal page padding */
  --grid-gap:         var(--space-6);  /* CSS Grid column/row gap */

  /* ─── Border Radius ─────────────────────────────────── */
  --radius-sm:    6px;    /* small tags, input fields */
  --radius-md:   12px;    /* standard cards, dropdowns */
  --radius-lg:   20px;    /* large feature cards */
  --radius-xl:   32px;    /* hero section, prominent panels */
  --radius-2xl:  48px;    /* extra-large decorative panels */
  --radius-btn:  10px;    /* CTA buttons — slightly tighter than cards */
  --radius-full: 9999px;  /* pills, badges, avatar circles */

  /* ─── Z-Index Scale ─────────────────────────────────── */
  --z-below:    -1;    /* decorative blobs / mesh backgrounds */
  --z-base:      0;
  --z-raised:   10;    /* cards that lift on hover */
  --z-dropdown: 100;   /* dropdowns, tooltips */
  --z-sticky:   200;   /* sticky nav */
  --z-overlay:  300;   /* modals, drawers */
  --z-toast:    400;   /* toast notifications */
}
```

---

## Usage Rules

### Spacing
- Section padding (top/bottom): `--space-9` desktop / `--space-8` mobile
- Card internal padding: `--space-5` (24px) — consistent across all cards
- Form fields gap: `--space-4` (16px) between fields, `--space-5` (24px) above submit
- Nav height: 64px (= `--space-8`) — use as a top-offset for sticky-positioned elements

### Border Radius
- Feature cards: `--radius-lg` (20px)
- Input fields: `--radius-sm` (6px)
- CTA buttons: `--radius-btn` (10px)
- Badges / tags: `--radius-full` (pill)
- Hero panel / decorative section backgrounds: `--radius-xl` or `--radius-2xl`

### Z-Index
- Decorative blob elements: always `--z-below` so they never intercept pointer events
- Sticky nav: `--z-sticky` (200) — ensure it sits above all content-layer elements
