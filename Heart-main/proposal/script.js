/**
 * A Journey For Mahima - Main Orchestrator Script
 * Particle Canvas, Mobile Drawer Navigation, Active Links
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Passphrase Site Lock ("you are mine")
  initSiteLock();

  // Initialize Premium Preloader Screen
  initPreloader();

  // Setup Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Highlight Current Active Page Link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath.endsWith('/') && href.endsWith('index.html')))) {
      link.classList.add('active');
    }
  });

  // Background Floating Heart Particles
  initParticleCanvas();

  // Story Calm Timeline Scroll Observer
  initStoryTimeline();

  // 3D Glass Flip Cards Handler
  initFlipCards();

  // Masonry Gallery Lightbox with Keyboard & Swipe Support
  initGalleryLightbox();

  // Interactive Letter Envelope & Typewriter Effect
  initLetterEnvelope();

  // Interactive Questions Section Handler
  initQuestionsSection();
}, { passive: true });



/**
 * Interactive Letter Envelope & Typewriter Effect
 */
function initLetterEnvelope() {
  const envelope = document.querySelector('#envelope-trigger');
  const letterStage = document.querySelector('.letter-stage');
  const typedTarget = document.querySelector('#typed-letter');
  const skipBtn = document.querySelector('#skip-type-btn');
  const actionsWrap = document.querySelector('.letter-actions');
  const cursor = document.querySelector('.typewriter-cursor');

  if (!envelope || !typedTarget) return;

  const letterText = `Dear Mahima,

Maybe this surprises you.
Maybe, somewhere, you already had an idea.

I've wanted to tell you something for a while, but every time I thought about saying it face to face, I somehow couldn't find the right words — or maybe just the courage.

So I made this instead.

Somewhere along the way, I started noticing all these little things about you — your smile, your eyes, your earrings, your love for flowers, your expressions, and even your love for sweetcorn. 🌸🌽❤️

And somewhere between noticing those little things and looking forward to seeing you, I realized something...

I really like you.

I don't know exactly when it happened. I just know that you became someone I genuinely care about and someone I wanted to be honest with.

I'm not expecting you to have the perfect answer right away. I don't want this website to put any pressure on you.

I just wanted you to know how I feel.

And if I'm being completely honest...

I'm still a little scared to say all of this out loud.

But I'm glad I finally found the courage to tell you.

— Tera Dibbu ❤️`;

  function formatLetterText(text) {
    return text.replace('I really like you.', '<strong style="color: var(--accent-gold); font-size: 1.25em;">I really like you.</strong>');
  }

  let typingIndex = 0;
  let typingTimer = null;
  let isTyping = false;

  function typeNextChar() {
    if (typingIndex < letterText.length) {
      let currentText = letterText.substring(0, typingIndex + 1);
      typedTarget.innerHTML = formatLetterText(currentText);
      typingIndex++;

      const letterBody = document.querySelector('.letter-body');
      if (letterBody) {
        letterBody.scrollTop = letterBody.scrollHeight;
      }

      typingTimer = setTimeout(typeNextChar, 35);
    } else {
      finishTyping();
    }
  }

  function finishTyping() {
    if (typingTimer) clearTimeout(typingTimer);
    isTyping = false;
    typedTarget.innerHTML = formatLetterText(letterText);
    if (actionsWrap) actionsWrap.classList.add('visible');
    if (skipBtn) skipBtn.style.display = 'none';
    setTimeout(() => {
      if (cursor) cursor.style.display = 'none';
    }, 2000);
  }

  function startEnvelopeOpen() {
    if (envelope.classList.contains('open')) return;

    envelope.classList.add('open');

    setTimeout(() => {
      if (letterStage) letterStage.classList.add('opened');
      isTyping = true;
      if (actionsWrap) actionsWrap.classList.add('visible');
      typeNextChar();
    }, 700);
  }

  envelope.addEventListener('click', startEnvelopeOpen);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startEnvelopeOpen();
    }
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      finishTyping();
    });
  }
}

/**
 * Masonry Gallery Lightbox Handler
 * Fullscreen view, Keyboard arrows/esc, Swipe support for touch
 */
function initGalleryLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-masonry-item'));
  const modal = document.querySelector('#lightbox-modal');
  if (!galleryItems.length || !modal) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalCounter = modal.querySelector('.lightbox-counter');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');

  let currentIndex = 0;
  let touchStartX = 0;

  function updateLightbox(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('.gallery-img');
    const title = item.getAttribute('data-title') || item.querySelector('.gallery-item-title')?.textContent || '';

    if (modalImg && img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt || title;
    }
    if (modalTitle) {
      modalTitle.textContent = title;
    }
    if (modalCounter) {
      modalCounter.textContent = `Memory ${currentIndex + 1} of ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    updateLightbox(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightbox(currentIndex + 1));

  // Close when clicking outside content box
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightbox(currentIndex + 1);
    }
  });

  // Touch Swipe navigation support
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance > 0) {
        updateLightbox(currentIndex - 1); // Swipe right -> previous
      } else {
        updateLightbox(currentIndex + 1); // Swipe left -> next
      }
    }
  }, { passive: true });
}

/**
 * 3D Glass Flip Cards Handler
 * Allows touch and click interaction on mobile and desktop
 */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card-container');
  flipCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/**
 * Story Timeline Intersection Observer
 * Smoothly reveals each timeline card as the user scrolls
 */
function initStoryTimeline() {
  const storyItems = document.querySelectorAll('.story-timeline-item');
  if (!storyItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  storyItems.forEach((item) => observer.observe(item));
}

/**
 * Premium Preloader with Percentage & Smooth Fade-Out
 * Locks page scroll until loading completes within max 2s
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('loader-percent');
  const barEl = document.getElementById('loader-bar');

  if (!preloader) return;

  // Lock scrolling during preloader screen
  document.body.classList.add('no-scroll');

  let progress = 0;
  const duration = 1350; // Total counting time 1.35 seconds
  const startTime = performance.now();

  function animateLoader(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

    if (percentEl) percentEl.textContent = `${progress}%`;
    if (barEl) barEl.style.width = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(animateLoader);
    } else {
      // Hold at 100% briefly, then initiate smooth fade out
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('no-scroll');

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 120);
    }
  }

  requestAnimationFrame(animateLoader);
}

function initParticleCanvas() {
  let canvas = document.getElementById('particles-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, { passive: true });

  // Twinkling Background Stars
  const stars = [];
  const starCount = Math.min(Math.floor((width * height) / 3000), 120);

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.005;
      this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.alpha += this.twinkleSpeed * this.twinkleDir;
      if (this.alpha >= 0.95 || this.alpha <= 0.1) {
        this.twinkleDir *= -1;
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 248, 235, ${Math.max(0.05, this.alpha)})`;
      ctx.shadowBlur = this.radius * 4;
      ctx.shadowColor = 'rgba(230, 194, 128, 0.8)';
      ctx.fill();
      ctx.restore();
    }
  }

  // Soft Moving Particles (Golden & Rose Ambient Floating Glow)
  const softParticles = [];
  const particleCount = Math.min(Math.floor(width / 22), 40);

  class SoftParticle {
    constructor() {
      this.reset();
    }

    reset() {
      const isMobile = width < 640;
      const laneWidth = isMobile ? 14 : 22;
      const isLeft = Math.random() < 0.5;
      const xPercent = isLeft
        ? (Math.random() * laneWidth + 2)
        : (Math.random() * laneWidth + (100 - laneWidth - 2));

      this.x = (xPercent / 100) * width;
      this.y = height + Math.random() * 80;
      this.radius = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.3;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.5 ? 'rgba(230, 194, 128,' : 'rgba(224, 82, 117,';
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.008) * 0.4;
      this.alpha += Math.sin(this.y * 0.02) * 0.005;

      if (this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${Math.max(0.1, this.alpha)})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color.includes('230') ? 'rgba(230, 194, 128, 0.6)' : 'rgba(224, 82, 117, 0.6)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  for (let i = 0; i < particleCount; i++) {
    softParticles.push(new SoftParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.update();
      s.draw();
    });

    softParticles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Interactive Questions Section Handler
 * Smooth transitions between questions with gentle reflection feedback.
 */
