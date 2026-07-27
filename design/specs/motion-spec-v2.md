# motion-spec-v2.md — Interaction Architecture

**Status**: ACTIVE — supersedes v1.0 for all new work; v1.0 remains as historical reference.
**Goal**: Awwwards-submission craft. Every section has one authored signature moment.
**Constraint**: 60fps at 380px CPU-throttled 4×. prefers-reduced-motion fully gated.
**Library**: GSAP + ScrollTrigger + SplitText (all registered explicitly).

---

## Global Easing Vocabulary (exhaustive — 3 named easings only)

Every animation on the site uses exactly one of these three. No exceptions.

| Name | GSAP value | Duration range | Use case |
|------|-----------|----------------|----------|
| **snap** | `power3.out` | 0.2–0.4s | UI responses: hover, form focus, nav state, micro-interactions |
| **settle** | `expo.out` | 0.6–0.9s | Scroll reveals, entrances — elements landing with authority |
| **drift** | `sine.inOut` | 4–8s | Ambient idle loops only: illustration float, parallax |

The CTA spring hover uses `elastic.out(1, 0.5)` — this is a flavour of snap timing, not a 4th easing.

```js
const EASE = {
  snap:   'power3.out',
  settle: 'expo.out',
  drift:  'sine.inOut',
  spring: 'elastic.out(1, 0.5)',  // CTA button only
};
```

---

## Z-Depth Parallax Model

Three named layers. Each scroll-dispersal tween reads the element's class and scales travel distance.

| Class | Multiplier | x/y travel | Behavior |
|-------|-----------|------------|----------|
| `.layer-back` | 0.15 | ~40–60px | Distant world — barely moves, most stable |
| `.layer-mid` | 0.35 | ~80–120px | Object layer — medium drift |
| `.layer-front` | 0.55 | ~120–180px | Closest — most responsive to scroll |

```js
const LAYER_SPEED = { back: 0.15, mid: 0.35, front: 0.55 };

function getLayerMultiplier(el) {
  if (el.classList.contains('layer-front')) return LAYER_SPEED.front;
  if (el.classList.contains('layer-mid'))   return LAYER_SPEED.mid;
  return LAYER_SPEED.back;
}
```

**Rule**: Each illustration object has exactly one GSAP tween at a time. Ambient float and scroll dispersal do NOT both run on the same element simultaneously — this causes overwrite conflicts. On scroll-active sections (hero), scroll dispersal replaces ambient float for that element.

---

## Interaction Physics Rule

- Hover/interaction responses animate **transform only**: `translate`, `scale`, `rotate`.
- Never animate layout properties on hover: `width`, `height`, `top`, `left`, `margin`, `padding`.
- `will-change: transform` is **never set globally in CSS**. It is applied via JS immediately before a tween (`onStart`) and cleared in `onComplete`. On short tweens (< 0.4s), skip it entirely — the compositor overhead is not worth it.
- Every ScrollTrigger instance that animates position uses `invalidateOnRefresh: true`.
- All batch stagger reveals use `once: true`.

---

## One Signature Moment Per Section

### Hero — SplitText word-sweep + z-depth dispersal *(implement v1.0 spec)*
Already designed, not yet coded. Word-sweep on headline using `SplitText`; dispersal uses layer-multiplied travel distances.

```js
// Hero headline word-sweep
const split = new SplitText('.hero__headline', { type: 'words' });
document.querySelector('.hero__headline').style.overflow = 'hidden';
tl.from(split.words, { y: '110%', opacity: 0, duration: 0.7, stagger: 0.055, ease: EASE.settle }, '-=0.25');
```

### Recognition — SplitText line-reveal per pain item
Each `.pain-item` gets its own ScrollTrigger. Words reveal left-to-right as the item scrolls into view. Provides a reading rhythm that makes each pain point land separately.

```js
document.querySelectorAll('.pain-item').forEach(item => {
  const split = new SplitText(item, { type: 'words' });
  item.style.overflow = 'hidden';
  gsap.from(split.words, {
    scrollTrigger: { trigger: item, start: 'top 88%', once: true },
    y: '120%', opacity: 0,
    duration: 0.55, stagger: 0.03, ease: EASE.settle,
  });
});
```

### Reframe — Pinned scrub stat countup
The "10–20 hrs" stat scrubs from 0 to 20 as the section enters. A brief pin holds the reader on the number.

```js
const counter = { val: 0 };
gsap.to(counter, {
  val: 20,
  scrollTrigger: {
    trigger: '.stat-callout',
    start: 'top 75%',
    end: 'top 30%',
    scrub: 0.8,
  },
  onUpdate() {
    const n = Math.round(counter.val);
    document.querySelector('.stat-callout__number').textContent =
      n < 10 ? `0–${n} hrs` : `10–${n} hrs`;
  },
  ease: 'none',
});
```

