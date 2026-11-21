// MediCloud template motion (GSAP + ScrollTrigger), adapted to Lafimora's rendered pages.
// Entrance tweens run once per page load; looping accents restart after every render (e.g. a language switch).
(function () {
'use strict';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (!gsap || !ScrollTrigger) return; // libraries missing: the site still works, just without motion
gsap.registerPlugin(ScrollTrigger);

let ctx = null;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const has = (sel) => document.querySelector(sel) !== null;

function from(sel, trigger, vars, start = 'top 80%') {
  if (!has(sel)) return;
  gsap.from(sel, trigger ? { scrollTrigger: { trigger, start }, ...vars } : vars);
}

function entrance() {
  // Hero
  from('.hero-left', null, { x: -100, opacity: 0, duration: 1.2, ease: 'power3.out' });
  from('.hero-right', null, { x: 100, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
  from('.page-hero-inner', null, { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });

  // Guidance strip ("Trusted by")
  from('.clients-content', '.clients-section', { x: -80, opacity: 0, duration: 1, ease: 'power3.out' });
  from('.client-logo', '.clients-section', { y: 60, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' });

  // Features
  from('.features-heading', '.features-section', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 'top 75%');
  from('.feature-card', '.features-section', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, 'top 70%');

  // How it works / roadmap
  from('.how-heading', '.how-section', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 'top 75%');
  from('.how-step', '.how-section', { y: 100, opacity: 0, duration: 1, stagger: 0.25, ease: 'back.out(1.7)' }, 'top 70%');
  from('.how-buttons .btn', '.how-buttons', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 'top 90%');

  // About
  from('.about-image-wrapper', '.about-section', { x: -120, opacity: 0, duration: 1.2, ease: 'power4.out' }, 'top 75%');
  from('.about-content', '.about-section', { x: 120, opacity: 0, duration: 1.2, ease: 'power4.out' }, 'top 75%');
  from('.about-item', '.about-section', { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 'top 70%');

  // Topic groups (testimonial cards)
  from('.testimonial-heading', '.testimonial-section', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 'top 75%');
  from('.testimonial-card', '.testimonial-section', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' }, 'top 70%');

  // Access / scope (pricing cards)
  from('.pricing-heading', '.pricing-section', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 'top 75%');
  from('.pricing-card', '.pricing-section', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' }, 'top 70%');
  from('.pricing-price', '.pricing-section', { scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'elastic.out(1,0.5)' }, 'top 70%');
  from('.pricing-item', '.pricing-section', { x: -20, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 'top 65%');

  // FAQ
  from('.faq-heading', '.faq-section', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 'top 75%');
  from('.faq-item', '.faq-wrapper', { y: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' });

  // Inner pages: generic reveals
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  });
  gsap.utils.toArray('.reveal-group').forEach((group) => {
    gsap.from(group.children, { scrollTrigger: { trigger: group, start: 'top 85%' }, y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
  });
}

function loops() {
  if (has('.floating-badge')) gsap.to('.floating-badge', { y: -12, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3 });
  if (has('.feature-icon')) gsap.to('.feature-icon', { y: -8, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2 });
  if (has('.how-number')) gsap.to('.how-number', { scale: 1.08, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2 });
  if (has('.testimonial-quote')) gsap.to('.testimonial-quote', { y: -6, duration: 2, repeat: -1, yoyo: true, stagger: 0.2, ease: 'sine.inOut' });
  if (has('.pricing-badge')) gsap.to('.pricing-badge', { scale: 1.08, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut' });
  if (has('.about-check')) gsap.to('.about-check', { scale: 1.15, duration: 1.2, repeat: -1, yoyo: true, stagger: 0.2, ease: 'power1.inOut' });
}

function runAnimations(page, { entrance: withEntrance = true } = {}) {
  if (ctx) ctx.revert();
  ctx = null;
  if (reduced.matches || page === 'chat') return; // chat has its own CSS motion
  ctx = gsap.context(() => {
    if (withEntrance) entrance();
    loops();
  });
  // Images load after render and change section heights; keep trigger positions accurate.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
window.runAnimations = runAnimations;
})();