function initQuestionsSection() {
  const steps = document.querySelectorAll('.question-step');
  const progressBar = document.querySelector('#q-progress-bar');
  const badge = document.querySelector('#q-step-badge');
  const completionCard = document.querySelector('.completion-card');
  const qCard = document.querySelector('.question-card');

  if (!steps.length || !qCard) return;

  let currentStepIndex = 0;

  const reflections = {
    0: {
      "yes": "That's exactly how it felt when I met you, Mahima. Out of nowhere, you became the most special person in my life. ✨",
      "sometimes": "Sometimes life quietly surprises us when we least expect it. Meeting you was the best surprise I ever had. ❤️",
      "definitely": "Without a doubt... You unexpectedly brought so much light, warmth, and joy into my life. 🌟"
    },
    1: {
      "yes": "I believe in them too. Every small detail that led us to this moment feels like a beautiful coincidence designed by fate. ✨",
      "fate": "Destiny has a gentle way of connecting hearts. Crossing paths with you is the sweetest coincidence I cherish. 💖",
      "doubt": "Beyond a doubt! Out of billions of people, finding you feels like a miracle I'm grateful for every single day. 🌹"
    },
    2: {
      "yes": "Honesty means everything to me. That's why I created this website—to share my genuine feelings with complete truth. ❤️",
      "world": "It truly does. Every word here comes straight from my heart, honest and unfiltered, just for you. ✨",
      "always": "Always and forever. Honesty is the foundation of everything I feel and hold dear for you, Mahima. 🕊️"
    }
  };

  steps.forEach((step, stepIdx) => {
    const buttons = step.querySelectorAll('.q-btn');
    const reflectionBox = step.querySelector('.question-reflection');
    const nextBtn = step.querySelector('.btn-next-question');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Remove active class from sibling buttons
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-value') || 'yes';
        const text = reflections[stepIdx]?.[key] || "Thank you for sharing your heart with me.";

        if (reflectionBox) {
          reflectionBox.textContent = text;
          reflectionBox.classList.add('visible');
        }

        const nextWrap = step.querySelector('.question-next-wrap');
        if (nextWrap) {
          nextWrap.classList.add('visible');
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToStep(stepIdx + 1);
      });
    }
  });

  function goToStep(nextIndex) {
    if (nextIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      const nextStep = steps[nextIndex];

      // Smooth transition
      currentStep.classList.add('fade-out');
      setTimeout(() => {
        currentStep.classList.add('step-hidden');
        currentStep.classList.remove('fade-out');

        nextStep.classList.remove('step-hidden');
        nextStep.classList.add('fade-in');

        currentStepIndex = nextIndex;

        // Update progress bar & badge
        if (badge) {
          badge.textContent = `Question ${currentStepIndex + 1} of ${steps.length}`;
        }
        if (progressBar) {
          const percent = ((currentStepIndex + 1) / steps.length) * 100;
          progressBar.style.width = `${percent}%`;
        }
      }, 350);
    } else {
      // Show Completion Card
      const currentStep = steps[currentStepIndex];
      currentStep.classList.add('fade-out');
      setTimeout(() => {
        currentStep.classList.add('step-hidden');
        if (qCard) qCard.style.display = 'none';
        const progressBox = document.querySelector('.questions-progress-box');
        if (progressBox) progressBox.style.display = 'none';

        if (completionCard) {
          completionCard.classList.add('visible');
        }
      }, 350);
    }
  }
}

/**
 * Site Lock System
 * Requires password "you are mine" to unlock and view the website.
 * Remembers unlock state in localStorage.
 */
function initSiteLock() {
  const SECRET_PASSCODE = "you are mine";
  
  // Check if already unlocked
  if (localStorage.getItem('siteUnlocked') === 'true') {
    return;
  }

  // Disable scrolling while locked
  document.body.classList.add('no-scroll');

  // Create Lock Screen DOM element
  const overlay = document.createElement('div');
  overlay.className = 'site-lock-overlay';
  overlay.innerHTML = `
    <div class="site-lock-card">
      <div class="site-lock-icon" aria-hidden="true">🔒❤️</div>
      <h2 class="site-lock-title">Protected Experience</h2>
      <p class="site-lock-subtitle">Enter the secret passphrase to unlock this journey</p>
      
      <form class="site-lock-form" onsubmit="return false;">
        <div class="site-lock-input-group">
          <input type="password" class="site-lock-input" placeholder="Enter passphrase..." autocomplete="off" />
          <button type="button" class="toggle-pwd-btn" aria-label="Toggle password visibility">👁️</button>
        </div>
        <div class="site-lock-error" role="alert"></div>
        <button type="submit" class="site-lock-btn">Unlock My Heart 🔑</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector('.site-lock-input');
  const errorEl = overlay.querySelector('.site-lock-error');
  const card = overlay.querySelector('.site-lock-card');
  const form = overlay.querySelector('.site-lock-form');
  const toggleBtn = overlay.querySelector('.toggle-pwd-btn');

  // Focus input automatically
  setTimeout(() => {
    if (input) input.focus();
  }, 300);

  // Toggle Password Visibility
  if (toggleBtn && input) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  function attemptUnlock() {
    const userVal = input ? input.value.trim().toLowerCase() : '';

    if (userVal === SECRET_PASSCODE) {
      errorEl.classList.remove('visible');
      errorEl.textContent = '';
      
      localStorage.setItem('siteUnlocked', 'true');
      overlay.classList.add('unlocked');
      
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('no-scroll');
      }, 500);
    } else {
      errorEl.textContent = '❌ Incorrect passphrase! Please try again ❤️';
      errorEl.classList.add('visible');
      
      card.classList.remove('shake');
      void card.offsetWidth; // Trigger reflow
      card.classList.add('shake');
      
      if (input) {
        input.select();
        input.focus();
      }
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      attemptUnlock();
    });
  }
}


