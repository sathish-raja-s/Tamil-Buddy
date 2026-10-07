import { audioService, AudioPlayOptions } from '../services/audioService';

/**
 * Backward-compatible facade for AudioService delegating to CentralAudioService.
 */
export class AudioService {
  static stop() {
    audioService.stop();
  }

  static playTamilWord(text: string, onEnd?: () => void, onError?: () => void) {
    audioService.playTamil(text, undefined, onEnd, () => onError?.());
  }

  static playEnglishWord(text: string) {
    audioService.playEnglish(text);
  }

  static playTamilSequence(texts: string[], onEnd?: () => void) {
    audioService.playSequence(texts, undefined, onEnd);
  }

  static playSoundEffect(type: 'success' | 'error' | 'click' | 'pop') {
    audioService.playSoundEffect(type);
  }

  static getStatus() {
    return audioService.getState();
  }

  static subscribe(listener: (status: any) => void) {
    return audioService.subscribe(listener);
  }
}
