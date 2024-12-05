import { PHONE_CATALOG } from '../../data/phoneCatalog';
import { storage } from '../storage';
import { cache } from '../cache';
import { generatePhoneId } from '../utils/phoneUtils';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';
import { getPhoneReviews } from './reviewService';
import { updatePhoneData } from './phoneService';
import { Phone } from '../../types/phone';

let isCollecting = false;

async function processPhone(brand: string, model: string): Promise<void> {
  const fullModel = `${brand} ${model}`;
  const phoneId = generatePhoneId(fullModel);

  try {
    // Check if we need to update
    const lastUpdate = await storage.get<number>(
      generateCacheKey(CACHE_KEYS.LAST_UPDATE, phoneId)
    );
    
    if (lastUpdate && Date.now() - lastUpdate < CACHE_DURATIONS.MEDIUM) {
      return; // Skip if recently updated
    }

    // Create base phone data
    const phone: Phone = {
      id: phoneId,
      name: fullModel,
      price: {
        tr: '49.999 ₺',
        eu: '999 €',
        us: '$999'
      },
      rating: 4.5,
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

    // Get reviews
    const reviews = await getPhoneReviews(phoneId, fullModel);
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      phone.rating = Number((totalRating / reviews.length).toFixed(1));
    }

    // Update phone data
    await updatePhoneData(phone);
    
    // Update last collection time
    await storage.set(
      generateCacheKey(CACHE_KEYS.LAST_UPDATE, phoneId),
      Date.now(),
      CACHE_DURATIONS.WEEK
    );

  } catch (error) {
    console.error(`Error processing ${fullModel}:`, error);
  }
}

export async function startDataCollection(): Promise<void> {
  if (isCollecting) {
    console.log('Data collection already in progress');
    return;
  }

  isCollecting = true;
  console.log('Starting data collection...');

  try {
    for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
      for (const model of models) {
        await processPhone(brand, model);
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error('Error during data collection:', error);
  } finally {
    isCollecting = false;
    console.log('Data collection completed');
  }
}