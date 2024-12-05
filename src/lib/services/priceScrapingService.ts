import axios from 'axios';
import * as cheerio from 'cheerio';
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
    url: 'https://www.hepsiburada.com',
    searchPath: '/ara?q=',
    priceSelector: '.product-price',
    productSelector: '.product-card'
  },
  trendyol: {
    name: 'Trendyol',
    url: 'https://www.trendyol.com',
    searchPath: '/sr?q=',
    priceSelector: '.prc-box-dscntd',
    productSelector: '.p-card-wrppr'
  },
  n11: {
    name: 'N11',
    url: 'https://www.n11.com',
    searchPath: '/arama?q=',
    priceSelector: '.newPrice',
    productSelector: '.columnContent'
  }
};

async function scrapePrices(model: string): Promise<PriceData[]> {
  const prices: PriceData[] = [];

  try {
    for (const [key, store] of Object.entries(STORES)) {
      try {
        const response = await axios.get(`${store.url}${store.searchPath}${encodeURIComponent(model)}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(response.data);
        const products = $(store.productSelector);

        products.each((_, element) => {
          const name = $(element).find('h3').text().trim();
          const price = $(element).find(store.priceSelector).first().text().trim();
          const url = $(element).find('a').attr('href') || '';

          if (name.toLowerCase().includes(model.toLowerCase()) && price) {
            prices.push({
              store: store.name,
              price: price.replace(/[^0-9,]/g, '') + ' TL',
              url: url.startsWith('http') ? url : `${store.url}${url}`
            });
            return false; // Break each loop after finding first match
          }
        });
      } catch (error) {
        console.error(`Error scraping ${store.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error scraping prices:', error);
  }

  return prices;
}

export async function getPhonePrices(model: string): Promise<PriceData[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PRICES, model);
  
  // Check cache first
  const cachedPrices = await cache.get<PriceData[]>(cacheKey);
  if (cachedPrices) {
    return cachedPrices;
  }

  // Scrape fresh prices
  const prices = await scrapePrices(model);
  
  // Cache results
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