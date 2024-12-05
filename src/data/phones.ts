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
  // Add more Samsung phones...
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
  // Add more Samsung phones...

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
  // Add more Google phones...

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
  // Add more OnePlus phones...

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
  }
  // Continue with more phones...
];

export function getPhonesByBrand(brand: string): Phone[] {
  return phones.filter(phone => 
    phone.name.toLowerCase().includes(brand.toLowerCase())
  );
}

export function getPhonesByPriceRange(min: number, max: number): Phone[] {
  return phones.filter(phone => {
    const price = parseInt(phone.price.tr.replace(/[^0-9]/g, ''));
    return price >= min && price <= max;
  });
}

export function getPhoneById(id: string): Phone | undefined {
  return phones.find(phone => phone.id === id);
}

export function addPhone(phone: Phone): void {
  phones.push(phone);
}

export function updatePhone(id: string, updatedPhone: Phone): void {
  const index = phones.findIndex(p => p.id === id);
  if (index !== -1) {
    phones[index] = updatedPhone;
  }
}

export function deletePhone(id: string): void {
  const index = phones.findIndex(p => p.id === id);
  if (index !== -1) {
    phones.splice(index, 1);
  }
}