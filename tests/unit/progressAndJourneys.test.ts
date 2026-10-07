import { describe, it, expect, beforeEach } from 'vitest';
import { metricsService } from '../../src/services/metricsService';

describe('User Learning Journeys & Progress Tracking Unit Tests', () => {
  beforeEach(() => {
    metricsService.resetTelemetry();
  });

  it('tracks quiz activity and completion in metrics telemetry', () => {
    metricsService.recordActivity('quizzesCompleted');
    metricsService.recordActivity('quizzesCompleted');
    metricsService.recordActivity('gamesCompleted');
    metricsService.recordActivity('tracingCompleted');
    metricsService.recordActivity('storiesRead');
    metricsService.recordActivity('rhymesPlayed');

    const telemetry = metricsService.getData();
    expect(telemetry.activity.quizzesCompleted).toBe(2);
    expect(telemetry.activity.gamesCompleted).toBe(1);
    expect(telemetry.activity.tracingCompleted).toBe(1);
    expect(telemetry.activity.storiesRead).toBe(1);
    expect(telemetry.activity.rhymesPlayed).toBe(1);
  });

  it('calculates API error rates and overall system reliability accurately', () => {
    // 8 audio successes, 2 failures
    for (let i = 0; i < 8; i++) {
      metricsService.recordAudioRequest(false);
      metricsService.recordAudioSuccess(1200);
    }
    for (let i = 0; i < 2; i++) {
      metricsService.recordAudioRequest(false);
      metricsService.recordAudioFailure();
    }

    // 9 AI successes, 1 failure
    for (let i = 0; i < 9; i++) {
      metricsService.recordAIRequest();
      metricsService.recordAISuccess(1500);
    }
    metricsService.recordAIRequest();
    metricsService.recordAIFailure(true, false);

    const errorRate = metricsService.getAPIErrorRate();
    // Total requests = 10 audio + 10 AI = 20. Failures = 2 audio + 1 AI = 3. 3/20 = 15%
    expect(errorRate).toBe(15);
  });

  it('handles reset of telemetry and cache hit rate calculation', () => {
    metricsService.recordAudioRequest(true); // Hit
    metricsService.recordAudioRequest(true); // Hit
    metricsService.recordAudioRequest(false); // Miss
    metricsService.recordAudioRequest(false); // Miss

    expect(metricsService.getAudioCacheHitRate()).toBe(50);

    metricsService.resetTelemetry();
    const cleanData = metricsService.getData();
    expect(cleanData.audio.requests).toBe(0);
    expect(metricsService.getAudioCacheHitRate()).toBeNull();
  });
});
