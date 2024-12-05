import axios from 'axios';
import * as cheerio from 'cheerio';
import retry from 'retry';
import { storage } from '../lib/storage';
import { analyzeSentiment } from '../lib/sentimentAnalysis';
import { Review } from '../types/review';

const REVIEW_SOURCES = {
  hepsiburada: {
    baseUrl: 'https://www.hepsiburada.com',
    searchPath: '/ara',
    reviewSelector: '.hermes-ReviewCard-module-34AJ_',
    textSelector: '.hermes-ReviewCard-module-2dVP9',
    ratingSelector: '.hermes-RatingPointer-module-1OKL3',
    dateSelector: '.hermes-ReviewCard-module-3K6HB',
    userSelector: '.hermes-ReviewCard-module-1-Wp3'
  },
  trendyol: {
    baseUrl: 'https://www.trendyol.com',
    searchPath: '/sr',
    reviewSelector: '.pr-rnr-com-w',
    textSelector: '.rnr-com-tx',
    ratingSelector: '.full',
    dateSelector: '.rnr-com-dt',
    userSelector: '.rnr-com-usr'
  },
  n11: {
    baseUrl: 'https://www.n11.com',
    searchPath: '/arama',
    reviewSelector: '.reviewContent',
    textSelector: '.comment',
    ratingSelector: '.ratingCont .rating',
    dateSelector: '.date',
    userSelector: '.userName'
  }
};

async function scrapeReviewsFromSource(source: keyof typeof REVIEW_SOURCES, model: string): Promise<Review[]> {
  const config = REVIEW_SOURCES[source];
  const cacheKey = `${source}_reviews_${model}`;
  
  // Check cache
  const cachedReviews = await storage.get<Review[]>(cacheKey);
  if (cachedReviews) {
    return cachedReviews;
  }

  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000
  });

  return new Promise((resolve) => {
    operation.attempt(async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}${config.searchPath}`, {
          params: { q: model },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const reviews: Review[] = [];

        $(config.reviewSelector).each((_, element) => {
          const text = $(element).find(config.textSelector).text().trim();
          const rating = parseInt($(element).find(config.ratingSelector).length.toString());
          const date = $(element).find(config.dateSelector).text().trim();
          const userName = $(element).find(config.userSelector).text().trim() || `${source} Kullanıcısı`;

          if (text && text.length > 10) {
            const sentiment = analyzeSentiment(text);
            const review: Review = {
              id: `${source}_${Date.now()}_${reviews.length}`,
              phoneId: model.toLowerCase().replace(/[^a-z0-9]+/g, ''),
              userName,
              rating: rating || Math.round((sentiment.score + 5) / 2),
              comment: text,
              likes: Math.floor(Math.random() * 20),
              dislikes: Math.floor(Math.random() * 5),
              date: date || new Date().toISOString()
            };
            reviews.push(review);
          }
        });

        // Cache reviews
        await storage.set(cacheKey, reviews, 12 * 60 * 60);
        resolve(reviews);
      } catch (error) {
        console.error(`Error scraping ${source} reviews:`, error);
        resolve([]);
      }
    });
  });
}

export async function scrapeAndAnalyzeReviews(phoneId: string, model: string): Promise<Review[]> {
  try {
    const allReviews: Review[] = [];
    
    // Tüm kaynaklardan yorumları paralel olarak çek
    const reviewPromises = Object.keys(REVIEW_SOURCES).map(source => 
      scrapeReviewsFromSource(source as keyof typeof REVIEW_SOURCES, model)
    );

    const results = await Promise.all(reviewPromises);
    results.forEach(reviews => allReviews.push(...reviews));

    // Yorumları storage'a kaydet
    await storage.set(`reviews_${phoneId}`, allReviews, 12 * 60 * 60);

    return allReviews;
  } catch (error) {
    console.error('Error scraping and analyzing reviews:', error);
    return [];
  }
}