import { Review } from '../../../types/review';
import { got } from 'got-scraping';
import * as cheerio from 'cheerio';

const REVIEW_SOURCES = [
  {
    name: 'epey',
    baseUrl: 'https://www.epey.com',
    searchPath: '/ara/',
    reviewSelector: '.yorum'
  },
  {
    name: 'teknosa',
    baseUrl: 'https://www.teknosa.com',
    searchPath: '/arama/',
    reviewSelector: '.review-item'
  },
  {
    name: 'vatanbilgisayar',
    baseUrl: 'https://www.vatanbilgisayar.com',
    searchPath: '/arama/',
    reviewSelector: '.comment-item'
  }
];

export async function scrapeReviews(model: string): Promise<Review[]> {
  const allReviews: Review[] = [];

  for (const source of REVIEW_SOURCES) {
    try {
      const searchUrl = `${source.baseUrl}${source.searchPath}${encodeURIComponent(model)}`;
      const response = await got(searchUrl, {
        timeout: 10000,
        retry: 2
      });
      
      const $ = cheerio.load(response.body);

      $(source.reviewSelector).each((index, element) => {
        const review = extractReview($, element, source.name, model);
        if (review) {
          allReviews.push(review);
        }
      });

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
    }
  }

  return removeDuplicates(allReviews);
}

function extractReview($: cheerio.CheerioAPI, element: cheerio.Element, source: string, model: string): Review | null {
  try {
    const $element = $(element);
    const comment = $element.find('.comment-text, .review-text, .yorum-metni').text().trim();
    const rating = extractRating($element);
    const userName = $element.find('.username, .reviewer-name, .kullanici-adi').text().trim() || `${source} Kullanıcısı`;
    const date = $element.find('.date, .review-date, .tarih').text().trim();

    if (!comment || !rating) return null;

    return {
      id: `${source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phoneId: model.toLowerCase().replace(/[^a-z0-9]+/g, ''),
      userName,
      rating,
      comment,
      likes: 0,
      dislikes: 0,
      date: new Date(date || Date.now()).toISOString(),
      aspects: [],
      source
    };
  } catch (error) {
    console.error('Error extracting review:', error);
    return null;
  }
}

function extractRating($element: cheerio.Cheerio): number {
  try {
    const ratingText = $element.find('.rating, .stars, .puan').text().trim();
    const rating = parseInt(ratingText, 10);
    return Math.min(Math.max(isNaN(rating) ? 3 : rating, 1), 5);
  } catch {
    return 3; // Default rating if extraction fails
  }
}

function removeDuplicates(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  return reviews.filter(review => {
    const key = `${review.comment.substring(0, 50)}${review.rating}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}