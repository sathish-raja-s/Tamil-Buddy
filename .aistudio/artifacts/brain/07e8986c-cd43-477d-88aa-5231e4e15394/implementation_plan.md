# Tamil Buddy Phase 2 — Validated, Tested, Reliable & Measurable Platform

A production-grade educational platform upgrade transforming the prototype into an empirically evaluated, thoroughly tested, highly resilient, and measurable learning system for Tamil language learners.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions guide Phase 2 execution:
> - **Validation Data Baseline**: The User Validation system supports interactive participant walkthroughs (P01, P02, P03...) recording real session telemetry with an explicit toggle to view demo benchmark data when no tests have run yet.
> - **Audio Caching Pipeline**: Client-side Cache Storage API backed by Service Worker precaching and IndexedDB metadata tracking (timestamps, hit/miss counters, size caps, and eviction).
> - **AI Chat Protection**: Backend Express middleware enforcing session-based token bucket rate limiting (10 requests/min) with child-friendly cooldown messaging.
> - **Model Upgrade**: Backend AI endpoints will use `gemini-3.8-flash` in compliance with latest Google GenAI SDK standards.

---

## 1. Overview & Core Concept

Tamil Buddy Phase 2 transforms the existing gamified 100-level Tamil learning application into an empirically validated, network-resilient, production-hardened platform. It resolves all four AI evaluation reviewer concerns:
1. **Formal User Validation**: An anonymous participant evaluation protocol (P01, P02, P03...) with a 10-task structured walkthrough, a 10-question Likert survey, and automatic calculation of Usability, Engagement, AI Helpfulness, Audio Quality, and Satisfaction metrics.
2. **Automated Testing Suite**: Full integration and end-to-end test coverage with Vitest and Playwright across all eight core user journeys (audio playback/fallback, AI chat, tracing canvas, quiz engine, level progression, and offline behavior).
3. **External Voice & AI Reliability**: Centralized `audioService` and `aiService` architectures providing multi-tier cascading fallbacks, instant local fallbacks during outages, and client-side audio caching.
4. **Low-Bandwidth & Offline Resilience**: Automatic offline detection (`📡 You're offline` / `🟢 Back Online`), manual Low-Bandwidth Mode toggle (`📶 Low Data Mode Active`), and offline persistence for core lessons, tracing, and games.
5. **System Telemetry & Evidence Reporting**: Real-time non-sensitive performance monitoring (`metricsService`) measuring audio load times, cache hit rates, AI response times, and failure frequencies, accompanied by an exportable Phase 2 Evidence Report.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Participant Evaluation Flow (`/validation`)**:
   - **Step 1 — Role Selection**: Select Participant Type (Learner, Parent, Teacher) and generate an anonymous ID (`P01`, `P02`...).
   - **Step 2 — Interactive Task Checklist**: A guided 10-task evaluation checklist with direct launch buttons for each task (Lesson, Tracing, Game, Audio, AI Chat, Quiz, Story, Rhyme, Progress).
   - **Step 3 — 10-Question Survey (1–5 Scale)**: Usability, engagement, audio clarity, AI usefulness, speed, and recommendation ratings with qualitative feedback fields.
   - **Step 4 — Automated Metric Compilation**: Instant calculation and display of aggregate Usability (US), Engagement (EN), AI Helpfulness (AI), Audio Experience (AU), and Overall Satisfaction (OS).

2. **Network Resilience & Low-Bandwidth Mode**:
   - Persistent, non-intrusive network status indicator in the top navigation.
   - Low-bandwidth toggle in the navbar or user settings reducing animations, deferring decorative assets, and preferring cached audio.
   - Offline banner displaying available offline modules (Letter Tracing, Local Vocabulary, Cached Stories).

3. **Performance & Validation Dashboard (`/validation` and `/parent`)**:
   - Data-rich dashboards displaying telemetry metrics (Cache Hit Rate %, AI Latency ms, Audio Latency ms, API Error Rate %).
   - Printable Phase 2 Evidence Report with quantitative charts and academic validation metrics.

### Visual Identity & Theme Discipline

- **Color Discipline (60-30-10)**:
  - 60% Neutral Canvas: Clean slate/off-white (`#F8FAFC` in light mode, `#0F172A` in dark mode).
  - 30% Structural Surfaces: Crisp border lines (`#E2E8F0` / `#1E293B`), white/dark-slate cards with subtle border containment.
  - 10% Intentional Accents: Royal Violet (`#7C3AED`) for primary interactive controls, Emerald (`#059669`) for positive progress, Amber (`#D97706`) for warnings/offline states.
- **Zero-Pill Discipline**: Metadata, timestamps, and status indicators rendered as clean unboxed text with typographic separators (`·`, `/`) instead of heavy badge pills.
- **Top Bar Contract**: Single-row 3-zone layout with brand mark, clean text navigation links, network/low-data indicators, and quick action buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized `audioService` vs. Component-Level Audio**
  - *Chosen Approach*: Single unified `audioService` singleton managing playback states (`idle`, `loading`, `playing`, `cached`, `fallback`, `error`), cache retrieval, and 4-tier fallback (Cache $\to$ Sarvam API $\to$ Google TTS Proxy $\to$ Web SpeechSynthesis $\to$ Graceful Error Toast).
  - *Why*: Eliminates race conditions, audio clipping, and duplicate downloads across components.

