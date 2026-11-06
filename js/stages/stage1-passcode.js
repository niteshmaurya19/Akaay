/**
 * ============================================================
 * 🔒 STAGE 1: PASSCODE LOCK SCREEN
 * ============================================================
 */

const Stage1Passcode = {
  currentPin: '',

  init() {
    this.currentPin = '';
    this.renderKeypad();
    this.updateDisplay();
    this.bindKeyboard();
  },

  renderKeypad() {
    const keypadContainer = document.getElementById('keypadGrid');
    if (!keypadContainer) return;

    keypadContainer.innerHTML = '';
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];

    keys.forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key-btn';

      if (key === 'clear') {
        btn.textContent = 'C';
        btn.setAttribute('aria-label', 'Clear');
        btn.addEventListener('click', () => this.clearPin());
      } else if (key === 'del') {
        btn.innerHTML = `
          <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l7-8h11a1 1 0 011 1v14a1 1 0 01-1 1H10l-7-8z"></path>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Backspace');
        btn.addEventListener('click', () => this.deleteDigit());
      } else {
        btn.textContent = key;
        btn.addEventListener('click', () => this.addDigit(key));
      }

      keypadContainer.appendChild(btn);
    });
  },

  bindKeyboard() {
    // Only bind once
    if (this._bound) return;
    this._bound = true;

    window.addEventListener('keydown', (e) => {
      if (window.App && window.App.currentStage !== 1) return;
      if (e.key >= '0' && e.key <= '9') {
        this.addDigit(e.key);
      } else if (e.key === 'Backspace') {
        this.deleteDigit();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        this.clearPin();
      }
    });
  },

  addDigit(digit) {
    if (this.currentPin.length >= 4) return;
    window.AudioEngine.playClick();
    this.currentPin += digit;
    this.updateDisplay();

    if (this.currentPin.length === 4) {
      setTimeout(() => this.validatePin(), 180);
    }
  },

  deleteDigit() {
    if (this.currentPin.length > 0) {
      window.AudioEngine.playClick();
      this.currentPin = this.currentPin.slice(0, -1);
      this.updateDisplay();
    }
  },

  clearPin() {
    if (this.currentPin.length > 0) {
      window.AudioEngine.playClick();
      this.currentPin = '';
      this.updateDisplay();
    }
  },

  updateDisplay() {
    const boxes = document.querySelectorAll('#pinBoxes .pin-box');
    boxes.forEach((box, i) => {
      if (i < this.currentPin.length) {
        box.classList.add('filled');
        box.textContent = '❤';
      } else {
        box.classList.remove('filled');
        box.textContent = '';
      }
      box.classList.remove('error');
    });
  },

  validatePin() {
    const correctPin = (window.CONFIG && window.CONFIG.passcode) || '2004';

    if (this.currentPin === correctPin) {
      // Correct!
      window.AudioEngine.playSuccess();
      
      const lockIcon = document.getElementById('lockIcon');
      if (lockIcon) {
        lockIcon.classList.add('unlocked');
      }

      window.ParticleEngine.burstSuccess(0.5);

      setTimeout(() => {
        if (window.App) window.App.goToStage(2);
      }, 700);
    } else {
      // Wrong PIN
      window.AudioEngine.playError();
      const boxes = document.querySelectorAll('#pinBoxes .pin-box');
      boxes.forEach(b => b.classList.add('error'));

      const hintText = document.getElementById('passcodeHint');
      if (hintText) {
        hintText.textContent = 'Incorrect passcode, try again! 🥺';
        hintText.classList.add('text-rose-600');
      }

      setTimeout(() => {
        this.currentPin = '';
        this.updateDisplay();
        if (hintText) {
          hintText.textContent = 'Something special is waiting for you ✨';
          hintText.classList.remove('text-rose-600');
        }
      }, 650);
    }
  },

  reset() {
    this.currentPin = '';
    const lockIcon = document.getElementById('lockIcon');
    if (lockIcon) lockIcon.classList.remove('unlocked');
    this.updateDisplay();
  }
};

window.Stage1Passcode = Stage1Passcode;

