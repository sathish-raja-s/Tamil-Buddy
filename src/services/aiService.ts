import { metricsService } from './metricsService';

/**
 * Single conversational turn exchanged between the learner and Tamil Buddy.
 */
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'buddy';
}

/**
 * Normalized response returned by {@link AIService.sendMessage},
 * capturing latency telemetry and whether a fallback or rate-limit path fired.
 */
export interface AIServiceResponse {
  /** Bilingual Tamil/English reply text rendered in the chat UI. */
  text: string;
  /** True when the reply originated from the deterministic offline rule engine or rate-limit guard. */
  isFallback: boolean;
  /** True when the backend `/api/chat` token-bucket rate limiter returned HTTP 429. */
  isRateLimited?: boolean;
  /** End-to-end round-trip latency in milliseconds. */
  durationMs: number;
}

// Local Tamil fallback responses for offline or API outage resilience
const LOCAL_FALLBACK_RULES: Array<{ match: RegExp; response: string }> = [
  {
    match: /அ|a\b|letter a/i,
    response: 'அ என்பது ஒரு தமிழ் உயிரெழுத்து. உதாரணம்: அம்மா (Mother), அணில் (Squirrel). அருமையாகக் கேட்டீர்கள்! ⭐',
  },
  {
    match: /ஆ|aa\b/i,
    response: 'ஆ என்பது நெடில் உயிரெழுத்து. உதாரணம்: ஆடு (Goat), ஆலமரம் (Banyan tree). நன்றாகப் படிக்கிறீர்கள்! 🌟',
  },
  {
    match: /இ|i\b/i,
    response: 'இ என்பது குறில் உயிரெழுத்து. உதாரணம்: இலை (Leaf), இட்லி (Idli). மிகவும் சிறப்பு! 👍',
  },
  {
    match: /ஈ|ee\b/i,
    response: 'ஈ என்பது நெடில் உயிரெழுத்து. உதாரணம்: ஈ (Housefly), ஈட்டி (Spear). அருமை! 👏',
  },
  {
    match: /வணக்கம்|hello|hi|vanakkam/i,
    response: 'வணக்கம்! நான் உங்கள் தமிழ் Buddy. இன்று நாம் என்ன கற்கலாம்? உயிர் எழுத்துக்கள், கதைகள் அல்லது பாட்டுகள் படிக்கலாமா? 😊',
  },
  {
    match: /உயிரெழுத்து|vowels/i,
    response: 'தமிழ் உயிரெழுத்துக்கள் மொத்தம் 12: அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ. ஆய்த எழுத்து ஒன்று: ஃ. 📚',
  },
  {
    match: /மெய்யெழுத்து|consonants/i,
    response: 'தமிழ் மெய்யெழுத்துக்கள் மொத்தம் 18: க், ங், ச், ஞ், ட், ண், த், ந், ப், ம், ய், ர், ல், வ், ழ், ள், ற், ன். வல்லினம், மெல்லினம், இடையினம் என மூன்று வகைப்படும்! 🌈',
  },
  {
    match: /நன்றி|thanks|thank you/i,
    response: 'மிக்க மகிழ்ச்சி! நீங்கள் தமிழ் கற்பது எனக்கு மிகவும் பெருமையாக இருக்கிறது! தொடர்ந்து முயற்சி செய்யுங்கள்! 🎉',
  },
];

class AIService {
  private timeoutMs = 8000;

  /**
   * Generates a deterministic, helpful local Tamil response when network or API fails
   */
  public getLocalFallback(query: string): string {
    for (const rule of LOCAL_FALLBACK_RULES) {
      if (rule.match.test(query)) {
        return rule.response;
      }
    }
    return 'அருமையான கேள்வி! தமிழ் மொழியில் 247 எழுத்துக்கள் உள்ளன. எழுத்துக்கள் அல்லது சொற்களைப் பற்றி என்னிடம் கேளுங்கள், மகிழ்ச்சியாகக் கற்பிப்பேன்! 😊';
  }

  /**
   * Sends a message to the backend Gemini AI Tutor with timeout, retry, and fallback protection
   */
  public async sendMessage(
    message: string,
    history: ChatMessage[] = [],
    weakLetters = '',
    onSlowWarning?: () => void
  ): Promise<AIServiceResponse> {
    const startTime = performance.now();
    metricsService.recordAIRequest();

    // Check offline status immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      metricsService.recordAIFallback();
      return {
        text: this.getLocalFallback(message),
        isFallback: true,
        durationMs: Math.round(performance.now() - startTime),
      };
    }

    // Timer to warn user if Buddy is taking a little longer
    let slowTimer: NodeJS.Timeout | null = null;
    if (onSlowWarning) {
      slowTimer = setTimeout(() => {
        onSlowWarning();
      }, 4000);
    }

    try {
      const response = await this.executeChatRequest(message, history, weakLetters);
      if (slowTimer) clearTimeout(slowTimer);

      const durationMs = Math.round(performance.now() - startTime);
      metricsService.recordAISuccess(durationMs);

      return {
        text: response.text,
        isFallback: false,
        durationMs,
      };
    } catch (err: any) {
      if (slowTimer) clearTimeout(slowTimer);

      const isRateLimit = err?.name === 'RateLimitError' || err?.status === 429;
      const isTimeout = err?.name === 'AbortError' || err?.message?.includes('timeout');

      metricsService.recordAIFailure(isTimeout, isRateLimit);
      metricsService.recordAIFallback();

      const durationMs = Math.round(performance.now() - startTime);

      if (isRateLimit) {
        return {
          text: 'Buddy needs a short break! 😊 Please wait a few seconds and try again.',
          isFallback: true,
          isRateLimited: true,
          durationMs,
        };
      }

      // Return local fallback
      return {
        text: this.getLocalFallback(message),
        isFallback: true,
        durationMs,
      };
    }
  }

  private async executeChatRequest(
    message: string,
    history: ChatMessage[],
    weakLetters: string,
    isRetry = false
  ): Promise<{ text: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.getSessionId(),
        },
        body: JSON.stringify({
          message,
          history,
          weakLetters,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        const rateLimitErr = new Error(errorData.error || 'Rate limit exceeded');
        (rateLimitErr as any).name = 'RateLimitError';
        (rateLimitErr as any).status = 429;
        throw rateLimitErr;
      }

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.text) {
        throw new Error('Empty response from AI server');
      }

      return { text: data.text };
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Perform one automatic retry if transient and not already retried
      if (!isRetry && error?.name !== 'RateLimitError') {
        await new Promise((r) => setTimeout(r, 800));
        return this.executeChatRequest(message, history, weakLetters, true);
      }

      throw error;
    }
  }

  private getSessionId(): string {
    try {
      let id = localStorage.getItem('tamil_buddy_session_id');
      if (!id) {
        id = 'sess_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('tamil_buddy_session_id', id);
      }
      return id;
    } catch {
      return 'default_session';
    }
  }
}

export const aiService = new AIService();
