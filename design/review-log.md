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
