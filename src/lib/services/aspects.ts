const aspects = {
  kamera: ['kamera', 'fotoğraf', 'video', 'çekim', 'zoom', 'selfie'],
  batarya: ['batarya', 'pil', 'şarj', 'güç'],
  performans: ['performans', 'hız', 'işlemci', 'ram', 'oyun'],
  ekran: ['ekran', 'görüntü', 'panel', 'parlaklık', 'renk'],
  tasarım: ['tasarım', 'görünüm', 'malzeme', 'kalite', 'ağırlık'],
  fiyat: ['fiyat', 'para', 'ücret', 'pahalı', 'ucuz', 'değer']
};

export function extractAspects(text: string): string[] {
  const foundAspects = new Set<string>();
  const lowerText = text.toLowerCase();

  Object.entries(aspects).forEach(([aspect, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      foundAspects.add(aspect);
    }
  });

  return Array.from(foundAspects);
}