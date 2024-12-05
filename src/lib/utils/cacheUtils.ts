export function generateCacheKey(prefix: string, identifier: string): string {
  return `${prefix}_${identifier}`;
}

export function getCacheExpiry(hours: number): number {
  return hours * 60 * 60;
}

export const CACHE_KEYS = {
  PHONE: 'phone',
  REVIEWS: 'reviews',
  PRICES: 'prices',
  LAST_UPDATE: 'last_update'
} as const;

export const CACHE_DURATIONS = {
  SHORT: getCacheExpiry(1), // 1 hour
  MEDIUM: getCacheExpiry(12), // 12 hours
  LONG: getCacheExpiry(24), // 24 hours
  WEEK: getCacheExpiry(168) // 1 week
} as const;