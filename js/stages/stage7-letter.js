/**
 * ============================================================
 * 💌 STAGE 7: LETTER FROM MY HEART (ANIMATED ENVELOPE)
 * ============================================================
 */

const Stage7Letter = {
  isOpened: false,
  isTyping: false,
  typingInterval: null,

  init() {
    this.isOpened = false;
    this.isTyping = false;
    this.bindEvents();
  },

  onEnter() {
    this.reset();
  },

  bindEvents() {
    const envelope = document.getElementById('letterEnvelope');
    const seal = document.getElementById('envelopeSeal');
    const nextBtn = document.getElementById('letterNextBtn');
    const paper = document.getElementById('letterPaper');

    if (envelope && !envelope._bound) {
      envelope._bound = true;
      envelope.addEventListener('click', () => this.openEnvelope());
    }

    if (seal && !seal._bound) {
      seal._bound = true;
      seal.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEnvelope();
      });
    }

    if (paper && !paper._bound) {
      paper._bound = true;
      // Tapping paper skips to full text immediately
      paper.addEventListener('click', () => {
        if (this.isTyping) {
          this.skipTyping();
        }
      });
    }

    if (nextBtn && !nextBtn._bound) {
      nextBtn._bound = true;
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.AudioEngine.playClick();
        if (window.App) window.App.goToStage(8);
      });
    }
  },

  openEnvelope() {
    if (this.isOpened) return;
    this.isOpened = true;

    // Chime & paper sound
    window.AudioEngine.playChime(4);

    const envelope = document.getElementById('letterEnvelope');
    const paper = document.getElementById('letterPaper');
    const prompt = document.getElementById('envelopePrompt');

    if (envelope) {
      envelope.classList.add('opened');
    }

    if (prompt) {
      prompt.style.opacity = '0';
    }

    // After flap opens, unfold paper and type out content
    setTimeout(() => {
      if (paper) {
        paper.classList.remove('hidden');
        paper.style.display = 'block';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(paper,
            { y: 50, scale: 0.9, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }
          );
        } else {
          paper.style.opacity = '1';
        }
      }

      this.typeLetter();
    }, 850);
  },

  getFullText() {
    return (window.CONFIG && window.CONFIG.letter && window.CONFIG.letter.content) || `My Dearest,

Happy Birthday! 🎂

You make every single day brighter and more meaningful. May your year be filled with pure happiness, love, and all the wonders this world has to offer! 💖

With all my love 💕`;
  },

  typeLetter() {
    const container = document.getElementById('letterTypingArea');
    const paper = document.getElementById('letterPaper');
    if (!container) return;

    container.innerHTML = '';
    const fullText = this.getFullText();
    let charIndex = 0;
    this.isTyping = true;

    if (this.typingInterval) clearInterval(this.typingInterval);

    this.typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        const char = fullText[charIndex];
        if (char === '\n') {
          container.innerHTML += '<br/>';
        } else {
          container.innerHTML += char;
        }

        // Auto-scroll paper gently
        if (paper) {
          paper.scrollTop = paper.scrollHeight;
        }

        charIndex++;
      } else {
        this.finishTyping();
      }
    }, 18);
  },

  skipTyping() {
    const container = document.getElementById('letterTypingArea');
    if (container) {
      container.innerHTML = this.getFullText().replace(/\n/g, '<br/>');
    }
    this.finishTyping();
  },

  finishTyping() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
    this.isTyping = false;
    this.onTypingComplete();
  },

  onTypingComplete() {
    const nextBtn = document.getElementById('letterNextBtn');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.classList.remove('opacity-0');
      nextBtn.style.display = 'inline-flex';
      nextBtn.style.pointerEvents = 'all';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(nextBtn,
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }
        );
      } else {
        nextBtn.style.opacity = '1';
      }
    }
  },

  reset() {
    this.isOpened = false;
    this.isTyping = false;
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    const envelope = document.getElementById('letterEnvelope');
    if (envelope) envelope.classList.remove('opened');

    const prompt = document.getElementById('envelopePrompt');
    if (prompt) prompt.style.opacity = '1';

    const paper = document.getElementById('letterPaper');
    if (paper) {
      paper.classList.add('hidden');
      paper.style.display = 'none';
      paper.style.opacity = '0';
    }

    const container = document.getElementById('letterTypingArea');
    if (container) container.innerHTML = '';

    const nextBtn = document.getElementById('letterNextBtn');
    if (nextBtn) {
      nextBtn.classList.add('hidden');
      nextBtn.classList.add('opacity-0');
      nextBtn.style.display = 'none';
      nextBtn.style.opacity = '0';
      nextBtn.style.pointerEvents = 'none';
    }
  }
};

window.Stage7Letter = Stage7Letter;
