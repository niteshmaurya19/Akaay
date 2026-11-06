/**
 * ============================================================
 * 🎂 BIRTHDAY WEB APP CONFIGURATION
 * ============================================================
 * Easily personalize the app here: change names, passcode,
 * messages, photos, quotes, and music without touching the logic!
 */

const CONFIG = {
  // 💖 Person's name
  name: 'Abhinay',

  // 🔑 4-digit Passcode to unlock Screen 1
  passcode: '2004',

  // 🎵 Background Music
  // If customAudioUrl is empty, the app automatically generates a beautiful
  // soothing Web Audio music box melody so it works offline with zero missing files!
  // To use your own song, paste a direct audio URL or local path (e.g. 'assets/romantic-song.mp3')
  music: {
    title: 'Romantic Music Box Lullaby',
    customAudioUrl: '', // e.g., 'assets/bgm.mp3' or direct URL
    defaultVolume: 0.4,
  },

  // 🧸 Screen 2: Greeting & Dodging Question
  greeting: {
    badge: 'Special Day 🎂',
    title: 'Happy Birthday, Abhinay 💖',
    subtitle: "Are you ready to see what's waiting for you?",
    yesText: 'Yes, absolutely! 🥳',
    noText: 'No 😐',
    dodgeResponses: [
      'Nope! Try again 😜',
      'Too slow! 🏃‍♂️💨',
      'Hey, you cannot say no! 🙈',
      'Nice try! 😂',
      'Yes is the only choice! 💖',
      'Catch me if you can! 🌸'
    ]
  },

  // 🎈 Screen 3: Balloon Pop Mini Game
  // 4 balloons revealing words that form a sweet sentence
  balloons: [
    { text: 'You', color: '#fda4af', glow: 'rgba(253, 164, 175, 0.6)' },
    { text: 'are', color: '#c4b5fd', glow: 'rgba(196, 181, 253, 0.6)' },
    { text: 'so', color: '#93c5fd', glow: 'rgba(147, 197, 253, 0.6)' },
    { text: 'special 💖', color: '#fde68a', glow: 'rgba(253, 230, 138, 0.6)' }
  ],
  balloonCompletedText: 'You are so special to me! 💖✨',

  // 🎂 Screen 4: Candle Blow Interaction
  candle: {
    title: 'Blow the candle, Abhinay 🎂',
    prompt: 'Blow gently into your microphone, or tap the button to make a wish!',
    wishMessage: 'Close your eyes & make a wish... ✨',
    smokeParticles: 8,
    autoTransitionDelayMs: 2500
  },

  // 🌹 Screen 5: Rose Bouquet Quote Bubbles
  bouquet: {
    title: 'Your Rose Bouquet 🌹',
    subtitle: 'Tap the bouquet to reveal sweet secrets 💌',
    quotes: [
      'Forever yours 🤍',
      'You make my world so beautiful 🌸',
      'Happy Birthday, My Favorite Human 🎂',
      'You are my sunshine on cloudy days ☀️',
      'Every moment with you is precious ✨',
      'I am so grateful to have you in my life 💖',
      'Your smile is my favorite thing 🥰'
    ]
  },

  // 📸 Screen 6: Polaroid Cards
  // To use real photos: set type: 'image' and src: 'path/to/photo.jpg'
  // To use emojis/stickers: set type: 'emoji' and emoji: '🥰'
  polaroids: [
    {
      type: 'emoji',
      emoji: '🥰',
      caption: 'The day our story began',
      date: 'A Day to Remember 💕'
    },
    {
      type: 'emoji',
      emoji: '🌅',
      caption: 'Our endless talks under the sky',
      date: 'Pure Magic ✨'
    },
    {
      type: 'emoji',
      emoji: '🎭',
      caption: 'Being goofy and laughing together',
      date: 'Unfiltered Joy 😂'
    },
    {
      type: 'emoji',
      emoji: '☕',
      caption: 'Quiet cozy moments together',
      date: 'Warm Hearts ☕'
    },
    {
      type: 'emoji',
      emoji: '✨',
      caption: 'Every little memory with you',
      date: 'Forever & Always 🤍'
    }
  ],

  // 💌 Screen 7: Letter from My Heart
  letter: {
    title: 'A Message From My Heart 💌',
    envelopePrompt: 'Tap the envelope to open your letter ✨',
    content: `My Dearest Abhinay,

Happy Birthday to the sweetest, most wonderful person in the whole universe! 🎂✨

Every day spent with you is a gift that I treasure deeply. Your warmth, your contagious laughter, and your gentle soul brighten even the darkest days. You make ordinary moments feel like poetry. 🌸

On this special birthday, I want to remind you of how truly remarkable and loved you are. You inspire everyone around you just by being your authentic self. 💖

Thank you for being my anchor, my favorite smile, and my happiest thought. Whatever dreams you hold in your heart this year, I hope every single one comes true.

I promise to stand by your side through every adventure, every high, every quiet sunset, and every sweet memory yet to come. 🤍

With all my love and infinite hugs,
Your Forever Person 💕`
  },

  // 🎁 Screen 8: Final Gift Box Celebration
  finalGift: {
    title: 'One Last Thing... Tap the gift 🎁',
    openedTitle: '🎉 Happy Birthday, Abhinay! 🎉',
    message: 'May this year shower you with endless laughter, good health, unforgettable adventures, and every dream you have ever wished for! You deserve all the magic in the world! 💖✨',
    emojis: '🧸🎂🌸🎁🥳🎈✨'
  }
};

// Export to window so it's globally accessible across modules
window.CONFIG = CONFIG;