### How It Works — Scatter-to-settle step cards
Cards start with exaggerated rotations and y-offset, then scrub into their final stacked positions. The choreography makes the "deal" of cards feel physical.

```js
const stepTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.steps',
    start: 'top 85%',
    end: 'top 20%',
    scrub: 1.2,
  },
});
// Each step: from exaggerated scatter → final stacked rotation
stepTimeline
  .from('.step--1', { y: 80, rotation: -12, opacity: 0, ease: EASE.settle }, 0)
  .from('.step--2', { y: 80, rotation: 14, opacity: 0, ease: EASE.settle }, 0.15)
  .from('.step--3', { y: 80, rotation: -14, opacity: 0, ease: EASE.settle }, 0.30);
// Final positions (from CSS removed, GSAP owns): step--1 → -1°, step--2 → +1.5°, step--3 → -1.5°
```

### Proof — Theatrical quote-mark scale
Opening quote mark scales from 0.1 → 1.0 with spring overshoot. Closing quote follows on a slight delay. Blockquote paragraphs reveal line by line.

Quote marks are CSS `::before`/`::after` pseudo-elements — GSAP cannot target them directly. Wrap in real elements:

```html
<span class="quote-mark quote-mark--open" aria-hidden="true">"</span>
<!-- blockquote content -->
<span class="quote-mark quote-mark--close" aria-hidden="true">"</span>
```

```js
gsap.from('.quote-mark--open', {
  scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
  scale: 0.1, opacity: 0, transformOrigin: 'bottom left',
  duration: 0.7, ease: 'elastic.out(1.2, 0.4)',
});
gsap.from('.quote-mark--close', {
  scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
  scale: 0.1, opacity: 0, transformOrigin: 'top right',
  duration: 0.7, ease: 'elastic.out(1.2, 0.4)', delay: 0.15,
});
```

### CTA — Magnetic button
`mousemove` on `.section-cta` calculates distance from button center; button drifts 12px max toward cursor. Dog-leash-free illustration pulls inversely.

```js
const ctaSection = document.querySelector('.section-cta');
const ctaBtn = ctaSection?.querySelector('.cta-button--form');

if (ctaSection && ctaBtn && window.matchMedia('(hover: hover)').matches) {
  ctaSection.addEventListener('mousemove', e => {
    const rect = ctaBtn.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dx = (e.clientX - btnCx) / window.innerWidth;
    const dy = (e.clientY - btnCy) / window.innerHeight;
    const maxPull = 12;
    gsap.to(ctaBtn, {
      x: dx * maxPull, y: dy * maxPull,
      duration: 0.4, ease: EASE.snap,
      overwrite: 'auto',
    });
  });
  ctaSection.addEventListener('mouseleave', () => {
    gsap.to(ctaBtn, { x: 0, y: 0, duration: 0.5, ease: EASE.settle });
  });
}
```

Mobile throb (touch devices only):
```js
if (window.matchMedia('(hover: none)').matches) {
  gsap.to('.cta-button--form', {
    scale: 1.025, duration: 2.5, repeat: -1, yoyo: true, ease: EASE.drift,
  });
}
```

---

## Performance Budget

| Metric | Target | Method |
|--------|--------|--------|
| Total JS gzipped | < 150kb | GSAP ~27kb + ST ~22kb + SplitText ~8kb = ~57kb base |
| LCP | < 2.5s | Fonts preconnect; animation JS non-blocking (deferred after DOMContentLoaded) |
| Main thread input blocking | 0ms | All tweens: `transform` + `opacity` only |
| CLS | 0 | `overflow: hidden` on SplitText containers before split; hero `min-height: 100svh` locked |
| Simultaneous animating elements (mobile) | ≤ 4 | Stagger sequences, not concurrent batches |

---

## Known Bugs Fixed in v4 Codebase

| Bug | Location | Fix |
|-----|----------|-----|
| SplitText not registered | `main.js:11` | `registerPlugin(ScrollTrigger, SplitText)` |
| CSS rotations overwritten by GSAP y-tweens | `main.css` + `main.js` | Remove CSS rotations; bake into GSAP from-states |
| Ambient float conflicts scrub dispersal | `main.js:134–147` | `overwrite: 'auto'` on scrub tweens; skip float on scroll-active elements |
| `will-change` on all `.illus-obj` permanently | `main.css:152` | Removed from CSS; applied surgically in `onStart`/`onComplete` |
| Nav scrolled state never activates | `main.js` | `ScrollTrigger.create` for nav class toggle |
| Marquee fixed CSS speed | `main.css:505` | GSAP ticker-driven with velocity coupling |

---

## Review Amendments (final review, 2026-06-12)

Spec values changed during the post-build review (see `design/review-log.md`):

