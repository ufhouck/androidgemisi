import { cache } from '../lib/cache';

interface ReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  aspects: {
    [key: string]: {
      sentiment: 'positive' | 'neutral' | 'negative';
      count: number;
    };
  };
}

const sentimentWords = {
  positive: ['güzel', 'harika', 'mükemmel', 'başarılı', 'hızlı', 'kaliteli'],
  negative: ['kötü', 'yavaş', 'sorunlu', 'başarısız', 'zayıf', 'pahalı']
};

export function analyzeReview(text: string): ReviewAnalysis {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (sentimentWords.positive.includes(word)) score++;
    if (sentimentWords.negative.includes(word)) score--;
  });

  return {
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
    score,
    aspects: {}
  };
}

export async function analyzeAllReviews(phoneId: string, reviews: string[]): Promise<void> {
  const analyses = reviews.map(analyzeReview);
  cache.set(`review_analysis_${phoneId}`, analyses);
}