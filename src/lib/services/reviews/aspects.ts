const aspectKeywords = {
  kamera: ['kamera', 'fotoğraf', 'video', 'çekim', 'zoom', 'selfie'],
  batarya: ['batarya', 'pil', 'şarj', 'güç'],
  performans: ['performans', 'hız', 'işlemci', 'ram', 'oyun'],
  ekran: ['ekran', 'görüntü', 'panel', 'parlaklık', 'renk'],
  tasarım: ['tasarım', 'görünüm', 'malzeme', 'kalite', 'ağırlık'],
  fiyat: ['fiyat', 'para', 'ücret', 'pahalı', 'ucuz', 'değer']
};

export function extractAspects(text: string): string[] {
  const aspects: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      aspects.add(aspect);
    }
  });

  return Array.from(aspects);
}