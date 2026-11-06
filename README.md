# Magic Garden 🌸
### *Watch, Grow, and Celebrate!*
**Autism-Friendly Visual Countdown Timer Progressive Web App (PWA)**

---

## 🌟 Overview
**Magic Garden** is a visual countdown timer designed specifically for nonverbal autistic children and young learners who find numbers, clocks, and abstract time concepts challenging to understand. 

Through gentle animations—a growing rainbow flower, a hopping bunny traveling to their cozy burrow, or arches of a glowing rainbow—children intuitively grasp how much time remains, what is happening now, and the joyful activity coming next.

---

## 🌻 Key Features

### 1. Six Sensory-Friendly Countdown Modes
- **Mode A: Magic Garden Flower**: A seed sprouts into a leafy stem, unfolds colorful petals, and blooms into a giant rainbow blossom.
- **Mode B: Rainbow Timer**: Six colorful arches fill with sensory colors as a friendly star journeys across the rainbow.
- **Mode C: Bunny Journey**: The child's chosen character hops along a winding stepping-stone trail with checkpoints to reach their cozy cottage.
- **Mode D: Balloon Float**: A pastel hot air balloon gently rises toward calm fluffy clouds and friendly stars (never pops suddenly).
- **Mode E: Butterfly Timer**: A fluttering butterfly glides between checkpoint flowers in a vibrant meadow, landing on the golden centerpiece flower.
- **Mode F: Sunset to Moon**: The smiling sun descends across an orbital arc, transitioning into a soothing twilight with a gentle crescent moon and glowing stars.

### 2. Picture-Based Presets & First–Then Schedule
- **Intuitive Presets**: 30s, 1m, 2m, 3m, 5m, 10m, 15m, 20m, 30m, plus custom duration slider.
- **FIRST–THEN Visual Communication**: Two large visual cards (*First Sit* → *Then Play*). Includes built-in activity icons (sitting, eating, learning, waiting, therapy, quiet time, toys, cartoon, outside, music, bubbles, tablet) plus **custom photo upload from device**.
- When the timer finishes, the FIRST card receives a green checkmark and the THEN card highlights with a celebratory pulse.

### 3. Gradual Sitting Training Mode
- 10 customizable levels (from 30s up to 30m).
- Gentle stepping progression. Never automatically increases duration without parent consent.
- Repetition and decreases supported; zero penalty or failure states.

### 4. Positive Reward Garden ("My Magic Garden")
- Every completed sitting activity earns stars and adds interactive blooming flowers, fluttering butterflies, fruit trees, and friends.
- Tapping elements triggers joyful wiggles and heart/star sparkles.

### 5. Accurate Timestamp Engine & Safeguards
- **Timestamp-Based**: Zero timer drift. Progress calculated from actual elapsed milliseconds.
- **Screen Wake Lock API**: Keeps device screens awake throughout sitting sessions.
- **Background Synchronization**: Handled smoothly via `visibilitychange` events.
- **Parental Lock**: Protects controls from accidental taps using a 4-digit PIN or 2-second hold.
- **Visual Break Button**: Allows a gentle breathing break and seamless resume.

### 6. 100% Offline PWA & Procedural Audio
- Web Audio API procedural synthesis for gentle wind chimes, harp arpeggios, and soft tones. Zero external audio asset dependencies.
- IndexedDB storage for activities, custom photos, rewards, training progress, and settings.
- Installable on Android, iPad, and desktop with offline Service Worker support.

---

## 🚀 Development & Production

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
