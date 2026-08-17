/**
 * Reveal Animations Engine using Intersection Observer - Optimized for 60 FPS
 * Supports: Fade, Slide (up, down, left, right), Zoom (in, out)
 * Rule: Runs strictly ONCE per element upon entering viewport.
 * Zero external libraries, lightweight, responsive.
 */

(function () {
  function initRevealAnimations() {
    const selector = '.reveal, .reveal-fade, .reveal-slide, .reveal-slide-up, .reveal-slide-down, .reveal-slide-left, .reveal-slide-right, .reveal-zoom, .reveal-zoom-in, .reveal-zoom-out, [data-reveal]';
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) return;

    // Fallback if IntersectionObserver is not supported in legacy browsers
    if (!('IntersectionObserver' in window)) {
      requestAnimationFrame(() => {
        elements.forEach(el => el.classList.add('revealed'));
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Check for optional stagger delay
          const delayAttr = el.getAttribute('data-reveal-delay') || el.getAttribute('data-delay');
          if (delayAttr) {
            const delayMs = parseInt(delayAttr, 10);
            setTimeout(() => {
              requestAnimationFrame(() => el.classList.add('revealed'));
            }, isNaN(delayMs) ? 0 : delayMs);
          } else {
            requestAnimationFrame(() => el.classList.add('revealed'));
          }

          // Stop observing so animation runs ONCE
          obs.unobserve(el);
        }
      });
    }, observerOptions);

    elements.forEach(el => {
      // Avoid re-observing already revealed elements
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealAnimations, { passive: true });
  } else {
    initRevealAnimations();
  }

  // Global helper to re-trigger observer on dynamically added elements
  window.initRevealAnimations = initRevealAnimations;
})();

