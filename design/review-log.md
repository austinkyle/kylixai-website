# review-log.md — Final Review of the v2 Experience Upgrade

**Reviewer**: Claude (Fable 5), final correction pass — 2026-06-12
**Scope**: Sonnet's Prompts 0–5 build in `build/src/`. Authority: fix/delete motion
defects; copy, logo masters, locked tokens, page structure untouched.

---

## Headline finding

**Sonnet's v2 build was never deployed.** kylixai.com was serving the old v3
assets (238-line main.js, CSS-only marquee, none of the v2 choreography); the
entire v5/v6 build sat uncommitted in the working tree. The reported regressions
(static marquee, over-long How It Works) were observed on a local preview of
that uncommitted build. This review fixed the build and shipped it for the
first time.

---

## Phase 1 — Foundation defects (all fixed)

| # | Defect | Location (pre-fix) | Fix |
|---|--------|--------------------|-----|
| B1 | `ScrollTrigger.getVelocity()` called as a static API — it doesn't exist. TypeError every ticker frame: **marquee frozen**, nav-thread velocity dead | main.js:161, 807 | Shared `scrollVelocity` sampled from `pageYOffset` inside the GSAP ticker (no raw scroll listeners) |
| B2 | `.steps-thread` SVG in normal flow → ~300px dead gap before step 1 | index.html steps section | Absolute overlay, sized to the steps stack via `offset*` (transform-safe), re-laid-out on `refreshInit`; hidden <768px |
| B3 | Pin `end:'+=250%'` ≈ 3.5 viewport-heights of pinned scroll | main.js | `+=150%` |
| B4 | Scroll-progress animated `height`/`top` per tick | main.js | `scaleY` + `y` transforms; node centered by margin so GSAP owns transform |
| B5 | Form fade-out tween had no vocabulary ease | main.js | `EASE.snap` |
| B6 | `will-change` toggled on ~15 perpetual drift loops (budget ≤6) | main.js | Removed |
| B7 | Hero GL "idle pause" comment was a lie — rAF ran whenever hero visible | main.js | Real 4s idle cutoff; mousemove restarts |
| B8 | Cursor-ring rAF free-ran forever | main.js | Stops when settled (<0.1px delta); mousemove restarts |
| B9 | Boundary-object `top` anchored once at init, stale after resize | main.js | Re-anchored on `refreshInit`; listener removed in matchMedia cleanup |
| B10 | Drift tweens spawned in ScrollTrigger callbacks leaked across breakpoint changes | main.js | `killTweensOf` + `clearProps` in tier-1 cleanup |
| B11 | Malformed nav-thread path (`C78,5 80,6` — incomplete cubic, console parse error) | index.html | Completed: `C76,5 78,5 80,6` |
| B12 | Horizontal overflow (up to 230px) from off-canvas sticky/gear start states | CSS | `overflow-x: clip` on html + body (clip ≠ hidden: no scroll container) |
| B13 | CSS transitions used default browser ease, outside the vocabulary | main.css | `--ease-snap` cubic-bezier(0.215,0.61,0.355,1) applied to all UI transitions |

**Reduced motion**: traced every entry point (page-load timeline, all ScrollTriggers,
marquee ticker, cursor, magnetic, hover systems, GL). The early return at main.js:52 +
CSS §20/§24 fallbacks produce a fully composed page — verified headless: headline,
steps, stickies, quote visible; stat reads "10–20 hrs"; thread strokes drawn; cursor,
progress rail, canvas absent. No gaps found.

**WebGL verdict**: kept. ~3.5 kb inline raw WebGL (no library), gated against
reduced-motion + touch, IO-paused off-viewport, now genuinely idle-paused. A/B
screenshots show clearly visible paper-grain mottling vs flat parchment — passes
the 5-second test.

## Phase 2 — Integrity

- **Form**: hCaptcha widget renders and injects its token field. Live E2E
  submission succeeded (two test emails sent). **Finding**: Web3Forms accepted
  posts with an empty `h-captcha-response` — captcha was not enforced anywhere.
  Fixed client-side (handler now requires a solved captcha before posting).
  **Recommended user action**: also enable hCaptcha enforcement in the Web3Forms
  dashboard so direct-to-API spam is rejected server-side.
- **Keyboard**: logical tab order (nav → hero CTA → form → captcha → submit →
  fallback → footer), visible focus rings throughout, nothing trapped behind the
  pin (pinned section contains no focusables), anchors land correctly.
