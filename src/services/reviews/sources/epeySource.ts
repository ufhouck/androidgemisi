import { Review } from '../../../types/review';
import { got } from 'got-scraping';
import * as cheerio from 'cheerio';
import { analyzeSentiment } from '../sentiment';
import { extractAspects } from '../aspects';
import { normalizeText } from '../../../lib/utils/textUtils';

export async function epeyReviews(model: string): Promise<Review[]> {
  try {
    const searchUrl = `https://www.epey.com/ara/${encodeURIComponent(model)}`;
    const response = await got(searchUrl);
    const $ = cheerio.load(response.body);

    // Ürün sayfasını bul
    const productUrl = $('.urun-liste li').first().find('a').attr('href');
    if (!productUrl) return [];

    // Ürün yorumları sayfasına git
    const reviewsUrl = `${productUrl}/kullanici-yorumlari`;
    const reviewsResponse = await got(reviewsUrl);
    const $reviews = cheerio.load(reviewsResponse.body);

    const reviews: Review[] = [];

    $reviews('.yorum').each((_, element) => {
      const comment = $reviews(element).find('.yorum-metni').text().trim();
      const rating = parseInt($reviews(element).find('.puan').text()) || 0;
      const userName = $reviews(element).find('.kullanici-adi').text().trim();
      const date = $reviews(element).find('.tarih').text().trim();

      if (comment && rating) {
        const normalizedComment = normalizeText(comment);
        const sentiment = analyzeSentiment(normalizedComment);
        const aspects = extractAspects(normalizedComment);

        reviews.push({
          id: `epey_${reviews.length}`,
          phoneId: model.toLowerCase().replace(/[^a-z0-9]+/g, ''),
          userName: userName || 'Epey Kullanıcısı',
          rating: Math.min(Math.max(rating / 2, 1), 5), // 10 üzerinden puanı 5'lik sisteme çevir
          comment: normalizedComment,
          likes: 0,
          dislikes: 0,
          date: new Date(date).toISOString(),
          aspects,
          sentiment,
          source: 'epey'
        });
      }
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching Epey reviews:', error);
    return [];
  }
}