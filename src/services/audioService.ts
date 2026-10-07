import { audioCache } from './audioCache';
import { metricsService } from './metricsService';

export type AudioState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'retrying'
  | 'cached'
  | 'offline';

export type SpeakerName = 'ishita' | 'ritu' | 'ratan' | 'rohan';

export interface AudioPlayOptions {
  speaker?: SpeakerName;
  pace?: number;
  preferCacheOnly?: boolean;
}

export interface AudioStatusInfo {
  state: AudioState;
  text?: string;
  message?: string;
}

type AudioStateListener = (status: AudioStatusInfo) => void;

class CentralAudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private state: AudioState = 'idle';
  private statusMessage = '';
  private currentText = '';
  private isSequencePlaying = false;
  private listeners: AudioStateListener[] = [];
  private retryCount = 0;
  private maxRetries = 1;

  constructor() {
    // Stop audio on page hide/unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.stop());
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.push(listener);
    listener({ state: this.state, text: this.currentText, message: this.statusMessage });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(state: AudioState, message?: string) {
    this.state = state;
    if (message !== undefined) this.statusMessage = message;
    this.listeners.forEach((l) =>
      l({ state: this.state, text: this.currentText, message: this.statusMessage })
    );
  }

  public getState(): AudioStatusInfo {
    return { state: this.state, text: this.currentText, message: this.statusMessage };
  }

  public getPreferredSpeaker(): SpeakerName {
    try {
      const stored = localStorage.getItem('tamil_buddy_preferred_speaker');
      if (stored && ['ishita', 'ritu', 'ratan', 'rohan'].includes(stored)) {
        return stored as SpeakerName;
      }
    } catch {
      // Ignore
    }
    return 'ishita';
  }

  public setPreferredSpeaker(speaker: SpeakerName) {
    try {
      localStorage.setItem('tamil_buddy_preferred_speaker', speaker);
    } catch {
      // Ignore
    }
  }

  public stop() {
    this.isSequencePlaying = false;
    this.retryCount = 0;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
      this.currentAudio = null;
    }

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.setState('idle', '');
  }

  /**
   * Primary entry point for playing Tamil pronunciation with 4-tier fallback
   */
  public async playTamil(
    text: string,
    options?: AudioPlayOptions,
    onEnd?: () => void,
    onError?: (errMessage: string) => void
  ): Promise<void> {
    if (!text || !text.trim()) {
      onEnd?.();
      return;
    }

    const cleanText = text.trim();
    this.stop();
    this.currentText = cleanText;
    const speaker = options?.speaker || this.getPreferredSpeaker();
    const pace = options?.pace || 1.0;
    const startTime = performance.now();

    // Check offline status
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    // --- LEVEL 1: Check Client-side Cache ---
    try {
      const cachedBlob = await audioCache.get(cleanText, speaker, pace);
      if (cachedBlob) {
        metricsService.recordAudioRequest(true);
        this.setState('cached', '📦 Playing cached audio');
        const playSuccess = await this.playBlob(cachedBlob, onEnd);
        if (playSuccess) {
          const duration = performance.now() - startTime;
          metricsService.recordAudioSuccess(duration);
          return;
        }
      }
    } catch (cacheErr) {
      console.warn('Cache lookup failed, proceeding to network:', cacheErr);
    }

    if (isOffline) {
      this.setState('offline', '📡 Offline mode: Voice service unavailable');
      this.playSpeechSynthesisFallback(cleanText, onEnd, onError);
      return;
    }

    // --- LEVEL 2: Fetch from Backend Proxy (Sarvam AI Bulbul v3 / Google TTS) ---
    metricsService.recordAudioRequest(false);
    this.setState('loading', '🔊 Loading pronunciation...');

    try {
      const audioUrl = `/api/tts?q=${encodeURIComponent(cleanText)}&speaker=${encodeURIComponent(speaker)}&pace=${pace}`;
      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error(`TTS server returned HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio payload');
      }

      // Save to client-side cache for future offline / instant replay
      audioCache.put(cleanText, audioBlob, speaker, pace).catch(() => {});

      this.setState('playing', '🔊 Playing...');
      const playSuccess = await this.playBlob(audioBlob, onEnd);
      if (playSuccess) {
        const duration = performance.now() - startTime;
        metricsService.recordAudioSuccess(duration);
        return;
      }
      throw new Error('Audio element playback failed');
    } catch (networkError) {
      console.warn('Network TTS failed, initiating fallback cascade:', networkError);

      // Retry mechanism if applicable
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.setState('retrying', '🔄 Retrying audio connection...');
        await new Promise((r) => setTimeout(r, 600));
        return this.playTamil(cleanText, options, onEnd, onError);
      }

      // --- LEVEL 3: Fallback to Browser SpeechSynthesis ---
      metricsService.recordAudioFallback();
      this.setState('failed', '⚠️ External voice unavailable, using speech synthesis');
      this.playSpeechSynthesisFallback(cleanText, onEnd, onError);
    }
  }

  private playBlob(blob: Blob, onEnd?: () => void): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (this.currentObjectUrl) {
          URL.revokeObjectURL(this.currentObjectUrl);
        }
        const url = URL.createObjectURL(blob);
        this.currentObjectUrl = url;

        const audio = new Audio(url);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.setState('playing', '🔊 Playing...');
        };

        audio.onended = () => {
          this.setState('completed', '');
          onEnd?.();
          resolve(true);
        };

        audio.onerror = () => {
          resolve(false);
        };

        audio.play().catch(() => {
          resolve(false);
        });
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Level 3 Fallback: Web SpeechSynthesis
   */
  private playSpeechSynthesisFallback(
    text: string,
    onEnd?: () => void,
    onError?: (errMessage: string) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.handleFinalFailure(onEnd, onError);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ta-IN';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const tamilVoice = voices.find(
        (v) => (v.lang && v.lang.includes('ta')) || (v.name && v.name.toLowerCase().includes('tamil'))
      );
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }

      utterance.onstart = () => {
        this.setState('playing', '🔊 Playing local synthesis...');
      };

      utterance.onend = () => {
        this.setState('completed', '');
        onEnd?.();
      };

      utterance.onerror = () => {
        this.handleFinalFailure(onEnd, onError);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.handleFinalFailure(onEnd, onError);
    }
  }

  /**
   * Level 4 Fallback: Safe Error State with User-Friendly Message
   */
  private handleFinalFailure(onEnd?: () => void, onError?: (errMessage: string) => void) {
    metricsService.recordAudioFailure();
    const fallbackMsg = 'Audio is temporarily unavailable. Please try again.';
    this.setState('failed', `⚠️ ${fallbackMsg}`);
    onError?.(fallbackMsg);
    onEnd?.();
  }

  /**
   * English Word Pronunciation (used in bilingual story vocabulary)
   */
  public playEnglish(text: string, onEnd?: () => void) {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Play multiple sentences sequentially (e.g. story reading)
   */
  public playSequence(texts: string[], options?: AudioPlayOptions, onEnd?: () => void) {
    if (!texts || texts.length === 0) {
      onEnd?.();
      return;
    }

    this.stop();
    this.isSequencePlaying = true;
    let index = 0;

    const playNext = () => {
      if (!this.isSequencePlaying) {
        onEnd?.();
        return;
      }

      if (index >= texts.length) {
        this.isSequencePlaying = false;
        this.setState('completed', '');
        onEnd?.();
        return;
      }

      const currentText = texts[index];
      index++;

      this.playTamil(currentText, options, playNext, () => {
        // Continue sequence even if single item fails
        playNext();
      });
    };

    playNext();
  }

  /**
   * Play standard educational sound effects (Web Audio API)
   */
  public playSoundEffect(type: 'success' | 'error' | 'click' | 'pop') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'error') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'click' || type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // AudioContext muted/unsupported
    }
  }
}

export const audioService = new CentralAudioService();
