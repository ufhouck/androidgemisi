import { Review } from '../types/review';

interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  aspects: {
    [key: string]: {
      sentiment: 'positive' | 'neutral' | 'negative';
      count: number;
    };
  };
}

interface ReviewSummary {
  phoneId: string;
  phoneName: string;
  overallSentiment: string;
  positiveAspects: string[];
  negativeAspects: string[];
  totalReviews: number;
}

function analyzeSentiment(reviews: Review[]): SentimentAnalysis {
  if (!Array.isArray(reviews)) {
    console.error('Invalid reviews data:', reviews);
    return {
      sentiment: 'neutral',
      score: 0,
      aspects: {}
    };
  }

  const aspects = {
    camera: ['kamera', 'fotoğraf', 'video', 'çekim'],
    battery: ['batarya', 'pil', 'şarj'],
    performance: ['performans', 'hız', 'işlemci', 'ram'],
    display: ['ekran', 'görüntü', 'panel'],
    design: ['tasarım', 'görünüm', 'malzeme']
  };

  const aspectAnalysis: { [key: string]: { positive: number; negative: number } } = {};
  let totalScore = 0;

  reviews.forEach(review => {
    const text = review.comment.toLowerCase();
    totalScore += review.rating > 3.5 ? 1 : review.rating < 2.5 ? -1 : 0;

    Object.entries(aspects).forEach(([aspect, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        if (!aspectAnalysis[aspect]) {
          aspectAnalysis[aspect] = { positive: 0, negative: 0 };
        }
        if (review.rating >= 4) {
          aspectAnalysis[aspect].positive++;
        } else if (review.rating <= 2) {
          aspectAnalysis[aspect].negative++;
        }
      }
    });
  });

  const normalizedAspects = Object.entries(aspectAnalysis).reduce((acc, [aspect, counts]) => {
    const total = counts.positive + counts.negative;
    if (total === 0) return acc;
    
    const score = (counts.positive - counts.negative) / total;
    acc[aspect] = {
      sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      count: total
    };
    return acc;
  }, {} as SentimentAnalysis['aspects']);

  return {
    sentiment: totalScore > 0 ? 'positive' : totalScore < 0 ? 'negative' : 'neutral',
    score: totalScore,
    aspects: normalizedAspects
  };
}

export function generateReviewSummary(reviews: Review[], phoneName: string): ReviewSummary {
  if (!Array.isArray(reviews)) {
    console.error('Invalid reviews data:', reviews);
    return {
      phoneId: '',
      phoneName,
      overallSentiment: 'Henüz yorum yapılmamış',
      positiveAspects: [],
      negativeAspects: [],
      totalReviews: 0
    };
  }

  if (reviews.length === 0) {
    return {
      phoneId: '',
      phoneName,
      overallSentiment: 'Henüz yorum yapılmamış',
      positiveAspects: [],
      negativeAspects: [],
      totalReviews: 0
    };
  }

  const analysis = analyzeSentiment(reviews);
  
  const aspectDescriptions = {
    camera: { positive: 'Kamera performansı beğeniliyor', negative: 'Kamera performansı eleştiriliyor' },
    battery: { positive: 'Batarya ömrü tatmin edici', negative: 'Batarya ömrü yetersiz bulunuyor' },
    performance: { positive: 'Performans güçlü', negative: 'Performans sorunları yaşanıyor' },
    display: { positive: 'Ekran kalitesi yüksek', negative: 'Ekran beklentileri karşılamıyor' },
    design: { positive: 'Tasarım beğeniliyor', negative: 'Tasarım eleştiriliyor' }
  };

  const positiveAspects = Object.entries(analysis.aspects)
    .filter(([_, data]) => data.sentiment === 'positive')
    .map(([aspect]) => aspectDescriptions[aspect as keyof typeof aspectDescriptions].positive);

  const negativeAspects = Object.entries(analysis.aspects)
    .filter(([_, data]) => data.sentiment === 'negative')
    .map(([aspect]) => aspectDescriptions[aspect as keyof typeof aspectDescriptions].negative);

  const sentimentDescriptions = {
    positive: 'Kullanıcılar genel olarak memnun',
    neutral: 'Kullanıcı görüşleri karma',
    negative: 'Kullanıcılar genel olarak memnun değil'
  };

  return {
    phoneId: reviews[0]?.phoneId || '',
    phoneName,
    overallSentiment: sentimentDescriptions[analysis.sentiment],
    positiveAspects,
    negativeAspects,
    totalReviews: reviews.length
  };
}