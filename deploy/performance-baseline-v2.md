# performance-baseline-v2.md — Post-Review Lighthouse Baseline

**Date**: 2026-06-12 (final review pass, pre-deploy local measurements; re-verify on live after Cloudflare deploy)
**Build**: main.css?v=6 / main.js?v=7

## Scores (Lighthouse, headless Chrome, simulated throttling)

| Metric | Desktop | Mobile | Target | Status |
|--------|---------|--------|--------|--------|
| Performance | 93 | 98 | ≥90 / ≥80 | ✅ |
| LCP | 1.2 s | 1.1 s | <2.5 s | ✅ |
| CLS | 0.002 | 0.002 | 0 | ✅ (rounding-level; metric-matched font fallbacks) |
| TBT | 20 ms | 180 ms | — | ⚠️ one ~188 ms task at load (GSAP+SplitText init), none during scroll |
| Accessibility | 93 | — | — | — |
| Best practices | 58 | — | — | hCaptcha third-party cookie/deprecation warnings — external, not actionable |

## Key fix
Mobile perf was **78 / LCP 4.0 s** before making the Google Fonts stylesheet
non-blocking (`media="print" onload` + `<noscript>` fallback). The metric-matched
Playfair/Lora Georgia fallbacks (main.css §0) make the swap CLS-safe.

## JS payload
GSAP core + ScrollTrigger + SplitText (CDN) ≈ 57 kb gz; site JS ~14 kb raw incl.
~3.5 kb inline WebGL hero texture (no library). Within the <150 kb budget.

---

## v2.1 — The Current (Review 2, 2026-06-12)

**Build**: main.css?v=9 / main.js?v=10 (Three.js module dynamically imported at idle —
off the critical path; ~120 kb gz loads only when the field runs).

| Metric | Desktop | Mobile | Status |
|--------|---------|--------|--------|
| Performance | 100 | 97 | ✅ |
| LCP | 0.3 s (h1#hero-headline) | 1.2 s | ✅ |
| TBT | 0 ms | 190 ms | ✅ |
| CLS | 0.021 | 0.001 | ✅ (headline min-height handoff; monitor) |
| Accessibility | 100 | — | ✅ (was 92/93) |

Field runtime (real GPU, retina): 118–121 fps tier 0 sustained incl. hover.
Mobile 390×844 @ 4× CPU throttle, DPR 3: locked 60 fps tier 0, no degradation
over a multi-minute scroll session. Measured via `window.__kylixCurrentDebug`.
