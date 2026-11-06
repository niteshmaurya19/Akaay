/**
 * ============================================================
 * 🎂 STAGE 4: BLOW THE CANDLE (MIC OR TAP)
 * ============================================================
 */

const Stage4Candle = {
  isBlown: false,
  isListeningMic: false,
  autoTransitionTimer: null,

  init() {
    this.isBlown = false;
    this.isListeningMic = false;
    this.updateContent();
    this.bindEvents();
  },

  updateContent() {
    const name = (window.CONFIG && window.CONFIG.name) || 'Abhinay';
    const candleConf = window.CONFIG && window.CONFIG.candle;

    const titleEl = document.getElementById('candleTitle');
    if (titleEl) titleEl.textContent = (candleConf && candleConf.title) || `Blow the candle, ${name} 🎂`;

    const wishEl = document.getElementById('candleWishMessage');
    if (wishEl) wishEl.textContent = (candleConf && candleConf.wishMessage) || 'Close your eyes & make a wish... ✨';
  },

  onEnter() {
    this.reset();
  },

  bindEvents() {
    const micBtn = document.getElementById('btnBlowMic');
    const tapBtn = document.getElementById('btnBlowTap');
    const cakeContainer = document.getElementById('cakeGraphic');
    const candleNextBtn = document.getElementById('candleNextBtn');

    if (micBtn && !micBtn._bound) {
      micBtn._bound = true;
      micBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMic();
      });
    }

    if (tapBtn && !tapBtn._bound) {
      tapBtn._bound = true;
      tapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.extinguishFlame();
      });
    }

    if (cakeContainer && !cakeContainer._bound) {
      cakeContainer._bound = true;
      cakeContainer.addEventListener('click', () => this.extinguishFlame());
    }

    if (candleNextBtn && !candleNextBtn._bound) {
      candleNextBtn._bound = true;
      candleNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.proceedToNext();
      });
    }
  },

  toggleMic() {
    if (this.isBlown) return;
    const micBtn = document.getElementById('btnBlowMic');

    if (this.isListeningMic) {
      window.AudioEngine.stopMicDetection();
      this.isListeningMic = false;
      if (micBtn) {
        micBtn.innerHTML = `<span>🎤</span> Blow into the mic`;
        micBtn.classList.remove('mic-active');
      }
      return;
    }

    this.isListeningMic = true;
    if (micBtn) {
      micBtn.innerHTML = `<span>🎙️</span> Listening... Blow now! 💨`;
      micBtn.classList.add('mic-active');
    }

    window.AudioEngine.startMicDetection(
      () => {
        // Microphone blow detected!
        this.isListeningMic = false;
        if (micBtn) {
          micBtn.innerHTML = `<span>✨</span> Blown out!`;
          micBtn.classList.remove('mic-active');
        }
        this.extinguishFlame();
      },
      (errMsg) => {
        // Mic error or permission denied
        this.isListeningMic = false;
        if (micBtn) {
          micBtn.innerHTML = `<span>⚠️</span> Mic unavailable (use tap!)`;
          micBtn.classList.remove('mic-active');
        }
      }
    );
  },

  extinguishFlame() {
    if (this.isBlown) return;
    this.isBlown = true;

    // Stop mic if running
    window.AudioEngine.stopMicDetection();
    this.isListeningMic = false;

    // Play whoosh sound
    window.AudioEngine.playWhoosh();

    // Extinguish flame animation
    const flame = document.getElementById('candleFlame');
    if (flame) {
      flame.classList.add('extinguished');
    }

    // Spawn smoke puffs
    this.createSmokePuffs();

    // Dim the screen slightly for warm romantic ambience
    const screen4 = document.getElementById('screen4');
    if (screen4) {
      screen4.classList.add('candle-dimmed');
    }

    // Hide blow action buttons
    const blowActions = document.getElementById('blowActions');
    if (blowActions) {
      if (typeof gsap !== 'undefined') {
        gsap.to(blowActions, { opacity: 0, y: 15, duration: 0.35, pointerEvents: 'none' });
      } else {
        blowActions.style.opacity = '0';
        blowActions.style.pointerEvents = 'none';
      }
    }

    // Reveal wish message and manual continue button
    const wishBox = document.getElementById('candleWishBox');
    if (wishBox) {
      wishBox.classList.remove('hidden');
      wishBox.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(wishBox,
          { opacity: 0, scale: 0.85, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' }
        );
      } else {
        wishBox.style.opacity = '1';
      }
    }

    // Soft celebration chime after blowing
    setTimeout(() => {
      window.AudioEngine.playChime(3);
    }, 600);

    // Auto transition to stage 5 after delay
    const delay = (window.CONFIG && window.CONFIG.candle && window.CONFIG.candle.autoTransitionDelayMs) || 2800;
    clearTimeout(this.autoTransitionTimer);
    this.autoTransitionTimer = setTimeout(() => {
      this.proceedToNext();
    }, delay);
  },

  proceedToNext() {
    clearTimeout(this.autoTransitionTimer);
    window.ParticleEngine.burstSuccess(0.5);
    if (window.App) window.App.goToStage(5);
  },

  createSmokePuffs() {
    const smokeContainer = document.getElementById('smokeContainer');
    if (!smokeContainer) return;

    smokeContainer.innerHTML = '';
    const count = 7;

    for (let i = 0; i < count; i++) {
      const puff = document.createElement('div');
      puff.className = 'smoke-particle';
      puff.style.left = `${(Math.random() - 0.5) * 16}px`;
      puff.style.animationDelay = `${i * 0.12}s`;
      puff.style.animationDuration = `${1.2 + Math.random() * 0.6}s`;
      smokeContainer.appendChild(puff);
    }
  },

  reset() {
    this.isBlown = false;
    this.isListeningMic = false;
    clearTimeout(this.autoTransitionTimer);
    window.AudioEngine.stopMicDetection();

    const flame = document.getElementById('candleFlame');
    if (flame) flame.classList.remove('extinguished');

    const smokeContainer = document.getElementById('smokeContainer');
    if (smokeContainer) smokeContainer.innerHTML = '';

    const screen4 = document.getElementById('screen4');
    if (screen4) screen4.classList.remove('candle-dimmed');

    const blowActions = document.getElementById('blowActions');
    if (blowActions) {
      blowActions.style.opacity = '1';
      blowActions.style.pointerEvents = 'all';
    }

    const wishBox = document.getElementById('candleWishBox');
    if (wishBox) {
      wishBox.classList.add('hidden');
      wishBox.style.display = 'none';
      wishBox.style.opacity = '0';
    }

    const micBtn = document.getElementById('btnBlowMic');
    if (micBtn) {
      micBtn.innerHTML = `<span>🎤</span> Blow into the mic`;
      micBtn.classList.remove('mic-active');
    }
  }
};

window.Stage4Candle = Stage4Candle;
