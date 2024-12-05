import axios from 'axios';
import { cache } from './cache';

export async function translateText(text: string, targetLang: string): Promise<string> {
  const cacheKey = `translation_${text}_${targetLang}`;
  const cachedTranslation = cache.get<string>(cacheKey);
  
  if (cachedTranslation) {
    return cachedTranslation;
  }

  try {
    // Using a free translation API (replace with your preferred service)
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'auto',
      target: targetLang
    });

    const translatedText = response.data.translatedText;
    
    // Cache for 7 days (604800 seconds)
    cache.set(cacheKey, translatedText, 604800);
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}