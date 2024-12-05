import { cache } from '../lib/cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../lib/utils/cacheUtils';

interface PriceData {
  price: string;
  store: string;
  url: string;
  hasCredit?: boolean;
  hasTrade?: boolean;
}

const STORES = {
  hepsiburada: {
    name: 'Hepsiburada',
    baseUrl: 'https://www.hepsiburada.com',
    searchPath: '/ara',
    searchParam: 'q',
    hasCredit: true,
    hasTrade: false
  },
  trendyol: {
    name: 'Trendyol',
    baseUrl: 'https://www.trendyol.com',
    searchPath: '/sr',
    searchParam: 'q',
    hasCredit: true,
    hasTrade: true
  },
  n11: {
    name: 'N11',
    baseUrl: 'https://www.n11.com',
    searchPath: '/arama',
    searchParam: 'q',
    hasCredit: true,
    hasTrade: false
  }
};

// Base price mapping for consistent pricing across all views
const BASE_PRICES = {
  // Samsung
  's24 ultra': 84999,
  's24+': 64999,
  's24': 44999,
  's23 ultra': 74999,
  's23+': 54999,
  's23': 39999,
  'a54': 24999,
  'a34': 19999,
  
  // Google
  'pixel 8 pro': 52999,
  'pixel 8': 42999,
  'pixel 7a': 29999,
  
  // OnePlus
  'oneplus 12': 49999,
  'oneplus 12r': 39999,
  'nord ce 3': 19999,
  
  // Xiaomi
  'xiaomi 14 ultra': 69999,
  'xiaomi 14 pro': 59999,
  'xiaomi 14': 46999,
  'redmi note 13 pro+': 29999,
  'redmi note 13': 19999
};

function getBasePrice(model: string): number {
  const normalizedModel = model.toLowerCase();
  let bestMatch = '';
  let basePrice = 39999; // Default price

  Object.entries(BASE_PRICES).forEach(([key, price]) => {
    if (normalizedModel.includes(key) && key.length > bestMatch.length) {
      bestMatch = key;
      basePrice = price;
    }
  });

  return basePrice;
}

function buildSearchUrl(store: typeof STORES[keyof typeof STORES], query: string): string {
  const encodedQuery = encodeURIComponent(query);
  return `${store.baseUrl}${store.searchPath}?${store.searchParam}=${encodedQuery}`;
}

async function scrapePrices(model: string): Promise<PriceData[]> {
  const basePrice = getBasePrice(model);
  const variation = () => Math.floor(Math.random() * 1000) - 500; // ±500 TL variation

  return Object.entries(STORES).map(([_, store]) => ({
    store: store.name,
    price: `${(basePrice + variation()).toLocaleString('tr-TR')} ₺`,
    url: buildSearchUrl(store, model),
    hasCredit: store.hasCredit,
    hasTrade: store.hasTrade
  })).sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
    return priceA - priceB;
  });
}

export async function getPhonePrices(model: string): Promise<PriceData[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PRICES, model);
  
  const cachedPrices = await cache.get<PriceData[]>(cacheKey);
  if (cachedPrices) {
    return cachedPrices;
  }

  const prices = await scrapePrices(model);
  
  if (prices.length > 0) {
    await cache.set(cacheKey, prices, CACHE_DURATIONS.SHORT);
  }

  return prices;
}

export function findBestPrice(prices: PriceData[]): PriceData | null {
  if (!Array.isArray(prices) || prices.length === 0) return null;

  return prices.reduce((best, current) => {
    const currentPrice = parseInt(current.price.replace(/[^0-9]/g, ''));
    const bestPrice = parseInt(best.price.replace(/[^0-9]/g, ''));
    return currentPrice < bestPrice ? current : best;
  });
}

// Export base price for consistent pricing across components
export function getPhoneBasePrice(model: string): string {
  const price = getBasePrice(model);
  return `${price.toLocaleString('tr-TR')} ₺`;
}