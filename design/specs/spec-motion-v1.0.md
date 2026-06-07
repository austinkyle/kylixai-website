# spec-motion-v1.0.md — Motion Language

**Status**: FINAL v1.0 — all values confirmed
**Constraint**: 60fps on a mid-range phone at 380px. prefers-reduced-motion MUST be respected.
**Library**: GSAP (CDN) + ScrollTrigger + SplitText (all free since April 2025)

---

## Core Principles

1. **Motion tells the story** — the "trapped → discovered → freed" arc unfolds through scroll
2. **Orchestrated, not scattered** — one well-timed page-load sequence creates more delight than many micro-animations
3. **Physics-feeling** — easing should feel like objects with weight, not generic linear transitions
4. **Mobile-first** — test every animation at 380px before desktop; reduce complexity on mobile if needed

---

## Easing Vocabulary

```js
const EASE = {
  enter:  'power3.out',           // Elements entering: quick start, gentle arrival
  exit:   'power2.in',            // Elements leaving
  spring: 'elastic.out(1, 0.5)', // CTA button bounce, satisfying tactile feel
  smooth: 'sine.inOut',          // Blob float, continuous ambient drift
  reveal: 'expo.out',            // SplitText word reveals: explosive, precise landing
};
```

---

## Page-Load Orchestration

```js
gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const heroSplit = new SplitText('.hero__headline', { type: 'words' });
  // Clip overflow on parent so split words reveal upward
  document.querySelector('.hero__headline').style.overflow = 'hidden';

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    // 1. Badge drops in
    .from('.hero__badge', {
      y: 16, opacity: 0, duration: 0.55, delay: 0.15
    })
    // 2. Headline words sweep up one by one
    .from(heroSplit.words, {
      y: '110%', opacity: 0,
      duration: 0.65, stagger: 0.055, ease: 'expo.out'
    }, '-=0.25')
    // 3. Subtext fades up
    .from('.hero__sub', {
      y: 22, opacity: 0, duration: 0.60
    }, '-=0.35')
    // 4. CTA button springs in
    .from('.cta-button--hero', {
      scale: 0.88, opacity: 0,
      duration: 0.65, ease: 'elastic.out(1, 0.5)'
    }, '-=0.35')
    // 5. Reassurance micro-copy fades
    .from('.hero__reassurance', {
      opacity: 0, duration: 0.45
    }, '-=0.30')
    // 6. Blobs fade + scale in from behind
    .from('.blob', {
      opacity: 0, scale: 0.75,
      duration: 1.6, stagger: 0.25, ease: 'power2.out'
    }, 0.35);  // starts early, overlapping with badge
}
```

---

## ScrollTrigger — Scrollytelling Arc

```js
// ─── Section: Recognition (pain cards) ──────────────────────
gsap.from('.pain-card', {
  scrollTrigger: {
    trigger: '.section-recognition',
    start: 'top 82%',
    once: true,
  },
  y: 28, opacity: 0,
  duration: 0.55, stagger: 0.07, ease: 'power3.out',
});

// Section heading
gsap.from('.section-recognition h2', {
  scrollTrigger: { trigger: '.section-recognition', start: 'top 85%', once: true },
  y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
});

// Closing beat
gsap.from('.recognition__close', {
  scrollTrigger: { trigger: '.recognition__close', start: 'top 90%', once: true },
  y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
});

// ─── Section: Reframe ────────────────────────────────────────
gsap.from('.section-reframe .reframe__inner > *', {
  scrollTrigger: {
    trigger: '.section-reframe',
    start: 'top 78%',
    once: true,
  },
  y: 24, opacity: 0,
  duration: 0.65, stagger: 0.12, ease: 'power3.out',
});

// ─── Section: How It Works ───────────────────────────────────
gsap.from('.section-how h2, .how__guarantee', {
  scrollTrigger: { trigger: '.section-how', start: 'top 80%', once: true },
  y: 20, opacity: 0, duration: 0.6, stagger: 0.10, ease: 'power3.out',
});

gsap.from('.step', {
  scrollTrigger: {
    trigger: '.steps',
    start: 'top 82%',
    once: true,
  },
  y: 40, opacity: 0,
  duration: 0.65, stagger: 0.14, ease: 'power3.out',
});

// ─── Section: Proof ──────────────────────────────────────────
gsap.from('.founder-quote, .testimonial-placeholder', {
  scrollTrigger: { trigger: '.section-proof', start: 'top 80%', once: true },
  y: 30, opacity: 0,
  duration: 0.7, stagger: 0.18, ease: 'power3.out',
});

// ─── Section: CTA / Form ─────────────────────────────────────
gsap.from('.section-cta .cta__inner > *', {
  scrollTrigger: { trigger: '.section-cta', start: 'top 80%', once: true },
  y: 24, opacity: 0,
  duration: 0.65, stagger: 0.10, ease: 'power3.out',
});
```

---

## Blob Ambient Float (CSS-handled)

CSS keyframes handle the continuous float in `design/assets/blobs.css`.
GSAP only handles the initial reveal (opacity + scale from page-load timeline above).

```js
// Continuous float is CSS keyframe animation — no GSAP needed after reveal
// GSAP sets opacity: 1 / scale: 1 during page-load; CSS animation takes over
```

---

## SplitText — Text Reveals

Only used on hero headline (above). Section headings use simple `y + opacity` GSAP tweens —
SplitText on every heading would feel excessive and hurt mobile performance.

---

## Hover States

```js
// CTA button — spring scale on hover
document.querySelectorAll('.cta-button').forEach(btn => {
  btn.addEventListener('mouseenter', () =>
    gsap.to(btn, { scale: 1.04, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
  );
  btn.addEventListener('mouseleave', () =>
    gsap.to(btn, { scale: 1,    duration: 0.4, ease: 'elastic.out(1, 0.5)' })
  );
});

// Pain cards — subtle lift
document.querySelectorAll('.pain-card').forEach(card => {
  card.addEventListener('mouseenter', () =>
    gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' })
  );
  card.addEventListener('mouseleave', () =>
    gsap.to(card, { y:  0, duration: 0.3, ease: 'power2.out' })
  );
});
```

---

## Nav — Glass Background on Scroll

```js
ScrollTrigger.create({
  start: 'top -72',
  onEnter:     () => document.querySelector('.nav').classList.add('nav--scrolled'),
  onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
});
```

---

## prefers-reduced-motion

```js
// ALL GSAP code is inside: if (!prefersReducedMotion) { ... }
// Elements must be visible at their end-state without animation.
// CSS rule ensures no opacity:0 traps:
//   @media (prefers-reduced-motion: reduce) { [data-gsap] { opacity: 1 !important; transform: none !important; } }
```

---

## Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| Page-load timeline | ≤ 1.8s total | staggered, no blocking |
| ScrollTrigger triggers | `once: true` | no repeated recalc |
| Simultaneous animating elements (mobile) | ≤ 3 | stagger ensures sequencing |
| `will-change` | `.blob--primary` only | never on text/cards |
| Properties animated | `transform`, `opacity` only | no layout triggers |
