/* ================================================================
   KylixAI — main.js v3.0
   Multi-page site: shared nav/footer interactions + scroll reveals
   ================================================================ */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ── 1. Nav: mobile overlay + dropdown ────────────────────────── */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (nav && navToggle && navLinks) {
    const focusableSel = 'a, button';
    let lastFocused = null;

    const openMenu = () => {
      lastFocused = document.activeElement;
      nav.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-locked');
      const items = navLinks.querySelectorAll(focusableSel);
      if (!reduceMotion) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out', stagger: 0.045, delay: 0.05 }
        );
      } else {
        gsap.set(items, { opacity: 1, y: 0 });
      }
      const first = navLinks.querySelector(focusableSel);
      if (first) setTimeout(() => {
        if (nav.classList.contains('is-open')) first.focus({ preventScroll: true });
      }, 300);
    };

    const closeMenu = () => {
      nav.classList.remove('is-open');
      nav.querySelectorAll('.nav__item--dropdown.is-open').forEach((d) => {
        d.classList.remove('is-open');
        d.querySelector('.nav__link')?.setAttribute('aria-expanded', 'false');
      });
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-locked');
      if (lastFocused) lastFocused.focus({ preventScroll: true });
    };

    navToggle.addEventListener('click', () => {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (event) => {
        const dropdownTrigger = a.closest('.nav__item--dropdown') && a.classList.contains('nav__link');
        if (dropdownTrigger) return;
        if (nav.classList.contains('is-open')) closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !nav.classList.contains('is-open')) return;
      closeMenu();
    });

    navLinks.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      const items = Array.from(navLinks.querySelectorAll(focusableSel));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  document.querySelectorAll('.nav__item--dropdown > .nav__link').forEach((trigger) => {
    const item = trigger.closest('.nav__item--dropdown');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return;
      e.preventDefault();
      const expanded = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(expanded));
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        e.stopPropagation();
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  /* ── 2. Grain overlay ──────────────────────────────────────────── */
  if (!document.querySelector('.grain')) {
    const grain = document.createElement('div');
    grain.className = 'grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  /* ── 3. Custom cursor ──────────────────────────────────────────── */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('has-custom-cursor');

    /* One ticker lerps both elements. The mousemove handler only records
       coordinates — allocating a tween per pointer event (100+/sec) was
       the single largest source of main-thread churn on this page. */
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0, moved = false;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY; moved = true;
    }, { passive: true });

    gsap.ticker.add(() => {
      if (!moved) return;
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      gsap.set(dot, { x: dx, y: dy, opacity: 1 });
      gsap.set(ring, { x: rx, y: ry, opacity: 1 });
    });

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => { dot.classList.add('cursor--link'); ring.classList.add('cursor--link'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('cursor--link'); ring.classList.remove('cursor--link'); });
    });
  }

  /* ── 4. Magnetic buttons ───────────────────────────────────────── */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn--primary, .nav__cta').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.4, duration: 0.3, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ── 5. Marquee (trusted-by strip) ────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    if (reduceMotion) {
      marqueeTrack.style.animation = 'none';
      marqueeTrack.classList.add('marquee__track--static');
    } else {
      marqueeTrack.style.animation = 'none';
      gsap.set(marqueeTrack, { x: 0 });
      let loopWidth = marqueeTrack.scrollWidth / 2;
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { loopWidth = marqueeTrack.scrollWidth / 2; });
      }
      window.addEventListener('resize', () => { loopWidth = marqueeTrack.scrollWidth / 2; });

      let x = 0;
      let running = true;
      const marqueeWrap = marqueeTrack.closest('.marquee');
      const speed = marqueeWrap && marqueeWrap.dataset.speed ? parseFloat(marqueeWrap.dataset.speed) : 1.15;
      if (marqueeWrap) {
        marqueeWrap.addEventListener('mouseenter', () => { running = false; });
        marqueeWrap.addEventListener('mouseleave', () => { running = true; });
        const io = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) running = false;
          else if (!marqueeWrap.matches(':hover')) running = true;
        });
        io.observe(marqueeWrap);
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) running = false;
      });

      /* Time-based, not per-frame: `x -= speed` every tick runs twice as fast
         on a 120Hz display as on 60Hz. `speed` is px per 60Hz frame, scaled
         by the real elapsed time so the strip moves at one rate everywhere. */
      let lastTick = 0;
      gsap.ticker.add((time) => {
        const dt = lastTick ? Math.min(time - lastTick, 0.1) : 1 / 60;
        lastTick = time;
        if (!running) return;
        x -= speed * dt * 60;
        if (Math.abs(x) >= loopWidth) x = 0;
        gsap.set(marqueeTrack, { x });
      });
    }
  }

  /* ── 6. Scroll reveal — cards & sections ──────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.card, .pricing-card, .team-card, .philosophy, .cta-band'
  );

  if (reduceMotion) {
    revealTargets.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
  } else {
    revealTargets.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
  }

  /* ── 7. Hero entrance ──────────────────────────────────────────── */
  const heroHeadline = document.querySelector('.hero__headline');
  const heroSub = document.querySelector('.hero__sub');
  const heroActions = document.querySelector('.hero__actions');

  if (heroHeadline) {
    if (reduceMotion) {
      gsap.set([heroHeadline, heroSub, heroActions], { opacity: 1, y: 0 });
    } else {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(heroHeadline, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(heroSub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo(heroActions, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
    }
  }

  /* ── 8. Logo signature animation — letters rise, signal sweeps, nodes ignite ── */
  document.querySelectorAll('.kylix-logo').forEach((logo) => {
    const glyphs = logo.querySelectorAll('.kylix-logo__glyph');
    const sweep = logo.querySelector('.kylix-logo__sweep');
    const nodes = logo.querySelectorAll('.kylix-logo__node');

    if (reduceMotion) {
      gsap.set(glyphs, { opacity: 1, y: 0 });
      if (sweep) gsap.set(sweep, { opacity: 0 });
      gsap.set(nodes, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(glyphs, { opacity: 0, y: 6 });
    gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: 'center' });
    if (sweep) {
      const len = sweep.getTotalLength ? sweep.getTotalLength() : 400;
      gsap.set(sweep, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    }

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(glyphs, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.04 }, 0);
    if (sweep) {
      tl.to(sweep, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.4)
        .to(sweep, { opacity: 0, duration: 0.3 }, 1.3);
    }
    nodes.forEach((node, i) => {
      const t = i === 0 ? 0.5 : 1.1;
      tl.to(node, { opacity: 1, scale: 1.4, duration: 0.15, ease: 'power2.out' }, t)
        .to(node, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' }, t + 0.15)
        .call(() => node.classList.add('is-lit'), null, t)
        .call(() => node.classList.remove('is-lit'), null, t + 0.6);
    });
  });

  /* ── 9. Team card click-to-reveal (About page) ────────────────── */
  document.querySelectorAll('.team-card[data-expandable]').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('is-expanded'));
  });

  /* ── 10. Spotlight cards — pointer glow + hover lift ───────────── */
  const spotlightCards = document.querySelectorAll('.card--spotlight');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    spotlightCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      card.addEventListener('mouseenter', () => {
        document.querySelectorAll('.card--spotlight').forEach((c) => {
          if (c !== card) c.classList.add('is-dimmed');
        });
      });
      card.addEventListener('mouseleave', () => {
        document.querySelectorAll('.card--spotlight').forEach((c) => c.classList.remove('is-dimmed'));
      });
    });
  } else if (spotlightCards.length) {
    /* Mobile: nearest-to-center card gets the active treatment on scroll */
    const setActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closest = null;
      let closestDist = Infinity;
      spotlightCards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < closestDist) { closestDist = dist; closest = card; }
      });
      spotlightCards.forEach((c) => c.classList.toggle('is-active', c === closest));
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { setActive(); ticking = false; });
    }, { passive: true });
    setActive();
  }

  /* ── 11. Sticky mobile "Book a Call" CTA ───────────────────────── */
  const mobileCta = document.querySelector('.mobile-cta');
  const hero = document.querySelector('.hero');
  const footerCta = document.querySelector('.cta-band');

  if (mobileCta && hero) {
    let finalCtaVisible = false;
    let footerVisible = false;
    const heroIo = new IntersectionObserver(([entry]) => {
      mobileCta.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0 });
    heroIo.observe(hero);

    const footer = document.querySelector('footer');
    if (footerCta || footer) {
      const finalContentIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === footerCta) finalCtaVisible = entry.isIntersecting;
          if (entry.target === footer) footerVisible = entry.isIntersecting;
        });
        mobileCta.classList.toggle('is-hidden-near-cta', finalCtaVisible || footerVisible);
      }, { threshold: 0.15 });
      if (footerCta) finalContentIo.observe(footerCta);
      if (footer) finalContentIo.observe(footer);
    }
  }

  /* ── 12b. Web3Forms quote form ─────────────────────────────────── */
  document.querySelectorAll('form[data-web3forms]').forEach((form) => {
    const status = form.querySelector('.form__status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) { status.textContent = 'Sending…'; status.className = 'form__status'; }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();
        if (data.success) {
          if (status) {
            status.textContent = "Thanks — we'll be in touch shortly.";
            status.className = 'form__status form__status--success';
          }
          form.reset();
        } else {
          if (status) {
            status.textContent = 'Something went wrong. Email us directly at hello@kylixai.com';
            status.className = 'form__status form__status--error';
          }
        }
      } catch {
        if (status) {
          status.textContent = 'Connection error. Please try again or email hello@kylixai.com';
          status.className = 'form__status form__status--error';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  /* ── 13. Step-list reveal (numbered process rows) ────────────────── */
  document.querySelectorAll('.step').forEach((el) => {
    if (reduceMotion) { el.classList.add('is-drawn'); return; }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => el.classList.add('is-drawn'),
    });
  });

  /* ── 12. Thread-line section dividers draw on scroll ───────────── */
  document.querySelectorAll('.thread-divider').forEach((el) => {
    if (reduceMotion) { gsap.set(el, { scaleX: 1 }); return; }
    gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });
})();