- **Brand**: the "orange only as signal nodes / bronze lockup" law belongs to the
  retired logo-era spec; the locked v2.0 tokens explicitly assign orange to CTAs /
  urgency / open-quote. One real fix: `.how__guarantee` orange text was 4.2:1
  (AA-large only) at 20px regular on small screens → switched to
  `--color-accent-1-dark` (existing token).
- **Copy**: index.html copy diverges from `content/copy/` finals in the hero
  reassurance + How It Works guarantee — traced to the user's own ROI-messaging
  commits (3c89a11, 13059e6) which touched only index.html. Site copy is
  authoritative; the copy docs are stale. **Deferred**: refreshing the copy finals
  (content workspace ownership).
- **Lighthouse**: see `deploy/performance-baseline-v2.md`. Mobile 78→98 after making
  the Google Fonts stylesheet non-blocking (the metric-matched fallbacks were built
  for exactly this and were being wasted).

## Phase 3 — Craft (Chanel-rule deletions, one per section)

| Section | Deleted | Why |
|---------|---------|-----|
| Hero | `#hero-sticky` (5th chaos object) | Redundant paper-role with invoice; brings simultaneous scrub objects to 4 (perf budget) |
| Recognition | Calendar illustration | Densest section (6 objects); calendar crowded the same corner as sticky--2 and added no narrative |
| Reframe | `#boundary-envelope` cross-parallax | Mail-chaos drifting INTO the solution section read against "chaos becomes system" |
| How It Works | Top-left sticky note | A chaos object inside the system section contradicts the narrative; checkmark stays |
| Proof | Close-quote idle drift | The mark should land and hold; open mark alone carries ambient life |
| CTA | `data-hover` lift on the freed leash | The magnetic CTA button must be the section's only interactive draw |

Unused calendar `<symbol>` removed with its last reference.

- **Signature moment**: headline word-sweep completes ~1.2s, thread draw 0.35–1.2s,
  chaos objects deliberately delayed to 1.05s — lands inside 3s, undiluted.
- **Idle life**: gap found in the hero (all objects scroll-active → no float, GL
  pauses when idle). Fixed within vocabulary: drift applied to the inner `<svg>`
  of scroll-active wrappers (no one-tween-per-element conflict). Every section now
  has ≥1 ambient loop (drift, 4–8s, ≤7px).
- **3am details (5 that survive)**: (1) nav squiggle shimmies with scroll velocity;
  (2) progress node blooms orange + springs at the CTA; (3) Recognition sticky #4
  lands deliberately late; (4) marquee accelerates with scroll; (5) field checkmark
  springs in only after a valid blur.

## Verification

Headless (Playwright, 1440px / 380px touch / reduced-motion): zero console errors,
marquee animating, thread spans the card stack, pin spacer 2.9 viewport-heights,
no horizontal overflow at any tested depth, mobile clean, reduced-motion composed.
Live site re-verified post-deploy.

## Deferred

- Refresh `content/copy/` finals to match the committed ROI messaging.
- TBT: one ~188ms task at load (GSAP/SplitText init) — acceptable, none during scroll.

---

# Review 2 — "The Current" hero build (PROMPT 2, amended authority) — 2026-06-12

**Reviewer**: Claude (Fable 5). **Scope**: uncommitted working tree adding the hero
background system ("The Current": L1 atmosphere, L2 paper GL, L3 grain, L4 vignette +
Three.js particle field), official Thread logo in nav, brand favicons/og-image.
**Authority**: The Current is a protected feature — Tier 1 fix / Tier 2 tune (documented)
/ Tier 3 delete only on measured evidence. Everything else: original authority.
Copy, logo art, fonts, structure untouched.

## Headline findings

1. **The Current never ran at all.** `three@0.169.0/build/three.min.js` is a 404 — the
   UMD build stopped shipping after r159. `window.THREE` was undefined, so the field,
   the avoidance mask and the impulse API silently no-oped on every load (plus a console
   network error on every visit).
2. **The entire hero scroll choreography is dead on the LIVE site** (introduced by
   cb5e16b, before this build). The run-underline's refresh handler killed its child
   tween of the scrub-paused heroTl; GSAP gc'd the whole timeline and silently destroyed
   its ScrollTrigger ~330 ms after load. Chaos-object dispersal, "you." departure,
   background lift and underline scrub were all inert. Bisected HEAD vs b22202a;
   isolated to `underlineTween.kill()` (kill-only variant reproduced it; DOM-only and
   add-only variants did not).
