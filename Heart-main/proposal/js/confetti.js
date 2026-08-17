/**
 * Lightweight Canvas Confetti - Optimized for 60 FPS
 * No external libraries.
 * Spawns confetti particles, updates for 5 seconds, then removes all particles & canvas element.
 */
function runLightweightConfetti() {
  // Prevent duplicate canvas instances
  const existingCanvas = document.getElementById('confetti-canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let resizeTimeout = null;
  const handleResize = () => {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  };
  window.addEventListener('resize', handleResize, { passive: true });

  const colors = ['#e05275', '#e6c280', '#ffffff', '#f8e1e7', '#f4acb7', '#ffd166'];
  let particles = [];
  let isSpawning = true;
  let animId = null;

  // Initial lightweight particle burst
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.4),
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 4 + 2,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (isSpawning && particles.length < 120 && Math.random() < 0.5) {
      particles.push({
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();

      if (p.y > height + 20) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0 || isSpawning) {
      animId = requestAnimationFrame(render);
    }
  }

  render();

  // Stop spawning and completely remove particles & canvas after 5 seconds
  setTimeout(() => {
    isSpawning = false;
    particles = [];
    if (animId) {
      cancelAnimationFrame(animId);
    }
    window.removeEventListener('resize', handleResize);
    ctx.clearRect(0, 0, width, height);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }, 5000);
}

// Auto-trigger if 'triggerConfetti' flag is set in localStorage
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('triggerConfetti') === 'true') {
    localStorage.removeItem('triggerConfetti');
    runLightweightConfetti();
  }
}, { passive: true });