- **Decision 2: Backend-Enforced Rate Limiting vs. Client Debouncing**
  - *Chosen Approach*: Express in-memory sliding token bucket middleware on `/api/chat` supplemented by frontend cooldown UI.
  - *Why*: Client debouncing alone can be bypassed and doesn't prevent server resource exhaustion. Backend middleware ensures hard protection while returning friendly JSON errors.

- **Decision 3: Anonymous Validation Storage**
  - *Chosen Approach*: Store participant validation records in Firestore collection `user_evaluations` keyed by anonymous IDs (`P01`, `P02`...) with local fallback when offline. Zero child PII collected.
  - *Why*: Complies strictly with privacy standards for children while providing auditable empirical data for project evaluation.

- **Decision 4: Local Fallback Responses for AI Tutor**
  - *Chosen Approach*: Built-in deterministic Tamil knowledge base covering all 247 letters, basic greetings, and common kindergarten vocabulary when the AI API is unreachable or times out (>8s).
  - *Why*: Children are never left with broken chat bubbles or error stack traces.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TAMIL BUDDY CLIENT                            │
├────────────────────────────────────────────────────────────────────────┤
│  Pages / Views:                                                        │
│  ├── /adventure (100 Levels, Pre/Post Tests, Games, Tracing)          │
│  ├── /learn     (Vowels, Consonants, Compound Letters, Sound Engine)   │
│  ├── /chat      (AI Buddy with Timeout, Retry, Local Fallback)         │
│  ├── /stories   (Interactive Stories & Audio Vocabulary)               │
│  ├── /rhymes    (Heritage Rhymes, Lyrics, Audio)                       │
│  ├── /parent    (Learning Analytics, Streaks, Weakness Areas, Reports) │
│  └── /validation (Phase 2 Participant Testing, Tasks, Survey, Metrics) │
├────────────────────────────────────────────────────────────────────────┤
│  Core Service Layer:                                                   │
│  ├── audioService   ──► [Cache Storage API] ──► [Fallback Chain]       │
│  ├── aiService      ──► [Timeout & Retries] ──► [Local Fallback DB]    │
│  ├── metricsService ──► [Latency, Hits/Misses, Errors] ──► Dashboard   │
│  └── networkService ──► [Online/Offline, Low-Bandwidth Mode Toggles]   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / JSON
┌──────────────────────────────────▼─────────────────────────────────────┐
│                          EXPRESS BACKEND                               │
├────────────────────────────────────────────────────────────────────────┤
│  Middleware:                                                           │
│  ├── RateLimiter (/api/chat: 10 req/min per session/IP)                │
│  └── TelemetryMiddleware (logs request duration & cache headers)       │
├────────────────────────────────────────────────────────────────────────┤
│  Routes:                                                               │
│  ├── GET  /api/tts     (Sarvam API with Memory Cache + Proxy Fallback) │
│  ├── POST /api/chat    (Gemini 3.8 Flash with Adaptive Prompting)      │
│  └── GET  /api/health  (Backend uptime & latency health check)         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                    EXTERNAL & PERSISTENCE SERVICES                     │
│  ├── Firebase Firestore (Users, Progress, Evaluations)                 │
│  ├── Google GenAI SDK   (Gemini 3.8 Flash AI Tutor)                    │
│  └── Sarvam AI TTS      (Indian Tamil Bulbul v3 Neural Voice)          │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & Service Implementation Mapping

1. **`src/services/audioService.ts`**:
   - Manages playback lifecycle with typed states: `IDLE`, `LOADING`, `PLAYING`, `CACHED`, `FALLBACK`, `ERROR`.
   - Checks Cache Storage API for pre-existing audio buffers.
   - Cascades: Cache $\to$ `/api/tts` (Sarvam) $\to$ `/api/tts` (Google fallback) $\to$ `window.speechSynthesis` (`ta-IN`) $\to$ Toast notification.
   - Emits telemetry events to `metricsService` on each operation.

2. **`src/services/aiService.ts`**:
   - Wraps chat requests with an 8-second timeout using `AbortController`.
   - Handles HTTP 429 (Rate Limit) with friendly child messages ("Buddy is taking a short rest! 😊").
   - Implements local fallback dictionary for common Tamil queries ("அ என்றால் என்ன?", "வணக்கம்", etc.) when offline or on API failure.

3. **`src/services/metricsService.ts`**:
   - Tracks audio load latency, cache hit/miss ratio, fallback invocation frequency.
   - Tracks AI chat response latency, timeout counts, error rates.
   - Persists anonymous telemetry aggregates to `localStorage` and provides getter functions for dashboards.

4. **`src/context/NetworkContext.tsx`**:
   - Tracks `isOnline` via browser event listeners.
   - Provides `isLowBandwidth` state with automatic detection (`navigator.connection.saveData` or slow effectiveType) and user override toggle.

5. **`src/pages/Validation.tsx`**:
   - 3-step evaluation protocol for participants (P01, P02, P03...).
   - Task completion checklist with live timers and status indicators.
   - 10-item 1–5 Likert evaluation questionnaire.
   - Analytics calculation view showing Usability, Engagement, AI Helpfulness, Audio Quality, and Overall Satisfaction with printable report generation.

6. **`server.ts`**:
   - Token bucket rate limiter middleware for `/api/chat`.
   - Update model to `gemini-3.8-flash`.
   - Enhanced error responses that supply structured guidance to the frontend.

7. **Automated Testing (`tests/`)**:
   - Unit tests for `audioService` fallback cascading and cache resolution.
   - Unit tests for `aiService` local fallbacks and timeout handling.
   - Playwright E2E tests for audio buttons, AI chat interaction, canvas tracing, quiz completion, and validation workflows.
