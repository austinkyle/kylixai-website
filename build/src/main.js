/* ================================================================
   KylixAI — main.js v3
   GSAP orchestration: page-load reveal, scroll animations,
   hero illustration dispersal, form submission.
   All animation gated behind prefers-reduced-motion.
   ================================================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ─── Page-load orchestration ─────────────────────────────────── */

  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
      .from('.hero__badge', {
        y: 14, opacity: 0, duration: 0.5, delay: 0.1
      })
      .from('.hero__headline', {
        y: 36, opacity: 0, duration: 0.75, ease: 'expo.out'
      }, '-=0.20')
      .from('.hero__sub', {
        y: 20, opacity: 0, duration: 0.6
      }, '-=0.40')
      .from('.cta-button--hero, .cta-button:not(.cta-button--form)', {
        scale: 0.90, opacity: 0,
        duration: 0.6, ease: 'back.out(1.6)'
      }, '-=0.35')
      .from('.hero__reassurance', {
        opacity: 0, duration: 0.4
      }, '-=0.25');

    /* Hero illustration objects fade in staggered */
    tl.from(
      ['#hero-alarm', '#hero-invoice', '#hero-cord', '#hero-coffee', '#hero-sticky'],
      { opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' },
      0.4
    );
  }

  /* ─── Hero dispersal — chaos objects drift outward on scroll ──── */

  if (!prefersReducedMotion) {
    const heroSection = document.querySelector('.section-hero');
    if (heroSection) {
      const disperseConfig = { trigger: '.section-hero', scrub: 1.4, start: 'top top', end: 'bottom top' };

      const alarmEl  = document.querySelector('#hero-alarm');
      const invoiceEl = document.querySelector('#hero-invoice');
      const cordEl   = document.querySelector('#hero-cord');
      const coffeeEl = document.querySelector('#hero-coffee');
      const stickyEl = document.querySelector('#hero-sticky');

      if (alarmEl)   gsap.to(alarmEl,   { x: -80, y: -110, rotation: -22, scrollTrigger: disperseConfig });
      if (invoiceEl) gsap.to(invoiceEl, { x: 120, y: -70,  rotation: 28,  scrollTrigger: disperseConfig });
      if (cordEl)    gsap.to(cordEl,    { x: -100, y: 55,               scrollTrigger: disperseConfig });
      if (coffeeEl)  gsap.to(coffeeEl,  { x: 70,  y: 90,  rotation: -14, scrollTrigger: disperseConfig });
      if (stickyEl)  gsap.to(stickyEl,  { x: 80,  autoAlpha: 0,         scrollTrigger: disperseConfig });
    }
  }

  /* ─── ScrollTrigger — section reveals ─────────────────────────── */

  if (!prefersReducedMotion) {
    /* Recognition heading */
    gsap.from('.section-heading', {
      scrollTrigger: { trigger: '.section-recognition', start: 'top 85%', once: true },
      y: 20, opacity: 0, duration: 0.6,
    });

    /* Pain items stagger */
    gsap.from('.pain-item', {
      scrollTrigger: { trigger: '.pain-list', start: 'top 88%', once: true },
      y: 16, opacity: 0,
      duration: 0.5, stagger: 0.07,
    });

    /* Recognition close */
    gsap.from('.recognition__close', {
      scrollTrigger: { trigger: '.recognition__close', start: 'top 92%', once: true },
      y: 14, opacity: 0, duration: 0.55,
    });

    /* Reframe inner */
    gsap.from('.reframe__inner > *', {
      scrollTrigger: { trigger: '.section-reframe', start: 'top 80%', once: true },
      y: 22, opacity: 0,
      duration: 0.65, stagger: 0.12,
    });

    /* How It Works */
    gsap.from('.section-how h2, .how__guarantee', {
      scrollTrigger: { trigger: '.section-how', start: 'top 82%', once: true },
      y: 18, opacity: 0, duration: 0.6, stagger: 0.10,
    });

    gsap.from('.step', {
      scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true },
      y: 36, opacity: 0,
      duration: 0.6, stagger: 0.15,
    });

    gsap.from('.how__footer', {
      scrollTrigger: { trigger: '.how__footer', start: 'top 92%', once: true },
      opacity: 0, duration: 0.5,
    });

    /* Proof — theatrical quote marks scale in */
    gsap.from('.founder-quote', {
      scrollTrigger: { trigger: '.section-proof', start: 'top 80%', once: true },
      y: 28, opacity: 0, duration: 0.75, ease: 'power3.out',
    });

    gsap.from('.testimonial-placeholder', {
      scrollTrigger: { trigger: '.testimonial-placeholder', start: 'top 88%', once: true },
      y: 20, opacity: 0, duration: 0.6,
    });

    /* CTA section */
    gsap.from('.cta__inner > *', {
      scrollTrigger: { trigger: '.section-cta', start: 'top 82%', once: true },
      y: 22, opacity: 0,
      duration: 0.6, stagger: 0.10,
    });

    /* Ambient float loops on illustration objects */
    document.querySelectorAll('.illus-obj').forEach((el, i) => {
      const duration = 4 + (i % 5) * 0.8;
      const yAmount  = 5 + (i % 3) * 2;
      const rAmount  = 1.5 + (i % 4) * 0.5;
      gsap.to(el, {
        y:        `+=${yAmount}`,
        rotation: `+=${rAmount}`,
        duration,
        repeat:   -1,
        yoyo:     true,
        ease:     'sine.inOut',
        delay:    i * 0.3,
      });
    });
  }

  /* ─── CTA button spring hover ──────────────────────────────────── */

  if (!prefersReducedMotion) {
    document.querySelectorAll('.cta-button').forEach(btn => {
      btn.addEventListener('mouseenter', () =>
        gsap.to(btn, { scale: 1.04, duration: 0.35, ease: 'elastic.out(1, 0.5)' })
      );
      btn.addEventListener('mouseleave', () =>
        gsap.to(btn, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' })
      );
    });
  }

  /* ─── Form submission ──────────────────────────────────────────── */

  const form     = document.getElementById('audit-form');
  const resultEl = document.getElementById('form-result');

  if (form && resultEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn   = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const payload  = JSON.stringify(Object.fromEntries(formData));

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: payload,
        });

        const data = await response.json();

        if (data.success) {
          if (!prefersReducedMotion) {
            await gsap.to(form, { opacity: 0, y: -10, duration: 0.3 }).then();
          }

          form.style.display = 'none';
          resultEl.removeAttribute('hidden');
          resultEl.className = 'form-result form-result--success';
          resultEl.textContent = "You're in. We'll be in touch shortly.";

          if (!prefersReducedMotion) {
            gsap.fromTo(
              resultEl,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
          }

          form.reset();
        } else {
          showFormError('Something went wrong. Try emailing us at hello@kylixai.com');
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        }
      } catch {
        showFormError('Connection error. Please try again or email hello@kylixai.com');
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });
  }

  function showFormError(message) {
    resultEl.removeAttribute('hidden');
    resultEl.className = 'form-result form-result--error';
    resultEl.textContent = message;

    if (!prefersReducedMotion) {
      gsap.fromTo(
        resultEl,
        { x: -5 },
        { x: 0, duration: 0.4, ease: 'elastic.out(3, 0.4)', clearProps: 'x' }
      );
    }
  }

})();
