/* ================================================================
   KylixAI — thread-field.js
   The Living Thread: a three-layer depth field of drifting signal
   filaments behind every hero, with a slow aurora bloom wash and a
   load-time convergence toward the headline baseline. Bends toward
   pointer (desktop) or touch + tilt (mobile). One instance per
   <canvas class="hero__field">.

   Perf model:
   - The field is a defocused background, so it renders to a buffer
     below the display resolution and is upscaled by the GPU.
   - The aurora drifts far too slowly to justify a per-frame redraw,
     so it is cached and refreshed on an interval.
   - Frame health is measured from consecutive rAF timestamps (real
     frame interval), never from JS execution time — canvas commands
     are queued, not rasterized synchronously, so JS timing reports
     a fraction of a millisecond no matter how badly the GPU is
     keeping up, which silently disables any ladder built on it.
   ================================================================ */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ACCENT = '255,79,31';
  const BRONZE = '168,118,62';

  /* Render the field below display resolution — it is soft by design, and
     the upscale is invisible while the fill cost roughly halves. */
  const RENDER_SCALE = 0.7;
  const AURORA_INTERVAL = 15;   /* frames between aurora buffer refreshes */
  const SLOW_FRAME_MS = 22;     /* a frame this long counts as struggling */
  const WINDOW_SIZE = 45;       /* frames per health window */
  const STRIKES_TO_DEGRADE = 2; /* consecutive bad windows before stepping down */
  const STRIKES_TO_RECOVER = 6; /* consecutive good windows before stepping up */

  function lerp(a, b, t) { return a + (b - a) * t; }

  function initField(canvas) {
    const ctx = canvas.getContext('2d');
    const bloomCanvas = document.createElement('canvas');
    const bloomCtx = bloomCanvas.getContext('2d');
    const auroraCanvas = document.createElement('canvas');
    const auroraCtx = auroraCanvas.getContext('2d');
    const isInterior = canvas.dataset.intensity === 'interior';
    const scale = isInterior ? 0.5 : 1;

    let width = 0, height = 0, dpr = 1;
    let convergeY = 0;
    let layers = { bg: [], mid: [], fg: [] };
    let targetCounts = { bg: 0, mid: 0, fg: 0 };
    let running = false;
    let bloomEnabled = true;
    let quality = 3;              /* 3 = full, 0 = floor */
    let frameCount = 0;
    let windowFrames = 0, windowSlow = 0;
    let badStreak = 0, goodStreak = 0;
    let lastFrameAt = 0;
    let auroraAge = AURORA_INTERVAL;
    let pointerX = null, pointerY = null;
    let tiltX = 0, tiltY = 0;
    let introProgress = 0;
    const introStart = performance.now();
    const introDuration = 1100;

    /* layer tuning: count base, amplitude mult, wobble-speed mult,
       parallax mult, alpha range, line width, hot accents, floor */
    const LAYER_SPEC = {
      bg:  { countMult: 0.45, ampMult: 1.9, speedMult: 0.5, parallaxMult: 0.5, alphaMin: 0.03, alphaMax: 0.07, lineWidth: 1,   hot: false, floor: 6 },
      mid: { countMult: 1,    ampMult: 1.2, speedMult: 1,   parallaxMult: 1,   alphaMin: 0.05, alphaMax: 0.15, lineWidth: 1,   hot: true,  floor: 14 },
      /* fg was blurred per-stroke, which forces an intermediate surface for
         every filament. A wider, dimmer stroke reads the same at a fraction
         of the cost. */
      fg:  { countMult: 0.12, ampMult: 0.8, speedMult: 1.7, parallaxMult: 1.7, alphaMin: 0.22, alphaMax: 0.38, lineWidth: 2.2, hot: false, floor: 2 },
    };

    function baseCount() {
      return width <= 480 ? 26 : width <= 900 ? 40 : 60;
    }

    function makeFilament(spec, i, total) {
      const points = [];
      const n = 6 + Math.floor(Math.random() * 4);
      /* Break the even-row rhythm: jitter each filament off its slot and give
         it a slight tilt, so the field reads as depth rather than as grain. */
      const slot = (height / (total + 1)) * (i + 1);
      const baseY = slot + (Math.random() - 0.5) * (height / total) * 1.8;
      const tilt = (Math.random() - 0.5) * height * 0.18 * spec.ampMult;
      for (let p = 0; p <= n; p++) {
        const t = p / n;
        points.push({
          x: width * t,
          baseY: baseY + tilt * (t - 0.5) * 2,
          phase: Math.random() * Math.PI * 2,
          speed: (0.15 + Math.random() * 0.25) * spec.speedMult,
          amp: (8 + Math.random() * 22) * spec.ampMult,
        });
      }
      const hot = spec.hot && i % Math.max(6, Math.floor(total / 4)) === 0;
      return {
        points,
        hot,
        color: hot ? ACCENT : BRONZE,
        alpha: hot ? 0.42 + Math.random() * 0.22 : spec.alphaMin + Math.random() * (spec.alphaMax - spec.alphaMin),
        width: hot ? 1.3 : spec.lineWidth,
        parallaxMult: spec.parallaxMult,
        nodeT: hot ? Math.random() : null,
        nodeSpeed: 0.00012 + Math.random() * 0.00018,
      };
    }

    function buildLayer(key) {
      const spec = LAYER_SPEC[key];
      const count = Math.max(spec.floor, Math.round(baseCount() * spec.countMult * scale));
      targetCounts[key] = count;
      layers[key] = new Array(count).fill(0).map((_, i) => makeFilament(spec, i, count));
    }

    function build() {
      buildLayer('bg');
      buildLayer('mid');
      buildLayer('fg');
      applyQuality();
    }

    /* Quality steps, worst-first: 3 full · 2 no bloom · 1 thin bg+fg · 0 floor */
    function applyQuality() {
      bloomEnabled = quality >= 3;
      const factor = quality >= 2 ? 1 : quality === 1 ? 0.6 : 0.35;
      ['bg', 'mid', 'fg'].forEach((k) => {
        const spec = LAYER_SPEC[k];
        const want = Math.max(spec.floor, Math.round(targetCounts[k] * factor));
        if (layers[k].length > want) {
          layers[k] = layers[k].slice(0, want);
        } else if (layers[k].length < want) {
          const total = targetCounts[k];
          for (let i = layers[k].length; i < want; i++) layers[k].push(makeFilament(spec, i, total));
        }
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      convergeY = height * 0.46;

      const buf = dpr * RENDER_SCALE;
      canvas.width = Math.round(width * buf);
      canvas.height = Math.round(height * buf);
      ctx.setTransform(buf, 0, 0, buf, 0, 0);

      bloomCanvas.width = Math.round(width * buf * 0.5);
      bloomCanvas.height = Math.round(height * buf * 0.5);
      bloomCtx.setTransform(buf * 0.5, 0, 0, buf * 0.5, 0, 0);

      auroraCanvas.width = bloomCanvas.width;
      auroraCanvas.height = bloomCanvas.height;
      auroraCtx.setTransform(buf * 0.5, 0, 0, buf * 0.5, 0, 0);

      auroraAge = AURORA_INTERVAL;
      build();
    }

    function fieldDisplacement(x, y, parallaxMult) {
      let dx = 0;
      if (pointerX !== null) {
        const ddx = x - pointerX;
        const ddy = y - pointerY;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        const radius = 180;
        if (dist < radius) {
          const falloff = Math.pow(1 - dist / radius, 2);
          dx += (ddx / (dist || 1)) * falloff * -26 * parallaxMult;
        }
      }
      dx += tiltX * 18 * parallaxMult * (y / height);
      return dx;
    }

    function drawFilament(target, f, now) {
      const eased = introProgress;
      target.beginPath();
      const pts = f.points.map((p) => {
        const wobble = Math.sin(now * 0.001 * p.speed + p.phase) * p.amp * eased;
        const y = lerp(convergeY, p.baseY, eased) + wobble + tiltY * 14 * eased;
        const x = p.x + fieldDisplacement(p.x, y, f.parallaxMult) * eased;
        return { x, y };
      });
      target.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        target.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      target.strokeStyle = `rgba(${f.color},${f.alpha * eased})`;
      target.lineWidth = f.width;
      target.stroke();

      if (f.nodeT !== null) {
        f.nodeT = (f.nodeT + f.nodeSpeed * 16) % 1;
        const idx = f.nodeT * (pts.length - 1);
        const i0 = Math.floor(idx);
        const i1 = Math.min(i0 + 1, pts.length - 1);
        const lt = idx - i0;
        const nx = pts[i0].x + (pts[i1].x - pts[i0].x) * lt;
        const ny = pts[i0].y + (pts[i1].y - pts[i0].y) * lt;
        target.beginPath();
        target.arc(nx, ny, 2.4, 0, Math.PI * 2);
        target.fillStyle = `rgba(${ACCENT},${0.85 * eased})`;
        target.fill();
      }
    }

    /* The aurora is the depth. Filaments are detail on top of it. */
    function renderAurora(now) {
      const t = now * 0.00004;
      const blobs = [
        /* Weighted toward the right, away from the text column — the accent
           blob is the brightest thing in the field and would otherwise sit
           under .hero__sub and break its contrast ratio. */
        { cx: width * (0.30 + Math.sin(t) * 0.1),        cy: height * (0.34 + Math.cos(t * 0.8) * 0.08), r: Math.max(width, height) * 0.62, color: BRONZE, alpha: 0.16 },
        { cx: width * (0.86 + Math.cos(t * 0.7) * 0.08), cy: height * (0.52 + Math.sin(t * 0.6) * 0.08), r: Math.max(width, height) * 0.44, color: ACCENT, alpha: 0.11 },
        { cx: width * (0.66 + Math.sin(t * 1.3) * 0.12), cy: height * (0.84 + Math.cos(t) * 0.06),       r: Math.max(width, height) * 0.34, color: BRONZE, alpha: 0.09 },
      ];
      auroraCtx.clearRect(0, 0, width, height);
      auroraCtx.save();
      auroraCtx.globalCompositeOperation = 'lighter';
      blobs.forEach((b) => {
        const g = auroraCtx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, b.r);
        g.addColorStop(0, `rgba(${b.color},${b.alpha})`);
        g.addColorStop(1, `rgba(${b.color},0)`);
        auroraCtx.fillStyle = g;
        auroraCtx.fillRect(0, 0, width, height);
      });
      auroraCtx.restore();
    }

    function frame(now) {
      if (!running) return;

      /* Real frame interval, measured between rAF callbacks. */
      if (lastFrameAt) {
        const interval = now - lastFrameAt;
        windowFrames++;
        if (interval > SLOW_FRAME_MS) windowSlow++;
        if (windowFrames >= WINDOW_SIZE) {
          const slowRatio = windowSlow / windowFrames;
          if (slowRatio > 0.5) {
            badStreak++; goodStreak = 0;
            if (badStreak >= STRIKES_TO_DEGRADE && quality > 0) {
              quality--; applyQuality(); badStreak = 0;
            }
          } else if (slowRatio < 0.1) {
            goodStreak++; badStreak = 0;
            if (goodStreak >= STRIKES_TO_RECOVER && quality < 3) {
              quality++; applyQuality(); goodStreak = 0;
            }
          } else {
            badStreak = 0; goodStreak = 0;
          }
          windowFrames = 0; windowSlow = 0;
        }
      }
      lastFrameAt = now;
      frameCount++;

      introProgress = Math.min(1, (now - introStart) / introDuration);
      introProgress = 1 - Math.pow(1 - introProgress, 3);

      ctx.clearRect(0, 0, width, height);

      if (++auroraAge >= AURORA_INTERVAL) { renderAurora(now); auroraAge = 0; }
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = introProgress;
      ctx.drawImage(auroraCanvas, 0, 0, width, height);
      ctx.restore();

      if (bloomEnabled) bloomCtx.clearRect(0, 0, width, height);

      layers.bg.forEach((f) => drawFilament(ctx, f, now));
      layers.mid.forEach((f) => {
        drawFilament(ctx, f, now);
        if (bloomEnabled && f.hot) drawFilament(bloomCtx, f, now);
      });
      layers.fg.forEach((f) => drawFilament(ctx, f, now));

      if (bloomEnabled) {
        /* Blur the small bloom buffer, not the full-size destination. */
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'blur(3px)';
        ctx.globalAlpha = 0.55;
        ctx.drawImage(bloomCanvas, 0, 0, width, height);
        ctx.restore();
      }

      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastFrameAt = 0;
      windowFrames = 0; windowSlow = 0;
      requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      lastFrameAt = 0;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    resize();

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      canvas.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        pointerX = e.clientX - r.left;
        pointerY = e.clientY - r.top;
      });
      canvas.addEventListener('mouseleave', () => { pointerX = null; pointerY = null; });
    } else {
      let touching = false;
      canvas.addEventListener('touchstart', (e) => {
        touching = true;
        const t = e.touches[0];
        const r = canvas.getBoundingClientRect();
        pointerX = t.clientX - r.left;
        pointerY = t.clientY - r.top;
      }, { passive: true });
      canvas.addEventListener('touchmove', (e) => {
        if (!touching) return;
        const t = e.touches[0];
        const r = canvas.getBoundingClientRect();
        pointerX = t.clientX - r.left;
        pointerY = t.clientY - r.top;
      }, { passive: true });
      canvas.addEventListener('touchend', () => { touching = false; pointerX = null; pointerY = null; });

      let lastGamma = 0, lastBeta = 0;
      const onTilt = (e) => {
        if (e.gamma === null) return;
        lastGamma = lastGamma * 0.9 + (e.gamma || 0) * 0.1;
        lastBeta = lastBeta * 0.9 + (e.beta || 0) * 0.1;
        tiltX = Math.max(-1, Math.min(1, lastGamma / 30));
        tiltY = Math.max(-1, Math.min(1, (lastBeta - 45) / 45));
      };

      const enableTilt = () => window.addEventListener('deviceorientation', onTilt);

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const grant = () => {
          DeviceOrientationEvent.requestPermission().then((state) => {
            if (state === 'granted') enableTilt();
          }).catch(() => {});
          window.removeEventListener('touchend', grant);
        };
        window.addEventListener('touchend', grant, { once: true });
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        enableTilt();
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? start() : stop();
    }, { threshold: 0 });
    io.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : (canvas.getBoundingClientRect().top < window.innerHeight && start());
    });

    return {
      get quality() { return quality; },
      get bloomEnabled() { return bloomEnabled; },
      get counts() { return { bg: layers.bg.length, mid: layers.mid.length, fg: layers.fg.length }; },
      get running() { return running; },
      get frameCount() { return frameCount; },
      get bufferSize() { return { w: canvas.width, h: canvas.height }; },
    };
  }

  function boot() {
    const canvases = document.querySelectorAll('canvas.hero__field');
    if (!canvases.length) return;
    if (reduceMotion) {
      canvases.forEach((c) => c.remove());
      return;
    }
    window.__kylixField = Array.from(canvases).map(initField);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
