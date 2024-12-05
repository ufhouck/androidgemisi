export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = [
    'mükemmel', 'harika', 'güzel', 'başarılı', 'muhteşem', 'süper',
    'kaliteli', 'hızlı', 'kusursuz', 'rahat', 'şık', 'etkileyici'
  ];

  const negativeWords = [
    'kötü', 'berbat', 'yavaş', 'sorunlu', 'yetersiz', 'zayıf',
    'pahalı', 'bozuk', 'kırık', 'düşük', 'vasat', 'problemli'
  ];

  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score--;
  });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}