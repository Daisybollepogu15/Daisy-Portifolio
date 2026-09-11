/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS - DAISY BOLLEPOGU PORTFOLIO
   ========================================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('GSAP is not loaded. Skipping GSAP animations.');
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  window.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

    heroTl
      .from('.cyber-nav', { y: -60, opacity: 0, duration: 1 })
      .from('.hero-badge-pill', { scale: 0.7, opacity: 0 }, '-=0.5')
      .from('.hero-title', { y: 35, opacity: 0 }, '-=0.6')
      .from('.hero-subtitle-container', { y: 20, opacity: 0 }, '-=0.5')
      .from('.hero-description', { y: 20, opacity: 0 }, '-=0.5')
      .from('.hero-tech-badges .tech-badge-chip', { scale: 0.8, opacity: 0, stagger: 0.06 }, '-=0.4')
      .from('.hero-cta-group', { y: 25, opacity: 0 }, '-=0.4')
      .from('.hologram-card-container', { scale: 0.85, opacity: 0, duration: 1.1, ease: 'back.out(1.4)' }, '-=0.8');

    // 2. ScrollTrigger Section Animations
    if (typeof ScrollTrigger !== 'undefined') {
      // Section Headers Reveal
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });

      // About Section Elements
      gsap.from('.about-dossier-card', {
        scrollTrigger: {
          trigger: '.about-dossier-card',
          start: 'top 80%'
        },
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.telemetry-card', {
        scrollTrigger: {
          trigger: '.about-side-stack',
          start: 'top 80%'
        },
        x: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Project Cards Stagger
      gsap.from('.project-card-wrapper', {
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%'
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Timeline Items
      gsap.utils.toArray('.timeline-item').forEach((item) => {
        const isLeft = item.classList.contains('left');
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          },
          x: isLeft ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      });

      // Certifications Cards
      gsap.from('.cert-hologram-card', {
        scrollTrigger: {
          trigger: '.cert-achieve-grid',
          start: 'top 80%'
        },
        y: 45,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Languages Cards
      gsap.from('.lang-card', {
        scrollTrigger: {
          trigger: '.languages-row',
          start: 'top 85%'
        },
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'back.out(1.2)'
      });

      // Contact Panels
      gsap.from('.contact-info-panel', {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from('.contact-form-panel', {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%'
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    // 3. Stats Telemetry Counters
    const statCounters = document.querySelectorAll('.stat-counter');
    statCounters.forEach((counter) => {
      const targetVal = parseFloat(counter.getAttribute('data-val')) || 0;
      const isPercent = counter.getAttribute('data-percent') === 'true';

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              counter,
              { innerText: 0 },
              {
                innerText: targetVal,
                duration: 1.8,
                ease: 'power2.out',
                snap: { innerText: 1 },
                onUpdate: function () {
                  counter.innerText = Math.round(counter.innerText) + (isPercent ? '%' : '+');
                }
              }
            );
          }
        });
      }
    });

  });
})();
