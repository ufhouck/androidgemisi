import puppeteer from 'puppeteer';
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
    priceSelector: '[data-test-id="price-current-price"]',
    productSelector: '[data-test-id="product-card-name"]'
  },
  trendyol: {
    name: 'Trendyol',
    url: 'https://www.trendyol.com',
    searchPath: '/sr?q=',
    priceSelector: '.prc-box-dscntd',
    productSelector: '.prdct-desc-cntnr-name'
  },
  n11: {
    name: 'N11',
    url: 'https://www.n11.com',
    searchPath: '/arama?q=',
    priceSelector: '.newPrice',
    productSelector: '.productName'
  }
};

async function scrapePrices(model: string): Promise<PriceData[]> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const prices: PriceData[] = [];

  try {
    for (const [key, store] of Object.entries(STORES)) {
      const page = await browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1366, height: 768 });

      // Navigate to search page
      const searchUrl = `${store.url}${store.searchPath}${encodeURIComponent(model)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle0' });

      // Wait for price elements
      await page.waitForSelector(store.priceSelector, { timeout: 5000 }).catch(() => null);

      // Get all products with prices
      const products = await page.evaluate(
        (priceSelector, productSelector) => {
          const items = document.querySelectorAll(productSelector);
          const prices = document.querySelectorAll(priceSelector);
          
          return Array.from(items).map((item, index) => ({
            name: item.textContent?.trim() || '',
            price: prices[index]?.textContent?.trim() || '',
            url: (item.closest('a') as HTMLAnchorElement)?.href || ''
          }));
        },
        store.priceSelector,
        store.productSelector
      );

      // Find exact or closest match
      const exactMatch = products.find(p => 
        p.name.toLowerCase().includes(model.toLowerCase())
      );

      if (exactMatch) {
        prices.push({
          store: store.name,
          price: exactMatch.price.replace(/[^0-9,]/g, '') + ' TL',
          url: exactMatch.url
        });
      }

      await page.close();
    }
  } catch (error) {
    console.error('Error scraping prices:', error);
  } finally {
    await browser.close();
  }

  return prices;
}

export async function getPhonePrices(model: string): Promise<PriceData[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PRICES, model);
  
  // Check cache first
  const cachedPrices = cache.get<PriceData[]>(cacheKey);
  if (cachedPrices) {
    return cachedPrices;
  }

  // Scrape fresh prices
  const prices = await scrapePrices(model);
  
  // Cache results
  if (prices.length > 0) {
    cache.set(cacheKey, prices, CACHE_DURATIONS.SHORT);
  }

  return prices;
}

export function findBestPrice(prices: PriceData[]): PriceData | null {
  if (prices.length === 0) return null;

  return prices.reduce((best, current) => {
    const currentPrice = parseInt(current.price.replace(/[^0-9]/g, ''));
    const bestPrice = parseInt(best.price.replace(/[^0-9]/g, ''));
    return currentPrice < bestPrice ? current : best;
  });
}