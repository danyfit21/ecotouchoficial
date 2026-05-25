/* ============================================================
   ECOTOUCH — main.js
   Scroll animations · Counter · Header sticky · Mobile menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HEADER SCROLL ── */
  const header = document.querySelector('.header');
  const onScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── ACTIVE NAV ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── MOBILE MENU ── */
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    if (mobileNav) {
      mobileNav.classList.toggle('open');
    }
  });
  // close on nav click
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger inside .stagger parents
          const parent = entry.target.closest('.stagger');
          if (parent) {
            const siblings = Array.from(parent.children);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 80}ms`;
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isFloat = el.dataset.float === 'true';
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = eased * target;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach(el => counterObserver.observe(el));

  /* ── PARALLAX HERO ── */
  const heroVisual = document.querySelector('.hero-visual');
  const heroOrbs = document.querySelectorAll('.hero .orb');
  if (heroVisual || heroOrbs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (heroVisual) {
        heroVisual.style.transform = `translateY(calc(-50% + ${y * 0.15}px))`;
      }
      heroOrbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (0.05 + i * 0.03)}px)`;
      });
    }, { passive: true });
  }

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando…';
      btn.disabled = true;

      // ── FORMSPREE INTEGRATION ──
      // Replace 'YOUR_FORM_ID' with your Formspree form ID
      // Get one free at https://formspree.io
      // Example endpoint: https://formspree.io/f/xpwzabcd
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

      // ── EMAILJS INTEGRATION (alternative) ──
      // import emailjs and call:
      // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
      // .then(() => showSuccess())
      // .catch(() => showError())

      // ── CURRENT: Simulation (replace with real service) ──
      // TO ACTIVATE: replace the setTimeout block below with real fetch call:
      /*
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) showSuccess();
        else showError();
      } catch {
        showError();
      }
      */

      // Simulation (remove when real endpoint is configured):
      setTimeout(() => {
        showSuccess();
      }, 1500);

      function showSuccess() {
        const successEl = document.querySelector('.form-success');
        form.style.display = 'none';
        successEl.classList.add('show');
      }
      function showError() {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Hubo un error al enviar. Por favor contáctanos directamente por WhatsApp.');
      }
    });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── HOVER GRADIENT TILT on cards ── */
  document.querySelectorAll('.sol-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

});
