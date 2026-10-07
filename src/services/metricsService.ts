export interface AudioTelemetry {
  requests: number;
  successes: number;
  failures: number;
  totalLoadTimeMs: number;
  cacheHits: number;
  cacheMisses: number;
  fallbackCount: number;
}

export interface AITelemetry {
  requests: number;
  successes: number;
  failures: number;
  totalResponseTimeMs: number;
  timeouts: number;
  rateLimitHits: number;
  fallbackCount: number;
}

export interface ActivityTelemetry {
  quizzesCompleted: number;
  gamesCompleted: number;
  tracingCompleted: number;
  storiesRead: number;
  rhymesPlayed: number;
}

export interface PerformanceTelemetry {
  audio: AudioTelemetry;
  ai: AITelemetry;
  activity: ActivityTelemetry;
  lastUpdated: string;
}

const STORAGE_KEY = 'tamil_buddy_telemetry_v2';

const getInitialTelemetry = (): PerformanceTelemetry => ({
  audio: {
    requests: 0,
    successes: 0,
    failures: 0,
    totalLoadTimeMs: 0,
    cacheHits: 0,
    cacheMisses: 0,
    fallbackCount: 0,
  },
  ai: {
    requests: 0,
    successes: 0,
    failures: 0,
    totalResponseTimeMs: 0,
    timeouts: 0,
    rateLimitHits: 0,
    fallbackCount: 0,
  },
  activity: {
    quizzesCompleted: 0,
    gamesCompleted: 0,
    tracingCompleted: 0,
    storiesRead: 0,
    rhymesPlayed: 0,
  },
  lastUpdated: new Date().toISOString(),
});

class MetricsService {
  private data: PerformanceTelemetry;
  private listeners: Array<(data: PerformanceTelemetry) => void> = [];

  constructor() {
    this.data = this.load();
  }

  private load(): PerformanceTelemetry {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...getInitialTelemetry(), ...JSON.parse(stored) };
      }
    } catch {
      // Fallback to initial
    }
    return getInitialTelemetry();
  }

  private persist() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch {
      // Ignore write errors
    }
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.getData()));
  }

  public subscribe(cb: (data: PerformanceTelemetry) => void): () => void {
    this.listeners.push(cb);
    cb(this.getData());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public getData(): PerformanceTelemetry {
    return JSON.parse(JSON.stringify(this.data));
  }

  // Audio Telemetry
  public recordAudioRequest(isCacheHit: boolean) {
    this.data.audio.requests += 1;
    if (isCacheHit) {
      this.data.audio.cacheHits += 1;
    } else {
      this.data.audio.cacheMisses += 1;
    }
    this.persist();
  }

  public recordAudioSuccess(durationMs: number) {
    this.data.audio.successes += 1;
    this.data.audio.totalLoadTimeMs += durationMs;
    this.persist();
  }

  public recordAudioFailure() {
    this.data.audio.failures += 1;
    this.persist();
  }

  public recordAudioFallback() {
    this.data.audio.fallbackCount += 1;
    this.persist();
  }

  // AI Telemetry
  public recordAIRequest() {
    this.data.ai.requests += 1;
    this.persist();
  }

  public recordAISuccess(durationMs: number) {
    this.data.ai.successes += 1;
    this.data.ai.totalResponseTimeMs += durationMs;
    this.persist();
  }

  public recordAIFailure(isTimeout = false, isRateLimit = false) {
    this.data.ai.failures += 1;
    if (isTimeout) this.data.ai.timeouts += 1;
    if (isRateLimit) this.data.ai.rateLimitHits += 1;
    this.persist();
  }

  public recordAIFallback() {
    this.data.ai.fallbackCount += 1;
    this.persist();
  }

  // Activity Telemetry
  public recordActivity(type: keyof ActivityTelemetry) {
    this.data.activity[type] += 1;
    this.persist();
  }

  // Calculated Metrics
  public getAudioSuccessRate(): number | null {
    if (this.data.audio.requests === 0) return null;
    return Math.round((this.data.audio.successes / this.data.audio.requests) * 100);
  }

  public getAudioCacheHitRate(): number | null {
    const totalCacheChecks = this.data.audio.cacheHits + this.data.audio.cacheMisses;
    if (totalCacheChecks === 0) return null;
    return Math.round((this.data.audio.cacheHits / totalCacheChecks) * 100);
  }

  public getAverageAudioLoadTimeSec(): number | null {
    if (this.data.audio.successes === 0) return null;
    const avgMs = this.data.audio.totalLoadTimeMs / this.data.audio.successes;
    return parseFloat((avgMs / 1000).toFixed(2));
  }

  public getAISuccessRate(): number | null {
    if (this.data.ai.requests === 0) return null;
    return Math.round((this.data.ai.successes / this.data.ai.requests) * 100);
  }

  public getAverageAIResponseTimeSec(): number | null {
    if (this.data.ai.successes === 0) return null;
    const avgMs = this.data.ai.totalResponseTimeMs / this.data.ai.successes;
    return parseFloat((avgMs / 1000).toFixed(2));
  }

  public getAIFallbackRate(): number | null {
    if (this.data.ai.requests === 0) return null;
    return Math.round((this.data.ai.fallbackCount / this.data.ai.requests) * 100);
  }

  public getAPIErrorRate(): number | null {
    const totalRequests = this.data.audio.requests + this.data.ai.requests;
    const totalFailures = this.data.audio.failures + this.data.ai.failures;
    if (totalRequests === 0) return null;
    return parseFloat(((totalFailures / totalRequests) * 100).toFixed(1));
  }

  public hasSufficientData(): boolean {
    return this.data.audio.requests >= 3 || this.data.ai.requests >= 2;
  }

  public resetTelemetry() {
    this.data = getInitialTelemetry();
    this.persist();
  }
}

export const metricsService = new MetricsService();
