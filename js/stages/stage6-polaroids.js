/**
 * ============================================================
 * 📸 STAGE 6: SWEET MOMENTS (POLAROID PHOTO DECK)
 * ============================================================
 */

const Stage6Polaroids = {
  cardsData: [],
  currentIndex: 0,

  init() {
    this.cardsData = (window.CONFIG && window.CONFIG.polaroids) || [
      { type: 'emoji', emoji: '🥰', caption: 'The day we first met', date: 'Day 1 💕' },
      { type: 'emoji', emoji: '🌅', caption: 'Our favorite sunset', date: 'Golden Hour ✨' },
      { type: 'emoji', emoji: '🎭', caption: 'Being silly together', date: 'Pure Smiles 😂' },
      { type: 'emoji', emoji: '☕', caption: 'Cozy coffee dates', date: 'Sweet Moments ☕' },
      { type: 'emoji', emoji: '✨', caption: 'Forever & always', date: 'Endless Love 🤍' },
    ];
    this.bindEvents();
  },

  onEnter() {
    this.renderDeck();
  },

  bindEvents() {
    const nextBtn = document.getElementById('polaroidNextBtn');
    if (nextBtn && !nextBtn._bound) {
      nextBtn._bound = true;
      nextBtn.addEventListener('click', () => {
        window.AudioEngine.playClick();
        if (window.App) window.App.goToStage(7);
      });
    }

    const resetBtn = document.getElementById('polaroidResetDeck');
    if (resetBtn && !resetBtn._bound) {
      resetBtn._bound = true;
      resetBtn.addEventListener('click', () => {
        window.AudioEngine.playClick();
        this.renderDeck();
      });
    }
  },

  renderDeck() {
    const deck = document.getElementById('polaroidDeck');
    if (!deck) return;

    deck.innerHTML = '';
    this.currentIndex = 0;
    this.updateCounter();

    const total = this.cardsData.length;

    // Render cards from bottom to top
    this.cardsData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.dataset.index = index;

      // Subtle random rotation for natural stacked polaroid look
      const rot = (index % 2 === 0 ? 1 : -1) * ((total - index) * 1.8 + Math.random() * 2);
      const scale = 1 - (index * 0.02);
      card.style.zIndex = total - index;
      card.style.transform = `rotate(${rot}deg) scale(${scale})`;

      // Content inside card
      let photoContent = '';
      if (item.type === 'image' && item.src) {
        photoContent = `<img src="${item.src}" alt="${item.caption}" class="polaroid-image" />`;
      } else {
        photoContent = `
          <div class="polaroid-placeholder">
            <span class="text-6xl">${item.emoji || '💖'}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-frame">
          ${photoContent}
          <div class="polaroid-meta">
            <p class="polaroid-caption">${item.caption}</p>
            <span class="polaroid-date">${item.date || ''}</span>
          </div>
        </div>
      `;

      this.attachSwipeListeners(card);
      deck.appendChild(card);
    });
  },

  attachSwipeListeners(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let hasMoved = false;

    const onStart = (clientX, clientY) => {
      // Only the top card can be dragged
      const topCard = this.getTopCard();
      if (topCard !== card) return;

      startX = clientX;
      startY = clientY;
      currentX = 0;
      currentY = 0;
      isDragging = true;
      hasMoved = false;
      card.style.transition = 'none';
      card.classList.add('dragging');
    };

    const onMove = (clientX, clientY) => {
      if (!isDragging) return;
      currentX = clientX - startX;
      currentY = clientY - startY;

      if (Math.abs(currentX) > 8 || Math.abs(currentY) > 8) {
        hasMoved = true;
      }

      const rotate = currentX * 0.08;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('dragging');
      card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

      // If dragged past threshold, dismiss card
      if (Math.abs(currentX) > 85) {
        const direction = currentX > 0 ? 1 : -1;
        this.dismissCard(card, direction);
      } else if (!hasMoved) {
        // Simple tap also reveals next card
        this.dismissCard(card, 1);
      } else {
        // Snap back
        card.style.transform = `translate(0px, 0px) rotate(${(Math.random() - 0.5) * 6}deg)`;
      }
    };

    // Touch events
    card.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      onStart(touch.clientX, touch.clientY);
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      onMove(touch.clientX, touch.clientY);
    }, { passive: true });

    card.addEventListener('touchend', onEnd);

    // Mouse events (Desktop drag support)
    card.addEventListener('mousedown', (e) => {
      onStart(e.clientX, e.clientY);

      const onMouseMove = (ev) => onMove(ev.clientX, ev.clientY);
      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        onEnd();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  },

  getTopCard() {
    const deck = document.getElementById('polaroidDeck');
    if (!deck) return null;
    const cards = deck.querySelectorAll('.polaroid-card:not(.dismissed)');
    return cards.length > 0 ? cards[0] : null;
  },

  dismissCard(card, direction) {
    if (card.classList.contains('dismissed')) return;
    card.classList.add('dismissed');

    window.AudioEngine.playSwoosh();

    const targetX = direction * (window.innerWidth + 200);
    const targetRot = direction * 35;

    if (typeof gsap !== 'undefined') {
      gsap.to(card, {
        x: targetX,
        y: targetRot * 2,
        rotation: targetRot,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          card.style.display = 'none';
          this.currentIndex++;
          this.updateCounter();
        }
      });
    } else {
      card.style.transform = `translate(${targetX}px, 0px) rotate(${targetRot}deg)`;
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.display = 'none';
        this.currentIndex++;
        this.updateCounter();
      }, 400);
    }
  },

  updateCounter() {
    const total = this.cardsData.length;
    const counter = document.getElementById('polaroidCounter');
    const resetBtn = document.getElementById('polaroidResetDeck');

    if (counter) {
      if (this.currentIndex >= total) {
        counter.textContent = 'All memories viewed! ✨';
        if (resetBtn) resetBtn.classList.remove('hidden');
      } else {
        counter.textContent = `Card ${this.currentIndex + 1} of ${total} (Swipe or tap)`;
        if (resetBtn) resetBtn.classList.add('hidden');
      }
    }
  },

  reset() {
    this.renderDeck();
  }
};

window.Stage6Polaroids = Stage6Polaroids;

