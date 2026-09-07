const fs = require('fs');

let content = fs.readFileSync('src/utils/audioService.ts', 'utf-8');

const newAudioService = `
export class AudioService {
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

  static playTamilWord(text: string, onEnd?: () => void) {
    if (!text) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    try {
      const audioUrl = \`/api/tts?q=\${encodeURIComponent(text)}\`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      if (onEnd) {
        audio.onended = onEnd;
        audio.onerror = () => {
          this.fallbackToSpeechSynthesis(text, onEnd);
        };
      } else {
        audio.onerror = () => {
          this.fallbackToSpeechSynthesis(text);
        };
      }

      audio.play().catch(e => {
        console.warn("Audio play failed, falling back to synthesis", e);
        this.fallbackToSpeechSynthesis(text, onEnd);
      });
    } catch (err) {
      this.fallbackToSpeechSynthesis(text, onEnd);
    }
  }

  static playEnglishWord(text: string) {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  static playTamilSequence(texts: string[], onEnd?: () => void) {
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

      try {
        const audioUrl = \`/api/tts?q=\${encodeURIComponent(text)}\`;
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        
        audio.onended = playNext;
        audio.onerror = () => {
          this.fallbackToSpeechSynthesis(text, playNext);
        };

        audio.play().catch(e => {
          console.warn("Audio play failed for sequence, falling back", e);
          this.fallbackToSpeechSynthesis(text, playNext);
        });
      } catch (err) {
        this.fallbackToSpeechSynthesis(text, playNext);
      }
    };

    playNext();
  }

  static playSoundEffect(type: 'success' | 'error' | 'click' | 'pop') {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'error') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'click' || type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn('AudioContext not supported or failed', e);
    }
  }
}
`;

fs.writeFileSync('src/utils/audioService.ts', newAudioService);
