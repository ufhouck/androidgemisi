export function generatePhonePrice(tier: 'flagship' | 'midrange' | 'budget'): {
  tr: string;
  eu: string;
  us: string;
} {
  const basePrice = {
    flagship: {
      tr: { min: 45000, max: 85000 },
      eu: { min: 899, max: 1499 },
      us: { min: 799, max: 1299 }
    },
    midrange: {
      tr: { min: 20000, max: 44999 },
      eu: { min: 399, max: 898 },
      us: { min: 349, max: 798 }
    },
    budget: {
      tr: { min: 8000, max: 19999 },
      eu: { min: 199, max: 398 },
      us: { min: 179, max: 348 }
    }
  }[tier];

  const randomInRange = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1) + min);

  const trPrice = randomInRange(basePrice.tr.min, basePrice.tr.max);
  const euPrice = randomInRange(basePrice.eu.min, basePrice.eu.max);
  const usPrice = randomInRange(basePrice.us.min, basePrice.us.max);

  return {
    tr: `${trPrice.toLocaleString('tr-TR')} ₺`,
    eu: `${euPrice} €`,
    us: `$${usPrice}`
  };
}

export function determinePhoneTier(brand: string, model: string): 'flagship' | 'midrange' | 'budget' {
  const modelLower = model.toLowerCase();
  
  // Flagship indicators
  if (
    modelLower.includes('ultra') ||
    modelLower.includes('pro+') ||
    modelLower.includes('plus+') ||
    (modelLower.includes('s24') && brand === 'Samsung') ||
    (modelLower.includes('14') && brand === 'Xiaomi') ||
    (modelLower.includes('pixel 8 pro') && brand === 'Google') ||
    (modelLower.includes('12') && brand === 'OnePlus')
  ) {
    return 'flagship';
  }

  // Budget indicators
  if (
    modelLower.includes('a1') ||
    modelLower.includes('a2') ||
    modelLower.includes('m1') ||
    modelLower.includes('m2') ||
    modelLower.includes('redmi') ||
    modelLower.includes('nord n') ||
    modelLower.includes('a0')
  ) {
    return 'budget';
  }

  // Default to midrange
  return 'midrange';
}