# 🎂 Romantic & Cute Birthday Web App

A modern, mobile-responsive, aesthetic interactive Birthday Web App built with soft pink pastel aesthetics, smooth GSAP transitions, Canvas Confetti, and zero-dependency Web Audio sound effects.

Designed with **clean, modular frontend code**: separate files for stylesheets, configurations, audio engine, particles, and individual files for each stage!

---

## 📂 Project Architecture

```
Abhinay/
├── index.html                   # Clean, semantic layout & screen containers
├── README.md                    # Documentation & customization guide
│
├── css/
│   ├── base.css                 # Reset, typography, pastel gradient & mobile container
│   ├── components.css           # Buttons, floating hearts, sparkles & music toggle
│   └── screens.css              # Stage-specific styles (lock, cake, envelope, polaroids, etc.)
│
├── js/
│   ├── config.js                # 💖 ALL CUSTOMIZATIONS (Name, PIN, Letter, Photos, Quotes)
│   ├── audio.js                 # Web Audio synthesizer, sfx, romantic music box & mic detection
│   ├── particles.js             # Ambient floating hearts, touch sparkles & canvas confetti
│   ├── app.js                   # Navigation orchestrator & screen transition controller
│   │
│   └── stages/                  # 📱 Modular Stage Controllers
│       ├── stage1-passcode.js   # Screen 1: Passcode lock & custom keypad
│       ├── stage2-greeting.js   # Screen 2: Animated cute sticker & dodging "No" button
│       ├── stage3-balloons.js   # Screen 3: Interactive balloon pop mini-game
│       ├── stage4-candle.js     # Screen 4: Blow candle via mic or tap
│       ├── stage5-bouquet.js    # Screen 5: Rose bouquet with pop-out quote bubbles
│       ├── stage6-polaroids.js  # Screen 6: Stacked polaroids with swipe & drag
│       ├── stage7-letter.js     # Screen 7: 3D flap envelope & typing letter
│       └── stage8-gift.js       # Screen 8: Bouncing gift box & celebration finale
│
└── assets/                      # Put your custom photos (.jpg, .png) or music (.mp3) here
```

---

## 📱 Interactive Multi-Step Flow

1. **Screen 1: Passcode Lock Screen**
   - Glowing 3D heart lock with unlocking key animation.
   - 4 PIN boxes with heart indicators.
   - Numeric custom keypad (1 to 9, 0, Backspace, Clear), plus desktop physical keyboard support.
   - Correct PIN triggers fanfare and confetti, advancing to Screen 2.

2. **Screen 2: Birthday Greeting & Playful Question**
   - Cute animated sticker: `🧸🎂`.
   - Heading: `"Happy Birthday, [Name] 💖"`.
   - Question: `"Are you excited for what's next?"`.
   - `"No"` button playfully dodges cursor or finger taps with funny responses (`"Too fast! 💨"`, `"Nope! 😜"`, `"Catch me if you can! 🌸"`), while `"Yes"` proceeds to Screen 3.

3. **Screen 3: Balloon Pop Mini-Game**
   - 4 pastel balloons floating in the air with realistic strings and bobbing animations.
   - Tapping any balloon pops it with sound effect and color-matched confetti, revealing hidden words underneath (`"You"` | `"are"` | `"so"` | `"special 💖"`).
   - Once all 4 are popped, celebration fanfare plays and `"Next Surprise ➜"` appears.

4. **Screen 4: Blow the Candle (Mic or Tap Interaction)**
   - Aesthetic birthday cake with multi-tier frosting, sprinkles, and flickering candle flame.
   - **Mic blow detection**: uses the browser's Web Audio API (`navigator.mediaDevices.getUserMedia`) to detect real breath blowing into the mic.
   - **Tap fallback**: `"Tap to blow 💨"` button for devices without mic access.
   - Blowing extinguishes the flame, releases rising smoke puffs, dims the ambient lighting, and displays `"Close your eyes & make a wish... ✨"` before auto-advancing with confetti.

5. **Screen 5: Interactive Rose Bouquet**
   - Beautiful central rose bouquet `💐`.
   - Tapping the bouquet dynamically launches floating quote bubbles around it with sparkle sound effects.
   - `"Continue 💕"` button at bottom.

6. **Screen 6: Sweet Moments (Polaroid Photo Deck)**
   - Stack of Polaroid photo cards with washi tape, captions, and dates.
   - Full touch swipe (drag left/right with rotation physics) as well as desktop drag and tap support.
   - Card counter tracker and replay option.

7. **Screen 7: Letter from My Heart (Animated Envelope)**
   - Cute 3D flap envelope with heart wax seal `💖`.
   - Tapping opens the flap with 3D perspective fold.
   - Unfolds parchment note paper and types out the personalized heartfelt birthday letter character by character with auto-scrolling.
   - `"One last surprise ✨"` button at bottom.

8. **Screen 8: The Final Gift Box**
   - Bouncing 3D gift box with ribbon and bow `🎁`.
   - Tapping pops the lid off, unleashes heavy multi-color confetti cannons, and reveals the celebration card with a `"🔄 Replay from Start"` button.

---

## 🛠️ How to Customize (`js/config.js`)

Open `js/config.js` to change anything in seconds:

### 1. Person's Name & Passcode
```javascript
name: 'Abhinay',
passcode: '2004', // Change to birthday year or date (e.g. '0524')
```

### 2. Real Photos for Polaroid Cards
In `js/config.js`, update `polaroids`:
```javascript
polaroids: [
  {
    type: 'image',
    src: 'assets/photo1.jpg',
    caption: 'Our first trip together',
    date: 'Summer 2024 💕'
  },
  // Add more cards...
]
```

### 3. Background Music
The app comes with a **built-in romantic music box synthesizer** using the Web Audio API, so music works immediately offline without downloading audio files!

If you want your own custom song:
1. Place your MP3 file in the `assets/` folder (e.g., `assets/romantic.mp3`).
2. In `js/config.js`, set:
   ```javascript
   customAudioUrl: 'assets/romantic.mp3',
   ```

### 4. Custom Letter & Quotes
Edit `letter.content` and `bouquet.quotes` in `js/config.js` with your own personal messages.

---

## 🚀 How to Run

- Simply double-click `index.html` in Windows Explorer or open it in any modern browser (Chrome, Edge, Safari, Firefox).
- No Node.js build process required! It runs completely client-side.
- Can be uploaded directly to **GitHub Pages**, **Vercel**, **Netlify**, or shared as a zipped folder.

