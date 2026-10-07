# Tamil Buddy — Phase 2 Architecture & Specifications

## 1. Overview
Tamil Buddy Phase 2 transforms the interactive 100-level Tamil educational application into an empirically validated, rigorously tested, network-resilient, and telemetry-measurable learning platform for children.

---

## 2. Phase 2 Implementations

### Problem 1 Solved: Formal User Validation System (`/validation`)
- **Anonymous Participant Protocol**: Implemented non-invasive participant profiling (`Participant P01`, `Participant P02`, `Participant P03`...) supporting Learner, Parent, and Teacher personas with zero child PII collection.
- **10-Task Guided Checklist**: Tests core platform capabilities including letter exploration, tracing canvas, learning games, pronunciation engine, AI chat, quizzes, bilingual stories, rhymes, and analytics review.
- **10-Question Likert Survey (1–5 Scale)**: Standardized questionnaire evaluating usability, activity engagement, tracing clarity, game enjoyment, audio quality, AI helpfulness, speed, and recommendation likelihood.
- **Automated Score Aggregation**: Automatically computes:
  - Usability Score (Average of Q1, Q8, Q9)
  - Engagement Score (Average of Q2, Q4, Q5)
  - AI Helpfulness Score (Q6)
  - Audio Quality Score (Q7)
  - Overall Satisfaction Score (Aggregate of all questions / Q10)
- **Validation Dashboard & Academic Reporting**:
  - Displays real participant submissions and aggregated metrics.
  - Includes a benchmark demo toggle clearly labeled `DEMO DATA — NOT REAL USER FEEDBACK` for comparative review.
  - Includes printable evidence reporting (`window.print()`).

### Problem 2 Solved: Automated Testing Architecture
- **Unit & Integration Suite (Vitest)**:
  - `tests/unit/audioService.test.ts`: Cache key hashing, state transitions, and audio telemetry tracking.
  - `tests/unit/aiService.test.ts`: Deterministic Tamil fallbacks, timeout handling, and AI metrics.
  - `tests/unit/validationService.test.ts`: Likert scoring math, anonymous ID generator, and aggregate metrics.
- **End-to-End Suite (Playwright)**:
  - `tests/e2e/app.spec.ts`: Tests page load, navigation links, AI Chat UI, Learn alphabet, Stories, Rhymes, Adventure Map, Validation workflow, and System Telemetry dashboard.

### Problem 3 Solved: Voice & AI Reliability
- **Centralized `audioService`**: Single singleton managing audio lifecycle with typed states (`idle`, `loading`, `playing`, `cached`, `retrying`, `failed`, `offline`).
- **4-Tier Cascading Fallback**:
  1. *Level 1*: Client Cache Storage API (`tamil-buddy-audio-v2`)
  2. *Level 2*: Backend TTS API with Sarvam AI Bulbul v3 neural voice
  3. *Level 3*: Backend Google TTS proxy fallback
  4. *Level 4*: Browser Web SpeechSynthesis (`ta-IN`)
  5. *Level 5*: Graceful error toast with automatic recovery
- **Audio Caching (`audioCache.ts`)**: Client-side Cache Storage API with LRU eviction (cap at 120 items), access counters, and metadata tracking.
- **Centralized `aiService`**:
  - 8-second request timeout via `AbortController`.
  - Automatic 1-time retry for transient connection drops.
  - Friendly warning ("Buddy is taking a little longer than usual…") if response exceeds 4s.
  - Local deterministic Tamil fallback dictionary for common queries ("அ", "வணக்கம்", "உயிரெழுத்துக்கள்", etc.) when offline or during outages.
- **Backend Rate Limiting (`server.ts`)**:
  - Express token bucket middleware on `/api/chat` limiting clients to 10 requests per minute.
  - Friendly response when limit is exceeded: *"Buddy needs a short break! 😊 Please try again in a moment."*
- **Model Standard**: Updated Gemini model to `gemini-3.8-flash` with `'User-Agent': 'aistudio-build'` telemetry headers.

### Problem 4 Solved: Measurable Performance & Telemetry (`/performance`)
- **Centralized Telemetry Engine (`metricsService`)**:
  - Audio: Request count, success count, failure count, latency to play, cache hits/misses, fallback count.
  - AI: Chat count, latency ms, timeout count, rate-limit count, fallback invocations.
  - Error rate tracking across all endpoints.
- **Telemetry Dashboard**:
  - Displays real calculated metrics (Audio Success Rate, Cache Hit Rate %, Avg Audio Load Time, AI Success Rate, Avg AI Response Time, AI Fallback Usage, API Error Rate).
  - Explicitly shows *"Insufficient data"* when minimum sample size is not yet reached, preventing fabricated numbers.
  - Live diagnostic test buttons to verify audio synthesis, cache hit, and AI chat pipeline in real time.
- **Low-Bandwidth Mode & Offline PWA**:
  - Automatic network detection (`navigator.connection`) and manual user toggle (`📶 Low Data Mode Active`).
  - Online/Offline status toasts (`📡 You're offline` / `🟢 Back Online`).
  - Offline capability for cached letter lessons, tracing canvas, local vocabulary, and stories.

---

## 3. Running & Verifying the Project

### Development Server
```bash
npm run dev
```

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npx playwright test
```

### Production Build
```bash
npm run build
```
