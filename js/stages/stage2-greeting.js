/**
 * ============================================================
 * 🧸 STAGE 2: BIRTHDAY GREETING & DODGING BUTTON
 * ============================================================
 */

const Stage2Greeting = {
  dodgeCount: 0,

  init() {
    this.dodgeCount = 0;
    this.updateContent();
    this.bindEvents();
  },

  updateContent() {
    const greeting = window.CONFIG ? window.CONFIG.greeting : null;
    const name = window.CONFIG ? window.CONFIG.name : 'Abhinay';

    const titleEl = document.getElementById('greetingTitle');
    if (titleEl) titleEl.textContent = `Happy Birthday, ${name} 💖`;

    const promptEl = document.getElementById('greetingPrompt');
    if (promptEl && greeting) promptEl.textContent = greeting.subtitle;

    const yesBtn = document.getElementById('btnYes');
    if (yesBtn && greeting) yesBtn.textContent = greeting.yesText;

    const noBtn = document.getElementById('btnNo');
    if (noBtn && greeting) {
      noBtn.textContent = greeting.noText;
      noBtn.style.transform = 'translate(0px, 0px)';
    }
  },

  onEnter() {
    // Soft celebration confetti when entering screen 2
    window.ParticleEngine.burstSuccess(0.35);

    // Bounce the cute sticker
    const sticker = document.getElementById('cuteSticker');
    if (sticker && typeof gsap !== 'undefined') {
      gsap.fromTo(sticker,
        { scale: 0.4, rotation: -15, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)' }
      );
    }
  },

  bindEvents() {
    const noBtn = document.getElementById('btnNo');
    const yesBtn = document.getElementById('btnYes');

    if (noBtn && !noBtn._bound) {
      noBtn._bound = true;

      const handleDodge = (e) => {
        e.preventDefault();
        this.dodgeNoButton(noBtn);
      };

      noBtn.addEventListener('mouseenter', handleDodge);
      noBtn.addEventListener('touchstart', handleDodge, { passive: false });
      noBtn.addEventListener('click', handleDodge);
    }

    if (yesBtn && !yesBtn._bound) {
      yesBtn._bound = true;
      yesBtn.addEventListener('click', () => {
        window.AudioEngine.playSuccess();
        window.ParticleEngine.burstSuccess(0.6);
        setTimeout(() => {
          if (window.App) window.App.goToStage(3);
        }, 400);
      });
    }
  },

  dodgeNoButton(btn) {
    window.AudioEngine.playClick();
    this.dodgeCount++;

    const greeting = window.CONFIG ? window.CONFIG.greeting : null;
    const responses = (greeting && greeting.dodgeResponses) || ['Nope! 😜', 'Too fast! 💨', 'Try again! 🙈'];
    btn.textContent = responses[(this.dodgeCount - 1) % responses.length];

    // Calculate a playful safe offset that doesn't fly off the screen
    const maxOffset = 110;
    const randX = (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * (maxOffset - 45));
    const randY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 50);

    if (typeof gsap !== 'undefined') {
      gsap.to(btn, {
        x: randX,
        y: randY,
        rotation: (Math.random() - 0.5) * 20,
        duration: 0.25,
        ease: 'power2.out'
      });
    } else {
      btn.style.transform = `translate(${randX}px, ${randY}px)`;
    }
  },

  reset() {
    this.dodgeCount = 0;
    const noBtn = document.getElementById('btnNo');
    if (noBtn) {
      const greeting = window.CONFIG ? window.CONFIG.greeting : null;
      noBtn.textContent = (greeting && greeting.noText) || 'No 😐';
      if (typeof gsap !== 'undefined') {
        gsap.set(noBtn, { x: 0, y: 0, rotation: 0 });
      } else {
        noBtn.style.transform = 'translate(0px, 0px)';
      }
    }
  }
};

window.Stage2Greeting = Stage2Greeting;

