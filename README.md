# DO — AI Life Operating System

> **"Tell us what you need. We'll figure out the rest."**

DO is a revolutionary AI-powered mobile application that functions as a **Personal Life Operator**. It transforms human intention into the shortest path from **WHAT YOU WANT → RESULT**.

## 🎯 Philosophy

This is NOT another chatbot, search engine, to-do list, or shopping app.

DO is designed for modern people who are busy, impatient, overwhelmed, or simply don't want to spend time searching, comparing, typing, planning, remembering, or performing repetitive daily tasks.

**The user's natural language, voice, image, or document becomes the interface.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## 📱 Core Features

### 🏠 Smart Home Screen
- "What do you need?" — One input for everything
- Voice, Camera, Text, Upload — Multiple input modes
- Quick action suggestions
- Today's personalized summary
- "What should I do now?" AI recommendation

### 🧠 AI Intent Engine
3-tier cascading classification system:
- **Tier 0**: Regex shortcuts (<5ms)
- **Tier 1**: Semantic keyword routing (<30ms)  
- **Tier 2**: LLM structured classification (<250ms)

### 🏆 Tell Me The Best
"Don't give me 50 options. Just tell me the best one."
- 🥇 Best Choice
- 🥈 Best Alternative
- 💰 Cheapest Sensible Choice

### ⚡ Just Do It Mode
AI executes tasks with minimal user input. Set reminders, create lists, plan trips — all with one sentence.

### 📷 Snap → Solve
Photograph anything — bills, products, menus, documents, errors — and get instant AI analysis.

### 🗣️ Voice-First AI
Talk naturally. The AI understands context, follows up, and acts.

### 🤔 What Should I Do?
Context-aware activity suggestions based on time, budget, mood, and location.

### 😴 Lazy Day Mode
"I'll handle the hard part." — Minimal-effort tasks you can knock out quickly.

### 🍕 What Do I Eat?
Photo your fridge or tell the AI what you have. Get meal suggestions with recipes.

### ✈️ Trip in 30 Seconds
Full travel planning in seconds. Dynamically modify: "Make it cheaper", "More adventurous".

### ⏱️ 5-Minute Life
"How much time do you have?" → Useful actions you can complete in that time.

### 📄 Explain It Like I'm Lazy
Upload any document. Get: What is this? What matters? What do I do?

### 💰 Money Assistant
Spending insights, budget tracking, bill reminders — in simple language.

### 🏠 Home Autopilot
Household management with smart restocking suggestions.

### 🔔 Notification Brain
- 🔴 DO NOW — Urgent
- 🟡 DO TODAY — Important
- 🟢 CAN WAIT — Low priority
- 🤖 AI HANDLED — Already processed

### 🧠 Personal Memory
AI remembers your preferences, routines, and choices. Full user control over stored data.

## 🏗️ Architecture

```
        USER
          ↓
  ┌───────────────┐
  │  INPUT LAYER  │
  │ Text / Voice  │
  │ Image / Files │
  └───────┬───────┘
          ↓
  ┌───────────────┐
  │ INTENT ENGINE │
  │   3-Tier      │
  │   Cascade     │
  └───────┬───────┘
          ↓
  ┌───────────────┐
  │ AI LIFE BRAIN │
  │  Orchestrator │
  └───────┬───────┘
          ↓
  ┌───┬───┬───┬───┐
  │ 🍕│ 🛒│ ✈️│ 💰│
  │Food│Shop│Trip│$$ │
  └───┴───┴───┴───┘
          ↓
    FINAL RESULT
          ↓
  USER CONFIRMATION
          ↓
        ACTION
```

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | React Native + Expo (SDK 57) |
| Navigation | Expo Router v4 |
| Styling | NativeWind v4 (Tailwind CSS) |
| Animations | React Native Reanimated 3 |
| Client State | Zustand + MMKV |
| Server State | TanStack Query v5 |
| Backend | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth (Apple/Google/Email) |
| AI | Multi-model (OpenAI, Gemini, Anthropic) |
| Voice | Deepgram (STT) + Cartesia (TTS) |
| Vision | Gemini Vision + ML Kit |

## 📁 Project Structure

```
DO/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Tab screens (Home, Dashboard, Profile)
│   ├── (modals)/           # Modal screens (Voice, Camera)
│   ├── chat/               # AI conversation
│   └── onboarding/         # Onboarding flow
├── src/
│   ├── components/ui/      # 17 reusable UI components
│   ├── features/           # 15 feature modules
│   ├── stores/             # Zustand state stores
│   ├── hooks/              # Custom hooks
│   ├── api/                # TanStack Query definitions
│   ├── lib/                # Supabase client, constants
│   ├── types/              # TypeScript definitions
│   ├── design/             # Design tokens
│   └── utils/              # Formatters, validators
├── supabase/
│   ├── migrations/         # Database schema
│   └── functions/          # Edge functions (AI engine)
└── assets/                 # Images, fonts, animations
```

## 🔐 Security & Privacy

- Row-Level Security on all database tables
- Client-side PII masking before cloud AI calls
- Encrypted local storage (MMKV)
- Zero data retention on cloud LLM calls
- Explicit confirmation for all high-impact actions
- User controls for memory management
- No unauthorized financial transactions

## 💎 Business Model

- **FREE** — Basic AI assistance
- **PRO** (₹299/mo) — Unlimited AI, advanced features, memory
- **PREMIUM** (₹599/mo) — Full personal automation suite

## 📜 License

Proprietary. All rights reserved.
