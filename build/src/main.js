/* ================================================================
   KylixAI — main.js
   GSAP orchestration: page-load timeline, ScrollTrigger sections,
   hover states, nav glass, form submission with animated feedback.
   All animation wrapped in prefers-reduced-motion check.
   ================================================================ */

(function () {
  'use strict';

  /* ─── Register plugins ────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ─── Page-load orchestration ─────────────────────────────── */

  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
      .from('.hero__badge', {
        y: 16, opacity: 0, duration: 0.55, delay: 0.10
      })
      .from('.hero__headline', {
        y: 40, opacity: 0, duration: 0.75, ease: 'expo.out'
      }, '-=0.20')
      .from('.hero__sub', {
        y: 22, opacity: 0, duration: 0.60
      }, '-=0.40')
      .from('.cta-button--hero', {
        scale: 0.88, opacity: 0,
        duration: 0.65, ease: 'elastic.out(1, 0.5)'
      }, '-=0.35')
      .from('.hero__reassurance', {
        opacity: 0, duration: 0.45
      }, '-=0.30')
      .from('.blob', {
        opacity: 0, scale: 0.75,
        duration: 1.6, stagger: 0.25, ease: 'power2.out'
      }, 0.35)
      .from('.flow-card', {
        opacity: 0, scale: 0.80,
        duration: 0.55, stagger: 0.10, ease: 'back.out(1.4)'
      }, '-=1.0')
      .from('.flow-hub', {
        opacity: 0, scale: 0.60,
        duration: 0.65, ease: 'elastic.out(1, 0.5)'
      }, '-=0.30');
  }

  /* ─── ScrollTrigger — section reveals ─────────────────────── */

  if (!prefersReducedMotion) {
    /* Recognition — heading */
    gsap.from('.section-recognition h2', {
      scrollTrigger: {
        trigger: '.section-recognition',
        start: 'top 85%',
        once: true,
      },
      y: 20, opacity: 0, duration: 0.6,
    });

    /* Recognition — pain cards stagger */
    gsap.from('.pain-card', {
      scrollTrigger: {
        trigger: '.pain-grid',
        start: 'top 85%',
        once: true,
      },
      y: 28, opacity: 0,
      duration: 0.55, stagger: 0.07,
    });

    /* Recognition — closing beat */
    gsap.from('.recognition__close', {
      scrollTrigger: {
        trigger: '.recognition__close',
        start: 'top 92%',
        once: true,
      },
      y: 16, opacity: 0, duration: 0.6,
    });

    /* Reframe — everything staggered */
    gsap.from('.reframe__inner > *', {
      scrollTrigger: {
        trigger: '.section-reframe',
        start: 'top 80%',
        once: true,
      },
      y: 24, opacity: 0,
      duration: 0.65, stagger: 0.12,
    });

    /* How It Works — heading + guarantee */
    gsap.from('.section-how h2, .how__guarantee', {
      scrollTrigger: {
        trigger: '.section-how',
        start: 'top 82%',
        once: true,
      },
      y: 20, opacity: 0, duration: 0.6, stagger: 0.10,
    });

    /* How It Works — steps */
    gsap.from('.step', {
      scrollTrigger: {
        trigger: '.steps',
        start: 'top 85%',
        once: true,
      },
      y: 40, opacity: 0,
      duration: 0.65, stagger: 0.14,
    });

    /* How It Works — footer note */
    gsap.from('.how__footer', {
      scrollTrigger: {
        trigger: '.how__footer',
        start: 'top 92%',
        once: true,
      },
      opacity: 0, duration: 0.5,
    });

    /* Proof */
    gsap.from('.section-proof h2', {
      scrollTrigger: {
        trigger: '.section-proof',
        start: 'top 84%',
        once: true,
      },
      y: 20, opacity: 0, duration: 0.6,
    });

    gsap.from('.founder-quote, .testimonial-placeholder', {
      scrollTrigger: {
        trigger: '.section-proof',
        start: 'top 80%',
        once: true,
      },
      y: 30, opacity: 0,
      duration: 0.7, stagger: 0.18,
    });

    /* CTA section */
    gsap.from('.cta__inner > *', {
      scrollTrigger: {
        trigger: '.section-cta',
        start: 'top 82%',
        once: true,
      },
      y: 24, opacity: 0,
      duration: 0.65, stagger: 0.10,
    });
  }

  /* ─── Nav — glass effect on scroll ────────────────────────── */

  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -72',
      onEnter:     () => nav.classList.add('nav--scrolled'),
      onLeaveBack: () => nav.classList.remove('nav--scrolled'),
    });
  }

  /* ─── Hover states ─────────────────────────────────────────── */

  if (!prefersReducedMotion) {
    /* CTA buttons — spring scale */
    document.querySelectorAll('.cta-button').forEach(btn => {
      btn.addEventListener('mouseenter', () =>
        gsap.to(btn, { scale: 1.04, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      );
      btn.addEventListener('mouseleave', () =>
        gsap.to(btn, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      );
    });

    /* Pain cards — subtle lift (CSS handles hover, GSAP on enter/leave for smoothness) */
  }

  /* ─── Form submission ──────────────────────────────────────── */

  const form = document.getElementById('audit-form');
  const resultEl = document.getElementById('form-result');

  if (form && resultEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const payload = JSON.stringify(Object.fromEntries(formData));

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
          /* Animate form out, success message in */
          if (!prefersReducedMotion) {
            await gsap.to(form, { opacity: 0, y: -12, duration: 0.35 }).then();
          }

          form.style.display = 'none';
          resultEl.removeAttribute('hidden');
          resultEl.className = 'form-result form-result--success';
          resultEl.textContent =
            "You're in. We'll be in touch shortly.";

          if (!prefersReducedMotion) {
            gsap.fromTo(
              resultEl,
              { opacity: 0, y: 16 },
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
        showFormError(
          'Connection error. Please try again or email hello@kylixai.com'
        );
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
        { x: -6 },
        {
          x: 0,
          duration: 0.4,
          ease: 'elastic.out(3, 0.4)',
          clearProps: 'x',
        }
      );
    }
  }

})();
