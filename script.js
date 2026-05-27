/* ============================================
   SEA BUMPERS — Interactions & animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HERO LOAD ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('is-loaded'));
  }

  /* ---------- NAV SCROLL EFFECT ---------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
      });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  reveals.forEach(el => revealObs.observe(el));

  /* ---------- HERO PARALLAX ---------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(min-width: 720px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroBg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- TEXTE AUTOMATIQUE DU PRODUIT ---------- */
  const steps = document.querySelectorAll('.produit__step');

  if (steps.length) {
    let activeStep = 0;
    const updateProduit = () => {
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === activeStep);
      });
      activeStep = (activeStep + 1) % steps.length;
    };

    updateProduit();
    window.setInterval(updateProduit, 3200);
  }

  /* ---------- SMOOTH SCROLL pour les ancres ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- MICRO-INTERACTIONS USAGES & MODÈLES ---------- */
  document.querySelectorAll('.usage, .modele').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  /* ---------- VIDEO AU SURVOL DE PLAGE ---------- */
  document.querySelectorAll('.usage--video').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    const playVideo = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    const pauseVideo = () => {
      video.pause();
      video.currentTime = 0;
    };

    card.addEventListener('mouseenter', playVideo);
    card.addEventListener('mouseleave', pauseVideo);
    card.addEventListener('focusin', playVideo);
    card.addEventListener('focusout', pauseVideo);
  });

});
