/**
 * ============================================================
 * 🎈 STAGE 3: BALLOON POP MINI-GAME
 * ============================================================
 */

const Stage3Balloons = {
  poppedCount: 0,
  totalBalloons: 4,

  init() {
    this.poppedCount = 0;
    this.totalBalloons = (window.CONFIG && window.CONFIG.balloons) ? window.CONFIG.balloons.length : 4;
    this.bindEvents();
  },

  bindEvents() {
    const nextBtn = document.getElementById('balloonNextBtn');
    if (nextBtn && !nextBtn._bound) {
      nextBtn._bound = true;
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.AudioEngine.playClick();
        if (window.App) window.App.goToStage(4);
      });
    }
  },

  onEnter() {
    this.reset();
    this.renderBalloons();
    this.updateCounter();
    this.bindEvents();
  },

  renderBalloons() {
    const container = document.getElementById('balloonPlayArea');
    if (!container) return;

    container.innerHTML = '';
    const balloonsData = (window.CONFIG && window.CONFIG.balloons) || [
      { text: 'You', color: '#fda4af' },
      { text: 'are', color: '#c4b5fd' },
      { text: 'so', color: '#93c5fd' },
      { text: 'special 💖', color: '#fde68a' }
    ];

    // Responsive positions for 4 balloons
    const positions = [
      { left: '16%', top: '22%' },
      { left: '62%', top: '15%' },
      { left: '22%', top: '56%' },
      { left: '68%', top: '50%' },
    ];

    balloonsData.forEach((item, index) => {
      const pos = positions[index] || { left: `${20 + index * 20}%`, top: '40%' };

      // Card wrapper for balloon + revealed secret
      const wrapper = document.createElement('div');
      wrapper.className = 'balloon-wrapper';
      wrapper.style.left = pos.left;
      wrapper.style.top = pos.top;

      // Hidden secret text underneath
      const secret = document.createElement('div');
      secret.className = 'balloon-secret';
      secret.textContent = item.text;

      // The balloon element
      const balloon = document.createElement('div');
      balloon.className = 'balloon-item';
      balloon.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0%, ${item.color} 45%, ${this.adjustColor(item.color, -25)} 100%)`;
      balloon.style.boxShadow = `0 10px 25px ${item.glow || 'rgba(0,0,0,0.15)'}`;

      // Balloon knot and string
      const knot = document.createElement('div');
      knot.className = 'balloon-knot';
      knot.style.borderBottomColor = item.color;

      const string = document.createElement('div');
      string.className = 'balloon-string';

      balloon.appendChild(knot);
      balloon.appendChild(string);

      // Gentle floating animation
      if (typeof gsap !== 'undefined') {
        gsap.to(balloon, {
          y: -14,
          rotation: (index % 2 === 0 ? 3 : -3),
          duration: 1.8 + index * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      // Handle both touch & click seamlessly
      const handlePop = (e) => {
        e.stopPropagation();
        this.popBalloon(balloon, secret, item.color, e);
      };

      balloon.addEventListener('pointerdown', handlePop);
      balloon.addEventListener('click', handlePop);

      wrapper.appendChild(secret);
      wrapper.appendChild(balloon);
      container.appendChild(wrapper);
    });
  },

  popBalloon(balloonEl, secretEl, color, event) {
    if (balloonEl.classList.contains('popped')) return;
    balloonEl.classList.add('popped');
    balloonEl.style.pointerEvents = 'none';

    // Sound effect
    const pitch = 0.9 + (this.poppedCount * 0.15);
    window.AudioEngine.playPop(pitch);

    // Confetti particles at click location
    const rect = balloonEl.getBoundingClientRect();
    window.ParticleEngine.burstBalloon(rect.left + rect.width / 2, rect.top + rect.height / 2, color);

    // Pop animation with GSAP or CSS
    if (typeof gsap !== 'undefined') {
      gsap.to(balloonEl, {
        scale: 1.4,
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          balloonEl.style.display = 'none';
          // Reveal secret word
          secretEl.classList.add('revealed');
          gsap.fromTo(secretEl,
            { scale: 0, opacity: 0, y: 10 },
            { scale: 1.1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }
          );
        }
      });
    } else {
      balloonEl.style.display = 'none';
      secretEl.classList.add('revealed');
    }

    this.poppedCount++;
    this.updateCounter();

    if (this.poppedCount >= this.totalBalloons) {
      setTimeout(() => this.onAllPopped(), 450);
    }
  },

  updateCounter() {
    const counterEl = document.getElementById('balloonCounter');
    if (counterEl) {
      counterEl.textContent = `${this.poppedCount} / ${this.totalBalloons} popped`;
    }
  },

  onAllPopped() {
    window.AudioEngine.playCelebration();
    window.ParticleEngine.burstSuccess(0.4);

    const resultBanner = document.getElementById('balloonResult');
    if (resultBanner) {
      resultBanner.textContent = (window.CONFIG && window.CONFIG.balloonCompletedText) || 'You are so special to me! 💖✨';
      resultBanner.classList.remove('hidden');
      resultBanner.classList.remove('opacity-0');
      resultBanner.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.to(resultBanner, { opacity: 1, y: 0, duration: 0.5 });
      } else {
        resultBanner.style.opacity = '1';
      }
    }

    const nextBtn = document.getElementById('balloonNextBtn');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.classList.remove('opacity-0');
      nextBtn.style.display = 'inline-flex';
      nextBtn.style.pointerEvents = 'all';
      nextBtn.style.opacity = '1';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(nextBtn,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }
        );
      } else {
        nextBtn.style.opacity = '1';
      }
    }
  },

  adjustColor(col, amt) {
    let usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let b = ((num >> 8) & 0x00FF) + amt;
    let g = (num & 0x0000FF) + amt;
    r = Math.min(255, Math.max(0, r));
    b = Math.min(255, Math.max(0, b));
    g = Math.min(255, Math.max(0, g));
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  },

  reset() {
    this.poppedCount = 0;
    const resultBanner = document.getElementById('balloonResult');
    if (resultBanner) {
      resultBanner.classList.add('hidden');
      resultBanner.classList.add('opacity-0');
      resultBanner.style.display = 'none';
      resultBanner.style.opacity = '0';
    }

    const nextBtn = document.getElementById('balloonNextBtn');
    if (nextBtn) {
      nextBtn.classList.add('hidden');
      nextBtn.classList.add('opacity-0');
      nextBtn.style.display = 'none';
      nextBtn.style.opacity = '0';
      nextBtn.style.pointerEvents = 'none';
    }
  }
};

window.Stage3Balloons = Stage3Balloons;
