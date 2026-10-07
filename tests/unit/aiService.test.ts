import { describe, it, expect, beforeEach } from 'vitest';
import { aiService } from '../../src/services/aiService';
import { metricsService } from '../../src/services/metricsService';

describe('AI Buddy Service & Fallback Unit Tests', () => {
  beforeEach(() => {
    metricsService.resetTelemetry();
  });

  it('provides accurate, deterministic local Tamil fallbacks for vowel queries', () => {
    const fallbackA = aiService.getLocalFallback('அ என்றால் என்ன?');
    expect(fallbackA).toContain('அ என்பது ஒரு தமிழ் உயிரெழுத்து');
    expect(fallbackA).toContain('அம்மா');

    const fallbackAa = aiService.getLocalFallback('tell me about ஆ');
    expect(fallbackAa).toContain('ஆ என்பது நெடில் உயிரெழுத்து');

    const fallbackGreeting = aiService.getLocalFallback('வணக்கம் buddy');
    expect(fallbackGreeting).toContain('வணக்கம்! நான் உங்கள் தமிழ் Buddy');
  });

  it('provides a gentle fallback for general Tamil queries', () => {
    const general = aiService.getLocalFallback('வானம் ஏன் நீல நிறம்?');
    expect(general).toContain('தமிழ் மொழியில் 247 எழுத்துக்கள் உள்ளன');
  });

  it('records AI telemetry metrics correctly during successes and fallbacks', () => {
    metricsService.recordAIRequest();
    metricsService.recordAISuccess(1800);
    metricsService.recordAIRequest();
    metricsService.recordAIFailure(true, false); // timeout
    metricsService.recordAIFallback();

    const data = metricsService.getData();
    expect(data.ai.requests).toBe(2);
    expect(data.ai.successes).toBe(1);
    expect(data.ai.failures).toBe(1);
    expect(data.ai.timeouts).toBe(1);
    expect(data.ai.fallbackCount).toBe(1);

    expect(metricsService.getAISuccessRate()).toBe(50);
    expect(metricsService.getAIFallbackRate()).toBe(50);
    expect(metricsService.getAverageAIResponseTimeSec()).toBe(1.8);
  });
});
