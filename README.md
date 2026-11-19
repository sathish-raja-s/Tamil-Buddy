# Tamil Buddy (தமிழ் தோழன்) — AI Tamil Learning Platform for Kids

An interactive, bilingual full-stack web application designed to teach Tamil orthography (247 glyphs), phonology, vocabulary, literature, and conversational fluency to children and heritage learners through a 100-level curriculum, HTML5 stroke tracing, gamified quizzes, narrated folk stories, and a fault-tolerant AI companion.

---

## Table of Contents

1. [System Architecture & Tech Stack](#1-system-architecture--tech-stack)
2. [Project Structure](#2-project-structure)
3. [API Endpoints Reference](#3-api-endpoints-reference)
4. [Database & Client Persistence Schema](#4-database--client-persistence-schema)
5. [Error Boundaries & Fault-Tolerance Architecture](#5-error-boundaries--fault-tolerance-architecture)
6. [Unit Testing & E2E Testing Architecture](#6-unit-testing--e2e-testing-architecture)
7. [Environment Variables & Setup](#7-environment-variables--setup)
8. [Scripts & Verification Commands](#8-scripts--verification-commands)

---

## 1. System Architecture & Tech Stack

| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion, Lucide Icons, Recharts | 100-level Adventure Map, Canvas 2D Writing Pad, Stories, Rhymes, Games, Parent Dashboard, Telemetry & Validation views |
| **Backend Proxy** | Node.js, Express 4 (`server.ts`) | Secure server-side proxy for Gemini AI (`gemini-3.8-flash`) and Sarvam AI / Google TTS, sliding-window rate limiting, in-memory WAV caching |
| **Database & Auth** | Firebase Authentication (Google Sign-In), Cloud Firestore | Authenticated learner progress (`xp`, `streak`, `completedLevels`, `analytics`) and unlocked achievement badges |
| **Offline & Audio Cache** | Browser Cache Storage API (`tamil-buddy-audio-v2`), `localStorage`, Vite PWA (`vite-plugin-pwa`) | LRU-evicted client audio cache (120 items), guest/offline progress mirror, low-bandwidth operation |
| **Automated Testing** | Vitest 5 (Unit Tests), Playwright (E2E Tests), TypeScript (`tsc --noEmit`) | Deterministic verification of services, error boundaries, scoring math, and end-to-end user journeys |

---

## 2. Project Structure

```text
├── server.ts                              # Express API proxy (/api/health, /api/tts, /api/chat) + Vite dev middleware
├── firebase-blueprint.json                # Declarative Firestore entity & collection blueprint
├── firestore.rules                        # Owner-scoped Firestore security & schema validation rules
├── ARCHITECTURE.md                        # Phase 2 architecture & empirical validation specifications
├── src/
│   ├── App.tsx                            # Root ErrorBoundary, context providers, and React Router routes
│   ├── main.tsx                           # Global lazy-chunk error listener & PWA service worker registration
│   ├── types.ts                           # Shared domain types (Curriculum, Analytics, Validation)
│   ├── components/
│   │   └── common/ErrorBoundary.tsx       # React Error Boundary with bilingual fallback UI & recovery actions
│   ├── context/                           # AuthContext, AchievementContext, NetworkContext, ThemeContext
│   ├── hooks/                             # useProgress (Firestore + localStorage sync), usePWAInstall
│   ├── services/
│   │   ├── aiService.ts                   # Timeout, retry, session tracking, and offline Tamil fallback engine
│   │   ├── audioService.ts                # Centralized 4-tier TTS playback state machine
│   │   ├── audioCache.ts                  # Cache Storage API manager with LRU eviction & metadata tracking
│   │   ├── metricsService.ts              # Client-side performance & reliability telemetry collector
│   │   └── validationService.ts           # Anonymous P01+ Likert survey scoring & aggregation
│   └── pages/                             # Home, Learn, Games, Stories, Rhymes, Heritage, Adventure, Chat, Pad, etc.
└── tests/
    ├── unit/                              # Vitest unit suites (5 test files)
    └── e2e/app.spec.ts                    # Playwright end-to-end user journey suite (9 scenarios)
```

---

## 3. API Endpoints Reference

All backend routes are served by `server.ts` on port `3000` under the `/api/*` prefix. API secrets (`GEMINI_API_KEY`, `SARVAM_API_KEY`) remain strictly server-side and are never exposed to the client bundle.

### `GET /api/health`
Liveness and diagnostics endpoint for uptime checks and telemetry verification.

- **Response (`200 OK`)**:
```json
{
  "status": "healthy",
  "timestamp": 1763520000000,
  "cachedAudioItems": 14
}
```

---

### `GET /api/tts`
Multi-tier Tamil Text-to-Speech proxy with server-side in-memory WAV caching and automatic upstream fallback.

- **Query Parameters**:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `q` | `string` | Yes | — | Tamil text string to synthesize. |
| `speaker` | `string` | No | `"ishita"` | Sarvam AI voice persona (`ishita`, `ritu`, `ratan`, `rohan`). |
| `pace` | `number` | No | `1.0` | Speech rate multiplier passed to Sarvam AI Bulbul v3. |

- **Resolution Pipeline**:
  1. **Server Memory Cache (`X-Cache: HIT`)**: Looks up `${speaker}_${pace}_${text}` in `audioCache` and returns cached `audio/wav` with `Cache-Control: public, max-age=31536000, immutable`.
  2. **Primary Neural Voice (Sarvam AI Bulbul v3)**: When `SARVAM_API_KEY` is configured, requests `ta-IN` 16 kHz WAV audio from `https://api.sarvam.ai/text-to-speech`, decodes base64 to `Buffer`, stores in memory cache, and returns `audio/wav`.
  3. **Secondary Proxy Fallback (Google Translate TTS)**: Streams `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ta&q=...` directly to the response if Sarvam AI is unconfigured or errors.

- **Status Codes**:
  - `200 OK`: Binary audio stream (`audio/wav` or `audio/mpeg`), includes `X-Cache: HIT | MISS`.
  - `400 Bad Request`: Missing `q` query parameter (`"Missing text"`).
  - `500 Internal Server Error`: Upstream TTS proxy network failure (`"Error fetching audio"`).

---

### `POST /api/chat`
Child-safe bilingual Tamil AI Tutor endpoint powered by Google Gemini (`gemini-3.8-flash`), protected by an in-memory sliding-window rate limiter and strict server-side timeout fallback.

- **Rate Limiting**:
  - Tracked per client via `X-Session-ID` request header (fallback: client IP).
  - Limit: **10 requests per 60-second window**.
  - On breach, returns `429 Too Many Requests` without calling Gemini.

- **Request Headers**:
  - `Content-Type: application/json`
  - `X-Session-ID: sess_<id>` (generated client-side by `aiService`)

- **Request Body**:
```json
{
  "message": "அ என்றால் என்ன?",
  "history": [
    { "sender": "buddy", "text": "வணக்கம்! இன்று என்ன கற்கலாம்?" },
    { "sender": "user", "text": "உயிரெழுத்துக்கள்" }
  ],
  "weakLetters": "ழ, ற"
}
```

- **Success Response (`200 OK`)**:
```json
{
  "text": "அ என்பது முதல் உயிரெழுத்து! உதாரணம்: அம்மா (Mother) ⭐",
  "isFallback": false
}
```

- **Fallback Response (`200 OK`, `isFallback: true`)**:
  - Triggered automatically when `GEMINI_API_KEY` is absent, upstream fails, or Gemini exceeds the **6,000 ms** `Promise.race` timeout (`AI_CALL_TIMEOUT`). Returns a curated bilingual Tamil educational reply.

- **Rate-Limited Response (`429 Too Many Requests`)**:
```json
{
  "error": "Buddy needs a short break! 😊 Please try again in a moment.",
  "rateLimited": true,
  "retryAfter": 42
}
```

---

## 4. Database & Client Persistence Schema

Tamil Buddy uses a **split-collection Cloud Firestore schema** (defined in `firebase-blueprint.json` and enforced by `firestore.rules`) paired with **offline-first local persistence** so learners never lose progress when signed out or offline.

### 4.1 Cloud Firestore Collections

#### Collection Document 1: `users/{userId}/data/progress`
Stores learner progression, XP, streaks, completed modules, and adaptive analytics (`UserProgress`).

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes (Immutable) | Firebase Auth UID; must match path `{userId}` (`^[a-zA-Z0-9_\-]{1,128}$`). |
| `xp` | `number` | Yes | Cumulative experience points earned. |
| `streak` | `number` | Yes | Consecutive active learning day streak. |
| `completedLevels` | `number[]` | No | Completed Adventure Map level numbers (1–100). |
| `completedQuestions` | `Record<string, number>` | No | Map of `questionId` to highest stars earned (1–3). |
| `completedStories` | `string[]` | No | IDs of completed bilingual folk stories. |
| `completedRhymes` | `string[]` | No | IDs of completed Tamil rhymes. |
| `favoriteStories` | `string[]` | No | Bookmarked story IDs. |
| `favoriteRhymes` | `string[]` | No | Bookmarked rhyme IDs. |
| `badges` | `string[]` | No | Summary list of earned badge IDs. |
| `analytics` | `object` | No | Nested object tracking `totalLearningTime`, `quizAttempts`, `quizCorrect`, `weakLetters` (`letter -> mistakeCount`), `vocabularyPracticed`, `lastActiveDate`, and `learningDays` (`YYYY-MM-DD -> minutes`). |
| `updatedAt` | `timestamp` | Yes | Server timestamp validated against `request.time`. |

#### Collection Document 2: `users/{userId}/data/achievements`
Stores detailed badge unlock metadata (`UserAchievements`).

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes (Immutable) | Firebase Auth UID matching path `{userId}`. |
| `badges` | `Record<string, { isUnlocked: boolean; unlockedAt?: number }>` | Yes | Map of badge IDs (`b1`–`b5`) to unlock status and epoch timestamp. |
| `updatedAt` | `timestamp` | Yes | Server timestamp validated against `request.time`. |

#### Firestore Security Rules (`firestore.rules`)
- **Default Deny**: All unmatched paths deny `read` and `write`.
- **Strict Ownership**: `isOwner(userId)` requires `request.auth != null && request.auth.uid == userId`.
- **Schema & Type Enforcement**: `isValidUserProgress()` and `isValidUserAchievements()` validate required keys, field types (`number`, `list`, `map`), `request.time` timestamp integrity, and `userId` immutability on updates.

### 4.2 Client-Side Storage & Cache Schema

| Store | Key / Cache Name | Policy / Capacity | Purpose |
| :--- | :--- | :--- | :--- |
| **Cache Storage API** | `tamil-buddy-audio-v2` | LRU eviction, max **120 entries**, 14-day TTL | Offline/instant replay of synthesized Tamil WAV blobs keyed by `${speaker}_${pace}_${text}` |
| **`localStorage`** | `tamil_buddy_audio_cache_meta_v2` | JSON map of `CacheEntryMeta` | Tracks `timestamp`, `accessCount`, and `sizeBytes` for LRU eviction |
| **`localStorage`** | `tamil_buddy_progress` | JSON `UserProgress` | Offline & guest persistence fallback when unauthenticated |
| **`localStorage`** | `tamil_achievements` | JSON badge unlock map | Offline & guest badge persistence |
| **`localStorage`** | `tamil_buddy_telemetry_v2` | JSON `PerformanceTelemetry` | Real-time audio, AI, and activity telemetry for `/performance` |
| **`localStorage`** | `tamil_buddy_evaluations_v2` | JSON `ParticipantEvaluation[]` | Anonymous Phase 2 user validation records (`Participant P01`, `P02`, ...) |
| **`localStorage`** | `tamil_buddy_preferred_speaker` | `'ishita' \| 'ritu' \| 'ratan' \| 'rohan'` | Persisted TTS voice persona selection |
| **`localStorage`** | `tamil_buddy_session_id` | `sess_<random>` | Anonymous session identifier sent via `X-Session-ID` for rate limiting |

---

## 5. Error Boundaries & Fault-Tolerance Architecture

Tamil Buddy implements defense-in-depth fault isolation across three layers so uncaught UI errors, stale PWA chunks, or upstream API outages never break a child's learning session.

### 5.1 React Error Boundary (`src/components/common/ErrorBoundary.tsx`)
The top-level application tree in `src/App.tsx` is wrapped in `<ErrorBoundary scope="Application Root">`, with support for localized nested boundaries on individual modules.

- **Error Capture Lifecycle**:
  1. `static getDerivedStateFromError(error)`: Synchronously transitions `state.hasError = true` and stores the thrown `Error` before the next render pass.
  2. `componentDidCatch(error, errorInfo)`: Captures React `componentStack`, logs scoped diagnostics (`[ErrorBoundary:<scope>]`), and safely invokes optional `onError(error, errorInfo, scope)` telemetry hooks inside a nested `try/catch` so a faulty logger can never cascade.
- **Child-Friendly Bilingual Recovery UI**:
  - Renders an accessible `role="alert"` / `aria-live="assertive"` card reassuring the learner in Tamil and English that their XP and badges remain safe.
  - Exposes **Try Again** (`handleReset()` — clears error state and re-mounts children), **Go Home** (`handleGoHome()` — resets and navigates to `/`), and an expandable **Technical Details** disclosure panel for developers/reviewers.

### 5.2 Global Chunk-Load & PWA Recovery (`src/main.tsx`)
- Attaches a global `window.addEventListener('error', ...)` handler detecting Vite dynamic-import `"Loading chunk failed"` errors after new deployments and prompts a clean reload.
- Integrates `registerSW` (`virtual:pwa-register`) to handle offline readiness and prompt updates when a new service worker version activates.

### 5.3 Service-Level Circuit Breakers & Fallbacks
- **Audio Pipeline (`audioService.ts`)**: 4-tier cascade — (1) Client Cache Storage → (2) Backend `/api/tts` (Sarvam AI Bulbul v3 → Google TTS proxy) with 1 automatic retry after 600 ms → (3) Browser `window.speechSynthesis` (`ta-IN`) → (4) Graceful non-blocking error toast + telemetry recording.
- **AI Tutor Pipeline (`aiService.ts`)**: Immediate offline detection, **8-second** `AbortController` client timeout (paired with **6-second** server race timeout), 4-second slow-response warning callback, 1 automatic transient retry (800 ms backoff), HTTP 429 rate-limit handling, and a deterministic local Tamil grammar/vowel fallback rule engine.

---

## 6. Unit Testing & E2E Testing Architecture

### 6.1 Unit Test Suites (Vitest)
Configured via `vitest.config.ts` (`environment: 'node'`, targeting `tests/unit/**/*.{test,spec}.ts`). All tests isolate state using `beforeEach` resets so execution is deterministic and CI-safe.

| Test Suite File | Module Under Test | Key Assertions & Coverage |
| :--- | :--- | :--- |
| `tests/unit/errorBoundary.test.ts` | `ErrorBoundary.tsx` | Verifies `getDerivedStateFromError` state transition, `formatBoundaryErrorMessage` null/empty handling, `componentDidCatch` scope + `onError` delegation, isolation of throwing `onError` callbacks, `handleReset` recovery, custom fallback rendering, and healthy pass-through rendering (7 test cases). |
| `tests/unit/aiService.test.ts` | `aiService.ts`, `metricsService.ts` | Verifies deterministic offline Tamil fallback rules for vowels (`அ`, `ஆ`), greetings (`வணக்கம்`), general queries, and AI success/timeout/fallback telemetry rate math (3 test cases). |
| `tests/unit/audioService.test.ts` | `audioCache.ts`, `audioService.ts`, `metricsService.ts` | Verifies deterministic `${speaker}_${pace}_${text}` cache key generation, audio telemetry recording (`cacheHits`, `cacheMisses`, load latency), zero-fabrication `null` guard for insufficient data, and `audioService.stop()` → `idle` transition (4 test cases). |
| `tests/unit/validationService.test.ts` | `validationService.ts` | Verifies sequential anonymous IDs (`Participant P01`), 10-question Likert aggregation formulas (usability, engagement, AI helpfulness, audio quality, overall satisfaction), and demo-benchmark toggle isolation (3 test cases). |
| `tests/unit/progressAndJourneys.test.ts` | `metricsService.ts` | Verifies learning activity counters (quizzes, games, tracing, stories, rhymes), combined Audio + AI API error-rate math (`3/20 = 15%`), and telemetry reset behavior (3 test cases). |

### 6.2 End-to-End Test Suite (Playwright)
Configured via `playwright.config.ts` (`tests/e2e/app.spec.ts`), validating 9 core browser user journeys:
1. Landing page branding & `Start Learning` CTA (`/`)
2. Alphabet exploration & Tamil glyph rendering (`/learn`)
3. Bilingual folk stories viewer (`/stories`)
4. Tamil rhymes & heritage audio views (`/rhymes`)
5. AI Buddy chat input & conversational UI (`/chat`)
6. 100-level Tamil Adventure Map (`/adventure`)
7. Phase 2 User Validation anonymous evaluation workflow (`/validation`)
8. System Performance & Telemetry live metrics dashboard (`/performance`)
9. Parent / Teacher analytics dashboard (`/parent`)

---

## 7. Environment Variables & Setup

Copy `.env.example` to `.env` and configure the following server-side variables:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key used by `POST /api/chat` (`gemini-3.8-flash`). If omitted, `/api/chat` degrades gracefully to local Tamil fallback responses. |
| `SARVAM_API_KEY` | Optional | Sarvam AI subscription key for Bulbul v3 neural Tamil TTS (`GET /api/tts`). If omitted, falls back to Google Translate TTS proxy. |
| `APP_URL` | Optional | Deployed application origin URL for self-referential links and OAuth callbacks. |

---

## 8. Scripts & Verification Commands

```bash
# Install dependencies
npm install

# Run full-stack development server (Express API + Vite middleware on port 3000)
npm run dev

# Run TypeScript type-check / lint
npm run lint

# Run Vitest unit test suite
npm run test

# Run Playwright end-to-end test suite
npm run test:e2e

# Build client bundle + Express production server (dist/server.cjs)
npm run build

# Start production server
npm run start
```
