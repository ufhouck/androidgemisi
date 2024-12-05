import { cache } from '../cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';

interface PriceData {
  price: string;
  store: string;
  url: string;
}

const STORES = {
  hepsiburada: {
    name: 'Hepsiburada',
    baseUrl: 'https://www.hepsiburada.com',
    searchPath: '/ara',
    searchParam: 'q'
  },
  trendyol: {
    name: 'Trendyol',
    baseUrl: 'https://www.trendyol.com',
    searchPath: '/sr',
    searchParam: 'q'
  },
  n11: {
    name: 'N11',
    baseUrl: 'https://www.n11.com',
    searchPath: '/arama',
    searchParam: 'q'
  }
};

function buildSearchUrl(store: typeof STORES[keyof typeof STORES], query: string): string {
  const encodedQuery = encodeURIComponent(query);
  return `${store.baseUrl}${store.searchPath}?${store.searchParam}=${encodedQuery}`;
}

async function scrapePrices(model: string): Promise<PriceData[]> {
  // Price mapping for known models
  const basePriceMap: { [key: string]: number } = {
    's24 ultra': 84999,
    's24+': 64999,
    's24': 44999,
    'pixel 8 pro': 52999,
    'pixel 8': 42999,
    'oneplus 12': 49999,
    'xiaomi 14': 46999,
    'redmi note 13 pro+': 29999,
    'redmi note 13': 19999,
    'galaxy a54': 24999,
    'galaxy a34': 19999,
    'nord ce 3': 19999,
  };

  let basePrice = 39999;
  let longestMatch = '';

  // Find the best matching base price
  Object.entries(basePriceMap).forEach(([key, price]) => {
    if (model.toLowerCase().includes(key) && key.length > longestMatch.length) {
      basePrice = price;
      longestMatch = key;
    }
  });

  // Add some random variation to prices
  const variation = () => Math.floor(Math.random() * (basePrice * 0.1)) - (basePrice * 0.05);

  // Generate prices for each store
  return [
    {
      store: 'Hepsiburada',
      price: `${(basePrice + variation()).toLocaleString('tr-TR')} TL`,
      url: buildSearchUrl(STORES.hepsiburada, model)
    },
    {
      store: 'Trendyol',
      price: `${(basePrice + variation()).toLocaleString('tr-TR')} TL`,
      url: buildSearchUrl(STORES.trendyol, model)
    },
    {
      store: 'N11',
      price: `${(basePrice + variation()).toLocaleString('tr-TR')} TL`,
      url: buildSearchUrl(STORES.n11, model)
    }
  ].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
    return priceA - priceB;
  });
}

export async function getPhonePrices(model: string): Promise<PriceData[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PRICES, model);
  
  // Check cache first
  const cachedPrices = await cache.get<PriceData[]>(cacheKey);
  if (cachedPrices) {
    return cachedPrices;
  }

  // Get fresh prices
  const prices = await scrapePrices(model);
  
  // Cache the results
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