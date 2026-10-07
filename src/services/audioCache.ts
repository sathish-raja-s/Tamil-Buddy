/**
 * Audio Cache Manager
 * Uses browser Cache Storage API with LRU eviction and localStorage metadata.
 */

const CACHE_NAME = 'tamil-buddy-audio-v2';
const METADATA_KEY = 'tamil_buddy_audio_cache_meta_v2';
const MAX_CACHE_ENTRIES = 120;
const MAX_CACHE_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

interface CacheEntryMeta {
  key: string;
  url: string;
  timestamp: number;
  accessCount: number;
  sizeBytes: number;
}

class AudioCacheManager {
  private cachePromise: Promise<Cache | null> | null = null;

  private async getCache(): Promise<Cache | null> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return null;
    }
    if (!this.cachePromise) {
      this.cachePromise = caches.open(CACHE_NAME).catch((err) => {
        console.warn('Cache Storage API unavailable:', err);
        return null;
      });
    }
    return this.cachePromise;
  }

  private getMetadata(): Record<string, CacheEntryMeta> {
    try {
      const stored = localStorage.getItem(METADATA_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveMetadata(meta: Record<string, CacheEntryMeta>) {
    try {
      localStorage.setItem(METADATA_KEY, JSON.stringify(meta));
    } catch {
      // Storage full or unavailable
    }
  }

  public getCacheKey(text: string, speaker = 'ishita', pace = 1.0): string {
    return `${speaker}_${pace}_${text.trim()}`;
  }

  public async has(text: string, speaker = 'ishita', pace = 1.0): Promise<boolean> {
    const cache = await this.getCache();
    if (!cache) return false;
    const key = this.getCacheKey(text, speaker, pace);
    const mockRequest = new Request(`https://tamilbuddy.local/audio/${encodeURIComponent(key)}`);
    const match = await cache.match(mockRequest);
    return !!match;
  }

  public async get(text: string, speaker = 'ishita', pace = 1.0): Promise<Blob | null> {
    const cache = await this.getCache();
    if (!cache) return null;

    const key = this.getCacheKey(text, speaker, pace);
    const mockRequest = new Request(`https://tamilbuddy.local/audio/${encodeURIComponent(key)}`);
    const response = await cache.match(mockRequest);

    if (!response) {
      return null;
    }

    // Update metadata accessCount and timestamp
    const meta = this.getMetadata();
    if (meta[key]) {
      meta[key].accessCount = (meta[key].accessCount || 0) + 1;
      meta[key].timestamp = Date.now();
      this.saveMetadata(meta);
    }

    return await response.blob();
  }

  public async put(text: string, blob: Blob, speaker = 'ishita', pace = 1.0): Promise<void> {
    const cache = await this.getCache();
    if (!cache) return;

    const key = this.getCacheKey(text, speaker, pace);
    const mockRequest = new Request(`https://tamilbuddy.local/audio/${encodeURIComponent(key)}`);
    const response = new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'audio/wav',
        'X-Cached-At': new Date().toISOString(),
      },
    });

    await cache.put(mockRequest, response);

    // Record metadata
    const meta = this.getMetadata();
    meta[key] = {
      key,
      url: mockRequest.url,
      timestamp: Date.now(),
      accessCount: (meta[key]?.accessCount || 0) + 1,
      sizeBytes: blob.size,
    };

    // Check LRU eviction if size > MAX_CACHE_ENTRIES
    const entries = Object.values(meta);
    if (entries.length > MAX_CACHE_ENTRIES) {
      // Sort by timestamp ascending (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toEvict = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
      for (const ev of toEvict) {
        await cache.delete(new Request(ev.url)).catch(() => {});
        delete meta[ev.key];
      }
    }

    this.saveMetadata(meta);
  }

  public async clear(): Promise<void> {
    if (typeof window !== 'undefined' && 'caches' in window) {
      await caches.delete(CACHE_NAME).catch(() => {});
    }
    localStorage.removeItem(METADATA_KEY);
  }

  public getStats(): { count: number; totalSizeBytes: number } {
    const meta = this.getMetadata();
    const entries = Object.values(meta);
    const totalSizeBytes = entries.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
    return {
      count: entries.length,
      totalSizeBytes,
    };
  }
}

export const audioCache = new AudioCacheManager();