3. **Mobile users never saw "you."** — the mobile departure ScrollTrigger
   (`start: 'top 70%'`, `once: true`) was already past its start at scroll 0 and fired
   at load. Live headline reads "Your business should run without". Pre-existing.
4. **The headline avoidance mask was empty.** SplitText adds no class by default;
   both the CSS `.char` rule and `buildMask('.hero__headline .char')` selected nothing
   (`charsClass: 'char'` was missing).

## Defect table

| # | Sev | Defect | Location (pre-fix) | Fix |
|---|-----|--------|--------------------|-----|
| B14 | blocking | Three.js UMD CDN URL 404s (ORB-blocked) → Current never initialises | index.html:587 | Dynamic `import()` of `three.module.min.js` inside the idle callback; CDN failure falls back to static L1+L4. Also removes ~120 kb gz from the critical path |
| B15 | blocking | Watchdog divided by an assumed 2 s window — ~80 ms after start it read ≈2 fps and cascaded to Tier 3, killing the field within 6 frames on any machine; same cascade after every tier change | main.js checkFPS | fps computed over the **measured** span; judge only when span ≥ 1.5 s |
| B16 | blocking | heroTl + its ScrollTrigger gc'd by `underlineTween.kill()` on first refresh (live-site bug, see finding 2) | main.js refreshInjectHandler | Handler now re-measures geometry, redraws the SAME path and `invalidate()`s the persistent tween; never kills children of the scrub-paused timeline |
| B17 | blocking | Mobile "you." departs at page load (finding 3) | main.js mobile tier | `start: 'top -15%'` — fires only once the hero scrolls away |
| I1 | integrity | Empty avoidance mask (finding 4) | main.js SplitText call | `charsClass: 'char'` |
| I2 | integrity | Stale off-brand favicon.svg (retired logo, gradient, live-font K) took precedence over the new PNG set | index.html:33 + favicon.svg | favicon.svg replaced with the official 07-THREAD-MONOGRAM-LIGHT master |
| I3 | integrity | L1 atmosphere invisible on desktop — z:-2 behind the opaque L2 canvas (`alpha:false`) | main.css | backdrop z:0, last-in-DOM → tints above the paper texture on all devices |
| I4 | integrity | Hero text/CTA stacked BELOW canvases (z 0/1) and vignette (z 9) — particles crossed the CTA, vignette darkened type | main.css .hero__inner | `position:relative; z-index: var(--z-content)` — field flows behind the words, mask still curves it around the headline |
| I5 | integrity | Reduced-motion hid L1 entirely, contradicting the documented static L1+L4 fallback | main.css §20 | Atmosphere stays as a static tint; only its drift stops |
| I6 | integrity | `u_ptSize` not DPR-scaled → particles half-size on retina | main.js uniforms | × dpr |
| I7 | integrity | `gl_PointSize` unclamped vs velocity — impulse could push point size past guaranteed GPU limits | vertex shader | `clamp(0.7 + spd*0.5, 0.7, 1.6)` |
| I8 | integrity | Tier-3 exit left a frozen frame composited forever + live GPU context | main.js | `teardown()`: fade out, dispose geometry/material/renderer, remove canvas, disconnect observers |
| I9 | integrity | "you." impulse re-fired on every scrub re-entry | main.js heroTl onStart | once-per-page guard (verified: 1 call across 3 scrub cycles) |
| I10 | integrity | L1 animated `background-position` — full-hero repaint every frame for 14 s loops (violates transform-only physics) | main.css | Two blob pseudo-layers driven by `transform: translate3d` |
| I11 | integrity | Watchdog ratcheted down on one-off stalls (tab switch, screenshot, GC) | main.js checkFPS | >250 ms frame gap = discontinuity → window resets; only sustained low fps degrades |
| I12 | integrity | SplitText 3.13 auto-aria wrote `aria-label` onto `<p>` (ARIA-prohibited) — Lighthouse a11y fail | main.js lineReveal | `aria: 'none'` (lines remain real text) — pre-existing |
| I13 | integrity | ink-ghost text at 1.9:1 / 1.7:1 contrast (founder-quote title, footer legal) | main.css | → ink-muted (≈5.6:1) — pre-existing |
| C1 | craft | Logo nodes scaled in ~20 px off-centre (`transformOrigin` px is bbox-relative, not viewBox) | main.js | `transformOrigin: '50% 50%'` |
| C2 | craft | Deterministic respawn — every particle reappeared at the same spot forever; edge-spawning built a visible density rim | main.js initP | Salted uniform respawn; 20-frame fade-in hides the pop |
| C3 | craft | Mask/renderer resize work ran un-debounced per RO tick | main.js | 150 ms debounce |
| C4 | craft | Mobile scroll-shear listener bound only if mobile at init | main.js | gated inside the handler |

