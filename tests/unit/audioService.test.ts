import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioCache } from '../../src/services/audioCache';
import { metricsService } from '../../src/services/metricsService';
import { audioService } from '../../src/services/audioService';

describe('Audio Cache & Metrics Unit Tests', () => {
  beforeEach(() => {
    metricsService.resetTelemetry();
  });

  it('generates reproducible cache keys based on text, speaker, and pace', () => {
    const key1 = audioCache.getCacheKey('வணக்கம்', 'ishita', 1.0);
    const key2 = audioCache.getCacheKey('வணக்கம்', 'ishita', 1.0);
    const key3 = audioCache.getCacheKey('வணக்கம்', 'ritu', 1.0);

    expect(key1).toBe('ishita_1_வணக்கம்');
    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
  });

  it('records audio telemetry events accurately in metricsService', () => {
    metricsService.recordAudioRequest(false);
    metricsService.recordAudioRequest(true);
    metricsService.recordAudioSuccess(1500); // 1.5s
    metricsService.recordAudioSuccess(2500); // 2.5s

    const data = metricsService.getData();
    expect(data.audio.requests).toBe(2);
    expect(data.audio.cacheHits).toBe(1);
    expect(data.audio.cacheMisses).toBe(1);
    expect(data.audio.successes).toBe(2);

    expect(metricsService.getAudioSuccessRate()).toBe(100);
    expect(metricsService.getAudioCacheHitRate()).toBe(50);
    expect(metricsService.getAverageAudioLoadTimeSec()).toBe(2.0);
  });

  it('handles insufficient telemetry data correctly without fabricating statistics', () => {
    const data = metricsService.getData();
    expect(data.audio.requests).toBe(0);
    expect(metricsService.hasSufficientData()).toBe(false);
    expect(metricsService.getAudioSuccessRate()).toBeNull();
    expect(metricsService.getAverageAudioLoadTimeSec()).toBeNull();
  });

  it('transitions audioService states appropriately during playback stop', () => {
    audioService.stop();
    const state = audioService.getState();
    expect(state.state).toBe('idle');
  });
});
