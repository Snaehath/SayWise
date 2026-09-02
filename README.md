# 🎙️ SayWise

> **Become a better, more natural English speaker in 2 focused minutes a day.**

SayWise is a mobile speech coaching app that replaces generic language games with an authentic daily speaking ritual. Instead of collecting XP or filling streaks, you spend 2 minutes speaking, receive personalized AI evaluation on how you sound, and get actionable coaching for your next session.

---

## 🌟 What is SayWise?

Most language apps focus on multiple-choice quizzes and grammar drills. **SayWise focuses entirely on voice and speech output:**

```
                  TODAY'S 2-MINUTE SPEAK
                 ┌────────────────────────┐
                 │  📖 Read Mode (1 min)  │  ➔ Articulation, rhythm & pacing
                 ├────────────────────────┤
                 │  🎙️ Talk Mode (1 min)  │  ➔ Spontaneous fluency & confidence
                 └───────────┬────────────┘
                             │
                             ▼
                    AI SPEECH EVALUATION
                   Powered by Gemini Audio
                             │
                             ▼
                    PERSONAL COACH TAKE
                   86/100 • "Clear pronunciation,
                   bring more life to your voice."
                   ✨ Biggest: Pacing +11%
                             │
                             ▼
                    ONE THING TO WORK ON
                   "Vary your pitch and intonation.
                   Try this tomorrow."
                             │
                             ▼
                      AUDIO REPLAY
                   Normal (1.0x) / Slow-Mo (0.75x)
```

---

## ✨ Core Features

### 1. 📖 Read Mode — *"Read this aloud"* (1 min)
- Read a natural, thought-grouped paragraph aloud.
- Focuses on pronunciation clarity, consonant articulation, breath pauses, and pacing.

### 2. 🎙️ Talk Mode — *"Talk about this"* (1 min)
- Receive a real-world dilemma, question, or scenario with a 10-second thinking prep timer.
- Speak freely for 45–60 seconds to build unscripted fluency, vocabulary retrieval, and vocal confidence.

### 3. 🎯 "Chosen For You" Personalization
- Transparent coaching feedback on why today's specific challenge was selected for you (e.g., *"Your pacing has been steady, so today's challenge gives you longer sentences to practice natural breath pauses."*).

### 4. 📊 The Results Screen (Your Daily Coach)
- **Immediate Headline:** A direct assessment of your take (e.g., *"Smooth cadence and clear projection."*).
- **4 Speaking Metrics:**
  - **Fluency:** Sentence flow and hesitation reduction.
  - **Clarity:** Vowel and consonant accuracy.
  - **Pacing:** Words-per-minute tempo and natural pausing.
  - **Expression:** Conversational inflection and vocal tone.
- **🎯 One Thing to Work On:** Exactly one concrete adjustment to focus on in your next session.
- **Audio Shadow Player:** Listen back to your recorded take at `1.0x` (Normal) or `0.75x` (Slow-Mo).

### 5. 👤 Speaking Profile & Journey
- Track your speaking progression across 5 natural stages:
  *Started ➔ Finding your voice ➔ Speaking more naturally ➔ Expressing ideas clearly ➔ Confident speaker*
- Active skill focus: `🎯 You're working toward: Natural pacing 70 → 80`.
- Tangible improvement tracking: `Fluency +8 this week ↗`.
- Personal records for Fluency, Clarity, Pacing, and Overall score.

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) `0.81.5` / [Expo SDK 54](https://expo.dev/) (Hermes Engine)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS `v3.4`)
- **Speech Intelligence:** [Google Gemini 2.5 Flash Multi-modal Audio](https://ai.google.dev/)
- **Audio Recording & Playback:** `expo-audio` & `expo-file-system`
- **Offline Storage:** `react-native-mmkv`
- **Icons:** `@expo/vector-icons` (Ionicons)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- Physical device running Expo Go / Development Build or an Android Emulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Snaehath/SayWise.git
   cd saywise
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the app:**
   ```bash
   npx expo start
   ```

---

## 📂 Project Structure

```
saywise/
├── assets/                    # App icons and splash screens
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AudioShadowPlayer.tsx # Take playback with 1.0x / 0.75x speed toggle
│   │   ├── Button.tsx         # Tactile button with instant touch response
│   │   ├── Header.tsx         # App navigation header
│   │   └── RecordingVisualizer.tsx # GPU native-driver audio waveform equalizer
│   ├── data/                  # Curated daily speaking curriculum
│   │   └── challenges.ts      # Read & Talk scenario recipes
│   ├── navigation/            # State-based router
│   │   └── AppNavigator.tsx   # Screen navigation coordinator
│   ├── screens/               # Main application screens
│   │   ├── WelcomeScreen.tsx  # Daily practice dashboard & speaking score
│   │   ├── ChallengeScreen.tsx# Speaking screen with prep timer & recording
│   │   ├── AnalysisScreen.tsx # AI speech processing state
│   │   ├── ResultScreen.tsx   # Coach headline, metrics & one thing to improve
│   │   ├── CompletionScreen.tsx# Session completion closure
│   │   └── JourneyScreen.tsx  # Speaking progression, records & weekly consistency
│   ├── services/              # Business logic & API
│   │   ├── analysisService.ts # Gemini multi-modal audio evaluation
│   │   ├── challengeService.ts# Daily challenge rotation engine
│   │   └── recordingService.ts# Audio recording permissions and lifecycle
│   ├── storage/               # Offline MMKV persistence
│   │   └── challengeStorage.ts# Profile state, history & personal bests
│   ├── theme/                 # Design tokens & color system
│   └── types/                 # TypeScript interfaces
├── App.tsx                    # Application entry root
├── app.json                   # Expo app configuration
├── tailwind.config.js         # Tailwind theme config
└── package.json               # Dependencies and scripts
```
