document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════
     GITHUB IMAGE LOADER
  ══════════════════════════════════════════════════════════ */
  const GH = window.GH;

  function ghLoad(el, file, onSuccess) {
    if (!el || !GH) return;
    const p = new Image();
    p.onload = () => {
      el.src = GH.url(file);
      el.classList.add('loaded');
      if (onSuccess) onSuccess(el);
    };
    p.onerror = () => console.info(`[GH Images] Missing: images/${file}`);
    p.src = GH.url(file);
  }

  // Hero avatar
  const avPhoto = document.getElementById('avPhoto');
  ghLoad(avPhoto, 'profile1.png', el => {
    const fallback = document.querySelector('.av-fallback');
    if (fallback) fallback.style.display = 'none';
  });

  // About photo
  const apPhoto = document.getElementById('apPhoto');
  ghLoad(apPhoto, 'profile1.png', el => {
    const wrap = document.getElementById('apWrap');
    if (wrap) wrap.classList.add('loaded');
  });

  // Project images
  document.querySelectorAll('.gh-img').forEach(img => {
    ghLoad(img, img.dataset.gh, () => {});
  });


  /* ══════════════════════════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════════════════════════ */
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });


  /* ══════════════════════════════════════════════════════════
     LOADER — vintage stamp progress bar
  ══════════════════════════════════════════════════════════ */
  const loader      = document.getElementById('loader');
  const loaderBar   = document.getElementById('loaderBar');
  const loaderStatus = document.getElementById('loaderStatus');

  const STATUSES = [
    'INITIALIZING SYSTEMS...',
    'LOADING ARSENAL...',
    'CHECKING VECTORS...',
    'ENCRYPTING CHANNEL...',
    'ESTABLISHING LINK...',
    'READY.'
  ];

  let progress = 0;
  let statusIdx = 0;

  const barInterval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    loaderBar.style.width = progress + '%';

    const newIdx = Math.min(Math.floor((progress / 100) * STATUSES.length), STATUSES.length - 1);
    if (newIdx !== statusIdx) {
      statusIdx = newIdx;
      loaderStatus.textContent = STATUSES[statusIdx];
    }

    if (progress >= 100) {
      clearInterval(barInterval);
      setTimeout(hideLoader, 500);
    }
  }, 90);

  function hideLoader() {
    gsap.to(loader, {
      opacity: 0, duration: 0.9, ease: 'power2.inOut',
      onComplete: () => { loader.style.display = 'none'; kickAnimations(); }
    });
  }


  /* ══════════════════════════════════════════════════════════
     ROLE TYPER
  ══════════════════════════════════════════════════════════ */
  const ROLES = [
    'Ethical Hacker',
    'Web Security Engineer',
    'CTF Competitor',
    'Bug Bounty Hunter',
    'Secure Developer',
  ];
  const roleEl = document.getElementById('roleText');
  let ri = 0, rc = 0, del = false;

  function typeRole() {
    const cur = ROLES[ri];
    if (!del) {
      roleEl.textContent = cur.slice(0, ++rc);
      if (rc === cur.length) { del = true; setTimeout(typeRole, 1800); return; }
    } else {
      roleEl.textContent = cur.slice(0, --rc);
      if (rc === 0) { del = false; ri = (ri + 1) % ROLES.length; }
    }
    setTimeout(typeRole, del ? 38 : 78);
  }
  typeRole();


  /* ══════════════════════════════════════════════════════════
     GSAP ANIMATIONS
  ══════════════════════════════════════════════════════════ */
  function kickAnimations() {

    // Navbar
    gsap.from('.navbar', { y: -70, opacity: 0, duration: 1, ease: 'power3.out' });

    // Hero
    gsap.from('.hero-badge',    { opacity: 0, x: -20, duration: 0.8, delay: 0.2 });
    gsap.from('.hn-top',        { y: 80, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power4.out' });
    gsap.from('.hn-bot',        { y: 60, opacity: 0, duration: 1.2, delay: 0.6, ease: 'power4.out' });
    gsap.from('.hero-role-wrap',{ opacity: 0, y: 18, duration: 0.8, delay: 0.9 });
    gsap.from('.hero-desc',     { opacity: 0, y: 18, duration: 0.8, delay: 1.05 });
    gsap.from('.hero-btns',     { opacity: 0, y: 18, duration: 0.8, delay: 1.2 });
    gsap.from('.hstat',         { opacity: 0, y: 18, duration: 0.7, delay: 1.4, stagger: 0.1 });
    gsap.from('.av-frame',      { opacity: 0, scale: 0.9, duration: 1.2, delay: 0.5, ease: 'power3.out' });
    gsap.from('.hero-scroll',   { opacity: 0, duration: 1.2, delay: 2.0 });

    // Scroll-triggered cards
    gsap.utils.toArray('.card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        y: 40, opacity: 0, duration: 0.9, delay: i * 0.04, ease: 'power3.out'
      });
    });

    // Section titles + eyebrows
    gsap.utils.toArray('.sec-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        x: -25, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    });
    gsap.utils.toArray('.sec-eyebrow').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%' },
        opacity: 0, x: -12, duration: 0.7
      });
    });

    // Skill bars
    document.querySelectorAll('.skbar').forEach(bar => {
      const w = bar.dataset.w + '%';
      ScrollTrigger.create({
        trigger: bar, start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: w, duration: 1.3, ease: 'power2.out' })
      });
    });

    // Stat counters
    document.querySelectorAll('.hstat-n').forEach(el => {
      const end = +el.dataset.target;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%',
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: end, duration: 2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.floor(this.targets()[0].v) + '+'; }
          });
        }
      });
    });

    // About photo
    gsap.from('.ap-wrap.loaded', {
      scrollTrigger: { trigger: '#about', start: 'top 80%' },
      opacity: 0, x: -25, duration: 1, ease: 'power3.out'
    });
  }


  /* ══════════════════════════════════════════════════════════
     ACTIVE NAV
  ══════════════════════════════════════════════════════════ */
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));


  /* ══════════════════════════════════════════════════════════
     MOBILE NAV
  ══════════════════════════════════════════════════════════ */
  const navToggle  = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });


  /* ══════════════════════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });


  /* ══════════════════════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════════════════════ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('cfName').value.trim();
      const email   = document.getElementById('cfEmail').value.trim();
      const subject = document.getElementById('cfSubject').value.trim();
      const msg     = document.getElementById('cfMsg').value.trim();
      if (!name || !email || !msg) { alert('Please fill in name, email, and message.'); return; }
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
      const sub  = encodeURIComponent(subject || 'Portfolio Contact');
      window.location.href = `mailto:vr5668503@gmail.com?subject=${sub}&body=${body}`;
    });
  }

  /* ══════════════════════════════════════════════════════════
     NAVBAR SCROLL SHADOW
  ══════════════════════════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (window.scrollY > 40) {
      nb.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      nb.style.boxShadow = 'none';
    }
  });

});