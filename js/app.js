/**
 * ============================================================
 * 📱 MAIN APP CONTROLLER & SCREEN TRANSITIONS
 * ============================================================
 * Coordinates the full multi-step interactive birthday flow,
 * stage lifecycles, background music toggle, and app replay.
 */

class BirthdayApp {
  constructor() {
    this.currentStage = 1;
    this.totalStages = 8;
    this.isTransitioning = false;
    this._transitionTimer = null;
  }

  init() {
    // 1. Initialize Particles & Touch Sparkles
    if (window.ParticleEngine) {
      window.ParticleEngine.initBackgroundHearts();
      window.ParticleEngine.initTouchSparks();
    }

    // 2. Setup Music Toggle Button
    this.setupMusicToggle();

    // 3. Initialize all stage modules
    if (window.Stage1Passcode) window.Stage1Passcode.init();
    if (window.Stage2Greeting) window.Stage2Greeting.init();
    if (window.Stage3Balloons) window.Stage3Balloons.init();
    if (window.Stage4Candle) window.Stage4Candle.init();
    if (window.Stage5Bouquet) window.Stage5Bouquet.init();
    if (window.Stage6Polaroids) window.Stage6Polaroids.init();
    if (window.Stage7Letter) window.Stage7Letter.init();
    if (window.Stage8Gift) window.Stage8Gift.init();

    // 4. Show initial stage
    this.showStage(1, false);
  }

  setupMusicToggle() {
    const musicBtn = document.getElementById('musicToggleBtn');
    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
      if (!window.AudioEngine) return;
      const isPlaying = window.AudioEngine.toggleMusic();

      if (isPlaying) {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = `
          <span class="music-icon animate-spin-slow">🎵</span>
          <span class="music-waves">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </span>
        `;
        musicBtn.title = 'Mute Music';
      } else {
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = `<span class="music-icon">🔇</span>`;
        musicBtn.title = 'Play Music';
      }
    });
  }

  goToStage(stageNumber) {
    if (stageNumber === this.currentStage) return;

    // Reset transition safety lock
    this.isTransitioning = true;
    clearTimeout(this._transitionTimer);
    this._transitionTimer = setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);

    const currentScreenEl = document.getElementById(`screen${this.currentStage}`);
    const nextScreenEl = document.getElementById(`screen${stageNumber}`);

    if (!currentScreenEl || !nextScreenEl) {
      this.isTransitioning = false;
      return;
    }

    // Kill any existing conflicting animations on these screens
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(currentScreenEl);
      gsap.killTweensOf(nextScreenEl);

      // Animate out current screen
      gsap.to(currentScreenEl, {
        opacity: 0,
        scale: 0.94,
        y: -20,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          currentScreenEl.classList.remove('active');
          currentScreenEl.style.transform = '';
          currentScreenEl.style.display = 'none';

          // Activate next screen
          nextScreenEl.style.display = 'flex';
          nextScreenEl.classList.add('active');
          nextScreenEl.style.pointerEvents = 'all';

          gsap.fromTo(nextScreenEl,
            { opacity: 0, scale: 1.05, y: 25 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
              onComplete: () => {
                this.currentStage = stageNumber;
                this.isTransitioning = false;
                this.triggerStageEnter(stageNumber);
              }
            }
          );
        }
      });
    } else {
      // Fallback
      currentScreenEl.classList.remove('active');
      currentScreenEl.style.display = 'none';
      nextScreenEl.style.display = 'flex';
      nextScreenEl.classList.add('active');
      this.currentStage = stageNumber;
      this.isTransitioning = false;
      this.triggerStageEnter(stageNumber);
    }
  }

  showStage(stageNumber, triggerLifecycle = true) {
    for (let i = 1; i <= this.totalStages; i++) {
      const scr = document.getElementById(`screen${i}`);
      if (!scr) continue;
      if (i === stageNumber) {
        scr.style.display = 'flex';
        scr.classList.add('active');
        scr.style.opacity = '1';
        scr.style.transform = 'none';
        scr.style.pointerEvents = 'all';
      } else {
        scr.classList.remove('active');
        scr.style.display = 'none';
        scr.style.opacity = '0';
        scr.style.pointerEvents = 'none';
      }
    }
    this.currentStage = stageNumber;
    if (triggerLifecycle) {
      this.triggerStageEnter(stageNumber);
    }
  }

  triggerStageEnter(stageNumber) {
    switch (stageNumber) {
      case 1:
        if (window.Stage1Passcode) window.Stage1Passcode.reset();
        break;
      case 2:
        if (window.Stage2Greeting) window.Stage2Greeting.onEnter();
        break;
      case 3:
        if (window.Stage3Balloons) window.Stage3Balloons.onEnter();
        break;
      case 4:
        if (window.Stage4Candle) window.Stage4Candle.onEnter();
        break;
      case 5:
        if (window.Stage5Bouquet) window.Stage5Bouquet.onEnter();
        break;
      case 6:
        if (window.Stage6Polaroids) window.Stage6Polaroids.onEnter();
        break;
      case 7:
        if (window.Stage7Letter) window.Stage7Letter.onEnter();
        break;
      case 8:
        if (window.Stage8Gift) window.Stage8Gift.onEnter();
        break;
    }
  }

  replay() {
    // Reset all stages
    if (window.Stage1Passcode) window.Stage1Passcode.reset();
    if (window.Stage2Greeting) window.Stage2Greeting.reset();
    if (window.Stage3Balloons) window.Stage3Balloons.reset();
    if (window.Stage4Candle) window.Stage4Candle.reset();
    if (window.Stage5Bouquet) window.Stage5Bouquet.reset();
    if (window.Stage6Polaroids) window.Stage6Polaroids.reset();
    if (window.Stage7Letter) window.Stage7Letter.reset();
    if (window.Stage8Gift) window.Stage8Gift.reset();

    // Transition back to stage 1 with a celebration sparkle
    window.ParticleEngine.burstSuccess(0.5);
    this.goToStage(1);
  }
}

// Instantiate and start when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.App = new BirthdayApp();
  window.App.init();
});
