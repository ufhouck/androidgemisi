import axios from 'axios';
import * as cheerio from 'cheerio';
import retry from 'retry';
import { Review } from '../types/review';
import { storage } from '../lib/storage';
import { analyzeSentiment } from '../lib/sentimentAnalysis';
import { translateText } from '../lib/translation';

interface ScrapedReview {
  text: string;
  rating: number;
  date: string;
  userName: string;
  source: string;
}

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
  google: {
    baseUrl: 'https://www.google.com',
    searchPath: '/search',
    reviewSelector: '.review-snippet',
    textSelector: '.review-text',
    ratingSelector: '.rating',
    dateSelector: '.review-date',
    userSelector: '.reviewer'
  },
  youtube: {
    baseUrl: 'https://www.youtube.com',
    searchPath: '/results',
    commentSelector: '.ytd-comment-renderer',
    textSelector: '#content-text',
    dateSelector: '.published-time-text',
    userSelector: '#author-text'
  }
};

async function scrapeGoogleReviews(model: string): Promise<ScrapedReview[]> {
  const config = REVIEW_SOURCES.google;
  const cacheKey = `google_reviews_${model}`;
  const cachedReviews = await storage.get<ScrapedReview[]>(cacheKey);
  
  if (cachedReviews) {
    return cachedReviews;
  }

  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}${config.searchPath}`, {
          params: { 
            q: `${model} phone review`,
            hl: 'en'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const reviews: ScrapedReview[] = [];

        $(config.reviewSelector).each((_, element) => {
          const text = $(element).find(config.textSelector).text().trim();
          const rating = parseInt($(element).find(config.ratingSelector).attr('aria-label')?.split(' ')[0] || '0');
          const date = $(element).find(config.dateSelector).text().trim();
          const userName = $(element).find(config.userSelector).text().trim() || 'Google Kullanıcısı';

          if (text && text.length > 10) {
            reviews.push({ text, rating, date, userName, source: 'Google' });
          }
        });

        await storage.set(cacheKey, reviews, 12 * 60 * 60);
        resolve(reviews);
      } catch (error) {
        if (operation.retry(error as Error)) {
          return;
        }
        console.error('Error scraping Google reviews:', error);
        resolve([]);
      }
    });
  });
}

async function scrapeYouTubeComments(model: string): Promise<ScrapedReview[]> {
  const config = REVIEW_SOURCES.youtube;
  const cacheKey = `youtube_reviews_${model}`;
  const cachedReviews = await storage.get<ScrapedReview[]>(cacheKey);
  
  if (cachedReviews) {
    return cachedReviews;
  }

  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}${config.searchPath}`, {
          params: { 
            search_query: `${model} inceleme`,
            hl: 'tr'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const reviews: ScrapedReview[] = [];

        $(config.commentSelector).each((_, element) => {
          const text = $(element).find(config.textSelector).text().trim();
          const date = $(element).find(config.dateSelector).text().trim();
          const userName = $(element).find(config.userSelector).text().trim() || 'YouTube Kullanıcısı';

          if (text && text.length > 10) {
            const sentiment = analyzeSentiment(text);
            const rating = Math.round((sentiment.score + 5) / 2); // Convert sentiment to 1-5 rating

            reviews.push({ text, rating, date, userName, source: 'YouTube' });
          }
        });

        await storage.set(cacheKey, reviews, 12 * 60 * 60);
        resolve(reviews);
      } catch (error) {
        if (operation.retry(error as Error)) {
          return;
        }
        console.error('Error scraping YouTube comments:', error);
        resolve([]);
      }
    });
  });
}

async function scrapeReviews(source: keyof typeof REVIEW_SOURCES, model: string): Promise<ScrapedReview[]> {
  const config = REVIEW_SOURCES[source];
  const cacheKey = `${source}_reviews_${model}`;
  const cachedReviews = await storage.get<ScrapedReview[]>(cacheKey);
  
  if (cachedReviews) {
    return cachedReviews;
  }

  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}${config.searchPath}`, {
          params: { q: model },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const reviews: ScrapedReview[] = [];

        $(config.reviewSelector).each((_, element) => {
          const text = $(element).find(config.textSelector).text().trim();
          const rating = parseInt($(element).find(config.ratingSelector).length.toString());
          const date = $(element).find(config.dateSelector).text().trim();
          const userName = $(element).find(config.userSelector).text().trim() || `${source} Kullanıcısı`;

          if (text && text.length > 10) {
            reviews.push({ text, rating, date, userName, source });
          }
        });

        await storage.set(cacheKey, reviews, 12 * 60 * 60);
        resolve(reviews);
      } catch (error) {
        if (operation.retry(error as Error)) {
          return;
        }
        console.error(`Error scraping ${source} reviews:`, error);
        resolve([]);
      }
    });
  });
}

function generateReviewId(phoneId: string, index: number): string {
  return `${phoneId}_${Date.now()}_${index}`;
}

export async function scrapeAndAnalyzeReviews(phoneId: string, model: string): Promise<Review[]> {
  const cacheKey = `analyzed_reviews_${phoneId}`;
  const cachedReviews = await storage.get<Review[]>(cacheKey);
  
  if (cachedReviews) {
    return cachedReviews;
  }

  try {
    const reviews: ScrapedReview[] = [];
    
    // Scrape reviews from all sources
    const [
      hepsiburadaReviews,
      trendyolReviews,
      googleReviews,
      youtubeReviews
    ] = await Promise.all([
      scrapeReviews('hepsiburada', model),
      scrapeReviews('trendyol', model),
      scrapeGoogleReviews(model),
      scrapeYouTubeComments(model)
    ]);

    reviews.push(
      ...hepsiburadaReviews,
      ...trendyolReviews,
      ...googleReviews,
      ...youtubeReviews
    );

    // Translate English reviews to Turkish
    const translatedReviews = await Promise.all(
      reviews.map(async review => {
        if (review.source === 'Google' && !/[ğüşıöçĞÜŞİÖÇ]/.test(review.text)) {
          try {
            review.text = await translateText(review.text, 'tr');
          } catch (error) {
            console.error('Translation error:', error);
          }
        }
        return review;
      })
    );

    // Analyze sentiment and create final review objects
    const analyzedReviews = translatedReviews.map((review, index) => {
      const sentiment = analyzeSentiment(review.text);
      return {
        id: generateReviewId(phoneId, index),
        phoneId,
        userName: review.userName,
        rating: review.rating || Math.round((sentiment.score + 5) / 2),
        comment: review.text,
        likes: Math.floor(Math.random() * 20),
        dislikes: Math.floor(Math.random() * 5),
        date: review.date || new Date().toISOString(),
        source: review.source,
        sentiment: sentiment.sentiment,
        aspects: sentiment.aspects
      };
    });

    // Store in persistent storage
    await storage.set(cacheKey, analyzedReviews, 12 * 60 * 60);

    return analyzedReviews;
  } catch (error) {
    console.error('Error scraping and analyzing reviews:', error);
    return [];
  }
}