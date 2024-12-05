export const CACHE_KEYS = {
  PHONE: 'phone',
  REVIEWS: 'reviews',
  PRICES: 'prices',
  LAST_UPDATE: 'last_update'
} as const;

export const CACHE_DURATIONS = {
  SHORT: 3600, // 1 hour
  MEDIUM: 43200, // 12 hours
  LONG: 86400, // 24 hours
  WEEK: 604800 // 1 week
} as const;

export function generateCacheKey(prefix: keyof typeof CACHE_KEYS, identifier: string): string {
  return `${prefix}_${identifier}`;
}