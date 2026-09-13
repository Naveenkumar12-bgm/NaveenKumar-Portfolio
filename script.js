/* ============================================================
   NAVEENKUMAR S BALIGAR — Portfolio JavaScript
   Features: Particles, Typed Text, 3D tilt, Scroll animations,
   AOS-like reveal, Cursor, Counter, Nav, Contact form, etc.
   ============================================================ */

'use strict';

// ========================
// GLOBAL UTILITIES
// ========================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ========================
// 1. LOADER
// ========================
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger initial AOS animations after load
      triggerAOS();
    }, 1800);
  });
  document.body.style.overflow = 'hidden';
}

// ========================
// 2. CUSTOM CURSOR
// ========================
function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;

  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function followCursor() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();
}

// ========================
// 3. PARTICLES CANVAS
// ========================
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 140;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 265 : 195;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse influence
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.012;
        this.y -= dy * 0.012;
      }
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 89%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(265, 89%, 66%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  buildParticles();
  loop();
}

// ========================
// 4. TYPED TEXT
// ========================
function initTyped() {
  const el = $('#typed-text');
  if (!el) return;
  const roles = [
    'Full Stack Developer',
    'Java Developer',
    'React.js Enthusiast',
    'Spring Boot Dev',
    'Problem Solver',
    'Software Engineer'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }
  type();
}

// ========================
// 5. NAVIGATION
// ========================
function initNav() {
  const nav = $('#nav');
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const links = $$('.nav-link');

  if (!nav) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = $$('span', hamburger);
    const isOpen = navLinks.classList.contains('open');
    if (spans[0]) {
      spans[0].style.transform = isOpen ? 'rotate(45deg) translateY(7px)' : '';
      spans[1].style.opacity = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translateY(-7px)' : '';
    }
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active section tracking
  function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        links.forEach(l => l.classList.remove('active'));
        const active = $(`a[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
}

// ========================
// 6. AOS (Animate On Scroll)
// ========================
function triggerAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay ? parseInt(entry.target.dataset.aosDelay) : 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('[data-aos]').forEach(el => observer.observe(el));
}

// ========================
// 7. SKILL BARS ANIMATION
// ========================
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.skill-fill', entry.target).forEach(bar => bar.classList.add('animated'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = $('#skills');
  if (skillsSection) observer.observe(skillsSection);
}

// ========================
// 8. COUNTER ANIMATION
// ========================
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ========================
// 9. 3D CARD TILT EFFECT
// ========================
function initTilt() {
  const cards = $$('.project-card, .cert-card, .skill-category, .education-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) scale(1.01)`;
      card.style.transition = 'transform 0.1s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

// ========================
// 10. HERO 3D MOUSE PARALLAX
// ========================
function initHeroParallax() {
  const hero = $('.hero');
  const scene = $('.hero-3d-scene');
  if (!hero || !scene) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    scene.style.transform = `rotateX(${-dy * 6}deg) rotateY(${dx * 10}deg)`;
    scene.style.transition = 'transform 0.2s linear';
  });

  hero.addEventListener('mouseleave', () => {
    scene.style.transform = '';
    scene.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
  });
}

// ========================
// 11. SCROLL PROGRESS
// ========================
function initScrollProgress() {
  const scrollIndicator = $('#scroll-indicator');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrolled > 200 ? '0' : '';
    }
  });
}

// ========================
// 12. BACK TO TOP
// ========================
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================
// 13. CONTACT FORM
// ========================
function initContactForm() {
  const form = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#contact-submit-btn');
    const name = $('#contact-name').value.trim();
    const email = $('#contact-email').value.trim();
    const message = $('#contact-message').value.trim();

    if (!name || !email || !message) {
      // Shake validation
      form.style.animation = 'shake 0.4s ease';
      setTimeout(() => form.style.animation = '', 400);
      return;
    }

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    // Simulate async send
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      if (success) success.classList.add('show');
      setTimeout(() => success?.classList.remove('show'), 5000);
    }, 1600);
  });
}

// ========================
// 14. GLOWING SECTION BORDERS
// ========================
function initGlowTrail() {
  $$('.project-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, hsla(265,89%,66%,0.06) 0%, var(--surface) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

// ========================
// 15. SMOOTH SECTION SCROLL REVEAL
// ========================
function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}

// ========================
// 16. ORBIT PAUSE ON HOVER
// ========================
function initOrbitInteraction() {
  const orbitSystem = $('#orbit-system');
  if (!orbitSystem) return;

  orbitSystem.addEventListener('mouseenter', () => {
    $$('.orbit', orbitSystem).forEach(o => {
      o.style.animationPlayState = 'paused';
    });
  });
  orbitSystem.addEventListener('mouseleave', () => {
    $$('.orbit', orbitSystem).forEach(o => {
      o.style.animationPlayState = 'running';
    });
  });
}

// ========================
// 17. SECTION BACKGROUND GRADIENT
// ========================
function initSectionGradients() {
  const sections = $$('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.style.setProperty('--current-section', '1');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

// ========================
// 18. FLOATING CARDS PERSPECTIVE MOUSE
// ========================
function initFloatingCards() {
  const scene = $('.hero-3d-scene');
  if (!scene) return;

  const cards = $$('.floating-card', scene);
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    cards.forEach((card, i) => {
      const depth = 0.5 + (i * 0.2);
      card.style.transform = `translateY(0) translateX(${dx * 12 * depth}px) translateY(${dy * 8 * depth}px)`;
    });
  });
}

// ========================
// 19. RIPPLE EFFECT ON BUTTONS
// ========================
function initRipple() {
  $$('.btn, .contact-social-btn, .social-icon').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: hsla(255,100%,100%,0.2);
        transform: scale(0);
        animation: ripple-anim 0.5s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple-anim { to { transform: scale(2.5); opacity: 0; } }`;
  document.head.appendChild(style);
}

// ========================
// 20. SCROLL-DRIVEN NAV INDICATOR
// ========================
function initScrollProgress2() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, hsl(265,89%,66%), hsl(195,100%,50%));
    z-index: 2000;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px hsl(265,89%,66%);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = pct + '%';
  });
}

// ========================
// INIT ALL
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initParticles();
  initTyped();
  initNav();
  initSkillBars();
  initCounters();
  initHeroParallax();
  initScrollProgress();
  initBackToTop();
  initContactForm();
  initGlowTrail();
  addShakeKeyframe();
  initOrbitInteraction();
  initSectionGradients();
  initFloatingCards();
  initRipple();
  initScrollProgress2();

  // Tilt (slight delay for DOM settling)
  setTimeout(initTilt, 500);

  // Fallback: trigger AOS after 2.5s if load hasn't fired
  setTimeout(triggerAOS, 2500);
});

// Re-trigger AOS for dynamically revealed elements
window.addEventListener('scroll', () => {
  $$('[data-aos]:not(.aos-animate)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
      setTimeout(() => el.classList.add('aos-animate'), delay);
    }
  });
});
