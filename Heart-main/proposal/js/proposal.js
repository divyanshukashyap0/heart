/**
 * A Journey For Mahima - Interactive Proposal Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnYes = document.getElementById('btn-proposal-yes');
  const btnNo = document.getElementById('btn-proposal-no');
  const celebrationModal = document.getElementById('celebration-modal');

  let dodgeCount = 0;
  let yesScale = 1.0;

  const playfulPhrases = [
    "No 😜",
    "Are you sure? 🥺",
    "Think again! 🙈",
    "Nice try! 🏃‍♀️",
    "Catch me if you can! 😜",
    "Wrong button! 💕",
    "You can't click me! 😜",
    "Just say YES! ❤️",
    "YES is right there! 👇",
    "Still trying? 😜"
  ];

  // Function to move the No button away when hovered/touched/clicked
  function moveNoButton() {
    if (!btnNo) return;
    
    btnNo.classList.add('dodging');

    const buttonWidth = btnNo.offsetWidth || 140;
    const buttonHeight = btnNo.offsetHeight || 50;

    const maxLeft = window.innerWidth - buttonWidth - 40;
    const maxTop = window.innerHeight - buttonHeight - 40;

    const randomLeft = Math.max(20, Math.floor(Math.random() * Math.max(maxLeft, 50)));
    const randomTop = Math.max(20, Math.floor(Math.random() * Math.max(maxTop, 50)));

    btnNo.style.left = `${randomLeft}px`;
    btnNo.style.top = `${randomTop}px`;

    // Cycle through playful phrases
    dodgeCount++;
    const phraseIndex = dodgeCount % playfulPhrases.length;
    btnNo.textContent = playfulPhrases[phraseIndex];

    // Grow the YES button on each dodge attempt!
    if (btnYes && yesScale < 1.75) {
      yesScale += 0.08;
      btnYes.style.transform = `scale(${yesScale})`;
      btnYes.style.boxShadow = `0 0 ${30 + dodgeCount * 5}px rgba(230, 194, 128, ${Math.min(1, 0.45 + dodgeCount * 0.05)})`;
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('pointerenter', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      moveNoButton();
    });
    btnNo.addEventListener('focus', moveNoButton);
  }

  // YES ❤️ Button Click Handler
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      // Save current date and time and accepted state in localStorage
      localStorage.setItem('proposalAccepted', 'true');
      
      if (!localStorage.getItem('relationshipStart')) {
        localStorage.setItem('relationshipStart', new Date().toISOString());
      }
      
      // Trigger lightweight celebration
      triggerConfetti();
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = 'relationship.html';
      }, 1500);
    });
  }

  // Close celebration modal on backdrop click if needed
  if (celebrationModal) {
    celebrationModal.addEventListener('click', (e) => {
      if (e.target === celebrationModal) {
        celebrationModal.classList.remove('visible');
      }
    });
  }

  // Canvas Confetti Celebration Effect
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e05275', '#e6c280', '#ffffff', '#f8e1e7', '#f4acb7', '#ffd166'];

    for (let i = 0; i < 170; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.75) * 22,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.4 ? 'circle' : 'square'
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
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

        if (p.y > canvas.height) {
          particles.splice(idx, 1);
        }
      });

      if (particles.length > 0) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }

    render();
  }
});
