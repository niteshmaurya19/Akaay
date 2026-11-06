/**
 * ============================================================
 * 🌹 STAGE 5: INTERACTIVE ROSE BOUQUET
 * ============================================================
 */

const Stage5Bouquet = {
  revealedCount: 0,
  quotes: [],

  init() {
    this.revealedCount = 0;
    this.quotes = (window.CONFIG && window.CONFIG.bouquet && window.CONFIG.bouquet.quotes) || [
      'Forever yours 🤍',
      'You make my world beautiful 🌸',
      'Happy Birthday, My Favorite Person 🎂',
      'You are my sunshine ✨',
      'You are my favorite person 💖'
    ];
    this.bindEvents();
  },

  onEnter() {
    this.revealedCount = 0;
    const quotesContainer = document.getElementById('bouquetQuotesContainer');
    if (quotesContainer) quotesContainer.innerHTML = '';

    const counter = document.getElementById('bouquetCounter');
    if (counter) counter.textContent = 'Tap the bouquet to reveal sweet thoughts 🌸';

    // Bounce the bouquet on entry
    const bouquet = document.getElementById('interactiveBouquet');
    if (bouquet && typeof gsap !== 'undefined') {
      gsap.fromTo(bouquet,
        { scale: 0.7, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }
      );
    }
  },

  bindEvents() {
    const bouquet = document.getElementById('interactiveBouquet');
    const continueBtn = document.getElementById('bouquetContinueBtn');

    if (bouquet && !bouquet._bound) {
      bouquet._bound = true;
      bouquet.addEventListener('click', () => this.tapBouquet());
    }

    if (continueBtn && !continueBtn._bound) {
      continueBtn._bound = true;
      continueBtn.addEventListener('click', () => {
        window.AudioEngine.playClick();
        if (window.App) window.App.goToStage(6);
      });
    }
  },

  tapBouquet() {
    const bouquet = document.getElementById('interactiveBouquet');
    const quotesContainer = document.getElementById('bouquetQuotesContainer');
    if (!bouquet || !quotesContainer) return;

    // Play chime sound with varying pitch
    window.AudioEngine.playChime(this.revealedCount);

    // Bouquet bounce / pulse animation
    if (typeof gsap !== 'undefined') {
      gsap.to(bouquet, {
        scale: 1.15,
        rotation: (Math.random() - 0.5) * 12,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      });
    }

    // Pick quote (cycles cleanly if clicked more times)
    const quoteIndex = this.revealedCount % this.quotes.length;
    const text = this.quotes[quoteIndex];

    // Create quote bubble
    const bubble = document.createElement('div');
    bubble.className = 'quote-bubble';
    bubble.textContent = text;

    // Calculate dynamic radial or scattered position around the bouquet
    // Angle in radians
    const angles = [-75, 75, -145, 145, -25, 25, -110, 110];
    const angleDeg = angles[this.revealedCount % angles.length];
    const rad = angleDeg * (Math.PI / 180);
    const distance = 110 + (Math.random() * 30);

    const offsetX = Math.sin(rad) * distance;
    const offsetY = -Math.cos(rad) * distance * 0.9;

    bubble.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0)`;
    quotesContainer.appendChild(bubble);

    // Animate bubble appearance
    if (typeof gsap !== 'undefined') {
      gsap.to(bubble, {
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1)`,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(2)'
      });
    } else {
      bubble.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1)`;
      bubble.style.opacity = '1';
    }

    this.revealedCount++;

    // Update status hint
    const counter = document.getElementById('bouquetCounter');
    if (counter) {
      counter.textContent = `${this.revealedCount} sweet note${this.revealedCount > 1 ? 's' : ''} revealed 💌`;
    }

    // Light heart sparkles from bouquet
    const rect = bouquet.getBoundingClientRect();
    window.ParticleEngine.burstBalloon(rect.left + rect.width / 2, rect.top + rect.height / 2, '#fb7185');
  },

  reset() {
    this.revealedCount = 0;
    const quotesContainer = document.getElementById('bouquetQuotesContainer');
    if (quotesContainer) quotesContainer.innerHTML = '';
  }
};

window.Stage5Bouquet = Stage5Bouquet;

