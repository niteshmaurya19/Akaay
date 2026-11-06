/**
 * ============================================================
 * ✨ PARTICLES, FLOATING HEARTS & CONFETTI ENGINE
 * ============================================================
 * Handles soft ambient background particles, interactive click hearts,
 * and high-aesthetic canvas-confetti bursts.
 */

const ParticleEngine = {
  // Initialize ambient floating hearts in the background
  initBackgroundHearts() {
    const container = document.getElementById('floatingHeartsBg');
    if (!container) return;

    container.innerHTML = '';
    const heartSymbols = ['🌸', '💖', '✨', '🤍', '💗', '🎀', '🧁', '🌷', '💕'];
    const count = window.innerWidth < 640 ? 16 : 28;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'ambient-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      
      const left = Math.random() * 100;
      const size = 0.8 + Math.random() * 1.1; // rem
      const duration = 9 + Math.random() * 10; // seconds
      const delay = Math.random() * 12; // seconds
      const opacity = 0.2 + Math.random() * 0.35;

      heart.style.left = `${left}%`;
      heart.style.fontSize = `${size}rem`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.opacity = opacity;

      container.appendChild(heart);
    }
  },

  // Interactive tap / click mini heart burst
  initTouchSparks() {
    const handleTap = (e) => {
      // Don't trigger if clicking on inputs or buttons to avoid distracting lag
      const target = e.target;
      if (target.closest('.key-btn') || target.closest('.balloon')) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!clientX || !clientY) return;

      const spark = document.createElement('span');
      spark.className = 'click-sparkle';
      const symbols = ['💖', '✨', '🌸', '🤍'];
      spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spark.style.left = `${clientX}px`;
      spark.style.top = `${clientY}px`;

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 900);
    };

    window.addEventListener('click', handleTap, { passive: true });
    window.addEventListener('touchstart', handleTap, { passive: true });
  },

  // Confetti Presets
  burstSuccess(originY = 0.6) {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: originY },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#c084fc', '#ffffff'],
      shapes: ['circle', 'square'],
      scalar: 1.1
    });
  },

  burstBalloon(x, y, color) {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 25,
      spread: 45,
      startVelocity: 18,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight
      },
      colors: [color, '#ffffff', '#fed7aa']
    });
  },

  burstCelebration() {
    if (typeof confetti !== 'function') return;
    const duration = 2800;
    const end = Date.now() + duration;
    const colors = ['#f43f5e', '#fb7185', '#f472b6', '#fbbf24', '#a855f7', '#60a5fa', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }
};

window.ParticleEngine = ParticleEngine;

