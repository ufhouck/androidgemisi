import natural from 'natural';
import { SentimentAnalyzer } from 'natural';

const analyzer = new SentimentAnalyzer('Turkish');
const tokenizer = new natural.WordTokenizer();

// Türkçe duygu analizi için kelime sözlüğü
const turkishSentimentLexicon = {
  positive: [
    'mükemmel', 'harika', 'güzel', 'başarılı', 'muhteşem', 'süper',
    'kaliteli', 'hızlı', 'kusursuz', 'rahat', 'şık', 'etkileyici'
  ],
  negative: [
    'kötü', 'berbat', 'yavaş', 'sorunlu', 'yetersiz', 'zayıf',
    'pahalı', 'bozuk', 'kırık', 'düşük', 'vasat', 'problemli'
  ]
};

export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const words = tokenizer.tokenize(text.toLowerCase());
  let score = 0;

  words.forEach(word => {
    if (turkishSentimentLexicon.positive.includes(word)) {
      score += 1;
    } else if (turkishSentimentLexicon.negative.includes(word)) {
      score -= 1;
    }
  });

  // Doğal dil işleme kütüphanesi ile analiz
  const naturalScore = analyzer.getSentiment(words);
  score += naturalScore;

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}