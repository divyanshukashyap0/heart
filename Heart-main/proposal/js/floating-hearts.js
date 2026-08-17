/**
 * Floating Hearts Generator - Optimized for 60 FPS
 * Generates floating hearts with random positions, sizes, sway, and speeds.
 * Strict maximum limit of 15 hearts active at any time.
 * rAF batched element creation, passive event handlers, zero external libraries.
 */

(function () {
  const MAX_HEARTS = 15;
  const HEART_SYMBOLS = ['❤️', '💖', '💕', '💗', '🌸', '✨'];
  let activeHeartsCount = 0;
  let cachedContainer = null;

  function getContainer() {
    if (!cachedContainer || !document.body.contains(cachedContainer)) {
      cachedContainer = document.getElementById('floating-hearts-container');
      if (!cachedContainer) {
        cachedContainer = document.createElement('div');
        cachedContainer.id = 'floating-hearts-container';
        document.body.appendChild(cachedContainer);
      }
    }
    return cachedContainer;
  }

  function spawnHeart() {
    if (activeHeartsCount >= MAX_HEARTS) return;

    requestAnimationFrame(() => {
      if (activeHeartsCount >= MAX_HEARTS) return;

      const container = getContainer();
      const heart = document.createElement('div');
      heart.className = 'floating-heart';

      // Pick random heart symbol
      const symbol = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
      heart.textContent = symbol;

      // Responsive side channel positioning to keep central content clear
      const isMobile = window.innerWidth < 640;
      const laneWidth = isMobile ? 12 : 20;
      const isLeft = Math.random() < 0.5;
      const leftPos = isLeft
        ? (Math.random() * laneWidth + 2)
        : (Math.random() * laneWidth + (100 - laneWidth - 2));

      const fontSize = Math.random() * 1.1 + 0.9; // 0.9rem to 2.0rem
      const duration = Math.random() * 4 + 6; // 6s to 10s float duration
      const swayDuration = Math.random() * 2 + 2; // 2s to 4s sway duration
      const baseOpacity = Math.random() * 0.35 + 0.6; // 0.6 to 0.95 opacity

      heart.style.left = `${leftPos}%`;
      heart.style.fontSize = `${fontSize}rem`;
      heart.style.animationDuration = `${duration}s, ${swayDuration}s`;
      heart.style.opacity = baseOpacity;

      activeHeartsCount++;

      // Clean up heart when off-screen animation ends
      let cleaned = false;
      const handleAnimationEnd = () => {
        if (cleaned) return;
        cleaned = true;
        heart.removeEventListener('animationend', handleAnimationEnd);
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
        activeHeartsCount = Math.max(0, activeHeartsCount - 1);
      };

      // Fallback cleanup timer in case animationend event is delayed or missed
      setTimeout(handleAnimationEnd, (duration + 2) * 1000);

      heart.addEventListener('animationend', handleAnimationEnd, { passive: true });

      container.appendChild(heart);
    });
  }

  function initFloatingHearts() {
    // Initial staggered spawn
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnHeart, i * 350);
    }

    // Interval spawner maintaining up to 15 active hearts
    setInterval(() => {
      if (activeHeartsCount < MAX_HEARTS) {
        spawnHeart();
      }
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingHearts, { passive: true });
  } else {
    initFloatingHearts();
  }
})();

