import { PHONE_CATALOG } from '../../data/phoneCatalog';
import { storage } from '../storage';
import { cache } from '../cache';
import { generatePhoneId } from '../utils/phoneUtils';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';
import { getPhoneReviews } from './reviewService';
import { updatePhoneData } from './phoneService';
import { Phone } from '../../types/phone';

async function processPhone(brand: string, model: string): Promise<void> {
  const fullModel = `${brand} ${model}`;
  const phoneId = generatePhoneId(fullModel);

  try {
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
    const updateKey = generateCacheKey(CACHE_KEYS.LAST_UPDATE, phoneId);
    await storage.set(updateKey, Date.now(), CACHE_DURATIONS.WEEK);

  } catch (error) {
    console.error(`Error processing ${fullModel}:`, error);
  }
}

export async function startDataCollection(): Promise<void> {
  console.log('Starting data collection...');

  try {
    for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
      for (const model of models) {
        await processPhone(brand, model);
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('Data collection completed');
  } catch (error) {
    console.error('Error during data collection:', error);
  }
}