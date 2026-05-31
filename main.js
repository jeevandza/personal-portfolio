'use strict';

/* ── 1. MOBILE NAV DRAWER ───────────────────────────────── */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('navDrawer');

  function openNav() {
    hamburger.classList.add('open');
    navDrawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    hamburger.classList.remove('open');
    navDrawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    navDrawer.classList.contains('open') ? closeNav() : openNav();
  });

  navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('click', e => {
    if (
      navDrawer.classList.contains('open') &&
      !navDrawer.contains(e.target) &&
      !hamburger.contains(e.target)
    ) closeNav();
  });
})();


/* ── 2. NAV SCROLL SHADOW ───────────────────────────────── */
(function initNavShadow() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();


/* ── 3. SCROLL REVEAL ────────────────────────────────────── */
(function initScrollReveal() {
  const items = document.querySelectorAll('.timeline-item, .skill-card, .edu-card');

  items.forEach((el, i) => { el.dataset.revealIdx = i; });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = (parseInt(entry.target.dataset.revealIdx, 10) % 4) * 90;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ── 4. DARK / LIGHT THEME TOGGLE ───────────────────────── */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'light') document.body.classList.add('light');

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  });
})();


/* ── 5. ACTIVE NAV LINK ON SCROLL ───────────────────────── */
(function initActiveNav() {
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
