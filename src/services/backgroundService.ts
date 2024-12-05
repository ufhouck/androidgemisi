import { scrapePhoneData } from './phoneScraping';
import { scrapeAndAnalyzeReviews } from './reviewScraping';
import { phones, addPhone, updatePhone } from '../data/phones';
import { cache } from '../lib/cache';

// Popular Android phone brands and their latest/popular models
const PHONE_CATALOG = {
  Samsung: [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy A54', 'Galaxy A34', 'Galaxy A24',
    'Galaxy M54', 'Galaxy M34', 'Galaxy F54'
  ],
  Google: [
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a',
    'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a'
  ],
  OnePlus: [
    'OnePlus 12', 'OnePlus 12R', 'OnePlus Nord CE 3',
    'OnePlus 11', 'OnePlus Nord N30', 'OnePlus Ace 2'
  ],
  Xiaomi: [
    'Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14',
    'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13',
    'POCO X6 Pro', 'POCO X6', 'POCO M6 Pro'
  ],
  OPPO: [
    'Find X7 Ultra', 'Find X7 Pro', 'Find X7',
    'Reno 11 Pro', 'Reno 11', 'Reno 10',
    'A79', 'A58', 'A38'
  ],
  Realme: [
    'GT5 Pro', 'GT Neo 5', '11 Pro+',
    '11 Pro', '11', 'C67',
    'Narzo 60 Pro', 'Narzo 60', 'C53'
  ],
  Honor: [
    'Magic 6 Pro', 'Magic 6', 'Magic V2',
    '90 Pro', '90', 'X9a',
    'X8', 'X7', 'X6'
  ],
  Reeder: [
    'S23 Pro Max', 'S23 Pro', 'S23',
    'P13 Max Pro', 'P13 Pro', 'P13',
    'M10S Pro', 'M10S', 'M8 Go'
  ]
};

async function updatePhoneData(brand: string, model: string) {
  const fullModel = `${brand} ${model}`;
  const phoneId = fullModel.toLowerCase().replace(/[^a-z0-9]+/g, '');
  
  try {
    const existingPhone = phones.find(p => p.id === phoneId);
    const newPhoneData = await scrapePhoneData(fullModel);
    const reviews = await scrapeAndAnalyzeReviews(phoneId, fullModel);

    if (existingPhone) {
      updatePhone(phoneId, {
        ...existingPhone,
        ...newPhoneData,
        reviews: reviews.length
      });
      console.log(`Updated data for ${fullModel}`);
    } else {
      addPhone({
        ...newPhoneData,
        reviews: reviews.length
      });
      console.log(`Added new phone: ${fullModel}`);
    }
  } catch (error) {
    console.error(`Error processing ${fullModel}:`, error);
  }
}

export async function startBackgroundService() {
  console.log('Starting background service for phone updates...');

  // Initial update for all phones
  for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
    for (const model of models) {
      await updatePhoneData(brand, model);
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Schedule weekly updates
  setInterval(async () => {
    console.log('Running weekly phone update...');
    
    for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
      for (const model of models) {
        await updatePhoneData(brand, model);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Clear cache after updates
    cache.clear();
  }, 7 * 24 * 60 * 60 * 1000); // Run every week
}