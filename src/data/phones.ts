import { Phone } from '../types/phone';
import { PHONE_CATALOG } from './phoneCatalog';
import { generatePhonePrice, determinePhoneTier } from '../lib/utils/priceUtils';

// Generate unique IDs for phones
function generateUniqueId(brand: string, model: string, index: number): string {
  return `${brand}_${model}_${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Default phones array with initial data
export const phones: Phone[] = Object.entries(PHONE_CATALOG).flatMap(([brand, models], brandIndex) =>
  models.map((model, modelIndex) => {
    const tier = determinePhoneTier(brand, model);
    const price = generatePhonePrice(tier);

    return {
      id: generateUniqueId(brand, model, brandIndex * 100 + modelIndex),
      name: `${brand} ${model}`,
      price,
      rating: 4.5,
      specs: {
        processor: tier === 'flagship' ? 'Snapdragon 8 Gen 3' :
                  tier === 'midrange' ? 'Snapdragon 7 Gen 1' :
                  'Dimensity 7020',
        ram: tier === 'flagship' ? '12GB' :
             tier === 'midrange' ? '8GB' :
             '6GB',
        storage: tier === 'flagship' ? '512GB' :
                tier === 'midrange' ? '256GB' :
                '128GB',
        camera: tier === 'flagship' ? '200MP + 12MP + 50MP' :
                tier === 'midrange' ? '108MP + 8MP + 2MP' :
                '50MP + 2MP + 2MP',
        battery: tier === 'flagship' ? '5000mAh' :
                tier === 'midrange' ? '5000mAh' :
                '4500mAh',
        screen: tier === 'flagship' ? '6.8" QHD+ AMOLED' :
                tier === 'midrange' ? '6.6" FHD+ AMOLED' :
                '6.5" HD+ LCD'
      },
      colors: ['Black', 'White', tier === 'flagship' ? 'Titanium' : 'Blue'],
      releaseDate: new Date().toISOString()
    };
  })
);

export default phones;