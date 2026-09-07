export type SpeakerName = 'ishita' | 'ritu' | 'ratan' | 'rohan';

export interface VoiceOptions {
  speaker?: SpeakerName;
  pace?: number;
}

export class TamilVoiceService {
  static currentAudio: HTMLAudioElement | null = null;
  static isSequencePlaying = false;

  static stop() {
    this.isSequencePlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  static getPreferredSpeaker(): SpeakerName {
    const stored = localStorage.getItem('tamil_buddy_preferred_speaker');
    if (stored && ['ishita', 'ritu', 'ratan', 'rohan'].includes(stored)) {
      return stored as SpeakerName;
    }
    return 'ishita';
  }

  static setPreferredSpeaker(speaker: SpeakerName) {
    localStorage.setItem('tamil_buddy_preferred_speaker', speaker);
  }

  static fallbackToSpeechSynthesis(text: string, onEnd?: () => void) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ta-IN';
        utterance.rate = 0.8;
        
        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = onEnd;
        }

        const voices = window.speechSynthesis.getVoices();
        const tamilVoice = voices.find(v => (v.lang && v.lang.includes('ta')) || (v.name && v.name.toLowerCase().includes('tamil')));
        if (tamilVoice) {
          utterance.voice = tamilVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          speak();
          window.speechSynthesis.onvoiceschanged = null;
        };
        speak();
      } else {
        speak();
      }
    } else {
      if (onEnd) onEnd();
    }
  }

  static async playTamilText(text: string, options?: VoiceOptions, onEnd?: () => void, onError?: () => void) {
    if (!text) {
      if (onEnd) onEnd();
      return;
    }
    
    this.stop();
    
    try {
      const speaker = options?.speaker || this.getPreferredSpeaker();
      const pace = options?.pace || 1.0;
      const audioUrl = `/api/tts?q=${encodeURIComponent(text)}&speaker=${encodeURIComponent(speaker)}&pace=${pace}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      if (onEnd) {
        audio.onended = onEnd;
      }
      
      audio.onerror = () => {
        if (onError) onError();
        this.fallbackToSpeechSynthesis(text, onEnd);
      };

      await audio.play();
    } catch (err) {
      console.warn("Audio play failed, falling back to synthesis", err);
      if (onError) onError();
      this.fallbackToSpeechSynthesis(text, onEnd);
    }
  }

  static playSequence(texts: string[], options?: VoiceOptions, onEnd?: () => void) {
    if (!texts || texts.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();
    this.isSequencePlaying = true;
    let currentIndex = 0;

    const playNext = () => {
      if (!this.isSequencePlaying) {
        if (onEnd) onEnd();
        return;
      }

      if (currentIndex >= texts.length) {
        this.isSequencePlaying = false;
        if (onEnd) onEnd();
        return;
      }
      
      const text = texts[currentIndex];
      currentIndex++;
      
      this.playTamilText(text, options, playNext, () => {
        // Continue sequence on error
      });
    };

    playNext();
  }
}
