import { Phone } from '../types/phone';

export const phones: Phone[] = [
  // Samsung Galaxy S Series
  {
    id: 's24ultra',
    name: 'Samsung Galaxy S24 Ultra',
    price: {
      tr: '84.999 ₺',
      eu: '1.449 €',
      us: '$1,299'
    },
    rating: 4.8,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '512GB',
      camera: '200MP + 12MP + 50MP + 10MP',
      battery: '5000mAh',
      screen: '6.8" QHD+ Dynamic AMOLED 2X'
    },
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
    releaseDate: '2024-01-17'
  },
  {
    id: 's24plus',
    name: 'Samsung Galaxy S24+',
    price: {
      tr: '64.999 ₺',
      eu: '1.149 €',
      us: '$999'
    },
    rating: 4.7,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP + 12MP + 10MP',
      battery: '4900mAh',
      screen: '6.7" QHD+ Dynamic AMOLED 2X'
    },
    colors: ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
    releaseDate: '2024-01-17'
  },
  // Google Pixel Series
  {
    id: 'pixel8pro',
    name: 'Google Pixel 8 Pro',
    price: {
      tr: '52.999 ₺',
      eu: '1.099 €',
      us: '$999'
    },
    rating: 4.7,
    specs: {
      processor: 'Google Tensor G3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP + 48MP + 48MP',
      battery: '5050mAh',
      screen: '6.7" QHD+ LTPO OLED'
    },
    colors: ['Obsidian', 'Porcelain', 'Bay Blue'],
    releaseDate: '2023-10-12'
  },
  // OnePlus Series
  {
    id: 'oneplus12',
    name: 'OnePlus 12',
    price: {
      tr: '49.999 ₺',
      eu: '949 €',
      us: '$899'
    },
    rating: 4.6,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP + 48MP + 64MP',
      battery: '5400mAh',
      screen: '6.82" QHD+ LTPO AMOLED'
    },
    colors: ['Flowy Emerald', 'Silky Black'],
    releaseDate: '2024-01-23'
  },
  // Xiaomi Series
  {
    id: '14pro',
    name: 'Xiaomi 14 Pro',
    price: {
      tr: '46.999 ₺',
      eu: '999 €',
      us: '$899'
    },
    rating: 4.5,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP + 50MP + 50MP',
      battery: '4880mAh',
      screen: '6.73" QHD+ LTPO AMOLED'
    },
    colors: ['Black', 'White', 'Jade Green'],
    releaseDate: '2024-02-25'
  },
  {
    id: 'redminote13pro',
    name: 'Redmi Note 13 Pro+',
    price: {
      tr: '24.999 ₺',
      eu: '449 €',
      us: '$399'
    },
    rating: 4.4,
    specs: {
      processor: 'Dimensity 7200 Ultra',
      ram: '12GB',
      storage: '256GB',
      camera: '200MP + 8MP + 2MP',
      battery: '5000mAh',
      screen: '6.67" AMOLED 120Hz'
    },
    colors: ['Midnight Black', 'Moonlight White', 'Aurora Purple'],
    releaseDate: '2024-01-15'
  },
  // POCO Series
  {
    id: 'pocox6pro',
    name: 'POCO X6 Pro',
    price: {
      tr: '19.999 ₺',
      eu: '399 €',
      us: '$349'
    },
    rating: 4.3,
    specs: {
      processor: 'Dimensity 8300-Ultra',
      ram: '12GB',
      storage: '256GB',
      camera: '64MP + 8MP + 2MP',
      battery: '5000mAh',
      screen: '6.67" AMOLED 120Hz'
    },
    colors: ['Black', 'Yellow', 'Gray'],
    releaseDate: '2024-01-11'
  },
  // Honor Series
  {
    id: 'magic6pro',
    name: 'Honor Magic6 Pro',
    price: {
      tr: '41.999 ₺',
      eu: '849 €',
      us: '$749'
    },
    rating: 4.4,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '512GB',
      camera: '50MP + 50MP + 180MP',
      battery: '5600mAh',
      screen: '6.8" LTPO OLED'
    },
    colors: ['Black', 'Green', 'Purple'],
    releaseDate: '2024-01-11'
  },
  {
    id: 'honor90',
    name: 'Honor 90',
    price: {
      tr: '29.999 ₺',
      eu: '549 €',
      us: '$499'
    },
    rating: 4.3,
    specs: {
      processor: 'Snapdragon 7 Gen 1',
      ram: '8GB',
      storage: '256GB',
      camera: '200MP + 12MP + 2MP',
      battery: '5000mAh',
      screen: '6.7" AMOLED 120Hz'
    },
    colors: ['Emerald Green', 'Diamond Silver', 'Midnight Black'],
    releaseDate: '2023-07-06'
  },
  // New phones
  {
    id: 'tecnospark20',
    name: 'Tecno Spark 20',
    price: {
      tr: '7.999 ₺',
      eu: '149 €',
      us: '$129'
    },
    rating: 4.1,
    specs: {
      processor: 'Helio G85',
      ram: '8GB',
      storage: '128GB',
      camera: '50MP + 0.8MP',
      battery: '5000mAh',
      screen: '6.6" IPS LCD'
    },
    colors: ['Racing Black', 'Cyber White', 'Gravity Green'],
    releaseDate: '2024-01-05'
  },
  {
    id: 'reeders23promax',
    name: 'Reeder S23 Pro Max',
    price: {
      tr: '9.999 ₺',
      eu: '189 €',
      us: '$169'
    },
    rating: 4.0,
    specs: {
      processor: 'Helio G99',
      ram: '6GB',
      storage: '128GB',
      camera: '108MP + 8MP + 2MP',
      battery: '5000mAh',
      screen: '6.8" IPS LCD'
    },
    colors: ['Gray', 'Blue'],
    releaseDate: '2024-02-15'
  }
];

// Helper functions
export function getPhonesByBrand(brand: string) {
  return phones.filter(phone => phone.name.toLowerCase().includes(brand.toLowerCase()));
}

export function getPhonesByPriceRange(minPrice: number, maxPrice: number) {
  return phones.filter(phone => {
    const price = parseInt(phone.price.tr.replace(/[^0-9]/g, ''));
    return price >= minPrice && price <= maxPrice;
  });
}

export function getPhonesByYear(year: number) {
  return phones.filter(phone => {
    const releaseYear = new Date(phone.releaseDate).getFullYear();
    return releaseYear === year;
  });
}