/**
 * ============================================================
 * 🎁 STAGE 8: THE FINAL GIFT BOX CELEBRATION
 * ============================================================
 */

const Stage8Gift = {
  isOpened: false,

  init() {
    this.isOpened = false;
    this.updateContent();
    this.bindEvents();
  },

  updateContent() {
    const finalGift = window.CONFIG && window.CONFIG.finalGift;
    const titleEl = document.getElementById('giftTitle');
    if (titleEl && finalGift) titleEl.textContent = finalGift.title;

    const messageEl = document.getElementById('giftFinalMessage');
    if (messageEl && finalGift) messageEl.textContent = finalGift.message;

    const emojisEl = document.getElementById('giftFinalEmojis');
    if (emojisEl && finalGift) emojisEl.textContent = finalGift.emojis;
  },

  onEnter() {
    this.reset();
  },

  bindEvents() {
    const giftBox = document.getElementById('interactiveGiftBox');
    const replayBtn = document.getElementById('btnReplayApp');

    if (giftBox && !giftBox._bound) {
      giftBox._bound = true;
      giftBox.addEventListener('click', () => this.openGift());
    }

    if (replayBtn && !replayBtn._bound) {
      replayBtn._bound = true;
      replayBtn.addEventListener('click', () => {
        window.AudioEngine.playClick();
        if (window.App) window.App.replay();
      });
    }
  },

  openGift() {
    if (this.isOpened) return;
    this.isOpened = true;

    // Fanfare and heavy confetti
    window.AudioEngine.playCelebration();
    window.ParticleEngine.burstCelebration();

    const giftBox = document.getElementById('interactiveGiftBox');
    const giftLid = document.getElementById('giftLid');
    const finalCard = document.getElementById('finalCelebrationCard');
    const titleEl = document.getElementById('giftTitle');

    if (giftBox) {
      giftBox.classList.add('opened');
      giftBox.style.animation = 'none';
    }

    // Animate lid flying off
    if (giftLid && typeof gsap !== 'undefined') {
      gsap.to(giftLid, {
        y: -90,
        rotation: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    // Explode box and reveal card
    setTimeout(() => {
      if (giftBox && typeof gsap !== 'undefined') {
        gsap.to(giftBox, { scale: 0, opacity: 0, duration: 0.5 });
      }

      const openedTitle = (window.CONFIG && window.CONFIG.finalGift && window.CONFIG.finalGift.openedTitle) || '🎉 Happy Birthday! 🎉';
      if (titleEl) {
        titleEl.textContent = openedTitle;
      }

      if (finalCard) {
        finalCard.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(finalCard,
            { scale: 0.7, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2)' }
          );
        } else {
          finalCard.style.opacity = '1';
        }
      }
    }, 900);
  },

  reset() {
    this.isOpened = false;

    const giftBox = document.getElementById('interactiveGiftBox');
    if (giftBox) {
      giftBox.classList.remove('opened');
      giftBox.style.animation = '';
      giftBox.style.transform = '';
      giftBox.style.opacity = '1';
      giftBox.style.display = 'block';
    }

    const giftLid = document.getElementById('giftLid');
    if (giftLid) {
      giftLid.style.transform = '';
      giftLid.style.opacity = '1';
    }

    const finalCard = document.getElementById('finalCelebrationCard');
    if (finalCard) finalCard.classList.add('hidden');

    const finalGift = window.CONFIG && window.CONFIG.finalGift;
    const titleEl = document.getElementById('giftTitle');
    if (titleEl && finalGift) titleEl.textContent = finalGift.title;
  }
};

window.Stage8Gift = Stage8Gift;

