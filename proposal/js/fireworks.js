/**
 * Optimized Canvas Fireworks Engine - Target 60 FPS
 * Hard cap: Maximum 100 particles active at any time.
 * Smooth physics, fade effects, zero external libraries, fully responsive.
 */

class CanvasFireworks {
  constructor(options = {}) {
    this.maxParticles = options.maxParticles || 100;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.rockets = [];
    this.animId = null;
    this.isRunning = false;
    this.resizeRafId = null;
    this.colors = ['#e6c280', '#e05275', '#ffffff', '#ffd166', '#f4acb7', '#a2d2ff'];
    
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    this.removeCanvas();

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fireworks-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  handleResize() {
    if (this.resizeRafId) cancelAnimationFrame(this.resizeRafId);
    this.resizeRafId = requestAnimationFrame(() => this.resizeCanvas());
  }

  launchRocket() {
    // Only launch if room under particle cap
    if (this.particles.length + 20 > this.maxParticles) return;

    const startX = Math.random() * (this.width * 0.8) + this.width * 0.1;
    const targetY = Math.random() * (this.height * 0.3) + this.height * 0.15;
    
    this.rockets.push({
      x: startX,
      y: this.height,
      targetY: targetY,
      speed: Math.random() * 4 + 8,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    });
  }

  explode(x, y, color) {
    const availableSlots = this.maxParticles - this.particles.length;
    if (availableSlots <= 0) return;

    // Spawn up to 25 particles per rocket explosion, strictly capped by available slots
    const particleCount = Math.min(25, availableSlots);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.2);
      const speed = Math.random() * 5 + 2;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 3 + 2,
        color: color || this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  start(durationMs = 6000) {
    this.init();
    this.isRunning = true;
    let lastLaunch = 0;

    const loop = (timestamp) => {
      if (!this.isRunning) return;

      // Dark trail for motion blur
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalCompositeOperation = 'lighter';

      // Launch rockets periodically if particle count permits
      if (timestamp - lastLaunch > 600 && this.particles.length < this.maxParticles - 20) {
        this.launchRocket();
        lastLaunch = timestamp;
      }

      // Update & Draw Rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.y -= r.speed;

        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = r.color;
        this.ctx.fill();

        if (r.y <= r.targetY) {
          this.explode(r.x, r.y, r.color);
          this.rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles (Strictly Max 100)
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // smooth gravity
        p.vx *= 0.98; // air drag
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);

    if (durationMs > 0) {
      setTimeout(() => this.stop(), durationMs);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.resizeRafId) {
      cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = null;
    }
    this.particles = [];
    this.rockets = [];
    this.removeCanvas();
  }

  removeCanvas() {
    window.removeEventListener('resize', this.handleResize);
    const existing = document.getElementById('fireworks-canvas');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    this.canvas = null;
    this.ctx = null;
  }
}

// Global quick helper
window.runCanvasFireworks = function(durationMs = 6000) {
  const fw = new CanvasFireworks({ maxParticles: 100 });
  fw.start(durationMs);
  return fw;
};

// Auto-trigger if fireworks flag is present
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('triggerFireworks') === 'true') {
    localStorage.removeItem('triggerFireworks');
    window.runCanvasFireworks(6000);
  }
}, { passive: true });

