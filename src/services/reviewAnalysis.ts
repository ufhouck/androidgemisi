import natural from 'natural';
import NodeCache from 'node-cache';

const reviewCache = new NodeCache({ stdTTL: 259200 }); // Cache for 3 days

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

const tokenizer = new natural.WordTokenizer();
const TurkishStemmer = natural.PorterStemmer;

// Turkish sentiment words
const sentimentWords = {
  positive: ['güzel', 'harika', 'mükemmel', 'başarılı', 'hızlı', 'kaliteli'],
  negative: ['kötü', 'yavaş', 'sorunlu', 'başarısız', 'zayıf', 'pahalı']
};

const aspects = {
  camera: ['kamera', 'fotoğraf', 'video', 'çekim'],
  battery: ['batarya', 'pil', 'şarj'],
  performance: ['performans', 'hız', 'işlemci', 'ram'],
  display: ['ekran', 'görüntü', 'panel'],
  design: ['tasarım', 'görünüm', 'malzeme']
};

export function analyzeReview(text: string): ReviewAnalysis {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const stemmedTokens = tokens.map(token => TurkishStemmer.stem(token));

  let sentimentScore = 0;
  const aspectAnalysis: { [key: string]: { sentiment: string; count: number } } = {};

  // Analyze sentiment
  stemmedTokens.forEach(token => {
    if (sentimentWords.positive.includes(token)) sentimentScore++;
    if (sentimentWords.negative.includes(token)) sentimentScore--;
  });

  // Analyze aspects
  Object.entries(aspects).forEach(([aspect, keywords]) => {
    const aspectMentions = stemmedTokens.filter(token => 
      keywords.some(keyword => token.includes(TurkishStemmer.stem(keyword)))
    ).length;

    if (aspectMentions > 0) {
      aspectAnalysis[aspect] = {
        sentiment: sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral',
        count: aspectMentions
      };
    }
  });

  return {
    sentiment: sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral',
    score: sentimentScore,
    aspects: aspectAnalysis
  };
}

export async function analyzeAllReviews(phoneId: string, reviews: string[]): Promise<void> {
  const cacheKey = `review_analysis_${phoneId}`;
  const cachedAnalysis = reviewCache.get(cacheKey);

  if (cachedAnalysis) {
    return cachedAnalysis;
  }

  const analyses = reviews.map(analyzeReview);
  
  const summary = {
    positive: analyses.filter(a => a.sentiment === 'positive').length,
    neutral: analyses.filter(a => a.sentiment === 'neutral').length,
    negative: analyses.filter(a => a.sentiment === 'negative').length,
    aspects: {} as { [key: string]: { positive: number; neutral: number; negative: number } }
  };

  // Summarize aspect sentiments
  analyses.forEach(analysis => {
    Object.entries(analysis.aspects).forEach(([aspect, data]) => {
      if (!summary.aspects[aspect]) {
        summary.aspects[aspect] = { positive: 0, neutral: 0, negative: 0 };
      }
      summary.aspects[aspect][data.sentiment as 'positive' | 'neutral' | 'negative']++;
    });
  });

  reviewCache.set(cacheKey, summary);
  return summary;
}