/* =========================================
   NEXUS DIGITAL — script.js
   ========================================= */
'use strict';

// ─── LOADER ────────────────────────────────────────────────────────────────────
(function initLoader() {
    document.body.classList.add('loading');
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                startReveal();
            }
        }, 2200);
    });
})();

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = 'a, button, .btn, .pf-btn, .tc-btn, .faq-question, .servico-card, .portfolio-card, .dif-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

// ─── PARTICLES CANVAS ─────────────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const COUNT = window.innerWidth < 768 ? 40 : 80;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.reset = function () {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.5 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.4 + 0.05;
            const palette = ['#6EE7B7', '#3B82F6', '#8B5CF6', '#F59E0B'];
            this.color = palette[Math.floor(Math.random() * palette.length)];
        };
        this.reset();
        this.update = function () {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        };
        this.draw = function () {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxDist) {
                    ctx.save();
                    ctx.globalAlpha = (1 - d / maxDist) * 0.06;
                    ctx.strokeStyle = '#6EE7B7';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
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

    init();
    loop();
    window.addEventListener('resize', resize);
})();

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
})();

// ─── MOBILE NAV ───────────────────────────────────────────────────────────────
(function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
        });
    });
})();

// ─── BACK TO TOP ──────────────────────────────────────────────────────────────
(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function startReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const siblings = el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
                let delay = 0;
                siblings.forEach((sib, i) => { if (sib === el) delay = i * 80; });
                setTimeout(() => el.classList.add('in-view'), delay);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    elements.forEach(el => observer.observe(el));
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ─── TESTIMONIALS SLIDER ──────────────────────────────────────────────────────
(function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('tcDots');
    const prevBtn = document.getElementById('tcPrev');
    const nextBtn = document.getElementById('tcNext');
    let current = 0;
    let autoTimer;

    function goTo(index) {
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(next, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    startAuto();

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); startAuto(); }
    });
})();

// ─── PORTFOLIO FILTER ─────────────────────────────────────────────────────────
(function initPortfolioFilter() {
    const buttons = document.querySelectorAll('.pf-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.cat === filter;
                if (show) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    requestAnimationFrame(() => {
                        card.style.animation = 'slideIn 0.4s ease forwards';
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
(function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const isOpen = q.getAttribute('aria-expanded') === 'true';
            // close all
            questions.forEach(other => {
                other.setAttribute('aria-expanded', 'false');
                const ans = other.nextElementSibling;
                if (ans) ans.classList.remove('open');
            });
            // open this one if it was closed
            if (!isOpen) {
                q.setAttribute('aria-expanded', 'true');
                const ans = q.nextElementSibling;
                if (ans) ans.classList.add('open');
            }
        });
    });
})();

// ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────────────────────────
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
                const top = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
})();

// ─── PARALLAX ON HERO ORBS ───────────────────────────────────────────────────
(function initParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    if (!orbs.length) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            orbs.forEach((orb, i) => {
                const speed = 0.08 + i * 0.04;
                orb.style.transform = `translateY(${y * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
})();

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────────────────────
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
})();

// ─── KEYFRAME for portfolio filter ───────────────────────────────────────────
(function addPortfolioKeyframe() {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: scale(0.94) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .nav-links a.active { color: var(--accent) !important; }
  `;
    document.head.appendChild(style);
})();