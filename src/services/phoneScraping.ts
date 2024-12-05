import axios from 'axios';
import * as cheerio from 'cheerio';
import { Phone } from '../types/phone';
import { addPhone } from './phoneService';
import { scrapeAndAnalyzeReviews } from './reviewScraping';

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);
}

export async function scrapePhoneData(model: string): Promise<Phone> {
  try {
    const phoneId = generateId(model);

    // Create a new phone object with scraped data
    const newPhone: Phone = {
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

    // Scrape and analyze reviews
    const reviews = await scrapeAndAnalyzeReviews(phoneId, model);
    
    // Calculate average rating from reviews
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      newPhone.rating = Number((totalRating / reviews.length).toFixed(1));
    }

    // Add the phone to storage
    addPhone(newPhone);

    return newPhone;
  } catch (error) {
    console.error('Error fetching phone data:', error);
    throw new Error('Failed to fetch phone data');
  }
}