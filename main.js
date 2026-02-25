/* ============================================================
   main.js  —  portfolio interactivity
   1. Mobile nav drawer
   2. Detect touch / mobile
   3. Custom cursor  (desktop only)
   4. Particle canvas background
   5. Scroll reveal
   6. Hero name glitch
   7. Active nav link on scroll
   ============================================================ */

'use strict';

/* ── 1. MOBILE NAV DRAWER ───────────────────────────────── */
(function initNav () {
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('navDrawer');

  function openNav () {
    hamburger.classList.add('open');
    navDrawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav () {
    hamburger.classList.remove('open');
    navDrawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    navDrawer.classList.contains('open') ? closeNav() : openNav();
  });

  /* Close when a drawer link is tapped */
  navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* Close when tapping outside */
  document.addEventListener('click', e => {
    if (
      navDrawer.classList.contains('open') &&
      !navDrawer.contains(e.target) &&
      !hamburger.contains(e.target)
    ) closeNav();
  });
})();


/* ── 2. DETECT TOUCH / MOBILE ───────────────────────────── */
const isMobile = () =>
  window.matchMedia('(max-width: 768px)').matches ||
  ('ontouchstart' in window);


/* ── 3. CUSTOM CURSOR  (desktop only) ───────────────────── */
(function initCursor () {
  if (isMobile()) return;

  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    /* Dot follows instantly */
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  /* Ring follows with smooth lag */
  (function animateRing () {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  /* Enlarge ring on interactive elements */
  document.querySelectorAll('a, button, .award-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('enlarged'));
    el.addEventListener('mouseleave', () => ring.classList.remove('enlarged'));
  });
})();


/* ── 4. PARTICLE CANVAS BACKGROUND ─────────────────────── */
(function initParticles () {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');

  const COUNT   = isMobile() ? 35 : 75;
  const CONNECT = 130;

  let W, H, particles;

  function create () {
    particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.38,
      dy: (Math.random() - 0.5) * 0.38,
      a:  Math.random() * 0.6 + 0.2,
    }));
  }

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    if (particles) {
      /* Clamp existing particles into new bounds */
      particles.forEach(p => {
        p.x = Math.min(p.x, W);
        p.y = Math.min(p.y, H);
      });
    } else {
      create();
    }
  }

  function draw () {
    ctx.clearRect(0, 0, W, H);

    /* Connection lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,200,${0.13 * (1 - dist / CONNECT)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    /* Dots + movement */
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,200,${p.a})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    }

    requestAnimationFrame(draw);
  }

  /* Debounced resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  draw();
})();


/* ── 5. SCROLL REVEAL ────────────────────────────────────── */
(function initScrollReveal () {
  const items = document.querySelectorAll('.timeline-item, .skill-card, .edu-card');

  /* Tag each element with its own index so stagger is always consistent */
  items.forEach((el, i) => { el.dataset.revealIdx = i; });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const idx   = parseInt(entry.target.dataset.revealIdx, 10);
      const delay = (idx % 6) * 80;     /* max 5-step stagger per viewport */

      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target); /* fire once per element */
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ── 6. HERO NAME GLITCH ─────────────────────────────────── */
(function initGlitch () {
  const nameEl = document.querySelector('h1 span');
  if (!nameEl) return;

  setInterval(() => {
    const shift = (Math.random() * 3 - 1.5).toFixed(1);
    nameEl.style.textShadow = `${shift}px 0 #ff5f7e, ${-shift}px 0 #00f0c8`;
    setTimeout(() => { nameEl.style.textShadow = 'none'; }, 90);
  }, 3800);
})();


/* ── 7. ACTIVE NAV LINK ON SCROLL ───────────────────────── */
(function initActiveNav () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();
