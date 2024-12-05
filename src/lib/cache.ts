import { get, set, del } from 'idb-keyval';

interface CacheData<T> {
  value: T;
  expires: number | null;
}

class BrowserCache {
  private memoryCache: Map<string, any>;
  private timeouts: Map<string, NodeJS.Timeout>;

  constructor() {
    this.memoryCache = new Map();
    this.timeouts = new Map();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Clear any existing timeout
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }

    // Set in memory cache
    this.memoryCache.set(key, value);

    // Set in IndexedDB
    try {
      const data: CacheData<T> = {
        value,
        expires: ttl ? Date.now() + ttl * 1000 : null
      };
      await set(key, data);
    } catch (error) {
      console.error('Error setting cache:', error);
    }

    // Set expiration if TTL provided
    if (ttl) {
      const timeout = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      this.timeouts.set(key, timeout);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // Try IndexedDB
    try {
      const data = await get(key) as CacheData<T> | undefined;
      if (!data) return null;

      if (data.expires && Date.now() > data.expires) {
        await this.delete(key);
        return null;
      }

      // Update memory cache
      this.memoryCache.set(key, data.value);
      return data.value;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
    try {
      await del(key);
    } catch (error) {
      console.error('Error deleting from cache:', error);
    }
  }

  clear(): void {
    this.memoryCache.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

export const cache = new BrowserCache();