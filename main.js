(() => {
  'use strict';

  // ---- Steam ---------------------------------------------------------------
  // The store page is in Valve's review. When it is public, set STEAM_LIVE to true:
  // every wishlist button then opens the store page.
  const STEAM_LIVE = false;
  const STEAM_URL = 'https://store.steampowered.com/app/5363010/Norman_Ascension/';

  document.querySelectorAll('[data-steam]').forEach((link) => {
    if (STEAM_LIVE) {
      link.href = STEAM_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.querySelectorAll('[data-steam-note]').forEach((n) => n.remove());
    } else if (link.closest('#wishlist')) {
      // the closing button has nowhere further to go until the page is live
      link.removeAttribute('href');
      link.setAttribute('role', 'link');
      link.setAttribute('aria-disabled', 'true');
    }
  });
  if (STEAM_LIVE) document.querySelectorAll('[data-steam-status]').forEach((n) => { n.textContent = 'Opens the Norman Ascension page on Steam.'; });

  // ---- Navigation bar ------------------------------------------------------
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.55);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Hero background -----------------------------------------------------
  const hero = document.querySelector('.hero-video');
  const pause = document.getElementById('heroPause');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setPaused = (paused) => {
    if (paused) hero.pause(); else hero.play().catch(() => {});
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Play background' : 'Pause background';
  };
  if (reduced) setPaused(true);
  pause.addEventListener('click', () => setPaused(!hero.paused));
  // do not decode video nobody can see
  new IntersectionObserver(([entry]) => {
    if (pause.getAttribute('aria-pressed') === 'true') return;
    if (entry.isIntersecting) hero.play().catch(() => {}); else hero.pause();
  }, { threshold: 0.05 }).observe(hero);

  // ---- Reveal on scroll ----------------------------------------------------
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));
  // a jump straight to an anchor (or a fast fling) must not leave anything unseen above the fold
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in'); });
  }, { passive: true });

  // ---- One film at a time --------------------------------------------------
  const films = [...document.querySelectorAll('.film video')];
  films.forEach((video) => video.addEventListener('play', () => films.forEach((other) => { if (other !== video) other.pause(); })));

  // ---- Lightbox ------------------------------------------------------------
  const box = document.getElementById('lightbox');
  const boxImage = box.querySelector('img');
  const caption = box.querySelector('.lightbox-caption');
  const items = [...document.querySelectorAll('[data-lightbox]')];
  let index = 0;
  let opener = null;
  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    boxImage.src = item.getAttribute('href');
    boxImage.alt = item.querySelector('img').alt;
    caption.textContent = `${boxImage.alt} · ${index + 1} / ${items.length}`;
  };
  const open = (i, from) => { opener = from; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.lightbox-close').focus(); };
  const close = () => { box.hidden = true; document.body.style.overflow = ''; boxImage.removeAttribute('src'); opener?.focus(); };
  items.forEach((item, i) => item.addEventListener('click', (event) => { event.preventDefault(); open(i, item); }));
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (event) => { if (event.target === box) close(); });
  document.addEventListener('keydown', (event) => {
    if (box.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
})();
