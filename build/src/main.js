/* ================================================================
   KylixAI — main.js v5
   Motion architecture: spec-motion-v2.md
   Easing vocabulary: snap (power3.out) | settle (expo.out) | drift (sine.inOut)
   All animation gated behind prefers-reduced-motion.
   Breakpoints via gsap.matchMedia():
     ≥1024px — full choreography (scrub, pin, cross-boundary parallax)
     ≥768px  — simplified (SplitText, triggered reveals, no pin)
     <768px  — minimal (opacity-only triggered reveals)
   ================================================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ─── Easing vocabulary ─────────────────────────────────────── */

  const EASE = {
    snap:   'power3.out',
    settle: 'expo.out',
    drift:  'sine.inOut',
    spring: 'elastic.out(1, 0.5)',
  };

  /* ─── Z-depth parallax multipliers ─────────────────────────── */

  const LAYER_SPEED = { back: 0.15, mid: 0.35, front: 0.55 };

  /* ─── Shared scroll velocity (px/s) ─────────────────────────────
     ScrollTrigger has no static getVelocity(); sample scroll position
     inside the GSAP ticker instead — no raw scroll listeners. */

  let scrollVelocity = 0;
  (function initScrollVelocity() {
    if (prefersReducedMotion) return;
    let lastY = window.pageYOffset;
    gsap.ticker.add((time, deltaTime) => {
      const y = window.pageYOffset;
      scrollVelocity = ((y - lastY) / Math.max(deltaTime, 1)) * 1000;
      lastY = y;
    });
  })();

  function getLayerMultiplier(el) {
    if (el.classList.contains('layer-front')) return LAYER_SPEED.front;
    if (el.classList.contains('layer-mid'))   return LAYER_SPEED.mid;
    return LAYER_SPEED.back;
  }

  /* ─── Elements that live in scroll tweens — skip ambient float ─ */

  const scrollActiveIds = new Set([
    'hero-alarm', 'hero-invoice', 'hero-cord', 'hero-coffee',
    'boundary-invoice',
  ]);

  /* ================================================================
     EARLY EXIT — prefers-reduced-motion
     Sections remain visible via CSS fallback in main.css §20.
     ================================================================ */

  if (prefersReducedMotion) {
    /* Ensure any GSAP-set initial states don't hide content */
    gsap.set(['.step', '.founder-quote', '.testimonial-placeholder',
              '.recognition-sticky', '.pain-item'], { clearProps: 'all' });

    /* Scroll progress: hide it */
    const progressEl = document.querySelector('.scroll-progress');
    if (progressEl) progressEl.style.display = 'none';

    /* Still drive the form submission — no animation */
    initFormHandler();
    return;
  }

  /* ================================================================
     SCROLL PROGRESS THREAD — all breakpoints (desktop shows the rail)
     ================================================================ */

  (function initScrollProgress() {
    const rail = document.querySelector('.scroll-progress');
    const fill = document.querySelector('.scroll-progress__fill');
    const node = document.querySelector('.scroll-progress__node');
    if (!rail || !fill || !node) return;

    /* Transforms only — never animate height/top per scroll tick */
    let railH = rail.clientHeight;
    ScrollTrigger.addEventListener('refresh', () => { railH = rail.clientHeight; });
    gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        gsap.set(fill, { scaleY: self.progress });
        gsap.set(node, {
          y: self.progress * railH,
          opacity: self.progress > 0.02 ? 1 : 0,
        });
      },
    });

    /* Node blooms orange when CTA enters — the logo concept as navigation */
    ScrollTrigger.create({
      trigger: '.section-cta',
      start: 'top 80%',
      once: true,
      onEnter() {
        gsap.to(fill, { background: 'var(--color-accent-1)', duration: 0.5, ease: EASE.snap });
        gsap.to(node, { scale: 1.8, duration: 0.4, ease: EASE.spring });
      },
    });
  })();

  /* ================================================================
     PAGE-LOAD ORCHESTRATION
     ================================================================ */

  (function initPageLoad() {
    const headlineEl = document.querySelector('.hero__headline');
    let heroSplit = null;
    if (headlineEl) {
      heroSplit = new SplitText(headlineEl, { type: 'words' });
      headlineEl.style.overflow = 'hidden';
    }

    /* Nav thread — set draw state before timeline so it animates in */
    const threadPath = document.querySelector('.nav__thread-path');
    let threadLen = 0;
    if (threadPath) {
      threadLen = threadPath.getTotalLength();
      gsap.set(threadPath, { strokeDasharray: threadLen, strokeDashoffset: threadLen });
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.settle } });

    tl
      .from('.hero__badge', {
        y: 14, opacity: 0, duration: 0.5, delay: 0.1,
      })
      .from(heroSplit ? heroSplit.words : '.hero__headline', {
        y: '110%', opacity: 0, duration: 0.70, stagger: 0.055,
      }, '-=0.20')
      .from('.hero__sub', {
        y: 22, opacity: 0, duration: 0.60,
      }, '-=0.40')
      .from('.cta-button:not(.cta-button--form)', {
        scale: 0.88, opacity: 0, duration: 0.65, ease: EASE.spring,
      }, '-=0.35')
      .from('.hero__reassurance', {
        opacity: 0, duration: 0.45,
      }, '-=0.30');

    /* Hero illustration objects fade in — delayed past headline sweep climax */
    tl.from(
      ['#hero-alarm', '#hero-invoice', '#hero-cord', '#hero-coffee'],
      { opacity: 0, duration: 0.8, stagger: 0.12, ease: EASE.settle },
      1.05
    );

    /* Thread draws as headline sweeps in */
    if (threadPath) {
      tl.to(threadPath, {
        strokeDashoffset: 0,
        duration: 0.85,
        ease: EASE.settle,
      }, 0.35);
    }

    /* After load: bind scroll velocity to thread dashoffset */
    if (threadPath && threadLen > 0) {
      tl.eventCallback('onComplete', () => {
        let dashOffset = 0;
        const maxShift = threadLen * 0.02;
        gsap.ticker.add(() => {
          const target = gsap.utils.clamp(-maxShift, maxShift, scrollVelocity * 0.000035 * threadLen);
          dashOffset  += (target - dashOffset) * 0.12;
          dashOffset  += (0 - dashOffset) * 0.06;
          gsap.set(threadPath, { strokeDashoffset: dashOffset });
        });
      });
    }
  })();

  /* ================================================================
     NAV SCROLLED STATE
     ================================================================ */

  (function initNav() {
    const navEl = document.getElementById('nav');
    if (!navEl) return;
    ScrollTrigger.create({
      start: 'top -64',
      onEnter:     () => navEl.classList.add('nav--scrolled'),
      onLeaveBack: () => navEl.classList.remove('nav--scrolled'),
    });
  })();

  /* ================================================================
     AMBIENT FLOAT LOOPS
     Skip elements that participate in scroll tweens.
     ================================================================ */

  (function initAmbientFloat() {
    document.querySelectorAll('.illus-obj').forEach((el, i) => {
      /* Scroll-active wrappers can't float (one tween per element rule) —
         drift their inner SVG instead so the hero has idle life too */
      const target = scrollActiveIds.has(el.id) ? el.querySelector('svg') : el;
      if (!target) return;

      const duration = 4 + (i % 5) * 0.8;
      const yAmount  = 5 + (i % 3) * 2;
      const rAmount  = 1.5 + (i % 4) * 0.5;

      gsap.to(target, {
        y:        `+=${yAmount}`,
        rotation: `+=${rAmount}`,
        duration,
        repeat:   -1,
        yoyo:     true,
        ease:     EASE.drift,
        delay:    i * 0.3,
        /* No will-change here: ~15 perpetual drift loops would blow the
           ≤6-element budget; compositor promotion isn't worth it for 4–8s loops */
      });
    });
  })();

  /* ================================================================
     SPLITTEXT HELPER — masked line reveal
     Used for section headlines (Playfair), blockquote paragraphs.
     Body copy fades as a block — never SplitText per-word.
     Returns the SplitText instance so callers can revert() on cleanup.
     ================================================================ */

  /* ── Steps connector thread — absolute overlay, sized to the stack ──
     Uses offset* (layout) values so GSAP transforms don't skew the math.
     Re-run on every ScrollTrigger refresh (resize/orientation). */

  function layoutStepsThread() {
    const thread = document.querySelector('.steps-thread');
    const steps  = document.querySelector('.steps');
    if (!thread || !steps) return;
    thread.style.left   = `${steps.offsetLeft - 26}px`;
    thread.style.top    = `${steps.offsetTop + 12}px`;
    thread.style.height = `${steps.offsetHeight - 24}px`;
    thread.style.width  = '20px';
  }
  layoutStepsThread();
  ScrollTrigger.addEventListener('refreshInit', layoutStepsThread);

  function lineReveal(selector, triggerEl, delay) {
    delay = delay || 0;
    const splits = [];
    document.querySelectorAll(selector).forEach((el) => {
      const split = new SplitText(el, { type: 'lines' });
      splits.push(split);

      /* Wrap each line in overflow:hidden so the 3px travel is clipped */
      split.lines.forEach((line) => {
        const mask = document.createElement('div');
        mask.className = 'line-mask';
        line.parentNode.insertBefore(mask, line);
        mask.appendChild(line);
      });

      gsap.from(split.lines, {
        scrollTrigger: { trigger: triggerEl || el, start: 'top 85%', once: true },
        y: 3,
        rotation: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: EASE.settle,
        delay,
      });
    });
    return splits;
  }

  /* ================================================================
     RESPONSIVE CHOREOGRAPHY — gsap.matchMedia()
     Three tiers; cleanup callbacks revert SplitText and kill ScrollTriggers.
     ================================================================ */

  const mm = gsap.matchMedia();

  /* ──────────────────────────────────────────────────────────────
     TIER 1: ≥1024px — Full choreography
     ────────────────────────────────────────────────────────────── */

  mm.add('(min-width: 1024px)', () => {
    const splits = [];
    const refreshHandlers = [];

    /* ── 1. Hero dispersal — individual bezier paths, 80vh, staggered exits ── */

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-hero',
        start: 'top top',
        end: '+=80%',  /* first ~80vh of scroll */
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    /* Each object: two `.to()` calls create a mid-arc curve.
       Layer multiplier scales travel distance per z-depth spec.
       Stagger via timeline positions (0, 0.12, 0.22, 0.32, 0.42). */
    const heroObjects = [
      { id: '#hero-invoice', pos: 0.00, x1:  100, y1:  -60, x2:  210, y2: -130, r: 28  },
      { id: '#hero-alarm',   pos: 0.10, x1:  -70, y1:  -90, x2: -150, y2: -190, r: -22 },
      { id: '#hero-cord',    pos: 0.20, x1:  -80, y1:   45, x2: -170, y2:  100, r: 0   },
      { id: '#hero-coffee',  pos: 0.30, x1:   60, y1:   75, x2:  130, y2:  160, r: -14 },
    ];

    heroObjects.forEach(({ id, pos, x1, y1, x2, y2, r }) => {
      const el = document.querySelector(id);
      if (!el) return;
      const m    = getLayerMultiplier(el);
      const dur  = 0.38;  /* fraction of timeline duration */

      heroTl
        .to(el, {
          x: x1 * m, y: y1 * m, rotation: r ? r * 0.4 : 0,
          overwrite: 'auto',
          ease: 'none',
          duration: dur,
        }, pos)
        .to(el, {
          x: x2 * m, y: y2 * m, rotation: r || 0,
          autoAlpha: 0,
          overwrite: 'auto',
          ease: 'none',
          duration: dur,
        }, pos + dur * 0.7);
    });

    /* Background lightens as chaos clears */
    heroTl
      .to('.section-hero', {
        backgroundColor: '#F5F1E0',
        overwrite: 'auto',
        ease: 'none',
        duration: 1,
      }, 0);

    /* ── 2. Cross-boundary parallax objects ── */

    const reframeEl = document.querySelector('.section-reframe');
    const howEl     = document.querySelector('.section-how');

    if (reframeEl && howEl) {
      const boundaryInvoice = document.querySelector('#boundary-invoice');
      if (boundaryInvoice) {
        /* Position at the midpoint of the Reframe→HowItWorks boundary;
           re-anchor on every refresh so resize doesn't strand it */
        const anchorInvoice = () =>
          gsap.set(boundaryInvoice, { top: reframeEl.offsetTop + reframeEl.offsetHeight * 0.85 });
        anchorInvoice();
        ScrollTrigger.addEventListener('refreshInit', anchorInvoice);
        refreshHandlers.push(anchorInvoice);

        gsap.to(boundaryInvoice, {
          y: () => window.innerHeight * 1.4,
          ease: 'none',
          scrollTrigger: {
            trigger: reframeEl,
            start: 'top bottom',
            end: () => `+=${howEl.offsetTop + howEl.offsetHeight - reframeEl.offsetTop}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }

    /* ── 3. Recognition — sticky-note scatter v2 ── */

    /* Set off-canvas starting positions */
    gsap.set('.recognition-sticky--1', { x: -280, y: -80,  rotation: -30, autoAlpha: 0 });
    gsap.set('.recognition-sticky--2', { x:  320, y: -120, rotation:  22, autoAlpha: 0 });
    gsap.set('.recognition-sticky--4', { x: -340, y:  160, rotation: -20, autoAlpha: 0 });

    const stickyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-recognition',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    /* Fly in with individual rotations — --4 is intentionally last (the "late" note) */
    stickyTl
      .to('.recognition-sticky--1', { x: 0, y: 0, rotation: -12, autoAlpha: 1, ease: EASE.settle }, 0.00)
      .to('.recognition-sticky--2', { x: 0, y: 0, rotation:   8, autoAlpha: 1, ease: EASE.settle }, 0.15)
      .to('.recognition-sticky--4', { x: 0, y: 0, rotation:  10, autoAlpha: 1, ease: EASE.settle }, 0.38); /* late */

    /* Spring settle fires once at 50% — overshoot snap gives physical landing */
    ScrollTrigger.create({
      trigger: '.section-recognition',
      start: 'top 50%',
      once: true,
      onEnter() {
        gsap.to('.recognition-sticky--1', { rotation: -12, y: '-=4', duration: 0.35, ease: EASE.spring, overwrite: 'auto' });
        gsap.to('.recognition-sticky--2', { rotation:   8, y: '+=3', duration: 0.35, ease: EASE.spring, overwrite: 'auto' });
        /* Note 4 settles noticeably late — intentional imperfection */
        /* Its onComplete restarts ambient drift for all stickies (spring's overwrite kills the original loops) */
        gsap.to('.recognition-sticky--4', {
          rotation: 10, y: '+=5', duration: 0.45, ease: EASE.spring, overwrite: 'auto', delay: 0.28,
          onComplete() {
            [
              { sel: '.recognition-sticky--1', y: 4, r: 1.2, dur: 5.2 },
              { sel: '.recognition-sticky--2', y: 3, r: 0.8, dur: 4.8 },
              { sel: '.recognition-sticky--4', y: 5, r: 1.5, dur: 6.1 },
            ].forEach(({ sel, y, r, dur }) => {
              gsap.to(sel, { y: `+=${y}`, rotation: `+=${r}`, duration: dur, repeat: -1, yoyo: true, ease: EASE.drift });
            });
          },
        });
      },
    });

    /* ── 4. How It Works — pinned scrub scene ── */

    /* Measure doodle path lengths */
    const doodlePaths = [
      document.querySelector('.step--1 .step__doodle-path'),
      document.querySelector('.step--2 .step__doodle-path'),
      document.querySelector('.step--3 .step__doodle-path'),
    ];
    const stepsThreadPath = document.querySelector('.steps-thread-path');

    doodlePaths.forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    if (stepsThreadPath) {
      const len = stepsThreadPath.getTotalLength();
      gsap.set(stepsThreadPath, { strokeDasharray: len, strokeDashoffset: len });
    }

    /* Steps start scattered (exaggerated rotations) — pin scene de-scatters them */
    gsap.set('.step--1', { autoAlpha: 0, y: 50, rotation: -14 });
    gsap.set('.step--2', { autoAlpha: 0, y: 50, rotation:  16 });
    gsap.set('.step--3', { autoAlpha: 0, y: 50, rotation: -12 });
    gsap.set('.how__footer', { autoAlpha: 0 });

    const stepsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-how',
        start: 'top top',
        end: '+=150%',
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    const threadLen = stepsThreadPath ? stepsThreadPath.getTotalLength() : 300;

    stepsTl
      /* Step 1 de-scatters and draws in */
      .to('.step--1', { autoAlpha: 1, y: 0, rotation: -1,   duration: 0.20, ease: EASE.settle }, 0.00)
      .to(doodlePaths[0], { strokeDashoffset: 0, duration: 0.20, ease: EASE.settle }, 0.02)
      /* Thread draws toward step 2 — offset goes from full → 2/3 (1/3 drawn) */
      .to(stepsThreadPath, { strokeDashoffset: threadLen * 0.67, duration: 0.18, ease: 'none' }, 0.17)
      /* Step 2 de-scatters and draws in */
      .to('.step--2', { autoAlpha: 1, y: 0, rotation:  1.5, duration: 0.20, ease: EASE.settle }, 0.33)
      .to(doodlePaths[1], { strokeDashoffset: 0, duration: 0.20, ease: EASE.settle }, 0.35)
      /* Thread draws toward step 3 — offset goes from 2/3 → 1/3 (2/3 drawn) */
      .to(stepsThreadPath, { strokeDashoffset: threadLen * 0.33, duration: 0.18, ease: 'none' }, 0.47)
      /* Step 3 de-scatters and draws in */
      .to('.step--3', { autoAlpha: 1, y: 0, rotation: -1.5, duration: 0.20, ease: EASE.settle }, 0.60)
      .to(doodlePaths[2], { strokeDashoffset: 0, duration: 0.20, ease: EASE.settle }, 0.62)
      /* Thread completes */
      .to(stepsThreadPath, { strokeDashoffset: 0, duration: 0.16, ease: 'none' }, 0.77)
      /* Footer fades in */
      .to('.how__footer', { autoAlpha: 1, duration: 0.10, ease: EASE.settle }, 0.90);

    /* ── Section headlines — line-masked reveals ── */
    splits.push(...lineReveal('#recognition-heading', '.section-recognition'));
    splits.push(...lineReveal('.section-reframe h2',  '.section-reframe'));
    splits.push(...lineReveal('#how-heading',          '.section-how'));
    splits.push(...lineReveal('#proof-heading',        '.section-proof'));
    splits.push(...lineReveal('#cta-heading',          '.section-cta'));

    /* ── Pain items — SplitText word-reveal ── */
    document.querySelectorAll('.pain-item').forEach((item) => {
      const split = new SplitText(item, { type: 'words' });
      splits.push(split);
      item.style.overflow = 'hidden';
      gsap.from(split.words, {
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        y: '120%', opacity: 0,
        duration: 0.55, stagger: 0.03, ease: EASE.settle,
      });
    });

    /* ── Proof — theatrical quote marks + blockquote line-reveal ── */
    gsap.from('.quote-mark--open', {
      scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
      scale: 0.6, opacity: 0, rotation: -8,
      transformOrigin: 'bottom left',
      duration: 0.75, ease: EASE.spring,
      onComplete() {
        gsap.to('.quote-mark--open', {
          y: '+=4', rotation: '+=1',
          duration: 5.5, repeat: -1, yoyo: true, ease: EASE.drift,
        });
      },
    });

    gsap.from('.quote-mark--close', {
      scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
      scale: 0.6, opacity: 0, rotation: 8,
      transformOrigin: 'top right',
      duration: 0.75, ease: EASE.spring,
      delay: 0.15,
      /* No idle drift on the close mark — it lands and HOLDS; the open
         mark alone carries the section's ambient life (Chanel rule) */
    });

    /* Blockquote paragraphs — delayed so quote marks appear first */
    splits.push(...lineReveal('.founder-quote blockquote p', '.founder-quote', 0.3));

    /* ── Remaining section reveals ── */
    initCommonSectionReveals();

    /* Cleanup: revert SplitText, kill scrub tweens, restore step visibility */
    return () => {
      splits.forEach((s) => s.revert && s.revert());
      refreshHandlers.forEach((h) => ScrollTrigger.removeEventListener('refreshInit', h));
      /* Kill ambient drift loops spawned inside ScrollTrigger callbacks —
         matchMedia doesn't track tweens created in deferred callbacks */
      gsap.killTweensOf([
        '.recognition-sticky--1', '.recognition-sticky--2', '.recognition-sticky--4',
        '.quote-mark--open', '.quote-mark--close',
      ]);
      gsap.set(['.recognition-sticky--1', '.recognition-sticky--2', '.recognition-sticky--4',
                '.quote-mark--open', '.quote-mark--close'], { clearProps: 'all' });
      gsap.set('.step--1', { clearProps: 'all', rotation: -1   });
      gsap.set('.step--2', { clearProps: 'all', rotation:  1.5 });
      gsap.set('.step--3', { clearProps: 'all', rotation: -1.5 });
      gsap.set('.how__footer', { clearProps: 'all' });
    };
  });

  /* ──────────────────────────────────────────────────────────────
     TIER 2: 768px–1023px — Simplified (no pin, no cross-boundary)
     ────────────────────────────────────────────────────────────── */

  mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
    const splits = [];

    /* Hero dispersal — simpler z-depth scrub over hero height */
    const disperseTargets = [
      { id: '#hero-alarm',   x: -140, y: -180, r: -22 },
      { id: '#hero-invoice', x:  200, y: -120, r:  28 },
      { id: '#hero-cord',    x: -160, y:   90, r:   0 },
      { id: '#hero-coffee',  x:  120, y:  150, r: -14 },
    ];

    const trigger = {
      trigger: '.section-hero',
      scrub: 1.4,
      start: 'top top',
      end: 'bottom top',
      invalidateOnRefresh: true,
    };

    disperseTargets.forEach(({ id, x, y, r }) => {
      const el = document.querySelector(id);
      if (!el) return;
      const m = getLayerMultiplier(el);
      const props = { x: x * m, y: y * m, overwrite: 'auto', scrollTrigger: trigger };
      if (r !== 0) props.rotation = r;
      gsap.to(el, props);
    });

    /* Recognition — simple sticky scatter trigger */
    gsap.from('.recognition-sticky', {
      scrollTrigger: { trigger: '.section-recognition', start: 'top 85%', once: true },
      y: 40, opacity: 0, rotation: -8,
      duration: 0.65, stagger: 0.10, ease: EASE.settle,
    });

    /* How It Works — triggered step reveals + doodle draw */
    doodleDrawOnScroll();

    gsap.from(['.step--1', '.step--2', '.step--3'], {
      scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true },
      y: 50, opacity: 0,
      duration: 0.7, stagger: 0.14, ease: EASE.settle,
      onComplete() {
        gsap.set('.step--1', { rotation: -1 });
        gsap.set('.step--2', { rotation: 1.5 });
        gsap.set('.step--3', { rotation: -1.5 });
      },
    });

    /* Section headlines — line-masked */
    splits.push(...lineReveal('#recognition-heading', '.section-recognition'));
    splits.push(...lineReveal('.section-reframe h2',  '.section-reframe'));
    splits.push(...lineReveal('#how-heading',          '.section-how'));
    splits.push(...lineReveal('#proof-heading',        '.section-proof'));
    splits.push(...lineReveal('#cta-heading',          '.section-cta'));

    /* Pain items — word reveal */
    document.querySelectorAll('.pain-item').forEach((item) => {
      const split = new SplitText(item, { type: 'words' });
      splits.push(split);
      item.style.overflow = 'hidden';
      gsap.from(split.words, {
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        y: '120%', opacity: 0,
        duration: 0.55, stagger: 0.03, ease: EASE.settle,
      });
    });

    /* Proof quote marks */
    gsap.from('.quote-mark--open', {
      scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
      scale: 0.6, opacity: 0, rotation: -8,
      transformOrigin: 'bottom left',
      duration: 0.75, ease: EASE.spring,
    });
    gsap.from('.quote-mark--close', {
      scrollTrigger: { trigger: '.founder-quote', start: 'top 80%', once: true },
      scale: 0.6, opacity: 0, rotation: 8,
      transformOrigin: 'top right',
      duration: 0.75, ease: EASE.spring,
      delay: 0.15,
    });

    splits.push(...lineReveal('.founder-quote blockquote p', '.founder-quote', 0.3));

    initCommonSectionReveals();

    return () => {
      splits.forEach((s) => s.revert && s.revert());
    };
  });

  /* ──────────────────────────────────────────────────────────────
     TIER 3: <768px — Minimal triggered reveals
     ────────────────────────────────────────────────────────────── */

  mm.add('(max-width: 767px)', () => {
    /* Hero — no scrub dispersal on mobile; let objects stay static */

    /* All sections: simple opacity stagger */
    gsap.from('.section-heading', {
      scrollTrigger: { trigger: '.section-recognition', start: 'top 85%', once: true },
      y: 16, opacity: 0, duration: 0.55, ease: EASE.settle,
    });

    gsap.from('.pain-item', {
      scrollTrigger: { trigger: '.pain-list', start: 'top 88%', once: true },
      y: 12, opacity: 0, duration: 0.45, stagger: 0.06, ease: EASE.settle,
    });

    gsap.from('.reframe__inner > *', {
      scrollTrigger: { trigger: '.section-reframe', start: 'top 80%', once: true },
      y: 18, opacity: 0, duration: 0.55, stagger: 0.10, ease: EASE.settle,
    });

    gsap.from(['.step--1', '.step--2', '.step--3'], {
      scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true },
      y: 20, opacity: 0, duration: 0.5, stagger: 0.10, ease: EASE.settle,
    });

    gsap.from('.founder-quote', {
      scrollTrigger: { trigger: '.section-proof', start: 'top 80%', once: true },
      y: 20, opacity: 0, duration: 0.65, ease: EASE.settle,
    });

    gsap.from('.cta__inner > *', {
      scrollTrigger: { trigger: '.section-cta', start: 'top 82%', once: true },
      y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: EASE.settle,
    });

    /* No cleanup needed — no SplitText created */
  });

  /* ================================================================
     SHARED SECTION REVEALS
     Called from tier 1 + tier 2 — elements that are identical across
     both desktop and tablet experiences.
     ================================================================ */

  function initCommonSectionReveals() {
    /* Recognition close paragraph */
    gsap.from('.recognition__close', {
      scrollTrigger: { trigger: '.recognition__close', start: 'top 92%', once: true },
      y: 14, opacity: 0, rotation: -1, duration: 0.55, ease: EASE.settle,
    });

    /* Reframe body copy — block fade (never SplitText on body copy) */
    gsap.from('.reframe__inner > p', {
      scrollTrigger: { trigger: '.section-reframe', start: 'top 78%', once: true },
      y: 18, opacity: 0, duration: 0.6, stagger: 0.12, ease: EASE.settle,
    });

    /* Stat callout — GSAP owns the transform so bake rotation into from-state */
    gsap.from('.stat-callout', {
      scrollTrigger: { trigger: '.stat-callout', start: 'top 85%', once: true },
      y: 28, opacity: 0, rotation: -3,
      duration: 0.7, ease: EASE.settle,
      onComplete() { gsap.set('.stat-callout', { rotation: -1.5 }); },
    });

    /* Stat countup scrub — signature moment for Reframe section */
    const statEl = document.querySelector('.stat-callout__number');
    if (statEl) {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.stat-callout',
          start: 'top 72%',
          end: 'top 28%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        onUpdate() {
          const n = Math.round(counter.val);
          statEl.textContent = n < 10 ? `0–${n} hrs` : `10–${n} hrs`;
        },
      });
    }

    gsap.from('.reframe__transition', {
      scrollTrigger: { trigger: '.reframe__transition', start: 'top 90%', once: true },
      y: 14, opacity: 0, duration: 0.5, ease: EASE.settle,
    });

    /* Proof — testimonial placeholder */
    gsap.from('.testimonial-placeholder', {
      scrollTrigger: { trigger: '.testimonial-placeholder', start: 'top 88%', once: true },
      y: 20, opacity: 0, rotation: -2,
      duration: 0.6, ease: EASE.settle,
      onComplete() { gsap.set('.testimonial-placeholder', { rotation: -0.8 }); },
    });

    /* CTA inner (body copy + form) */
    gsap.from('.cta__inner > *:not(h2)', {
      scrollTrigger: { trigger: '.section-cta', start: 'top 82%', once: true },
      y: 22, opacity: 0, duration: 0.6, stagger: 0.10, ease: EASE.settle,
    });

    /* How It Works guarantee line */
    gsap.from('.how__guarantee', {
      scrollTrigger: { trigger: '.section-how', start: 'top 82%', once: true },
      y: 14, opacity: 0, duration: 0.5, ease: EASE.settle,
    });
  }

  /* ================================================================
     DOODLE DRAW ON SCROLL (tablet tier — no pin)
     Each step's decorative path draws as the card scrolls into view.
     ================================================================ */

  function doodleDrawOnScroll() {
    ['.step--1', '.step--2', '.step--3'].forEach((sel, i) => {
      const path = document.querySelector(`${sel} .step__doodle-path`);
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: EASE.settle,
        scrollTrigger: {
          trigger: sel,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.12,
      });
    });

    const threadPath = document.querySelector('.steps-thread-path');
    if (threadPath) {
      const len = threadPath.getTotalLength();
      gsap.set(threadPath, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(threadPath, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: EASE.settle,
        scrollTrigger: {
          trigger: '.steps',
          start: 'top 80%',
          once: true,
        },
      });
    }
  }

  /* ================================================================
     SCROLL-VELOCITY MARQUEE
     ================================================================ */

  (function initMarquee() {
    const marqueeTrack = document.querySelector('.marquee__track');
    if (!marqueeTrack) return;
    marqueeTrack.style.animation = 'none';
    gsap.set(marqueeTrack, { x: 0 });

    let loopWidth = marqueeTrack.scrollWidth / 2;
    /* Re-measure once webfonts land and on ScrollTrigger refresh (resize) */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { loopWidth = marqueeTrack.scrollWidth / 2; });
    }
    ScrollTrigger.addEventListener('refresh', () => {
      loopWidth = marqueeTrack.scrollWidth / 2;
    });

    const BASE           = 1.2;
    const VELOCITY_SCALE = 0.003;
    const DECAY          = 0.08;
    const RETURN         = 0.015;

    let x = 0, speed = BASE, target = BASE;

    gsap.ticker.add(() => {
      const vel = Math.abs(scrollVelocity);
      target = BASE + vel * VELOCITY_SCALE;
      speed  += (target - speed) * DECAY;
      target += (BASE - target) * RETURN;
      x -= speed;
      if (x <= -loopWidth) x += loopWidth;
      gsap.set(marqueeTrack, { x });
    });
  })();

  /* ================================================================
     MICRO-INTERACTION LAYER
     7 systems — gated by their own matchMedia / hover checks.
     Run outside gsap.matchMedia() so they don't re-init on resize.
     ================================================================ */

  const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── 1. Custom cursor ────────────────────────────────────────── */

  if (isHoverDevice) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
      document.body.classList.add('has-custom-cursor');

      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
      const LERP = 0.12;
      let wobbleTween = null;
      let cursorVisible = false;

      let ringRaf = 0;

      function tickRing() {
        ringRaf = 0;
        ringX += (mouseX - ringX) * LERP;
        ringY += (mouseY - ringY) * LERP;
        gsap.set(ring, { x: ringX, y: ringY });
        /* Stop the loop once the ring has settled; mousemove restarts it */
        if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
          ringRaf = requestAnimationFrame(tickRing);
        }
      }

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(dot, { x: mouseX, y: mouseY });
        if (!ringRaf) ringRaf = requestAnimationFrame(tickRing);
        if (!cursorVisible) {
          cursorVisible = true;
          gsap.to([dot, ring], { opacity: 1, duration: 0.25, ease: EASE.snap });
        }
      });

      document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.2, ease: EASE.snap });
      });
      document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.2, ease: EASE.snap });
      });

      document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('cursor--link');
          ring.classList.add('cursor--link');
          gsap.to(ring, { scale: 1.5, duration: 0.2, ease: EASE.snap, overwrite: 'auto' });
          gsap.to(dot,  { scale: 1.2, duration: 0.2, ease: EASE.snap, overwrite: 'auto' });
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('cursor--link');
          ring.classList.remove('cursor--link');
          gsap.to(ring, { scale: 1, duration: 0.2, ease: EASE.snap, overwrite: 'auto' });
          gsap.to(dot,  { scale: 1, duration: 0.2, ease: EASE.snap, overwrite: 'auto' });
        });
      });

      document.querySelectorAll('[data-hover]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          if (wobbleTween) wobbleTween.kill();
          wobbleTween = gsap.to(ring, {
            rotation: '+=2', duration: 0.4, yoyo: true, repeat: -1,
            ease: EASE.snap, overwrite: 'auto',
          });
        });
        el.addEventListener('mouseleave', () => {
          if (wobbleTween) { wobbleTween.kill(); wobbleTween = null; }
          gsap.to(ring, { rotation: 0, duration: 0.3, ease: EASE.snap, overwrite: 'auto' });
        });
      });
    }
  }

  /* ── 2. Magnetic elements ────────────────────────────────────── */

  if (isHoverDevice) {
    const magneticEls = [...document.querySelectorAll('.cta-button, .nav__cta')].map((el) => ({
      el,
      setX: gsap.quickTo(el, 'x', { duration: 0.3, ease: EASE.snap }),
      setY: gsap.quickTo(el, 'y', { duration: 0.3, ease: EASE.snap }),
    }));

    document.addEventListener('mousemove', (e) => {
      magneticEls.forEach(({ el, setX, setY }) => {
        const r    = el.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = e.clientX - cx;
        const dy   = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxPull = el.classList.contains('cta-button--form') ? 4 : 8;

        if (dist < 80 && dist > 0) {
          const pull = ((80 - dist) / 80) * maxPull;
          setX((dx / dist) * pull);
          setY((dy / dist) * pull);
          el._mag = true;
        } else if (el._mag) {
          el._mag = false;
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: EASE.spring });
        }
      });
    });
  }

  /* ── 3. Link ink underlines ──────────────────────────────────── */

  document.querySelectorAll('.nav__cta, .cta__fallback, .footer__wordmark').forEach((link) => {
    const ink = document.createElement('span');
    ink.className = 'link-ink';
    ink.setAttribute('aria-hidden', 'true');
    link.style.position = 'relative';
    link.appendChild(ink);

    link.addEventListener('mouseenter', () => {
      gsap.fromTo(ink,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.3, ease: EASE.snap }
      );
    });
    link.addEventListener('mouseleave', () => {
      gsap.set(ink, { transformOrigin: 'right' });
      gsap.to(ink, { scaleX: 0, duration: 0.25, ease: EASE.snap });
    });
  });

  /* ── 4. CTA button interactions ──────────────────────────────── */

  document.querySelectorAll('.cta-button').forEach((btn) => {
    btn.addEventListener('mouseenter', () =>
      gsap.to(btn, { scale: 1.04, y: -1, duration: 0.35, ease: EASE.spring, overwrite: 'auto' })
    );
    btn.addEventListener('mouseleave', () =>
      gsap.to(btn, { scale: 1, y: 0, duration: 0.35, ease: EASE.spring, overwrite: 'auto' })
    );
    btn.addEventListener('mousedown', () =>
      gsap.to(btn, { scale: 0.97, y: 0, duration: 0.08, ease: EASE.snap, overwrite: 'auto' })
    );
    btn.addEventListener('mouseup', () =>
      gsap.to(btn, { scale: 1.04, y: -1, duration: 0.35, ease: EASE.spring, overwrite: 'auto' })
    );
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ')
        gsap.to(btn, { scale: 0.97, duration: 0.08, ease: EASE.snap, overwrite: 'auto' });
    });
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ')
        gsap.to(btn, { scale: 1, duration: 0.35, ease: EASE.spring, overwrite: 'auto' });
    });
  });

  /* Mobile CTA throb */
  if (window.matchMedia('(hover: none)').matches) {
    gsap.to('.cta-button--form', {
      scale: 1.025, duration: 2.5, repeat: -1, yoyo: true, ease: EASE.drift,
    });
  }

  /* ── 5. Form field life ──────────────────────────────────────── */

  document.querySelectorAll('.form-group').forEach((group) => {
    const input = group.querySelector('input');
    const label = group.querySelector('label');
    if (!input || !label) return;

    const underline = document.createElement('span');
    underline.className = 'field-underline';
    underline.setAttribute('aria-hidden', 'true');
    group.appendChild(underline);

    const check = document.createElement('span');
    check.className = 'field-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';
    gsap.set(check, { scale: 0 });
    group.appendChild(check);

    let interacted = false;

    input.addEventListener('focus', () => {
      gsap.to(label, { y: -2, duration: 0.25, ease: EASE.snap });
      gsap.set(underline, { transformOrigin: 'left' });
      gsap.to(underline, { scaleX: 1, duration: 0.3, ease: EASE.snap });
    });

    input.addEventListener('blur', () => {
      gsap.to(label, { y: 0, duration: 0.25, ease: EASE.settle });
      gsap.set(underline, { transformOrigin: 'right' });
      gsap.to(underline, { scaleX: 0, duration: 0.25, ease: EASE.snap });

      if (!interacted && input.value.trim()) interacted = true;

      if (interacted && input.validity.valid && input.value.trim()) {
        gsap.fromTo(check,
          { scale: 0, rotation: -15 },
          { scale: 1, rotation: 0, duration: 0.4, ease: EASE.spring }
        );
      } else {
        gsap.to(check, { scale: 0, duration: 0.2, ease: EASE.snap });
      }
    });

    input.addEventListener('input', () => { interacted = true; });
  });

  /* ── 6. Illustrated object hover ────────────────────────────── */

  if (isHoverDevice) {
    document.querySelectorAll('[data-hover]').forEach((el) => {
      el.style.pointerEvents = 'auto';
      let hoverTl = null;

      el.addEventListener('mouseenter', () => {
        const baseRot = gsap.getProperty(el, 'rotation');
        const baseY   = gsap.getProperty(el, 'y');
        el._base = { rotation: baseRot, y: baseY };

        if (hoverTl) hoverTl.kill();

        switch (el.dataset.hover) {
          case 'shake':
            hoverTl = gsap.timeline()
              .to(el, { rotation: '+=5',  duration: 0.06, ease: EASE.snap })
              .to(el, { rotation: '-=10', duration: 0.10, ease: EASE.snap })
              .to(el, { rotation: '+=5',  duration: 0.10, ease: EASE.snap });
            break;
          case 'lift':
            hoverTl = gsap.timeline()
              .to(el, { y: '-=8', duration: 0.25, ease: EASE.snap });
            break;
          case 'flutter':
            hoverTl = gsap.timeline()
              .to(el, { rotation: '+=2', duration: 0.15, ease: EASE.snap })
              .to(el, { rotation: '-=4', duration: 0.20, ease: EASE.snap })
              .to(el, { rotation: '+=2', duration: 0.20, ease: EASE.snap });
            break;
          case 'steam':
            hoverTl = gsap.timeline()
              .to(el, { y: '-=10', duration: 0.40, ease: EASE.snap })
              .to(el, { y: '+=10', duration: 0.50, ease: EASE.settle });
            break;
        }
      });

      el.addEventListener('mouseleave', () => {
        if (hoverTl) { hoverTl.kill(); hoverTl = null; }
        gsap.to(el, {
          rotation: el._base?.rotation ?? 0,
          y:        el._base?.y        ?? 0,
          duration: 0.4, ease: EASE.settle, overwrite: 'auto',
        });
      });
    });
  }

  /* ── 7. Scroll-velocity marquee already init'd above ─────────── */

  /* ================================================================
     FORM SUBMISSION
     ================================================================ */

  initFormHandler();

  function initFormHandler() {
    const form     = document.getElementById('audit-form');
    const resultEl = document.getElementById('form-result');
    if (!form || !resultEl) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn     = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      const formData = new FormData(form);

      /* Require a solved captcha — Web3Forms accepts token-less posts,
         so the gate has to live here */
      const captchaToken = formData.get('h-captcha-response');
      if (!captchaToken) {
        showFormError('Please tick the captcha box first.');
        submitBtn.textContent = originalLabel;
        submitBtn.disabled    = false;
        return;
      }

      const payload  = JSON.stringify(Object.fromEntries(formData));

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: payload,
        });

        const data = await response.json();

        if (data.success) {
          if (!prefersReducedMotion) {
            await gsap.to(form, { opacity: 0, y: -10, duration: 0.3, ease: EASE.snap }).then();
          }

          form.style.display = 'none';
          resultEl.removeAttribute('hidden');
          resultEl.className   = 'form-result form-result--success';
          resultEl.textContent = "You're in. We'll be in touch shortly.";

          if (!prefersReducedMotion) {
            gsap.fromTo(resultEl,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.5, ease: EASE.settle }
            );
          }

          form.reset();
        } else {
          showFormError('Something went wrong. Try emailing us at hello@kylixai.com');
          submitBtn.textContent = originalLabel;
          submitBtn.disabled    = false;
        }
      } catch {
        showFormError('Connection error. Please try again or email hello@kylixai.com');
        submitBtn.textContent = originalLabel;
        submitBtn.disabled    = false;
      }
    });

    function showFormError(message) {
      resultEl.removeAttribute('hidden');
      resultEl.className   = 'form-result form-result--error';
      resultEl.textContent = message;

      if (!prefersReducedMotion) {
        gsap.to(resultEl, {
          keyframes: [
            { x: 2,  duration: 0.07 },
            { x: -2, duration: 0.07 },
            { x: 2,  duration: 0.07 },
            { x: -2, duration: 0.07 },
            { x: 0,  duration: 0.08 },
          ],
          ease: EASE.snap,
          clearProps: 'x',
        });
      }
    }
  }

})();


/* ─── HERO GL — paper texture displacement ─────────────────────────
   Progressive enhancement only. Absent on: touch devices, reduced-motion,
   WebGL unavailable. RAF paused when cursor idle >4s or hero out of view.
   No external libraries — raw WebGL, ~3.5 kb.
──────────────────────────────────────────────────────────────────── */
(function initHeroGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  var hero = document.querySelector('.section-hero');
  if (!hero) return;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;' +
    'z-index:0;pointer-events:none;display:block;';
  hero.prepend(canvas);

  var gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });
  if (!gl) { canvas.remove(); return; }

  /* ── Shaders ─────────────────────────────────────────────────── */
  var VERT = [
    'attribute vec2 a_pos;',
    'void main(){gl_Position=vec4(a_pos,0.,1.);}',
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform vec2  u_res;',
    'uniform vec2  u_ptr;',
    'uniform float u_time;',
    'const vec3 C_GND =vec3(0.937,0.918,0.839);',
    'const vec3 C_DRK =vec3(0.784,0.725,0.604);',
    'const vec3 C_LIT =vec3(0.961,0.945,0.910);',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float noise(vec2 p){',
    '  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),',
    '             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){',
    '  float v=0.,a=.5;',
    '  mat2 r=mat2(.878,.479,-.479,.878);',
    '  for(int i=0;i<4;i++){v+=a*noise(p);p=r*p*2.1+vec2(100.);a*=.5;}',
    '  return v;}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/u_res;',
    '  vec2 toPtr=(uv-u_ptr)*vec2(u_res.x/u_res.y,1.);',
    '  float d=length(toPtr);',
    '  float ripple=sin(d*22.-u_time*2.2)*0.005*smoothstep(0.5,0.,d);',
    '  vec2 s=uv+normalize(toPtr+0.0001)*ripple;',
    '  float g=fbm(s*8.+vec2(u_time*0.009,0.));',
    '  vec3 c=mix(C_DRK,C_LIT,smoothstep(0.3,0.7,g));',
    '  c=mix(C_GND,c,0.18);',
    '  gl_FragColor=vec4(c,1.);}',
  ].join('\n');

  /* ── Compile helpers ─────────────────────────────────────────── */
  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s); return null;
    }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.remove(); return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);

  /* ── Full-screen quad (2 triangles) ─────────────────────────── */
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1,  1,  1,
    -1, -1,  1,  1, -1,  1,
  ]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* ── Uniforms ────────────────────────────────────────────────── */
  var uRes  = gl.getUniformLocation(prog, 'u_res');
  var uPtr  = gl.getUniformLocation(prog, 'u_ptr');
  var uTime = gl.getUniformLocation(prog, 'u_time');

  /* ── Resize ──────────────────────────────────────────────────── */
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    var w = hero.offsetWidth, h = hero.offsetHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  resize();
  var ro = new ResizeObserver(resize);
  ro.observe(hero);

  // Draw one frame immediately so canvas shows parchment on load (not black)
  gl.uniform2f(uPtr, 0.5, 0.5);
  gl.uniform1f(uTime, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  /* ── Pointer tracking ────────────────────────────────────────── */
  var ptrX = 0.5, ptrY = 0.5;
  var tgtX = 0.5, tgtY = 0.5;
  var lastMove = Date.now(); // non-zero so IntersectionObserver starts RAF on load
  var rafId = 0;
  var heroVisible = false;

  function onMove(e) {
    var r = hero.getBoundingClientRect();
    tgtX = (e.clientX - r.left) / r.width;
    tgtY = 1.0 - (e.clientY - r.top)  / r.height;
    lastMove = Date.now();
    if (!rafId) tick(performance.now());
  }
  hero.addEventListener('mousemove', onMove);

  /* ── RAF loop ────────────────────────────────────────────────── */
  var IDLE_MS = 4000;
  function tick(t) {
    rafId = 0;
    ptrX += (tgtX - ptrX) * 0.08;
    ptrY += (tgtY - ptrY) * 0.08;
    gl.uniform2f(uPtr, ptrX, ptrY);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    /* Pause when cursor idle >4s — mousemove restarts the loop */
    if (heroVisible && Date.now() - lastMove < IDLE_MS) {
      rafId = requestAnimationFrame(tick);
    }
  }

  /* ── IntersectionObserver ────────────────────────────────────── */
  var io = new IntersectionObserver(function(entries) {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !rafId) {
      rafId = requestAnimationFrame(tick);
    } else if (!heroVisible && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }, { threshold: 0 });
  io.observe(hero);
}());
