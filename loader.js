/* ============================================================
   loader.js  —  3-phase intro animation
   Phase 1 : Terminal boot sequence
   Phase 2 : Name letters fly in from chaos
   Phase 3 : Scanline + progress bar
   Exit    : Shard explosion + screen wipe
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────── */
  const loader      = document.getElementById('loader');
  const lCanvas     = document.getElementById('loaderCanvas');
  const lCtx        = lCanvas.getContext('2d');
  const skipBtn     = document.getElementById('ldSkip');
  const termBody    = document.getElementById('ldTermBody');
  const ldSubtitle  = document.getElementById('ldSubtitle');
  const ldBigText   = document.getElementById('ldBigText');
  const ldBar       = document.getElementById('ldProgressBar');
  const ldPct       = document.getElementById('ldProgressPct');
  const ldStatus    = document.getElementById('ldStatusLine');

  let loaderDone = false;

  /* ── prevent scroll while loading ─────────────────────── */
  document.body.style.overflow = 'hidden';

  /* ══════════════════════════════════════════════════════════
     MATRIX RAIN  background canvas
  ══════════════════════════════════════════════════════════ */
  const MATRIX_CHARS = 'JEEVANDSOUZA01REACTNODEJSAWSMONGODBRUSTDOCKER<>/{}[]();=+-*&#@!?%'.split('');
  const COL_W = 18;
  let cols, drops, matrixRAF;

  function resizeLoaderCanvas () {
    lCanvas.width  = window.innerWidth;
    lCanvas.height = window.innerHeight;
    cols  = Math.floor(lCanvas.width / COL_W);
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -60));
  }

  function drawMatrix () {
    lCtx.fillStyle = 'rgba(0,0,0,0.07)';
    lCtx.fillRect(0, 0, lCanvas.width, lCanvas.height);
    lCtx.font = `${COL_W - 2}px 'DM Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char  = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const y     = drops[i] * COL_W;
      const alpha = Math.random() > 0.93 ? 1 : 0.42;

      lCtx.fillStyle = `rgba(0,240,200,${alpha})`;
      lCtx.fillText(char, i * COL_W, y);

      if (y > lCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }

    matrixRAF = requestAnimationFrame(drawMatrix);
  }

  resizeLoaderCanvas();
  window.addEventListener('resize', resizeLoaderCanvas);
  drawMatrix();

  /* ══════════════════════════════════════════════════════════
     PHASE MANAGER
  ══════════════════════════════════════════════════════════ */
  function showPhase (id) {
    document.querySelectorAll('.ld-phase').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* ══════════════════════════════════════════════════════════
     PHASE 1 — TERMINAL BOOT
  ══════════════════════════════════════════════════════════ */
  const BOOT_LINES = [
    { cls: 'ld-prompt', text: '$ ./boot.sh --env=production',          delay:    0 },
    { cls: 'ld-dim',    text: 'Initialising runtime environment…',     delay:  320 },
    { cls: 'ld-ok',     text: '✓  Node.js v20.11.0          [OK]',     delay:  580 },
    { cls: 'ld-ok',     text: '✓  React 18.3 loaded         [OK]',     delay:  760 },
    { cls: 'ld-ok',     text: '✓  MongoDB connected         [OK]',     delay:  920 },
    { cls: 'ld-ok',     text: '✓  AWS SDK authenticated     [OK]',     delay: 1080 },
    { cls: 'ld-warn',   text: '⚡  Compiling assets…',                  delay: 1240 },
    { cls: 'ld-ok',     text: '✓  Bundle: 142 kb (gzip)     [OK]',     delay: 1420 },
    { cls: 'ld-ok',     text: '✓  5 yrs XP loaded           [LEGEND]', delay: 1620 },
    { cls: 'ld-prompt', text: '$ Launching portfolio…',                 delay: 1840 },
  ];

  function runPhase1 () {
    showPhase('ldPhase1');
    termBody.innerHTML = '';

    BOOT_LINES.forEach(({ cls, text, delay }) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = `ld-term-line ${cls}`;
        span.textContent = text;
        termBody.appendChild(span);
        termBody.scrollTop = termBody.scrollHeight;
      }, delay);
    });

    setTimeout(runPhase2, 2350);
  }

  /* ══════════════════════════════════════════════════════════
     PHASE 2 — NAME LETTERS FLY IN
  ══════════════════════════════════════════════════════════ */
  function runPhase2 () {
    showPhase('ldPhase2');

    const letters = document.querySelectorAll('.ld-letter');

    /* Randomise each letter's entry angle */
    letters.forEach(el => {
      const tilt = (Math.random() * 48 - 24).toFixed(1);
      el.style.setProperty('--tilt', `${tilt}deg`);
    });

    /* Double rAF ensures transitions fire after style is applied */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      letters.forEach((el, i) => {
        el.style.transitionDelay = `${i * 52 + Math.random() * 24}ms`;
        el.classList.add('land');
      });

      /* Glow burst on each letter as it snaps into place */
      letters.forEach((el, i) => {
        setTimeout(() => {
          el.style.textShadow = '0 0 60px currentColor, 0 0 120px currentColor';
          setTimeout(() => { el.style.textShadow = ''; }, 320);
        }, i * 52 + 120);
      });

      /* Show subtitle after all letters land */
      setTimeout(() => {
        ldSubtitle.classList.add('show');
      }, letters.length * 52 + 260);
    }));

    setTimeout(runPhase3, 2300);
  }

  /* ══════════════════════════════════════════════════════════
     PHASE 3 — SCANLINE + PROGRESS BAR
  ══════════════════════════════════════════════════════════ */
  const STATUS_MSGS = [
    'Loading experience data…',
    'Compiling skill modules…',
    'Mounting React components…',
    'Authenticating AWS SDK…',
    'Optimising bundle…',
    'Injecting passion…',
    'Adding coffee.exe…',
    'Ready to launch 🚀',
  ];

  function runPhase3 () {
    showPhase('ldPhase3');

    const DURATION = 2600;
    const start    = performance.now();
    let   msgIdx   = 0;

    const statusInterval = setInterval(() => {
      if (msgIdx >= STATUS_MSGS.length) return;
      ldStatus.style.opacity = '0';
      setTimeout(() => {
        ldStatus.textContent  = STATUS_MSGS[msgIdx++];
        ldStatus.style.opacity = '1';
      }, 140);
    }, DURATION / STATUS_MSGS.length);

    function tick (now) {
      const elapsed  = now - start;
      const raw      = Math.min(100, Math.round((elapsed / DURATION) * 100));
      /* Ease last 20% so it feels like it's "thinking" */
      const visual   = raw < 80 ? raw : 80 + (raw - 80) * 0.55;

      ldBar.style.width = visual + '%';
      ldPct.textContent = raw + '%';

      if (raw < 100) {
        requestAnimationFrame(tick);
      } else {
        clearInterval(statusInterval);
        ldStatus.textContent = 'Ready to launch 🚀';
        setTimeout(exitLoader, 550);
      }
    }

    requestAnimationFrame(tick);
  }

  /* ══════════════════════════════════════════════════════════
     EXIT — SHARD EXPLOSION + SCREEN WIPE
  ══════════════════════════════════════════════════════════ */
  function exitLoader () {
    if (loaderDone) return;
    loaderDone = true;

    cancelAnimationFrame(matrixRAF);

    /* Build shard canvas */
    const sc   = document.createElement('canvas');
    const sCtx = sc.getContext('2d');
    sc.width   = window.innerWidth;
    sc.height  = window.innerHeight;
    sc.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:10;';
    loader.appendChild(sc);

    const W      = sc.width;
    const H      = sc.height;
    const SHARDS = 130;
    const shards = [];

    for (let i = 0; i < SHARDS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 24 + 6;
      shards.push({
        x:    W / 2 + (Math.random() - 0.5) * W * 0.9,
        y:    H / 2 + (Math.random() - 0.5) * H * 0.9,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed - 5,
        size: Math.random() * 20 + 4,
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.28,
        alpha:1,
        color: Math.random() > 0.5 ? '#00f0c8' : '#ff5f7e',
      });
    }

    function drawShards () {
      sCtx.clearRect(0, 0, W, H);
      let alive = false;

      shards.forEach(s => {
        if (s.alpha <= 0) return;
        alive = true;

        sCtx.save();
        sCtx.globalAlpha = s.alpha;
        sCtx.fillStyle   = s.color;
        sCtx.shadowColor = s.color;
        sCtx.shadowBlur  = 10;
        sCtx.translate(s.x, s.y);
        sCtx.rotate(s.rot);

        /* Irregular polygon shard */
        sCtx.beginPath();
        sCtx.moveTo(-s.size,       -s.size * 0.35);
        sCtx.lineTo( 0,            -s.size);
        sCtx.lineTo( s.size * 0.7, -s.size * 0.2);
        sCtx.lineTo( s.size * 0.3,  s.size * 0.85);
        sCtx.lineTo(-s.size * 0.6,  s.size * 0.5);
        sCtx.closePath();
        sCtx.fill();
        sCtx.restore();

        s.x     += s.vx;
        s.y     += s.vy;
        s.vy    += 0.65;   /* gravity */
        s.rot   += s.rotV;
        s.alpha -= 0.026;
      });

      if (alive) requestAnimationFrame(drawShards);
    }

    drawShards();

    /* Trigger CSS clip-path wipe */
    loader.classList.add('exit');

    setTimeout(() => {
      loader.style.display     = 'none';
      document.body.style.overflow = '';
    }, 950);
  }

  /* ── Skip button ────────────────────────────────────────── */
  skipBtn.addEventListener('click', exitLoader);

  /* ── Safety fallback (never block > 9 s) ───────────────── */
  setTimeout(exitLoader, 9000);

  /* ── Kick off ───────────────────────────────────────────── */
  runPhase1();

})();
