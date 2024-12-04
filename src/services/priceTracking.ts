import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const priceCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

interface PriceData {
  price: string;
  store: string;
  url: string;
}

interface StorePrices {
  [key: string]: PriceData[];
}

const stores = {
  trendyol: {
    baseUrl: 'https://www.trendyol.com',
    selector: '.prc-box-dscntd'
  },
  hepsiburada: {
    baseUrl: 'https://www.hepsiburada.com',
    selector: '.price-value'
  },
  n11: {
    baseUrl: 'https://www.n11.com',
    selector: '.newPrice'
  }
};

export async function trackPrices(phoneModel: string): Promise<StorePrices> {
  const cacheKey = `prices_${phoneModel}`;
  const cachedPrices = priceCache.get<StorePrices>(cacheKey);

  if (cachedPrices) {
    return cachedPrices;
  }

  const prices: StorePrices = {};

  for (const [store, config] of Object.entries(stores)) {
    try {
      const response = await axios.get(`${config.baseUrl}/search?q=${encodeURIComponent(phoneModel)}`);
      const $ = cheerio.load(response.data);
      
      const priceElements = $(config.selector);
      const priceData: PriceData[] = [];

      priceElements.each((_, element) => {
        const price = $(element).text().trim();
        const url = $(element).closest('a').attr('href') || '';
        
        priceData.push({
          price,
          store,
          url: url.startsWith('http') ? url : `${config.baseUrl}${url}`
        });
      });

      prices[store] = priceData;
    } catch (error) {
      console.error(`Error fetching prices from ${store}:`, error);
      prices[store] = [];
    }
  }

  priceCache.set(cacheKey, prices);
  return prices;
}

export async function updateAllPrices(): Promise<void> {
  const phones = (await import('../data/phones')).phones;
  
  for (const phone of phones) {
    const prices = await trackPrices(phone.name);
    
    // Find the best price across all stores
    let bestPrice: PriceData | undefined;
    
    Object.values(prices).flat().forEach(price => {
      const priceValue = parseInt(price.price.replace(/[^0-9]/g, ''));
      const bestPriceValue = bestPrice ? parseInt(bestPrice.price.replace(/[^0-9]/g, '')) : Infinity;
      
      if (priceValue < bestPriceValue) {
        bestPrice = price;
      }
    });

    if (bestPrice) {
      phone.price.bestPrice = bestPrice;
    }
  }
}