| Value | Was | Now | Why |
|-------|-----|-----|-----|
| How It Works pin length | `end: '+=250%'` | `end: '+=150%'` | 3.5 viewport-heights of pin felt endless; 2.5 total keeps the card choreography readable |
| Scroll velocity source | `ScrollTrigger.getVelocity()` | shared ticker sampling `pageYOffset` | No such static API — marquee + nav-thread velocity were dead |
| Scroll progress thread | `height`/`top` per tick | `scaleY`/`y` transforms | Interaction-physics rule compliance |
| Ambient float on scroll-active hero objects | skipped entirely | drift applied to inner `<svg>` child | Hero idle life without violating one-tween-per-element |
| `will-change` on ambient floats | onStart/onRepeat toggling | removed | ~15 perpetual loops exceeded the ≤6 budget |
| Quote-mark idle drift | both marks | open mark only | Close mark lands and holds (Chanel rule) |
| CSS transitions | default browser ease | `--ease-snap` cubic-bezier mirror of power3.out | One easing vocabulary across CSS + GSAP |

---

## Review 2 Amendments (The Current review, 2026-06-12)

Laws learned the hard way — these are binding for all future motion work:

| Rule | Why |
|------|-----|
| **Never `kill()` a child of a scrub-paused timeline.** Re-measure + `invalidate()` the persistent tween instead | GSAP gc's the whole timeline and silently destroys its ScrollTrigger — this had disabled the entire hero dispersal in production |
| **SplitText needs explicit `charsClass`/`wordsClass`** when CSS or JS selects the pieces | SplitText adds no classes by default; `.char` selectors silently match nothing |
| **SplitText on `<p>`: pass `aria: 'none'`** | v3.13 auto-aria writes `aria-label` onto elements where ARIA prohibits naming |
| **fps watchdogs judge the measured span of continuous frames only** | Assumed-window math reads warm-up as ~2 fps; single stalls (tab switch, GC) are discontinuities, not low fps |
| **`once: true` ScrollTriggers must not start in the already-triggered zone** | Mobile "you." (`top 70%`) fired at load — the word was never visible on phones |
| **Ambient layers animate `transform` only** (L1 blobs moved from `background-position` to translate3d pseudo-layers) | Same interaction-physics law as hover — repaint loops are budget theft |

The Current — shipped parameters: 520/220 particles (desktop/mobile), alpha 0.34,
point 12/7.5 px × dpr, colours 60% ink-ghost / 39% ink-muted / 0.8% accent-1,
degradation ladder 45/30/20 fps → 60% / 35%+round×0.6 / teardown. Diagnostics:
`window.__kylixCurrentDebug`.

---

## v4 — The Living Thread field (`build/src/thread-field.js`)

Canvas filament system mounted on every `<canvas class="hero__field">` — full intensity on Home
and Services (real `.hero`), reduced intensity (`data-intensity="interior"`, 0.5× filament count)
on the shorter `.section.section--dark` intro bands of Apps/About/Resources, which share
`position: relative` with `.hero` so the absolutely-positioned canvas sizes correctly against
either parent.

**System**: N horizontal quadratic-spline filaments (26/40/60 at ≤480/≤900/>900px, halved on
interior pages), 1px stroke in `--color-bronze` at 8–22% alpha, ~1-in-6 "hot" filaments in
`--color-accent` with a travelling glow node. A second offscreen canvas holds a blurred copy of
the hot filaments only, composited back with `globalCompositeOperation: 'lighter'` at 55% alpha
for the bloom — this is the one deliberate GPU/battery spend the user explicitly authorized in
trade for visual impact.

**Interaction parity (desktop ≡ mobile, by design)**: both platforms drive the same
`fieldDisplacement(x, y)` falloff function (radius 180px, `(1 - d/r)²` falloff, ±26px lateral
push). Desktop supplies `pointerX/Y` via `mousemove` (gated `(hover: hover) and (pointer: fine)`);
mobile supplies the same coordinates via `touchmove`, plus a low-pass-filtered
`deviceorientation` gamma/beta tilt blended into every filament's y-offset — gated behind the
iOS 13+ permission gesture (`DeviceOrientationEvent.requestPermission()` on first `touchend`),
falling back to autonomous drift + touch response if denied or unsupported.

**Degradation ladder** (frame-time guard, rolling 45-frame average): first the bloom pass is
dropped, then filaments shed in steps of 6 down to a floor of 14 — degraded, never disabled.
Lifecycle: `IntersectionObserver` pauses the rAF loop when the canvas leaves the viewport;
`visibilitychange` pauses on tab blur; `prefers-reduced-motion: reduce` removes the canvas
entirely (`boot()` in `thread-field.js`) in favour of the static CSS ember-glow fallback already
present on `.hero__glow`.

**Load choreography**: `introProgress` eases 0–1 over 900ms with a cubic-out curve, driving both
the filaments' draw-in and their displacement responsiveness — nothing bends toward the pointer
until the intro settles, so the field never looks like it's fighting the entrance.
