export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Fazla boşlukları temizle
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ.,!?-]/g, '') // Özel karakterleri temizle
    .trim();
}

export function removeDuplicateSentences(text: string): string {
  const sentences = text.split(/[.!?]+/).map(s => s.trim());
  const uniqueSentences = Array.from(new Set(sentences));
  return uniqueSentences.join('. ').trim();
}

export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}