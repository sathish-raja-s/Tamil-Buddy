import { audioService, SpeakerName, AudioPlayOptions } from './audioService';

export type { SpeakerName };
export interface VoiceOptions {
  speaker?: SpeakerName;
  pace?: number;
}

export class TamilVoiceService {
  static stop() {
    audioService.stop();
  }

  static getPreferredSpeaker(): SpeakerName {
    return audioService.getPreferredSpeaker();
  }

  static setPreferredSpeaker(speaker: SpeakerName) {
    audioService.setPreferredSpeaker(speaker);
  }

  static async playTamilText(
    text: string,
    options?: VoiceOptions,
    onEnd?: () => void,
    onError?: () => void
  ) {
    return audioService.playTamil(text, options, onEnd, () => onError?.());
  }

  static playSequence(texts: string[], options?: VoiceOptions, onEnd?: () => void) {
    audioService.playSequence(texts, options, onEnd);
  }
}
