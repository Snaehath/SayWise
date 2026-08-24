# 🎙️ SayWise - Daily Speaking & Writing Habit

> Build natural English communication confidence in just **2 focused minutes a day** with instant AI-powered speech analysis and grammar coaching.

SayWise is a high-speed, mobile-first daily practice app built with **React Native (Expo SDK 54)** and powered by **Google Gemini 2.5 Flash**.

---

## ✨ Features & Upgrades

- **🎯 Dual-Mode Habit Engine:**
  - **🎙️ Speaking Practice (Always Unlocked - Level 1+):** Read curated paragraphs aloud with live 11-bar equalizer waveforms and instant phoneme-level IPA articulation analysis.
  - **✍️ Writing Practice (Unlocks at Level 2 🔒):** Compose short responses to daily topic prompts with instant AI evaluation for grammar accuracy, vocabulary richness, sentence flow, and a polished native rewrite.
- **🚀 1-Tap Zero-Friction Launch:** Tapping any unlocked practice card immediately opens today's challenge with zero decision fatigue.
- **🌐 Unified Global Difficulty Settings:** Select your tier once in Settings (**Beginner 🌱**, **Intermediate ⚡**, or **Advanced 👑**), and it automatically tailors both Speaking and Writing curricula globally.
- **🏆 Gamified Level & XP Progression Engine:**
  - **🚀 First-Time Kickstart Boost (Level 1 ➔ 2):** Completing your 1st Speaking Challenge awards `+200 XP` (`100 Base + 100 Kickstart Boost`) for an **instant level up to Level 2** and unlocks Writing Mode!
  - **🔥 Daily Streak Consistency Multiplier (Level 2 ➔ 3+):**
    - Base requirement: 3 challenges to level up.
    - **With Active Daily Streak:** Earn `+50 XP` bonus per session — **leveling up in only 2 challenges**!
  - **⚡ Tier Unlock Milestones:**
    - **Level 1–4:** Beginner Mode 🌱
    - **Level 5 Unlock:** Intermediate Mode ⚡ (unlocked via XP consistency)
    - **Level 10 Unlock:** Advanced Mastery Mode 👑
- **⚙️ Settings & Level Management Screen:**
  - Top header **Gear Button** (`settings-outline`) on the Home screen.
  - Difficulty tier selector with lock badges (`🔒 Unlocks at Level 5`).
  - 30-Day Vocal Habit activity history matrix (GitHub contribution style).
  - Lifetime speaking metrics (words spoken, minutes practiced, daily streak).
- **🔤 Interactive Word-Level IPA Breakdown (Speaking):**
  - **Color-Coded Word Chips:** Every word is color-coded by articulation accuracy (🟢 Crisp, 🟡 Review, 🔴 Needs Work).
  - **Tap-to-Inspect Phonetic Modal:** View IPA transcriptions (e.g. `[ /ˈkɑːɡ.nə.tɪv/ ]`) and targeted mouth/tongue positioning tips.
- **🎧 Audio Replay & Shadowing Player:**
  - Replay your recorded take with **`1.0x` (Normal)** and **`0.75x` (Slow-Mo)** playback speed toggle.
- **🤖 Gemini 2.5 Flash Evaluation Engine:**
  - **Overall Score (0–100)** with visual metric progress bars.
  - **Actionable Coaching Takeaways:** 1 top strength + 1 key focus area.
- **🔥 Consecutive Day Streak Tracking:** Streak flame milestones that grow with daily practice.
- **🔒 Privacy First:** Ephemeral audio recordings are deleted immediately following evaluation.
- **⚡ Zero-Lag Architecture:** Instant 0ms screen navigation with offline **MMKV** key-value persistence.

---

## 📱 App Flow

