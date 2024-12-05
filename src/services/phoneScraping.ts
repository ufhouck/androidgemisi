import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from '../lib/storage';
import { scrapeAndAnalyzeReviews } from './reviewScraping';
import retry from 'retry';

interface ScrapedPhone {
  id: string;
  name: string;
  price: {
    tr: string;
    eu: string;
    us: string;
  };
  rating: number;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    screen: string;
  };
  colors: string[];
  releaseDate: string;
}

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);
}

async function scrapePhoneSpecs(model: string): Promise<Partial<ScrapedPhone>> {
  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const searchUrl = `https://www.gsmarena.com/res.php3?sSearch=${encodeURIComponent(model)}`;
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);

        // GSMArena'dan telefon özelliklerini çek
        const specs: Partial<ScrapedPhone> = {
          specs: {
            processor: $('.specs-brief-accent').first().text().trim(),
            ram: $('.specs-brief-accent').eq(1).text().trim(),
            storage: $('.specs-brief-accent').eq(2).text().trim(),
            camera: $('.specs-brief-accent').eq(3).text().trim(),
            battery: $('.specs-brief-accent').eq(4).text().trim(),
            screen: $('.specs-brief-accent').eq(5).text().trim()
          }
        };

        resolve(specs);
      } catch (error) {
        if (operation.retry(error as Error)) {
          return;
        }
        console.error('Error scraping phone specs:', error);
        resolve({});
      }
    });
  });
}

export async function scrapePhoneData(model: string): Promise<ScrapedPhone> {
  try {
    const phoneId = generateId(model);
    
    // Önce cache'e bak
    const cachedPhone = await storage.get<ScrapedPhone>(`phone_${phoneId}`);
    if (cachedPhone) {
      return cachedPhone;
    }

    // Temel telefon verilerini oluştur
    const newPhone: ScrapedPhone = {
      id: phoneId,
      name: model,
      price: {
        tr: '49.999 ₺',
        eu: '999 €',
        us: '$999'
      },
      rating: 0,
      specs: {
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        camera: '200MP + 12MP + 50MP',
        battery: '5000mAh',
        screen: '6.8" AMOLED'
      },
      colors: ['Black', 'White', 'Gray'],
      releaseDate: new Date().toISOString()
    };

    // Özellikleri scrape et
    const scrapedSpecs = await scrapePhoneSpecs(model);
    if (scrapedSpecs.specs) {
      newPhone.specs = { ...newPhone.specs, ...scrapedSpecs.specs };
    }

    // Yorumları çek ve analiz et
    const reviews = await scrapeAndAnalyzeReviews(phoneId, model);
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      newPhone.rating = Number((totalRating / reviews.length).toFixed(1));
    }

    // Telefonu storage'a kaydet
    await storage.set(`phone_${phoneId}`, newPhone, 24 * 60 * 60); // 24 saat cache
    await storage.addPhone(newPhone);

    return newPhone;
  } catch (error) {
    console.error('Error fetching phone data:', error);
    throw new Error('Failed to fetch phone data');
  }
}