## Tier-2 tuning log (protected feature — each change + reason)

| Param | Was | Now | Why |
|-------|-----|-----|-----|
| Particle count | 1200 desktop / 380 mobile | 520 / 220 | At original density the field read as confetti static fighting the headline (screenshot-verified on real GPU); halved it reads as a current |
| Global alpha | 0.58 | 0.34 | Field must sit beneath the words — idle life without an attention trap (Pass A.5) |
| Point size | 15 / 9 CSS px | 12 / 7.5 (× dpr) | 15 px streaks read as heavy marks, not fibres |
| Colour mix | 85% ink-muted, 12% ghost, 3% orange | 60% ghost, ~39% muted, 0.8% orange | Mostly-dark mix made noise; orange is a rare signal per brand law, not decoration |
| Tier-2 rung | streaks off only | + point size × 0.6 | Round fallback at full size read as blobs, not grain |

## Pass A — hero integration audit

1. **Pointer**: headline repulsion and field attractor both read `__kylixHeroPointer`;
   zero duplicated listeners between them (L2's own hero mousemove retained — it feeds
   the ripple uv + its B7 idle-restart; different concern, documented). Repulsion
   verified live (4 chars displaced around cursor).
2. **Impulse**: fires exactly once (instrumented: 1 call across 3 full scrub cycles),
   correct hero-relative coordinates (434, 601), headline timeline timing untouched.
3. **Fusion**: after I3/I4/I5 + Tier-2 tuning the hero reads as one scene — atmosphere
   tints the paper, fibres flow behind type and curve around the headline (mask hole
   visibly tracks the glyphs), grain (z 9998) sits over both canvases, vignette over
   field / under content. Screenshots archived in the session log.
4. **LCP**: desktop LCP element = `h1#hero-headline` (Lighthouse trace), 0.3 s desktop /
   1.2 s mobile-sim. Mobile LCP attribution is `p.hero__sub` at ~50 ms (char-split
   headline geometry) — within budget, accepted and documented.
5. **Idle life**: 60 s+ untouched — field stays alive at tier 0, no pulse loops, no
   degradation (real GPU: 118–121 fps sustained, incl. hover). L2's 4 s idle cutoff intact.

## Pass B — mobile excellence (390×844, also 360/430)

- Judged as its own design: full headline incl. "you.", avoidance hole follows the
  wrapped headline at all three widths, field behind text, CTA dominant. Passes.
- "you." rests at opacity 1 and departs only after ~40 vh of scroll (all widths).
- 4× CPU throttle, DPR 3: locked 60 fps at tier 0 through a multi-minute scroll
  session — no degradation, no thermal spiral, field pauses off-viewport.
- Tap targets: hero CTA 261×64, form CTA 317–388×65 (nav CTA hidden on mobile by
  design — sticky pill replaces it). No horizontal overflow at 360/390/430.
- Lighthouse mobile (simulated 4G): **97 perf / LCP 1.2 s / TBT 190 ms / CLS 0.001**
  — gates (≥90, <2.5 s) passed.

## Lighthouse (localhost, lighthouse@12)

| Metric | Desktop | Mobile | v2 baseline |
|--------|---------|--------|-------------|
| Performance | 100 | 97 | 93 / 98 |
| LCP | 0.3 s | 1.2 s | 1.2 / 1.1 s |
| TBT | 0 ms | 190 ms | 20 / 180 ms |
| CLS | 0.021 | 0.001 | 0.002 |
| Accessibility | **100** (was 92) | — | 93 |

Best-practices remains hCaptcha-noise-bound off-domain (unchanged, external).

## Deferred / accepted

- Mobile LCP attribution = hero sub-paragraph (~50 ms; char-split headline) — accepted.
- Brand-guide tension: nav wordmark renders at 170 px (desktop) / 130 px (mobile) wide
  vs the guide's "monogram below 200 px" rule. The guide's own signature animation
  requires the wordmark; thread cut remains legible with the drawn thread. Accepted,
  flagged for the user.
- Desktop CLS 0.021 (was 0.002) — headline min-height handoff during scatter; within
  "good" (<0.1). Monitor.
- content/copy/ finals still stale vs site copy (carried from Review 1).
- hCaptcha server-side enforcement in the Web3Forms dashboard still pending (user action).
- `window.__kylixCurrentDebug` (read-only: level/count/fps) added for field diagnostics.
