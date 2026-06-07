# token-colors-v1.0.md — Color Palette & CSS Custom Properties

**Status**: FINAL v1.0
**Direction**: Electric Tangerine × Cyan / Deep Space Dark
**Rationale**: Warm action-orange as the hero CTA color; electric cyan as the cold Y2K surprise;
               very dark purple-black surface maximises contrast and creates the "space" for
               the glow effects to sing. Y2K-adjacent dopamine without nostalgia gimmickry.

---

## Palette Commit

| Token | Hex | Role |
|-------|-----|------|
| Primary | `#FF4F1F` | Electric tangerine-orange — CTAs, key moments |
| Primary Light | `#FF7349` | Hover / lighter tint |
| Primary Dark | `#D93E15` | Pressed / darker shade |
| Accent | `#00EAFF` | Electric cyan — max 2–3 uses per page |
| Accent Light | `#66F3FF` | Tint for subtle accent backgrounds |
| Surface Base | `#0D0B14` | Main page background — deep purple-black |
| Surface Raised | `#181425` | Card / panel surface |
| Surface Overlay | `rgba(24,20,37,0.78)` | Frosted glass / modal overlay |
| Text Primary | `#F0EDF8` | Body copy — near-white with lavender tint |
| Text Secondary | `#8F8AB0` | Labels, captions — muted lavender-grey |
| Text on Primary | `#0D0B14` | Text on orange CTA button (5.7:1 — AA ✓) |
| Text on Accent | `#0D0B14` | Text on cyan surface (11:1 — AAA ✓) |
| Success | `#22D46A` | Confirmation, positive states |
| Error | `#FF2D6B` | Error, destructive states |

---

## CSS Custom Properties

```css
/* ─── KylixAI Brand Palette ─────────────────────────────── */
:root {
  /* Primary — Electric Tangerine */
  --color-primary:          #FF4F1F;
  --color-primary-light:    #FF7349;
  --color-primary-dark:     #D93E15;

  /* Accent — Electric Cyan */
  --color-accent:           #00EAFF;
  --color-accent-light:     #66F3FF;

  /* Surface — Deep Space */
  --color-surface-base:     #0D0B14;
  --color-surface-raised:   #181425;
  --color-surface-overlay:  rgba(24, 20, 37, 0.78);

  /* Text */
  --color-text-primary:     #F0EDF8;
  --color-text-secondary:   #8F8AB0;
  --color-text-on-primary:  #0D0B14;   /* dark on orange — AA compliant */
  --color-text-on-accent:   #0D0B14;   /* dark on cyan  — AAA compliant */

  /* Semantic */
  --color-success:          #22D46A;
  --color-error:            #FF2D6B;

  /* ─── Gradients ───────────────────────────────────────── */

  /* Hero section wordmark + primary headline accent */
  --gradient-hero:
    linear-gradient(135deg, #FF4F1F 0%, #FF9000 100%);

  /* CTA button fill */
  --gradient-cta:
    linear-gradient(135deg, #FF4F1F 0%, #FF7349 100%);

  /* Radial mesh blobs — layer these in background */
  --gradient-mesh-1:
    radial-gradient(ellipse 70% 60% at 12% 65%,
      rgba(255, 79, 31, 0.30) 0%, transparent 55%);

  --gradient-mesh-2:
    radial-gradient(ellipse 60% 55% at 88% 12%,
      rgba(0, 234, 255, 0.20) 0%, transparent 52%);

  /* ─── Soft-UI Shadows (neumorphic, tuned for dark surface) ─ */

  /* Raised card / CTA button rest state */
  --shadow-raised:
    10px 10px 28px rgba(0, 0, 0, 0.55),
    -4px  -4px 16px rgba(255, 255, 255, 0.030);

  /* Inset / pressed / active state */
  --shadow-inset:
    inset 4px  4px 14px rgba(0, 0, 0, 0.60),
    inset -2px -2px  8px rgba(255, 255, 255, 0.020);

  /* Primary glow — for CTA hover, hero decoration */
  --shadow-glow-primary:
    0 0 48px rgba(255, 79, 31, 0.45),
    0 0 16px rgba(255, 79, 31, 0.30);

  /* Accent glow — for accent elements, icon halos */
  --shadow-glow-accent:
    0 0 40px rgba(0, 234, 255, 0.35),
    0 0 12px rgba(0, 234, 255, 0.20);
}
```

---

## Usage Rules

- `--color-primary` + `--gradient-cta`: the single most important CTA button.
- `--color-accent`: maximum 3 uses per page — icon halo, one stat callout, one decorative shape.
- Soft-UI shadows (`--shadow-raised` / `--shadow-inset`): CTA button and key feature cards only.
- Glow (`--shadow-glow-primary`): CTA hover state + hero decoration element.
- Mesh gradients: compose `--gradient-mesh-1, --gradient-mesh-2, var(--color-surface-base)`
  as the `background` shorthand on the `<body>` or hero `<section>`.

---

## Accessibility Check ✓

| Pair | Contrast Ratio | Level |
|------|---------------|-------|
| `--color-text-primary` (#F0EDF8) on `--color-surface-base` (#0D0B14) | ~16:1 | AAA ✓ |
| `--color-text-on-primary` (#0D0B14) on `--color-primary` (#FF4F1F) | ~5.7:1 | AA ✓ |
| `--color-text-on-accent` (#0D0B14) on `--color-accent` (#00EAFF) | ~11:1 | AAA ✓ |
| `--color-text-secondary` (#8F8AB0) on `--color-surface-base` (#0D0B14) | ~5.2:1 | AA ✓ |