```mermaid
graph TD
    A[🏠 Home Screen] -->|🎙️ Speaking Mode| C[🎙️ Speaking Challenge & Live Waveform]
    A -->|✍️ Writing Mode (Lvl 2+)| W[✍️ Writing Practice & Editor]
    A -->|⚙️ Settings Icon| S[⚙️ Settings, Levels & 30-Day Map]
    C -->|Read Aloud & Record| D[🤖 Gemini 2.5 Flash Audio Analysis]
    W -->|Submit Response| D2[🤖 Gemini 2.5 Flash Grammar Analysis]
    D -->|Multimodal Speech Evaluation| E[📊 Speaking Results & IPA Modal]
    D2 -->|Grammar & Rewrite Evaluation| WR[📊 Writing Results & Native Rewrite]
    E -->|Complete Challenge| H[🎉 Victory, XP Boost & Streak Milestone]
    WR -->|Complete Challenge| H
    H -->|Return Home| A
```

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) `0.81.5` / [Expo SDK 54](https://expo.dev/)
- **Runtime:** Hermes Engine (New Architecture Ready)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS `v3.4`)
- **AI Intelligence:** [Google Gemini 2.5 Flash API](https://ai.google.dev/)
- **Audio Engine:** `expo-audio` & `expo-file-system`
- **Storage:** `react-native-mmkv` (Zero-latency offline key-value storage)
- **Icons:** `@expo/vector-icons` (Ionicons)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Android Studio](https://developer.android.com/studio) (for Android Emulator / Native Device builds) or physical Android device connected via USB with USB Debugging enabled
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Snaehath/SayWise.git
cd saywise
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the App

#### Android (Development Build):

```bash
npx expo run:android
```

#### Metro Bundler:

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
│   │   ├── AudioShadowPlayer.tsx # Take audio player with 1.0x/0.75x speed toggle
│   │   ├── Button.tsx         # Tactile button with animated scale feedback
│   │   ├── Header.tsx         # Top app navigation bar
│   │   ├── ProgressBar.tsx    # Animated metric progress bar
│   │   ├── RecordingVisualizer.tsx # Live 11-bar audio recording equalizer
│   │   ├── ScoreCard.tsx      # Dashboard ring score & 4-metric progress bars
│   │   └── WordPhoneticModal.tsx # Tap-to-inspect IPA & articulation modal
│   ├── navigation/            # Navigation routing
│   │   └── AppNavigator.tsx   # Lightweight, instant screen state switcher
│   ├── screens/               # Core application screens
│   │   ├── WelcomeScreen.tsx  # Home dashboard, dual mode cards & level progress
│   │   ├── SettingsScreen.tsx # Level progression, locked tiers & 30-day map
│   │   ├── ChallengeScreen.tsx# Read-aloud paragraph & live waveform recording
│   │   ├── WritingChallengeScreen.tsx # Prompt composition & live word counter
│   │   ├── AnalysisScreen.tsx # AI audio processing & pulsing visualizer
│   │   ├── ResultScreen.tsx   # Word-level chips, audio playback & score card
│   │   ├── WritingResultScreen.tsx # Grammar dashboard, corrections & native rewrite
│   │   └── CompletionScreen.tsx# Streak celebration, XP awards & summary
│   ├── services/              # API & Audio Business Logic
│   │   ├── analysisService.ts # Gemini 2.5 Flash audio & text grammar evaluation
│   │   ├── challengeService.ts# Curated daily speaking & writing curriculum
│   │   └── recordingService.ts# Expo Audio lifecycle & cache management
│   ├── storage/               # Offline Persistence
│   │   └── challengeStorage.ts# MMKV level engine, streak counter & 30-day activity
│   ├── theme/                 # Design tokens & color system
│   └── types/                 # TypeScript interfaces and data models
├── App.tsx                    # Application entry root with SafeAreaProvider
├── app.json                   # Expo configuration & app metadata
├── metro.config.js            # Metro bundler config with NativeWind
├── tailwind.config.js         # Tailwind styling theme & color tokens
└── package.json               # Project dependencies & scripts
```

---

## 🔒 Security

- Sensitive credentials (Gemini API keys) are strictly managed via environment variables (`.env`) and excluded from source control via `.gitignore`.
- Temporary recording audio clips are deleted immediately after AI evaluation.
