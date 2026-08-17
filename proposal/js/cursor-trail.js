/**
 * Premium Glowing Cursor Trail - Optimized for 60 FPS
 * Spawns tiny glowing heart particles on mouse & touch movement.
 * Distance & time throttled, rAF batched, max active particle cap.
 * Passive event listeners, zero external libraries, fully responsive.
 */

(function () {
  const MAX_CURSOR_HEARTS = 20;
  const DISTANCE_THRESHOLD = 14; // pixels
  const TIME_THRESHOLD = 30; // milliseconds
  const HEARTS = ['💖', '✨', '💕', '❤️', '🌸'];

  let activeParticlesCount = 0;
  let lastX = -1000;
  let lastY = -1000;
  let lastTime = 0;
  let pendingX = null;
  let pendingY = null;
  let isRafScheduled = false;
  let cachedContainer = null;

  function getContainer() {
    if (!cachedContainer || !document.body.contains(cachedContainer)) {
      cachedContainer = document.getElementById('cursor-trail-container');
      if (!cachedContainer) {
        cachedContainer = document.createElement('div');
        cachedContainer.id = 'cursor-trail-container';
        document.body.appendChild(cachedContainer);
      }
    }
    return cachedContainer;
  }

  function createHeartParticle(x, y) {
    if (activeParticlesCount >= MAX_CURSOR_HEARTS) return;

    const container = getContainer();
    const particle = document.createElement('div');
    particle.className = 'cursor-trail-heart';

    const symbol = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    particle.textContent = symbol;

    const rotMid = (Math.random() - 0.5) * 30;
    const rotEnd = (Math.random() - 0.5) * 50;
    const sizeScale = (Math.random() * 0.4 + 0.75).toFixed(2); // 0.75 to 1.15

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--rot', `${rotMid}deg`);
    particle.style.setProperty('--rot-end', `${rotEnd}deg`);
    particle.style.fontSize = `${sizeScale}rem`;

    activeParticlesCount++;

    let cleaned = false;
    const handleAnimationEnd = () => {
      if (cleaned) return;
      cleaned = true;
      particle.removeEventListener('animationend', handleAnimationEnd);
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      activeParticlesCount = Math.max(0, activeParticlesCount - 1);
    };

    // Fallback cleanup timer in case animationend event is missed or tab is backgrounded
    setTimeout(handleAnimationEnd, 1200);

    particle.addEventListener('animationend', handleAnimationEnd, { passive: true });
    container.appendChild(particle);
  }

  function processPendingPointer() {
    isRafScheduled = false;
    if (pendingX === null || pendingY === null) return;

    const now = Date.now();
    const dist = Math.hypot(pendingX - lastX, pendingY - lastY);

    if (dist >= DISTANCE_THRESHOLD || (now - lastTime >= TIME_THRESHOLD && dist > 4)) {
      createHeartParticle(pendingX, pendingY);
      lastX = pendingX;
      lastY = pendingY;
      lastTime = now;
    }

    pendingX = null;
    pendingY = null;
  }

  function handlePointerMove(clientX, clientY) {
    pendingX = clientX;
    pendingY = clientY;

    if (!isRafScheduled) {
      isRafScheduled = true;
      requestAnimationFrame(processPendingPointer);
    }
  }

  function onMouseMove(e) {
    handlePointerMove(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  }

  function initCursorTrail() {
    // Desktop mouse events - passive for smooth scrolling & rendering
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Touch events for mobile/tablet devices
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorTrail, { passive: true });
  } else {
    initCursorTrail();
  }
})();

