/**
 * ============================================================
 * 🎵 AUDIO ENGINE & SOUND SYNTHESIS
 * ============================================================
 * Uses Web Audio API for zero-dependency sound effects,
 * built-in romantic music box melody generator, and mic detection.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.musicPlaying = false;
    this.musicBoxInterval = null;
    this.customAudio = null;
    this.micStream = null;
    this.analyser = null;
    this.micCheckId = null;
    this.volume = (window.CONFIG && window.CONFIG.music && window.CONFIG.music.defaultVolume) || 0.4;
  }

  // Lazy-initialize audio context on user interaction
  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ==========================================
  // Sound Effects Synthesis
  // ==========================================

  // Soft keypad / button click
  playClick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Harmonic success chime
  playSuccess() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // Soft error buzz
  playError() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Realistic balloon pop
  playPop(pitch = 1.0) {
    try {
      const ctx = this.getContext();
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.pow(1 - i / bufferSize, 3);
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 * pitch, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Whoosh / breath extinguishing candle
  playWhoosh() {
    try {
      const ctx = this.getContext();
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * decay * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.45);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Soft sparkle bell / quote chime
  playChime(noteIndex = 0) {
    try {
      const ctx = this.getContext();
      const scale = [587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1174.66]; // D5, E5, G5, A5, B5, C6, D6
      const freq = scale[noteIndex % scale.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // Card swoosh
  playSwoosh() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Grand celebration fanfare
  playCelebration() {
    try {
      const ctx = this.getContext();
      const melody = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.5, d: 0.4  }, // C6
        { f: 880.00, d: 0.15 }, // A5
        { f: 1046.5, d: 0.6  }  // C6
      ];

      let t = ctx.currentTime;
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d * 0.9;
      });
    } catch (e) {}
  }

  // ==========================================
  // Romantic Background Music (Synth & Custom)
  // ==========================================

  playMusicBoxNote(freq, time, duration = 0.8) {
    if (!this.musicPlaying) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Music box sound has soft sine harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      const noteVolume = 0.08 * (this.volume / 0.4);
      gain.gain.setValueAtTime(noteVolume, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  startMusicBoxLoop() {
    // Beautiful gentle lullaby progression (Canon in D / Romance style)
    // Frequencies: D5, F#5, A5, C#5, B4, F#5, G5, D5, G5, B5, A5, C#5
    const sequence = [
      { f: 587.33, d: 0.6 }, // D5
      { f: 739.99, d: 0.6 }, // F#5
      { f: 880.00, d: 0.6 }, // A5
      { f: 739.99, d: 0.6 }, // F#5
      { f: 554.37, d: 0.6 }, // C#5
      { f: 659.25, d: 0.6 }, // E5
      { f: 880.00, d: 0.6 }, // A5
      { f: 659.25, d: 0.6 }, // E5
      { f: 493.88, d: 0.6 }, // B4
      { f: 587.33, d: 0.6 }, // D5
      { f: 739.99, d: 0.6 }, // F#5
      { f: 587.33, d: 0.6 }, // D5
      { f: 440.00, d: 0.6 }, // A4
      { f: 554.37, d: 0.6 }, // C#5
      { f: 659.25, d: 0.6 }, // E5
      { f: 554.37, d: 0.6 }, // C#5
      { f: 392.00, d: 0.6 }, // G4
      { f: 493.88, d: 0.6 }, // B4
      { f: 587.33, d: 0.6 }, // D5
      { f: 493.88, d: 0.6 }, // B4
      { f: 440.00, d: 0.6 }, // A4
      { f: 554.37, d: 0.6 }, // C#5
      { f: 659.25, d: 0.6 }, // E5
      { f: 880.00, d: 0.8 }, // A5
    ];

    let noteIdx = 0;
    const intervalTime = 380; // ms per note

    const playNext = () => {
      if (!this.musicPlaying) return;
      const ctx = this.getContext();
      const current = sequence[noteIdx];
      this.playMusicBoxNote(current.f, ctx.currentTime, current.d);

      // Play soft bass root on downbeats
      if (noteIdx % 4 === 0) {
        this.playMusicBoxNote(current.f / 2, ctx.currentTime, 1.2);
      }

      noteIdx = (noteIdx + 1) % sequence.length;
    };

    playNext();
    this.musicBoxInterval = setInterval(playNext, intervalTime);
  }

  stopMusicBoxLoop() {
    if (this.musicBoxInterval) {
      clearInterval(this.musicBoxInterval);
      this.musicBoxInterval = null;
    }
  }

  toggleMusic() {
    const customUrl = window.CONFIG && window.CONFIG.music && window.CONFIG.music.customAudioUrl;

    if (this.musicPlaying) {
      this.musicPlaying = false;
      if (this.customAudio) {
        this.customAudio.pause();
      } else {
        this.stopMusicBoxLoop();
      }
      return false;
    } else {
      this.musicPlaying = true;
      if (customUrl && customUrl.trim() !== '') {
        if (!this.customAudio) {
          this.customAudio = new Audio(customUrl);
          this.customAudio.loop = true;
          this.customAudio.volume = this.volume;
        }
        this.customAudio.play().catch(() => {
          // Fallback to synth if custom audio fails
          this.startMusicBoxLoop();
        });
      } else {
        this.startMusicBoxLoop();
      }
      return true;
    }
  }

  // ==========================================
  // Microphone Blow Detection
  // ==========================================
  async startMicDetection(onBlowDetected, onError) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (onError) onError('Microphone API not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;
      const ctx = this.getContext();
      const source = ctx.createMediaStreamSource(stream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.2;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let blowCounter = 0;

      const checkAudio = () => {
        if (!this.micStream) return;
        this.analyser.getByteFrequencyData(dataArray);

        // Breath/wind produces energy in the low-to-mid frequency spectrum
        let sum = 0;
        for (let i = 2; i < 40; i++) {
          sum += dataArray[i];
        }
        const avg = sum / 38;

        if (avg > 42) { // Blow energy threshold
          blowCounter++;
          if (blowCounter >= 3) { // Require sustained blow for 3 frames to avoid false clicks
            this.stopMicDetection();
            if (onBlowDetected) onBlowDetected();
            return;
          }
        } else {
          blowCounter = Math.max(0, blowCounter - 1);
        }

        this.micCheckId = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      if (onError) onError(err.message || 'Microphone access denied.');
    }
  }

  stopMicDetection() {
    if (this.micCheckId) {
      cancelAnimationFrame(this.micCheckId);
      this.micCheckId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
  }
}

// Global audio singleton
window.AudioEngine = new AudioEngine();

