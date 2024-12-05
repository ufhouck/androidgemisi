const sentimentWords = {
  positive: [
    'güzel', 'harika', 'mükemmel', 'başarılı', 'hızlı', 'kaliteli', 'iyi', 'muhteşem',
    'süper', 'rahat', 'pratik', 'kusursuz', 'etkileyici', 'şık', 'dayanıklı', 'akıcı',
    'dengeli', 'güçlü', 'net', 'keskin', 'parlak', 'premium', 'uzun', 'verimli', 'temiz'
  ],
  negative: [
    'kötü', 'yavaş', 'sorunlu', 'başarısız', 'zayıf', 'pahalı', 'kırılgan', 'yetersiz',
    'berbat', 'vasat', 'düşük', 'bozuk', 'hatalı', 'problemli', 'rahatsız', 'donma',
    'kasma', 'ısınma', 'bulanık', 'karanlık', 'sönük', 'plastik', 'kısa', 'verimsiz', 'pis'
  ]
};

const aspects = {
  camera: [
    'kamera', 'fotoğraf', 'video', 'çekim', 'zoom', 'lens', 'selfie', 'portre',
    'gece çekimi', 'hdr', 'odaklama', 'stabilizasyon'
  ],
  battery: [
    'batarya', 'pil', 'şarj', 'güç', 'adaptör', 'hızlı şarj', 'kablosuz şarj',
    'pil ömrü', 'standby', 'güç tüketimi'
  ],
  performance: [
    'performans', 'hız', 'işlemci', 'ram', 'oyun', 'akıcı', 'donma', 'kasma',
    'multitasking', 'uygulama', 'açılış', 'yükleme'
  ],
  display: [
    'ekran', 'görüntü', 'panel', 'parlaklık', 'renk', 'çözünürlük', 'hdr',
    'yenileme hızı', 'dokunmatik', 'hassasiyet', 'görüş açısı'
  ],
  design: [
    'tasarım', 'görünüm', 'malzeme', 'kalite', 'ağırlık', 'boyut', 'ergonomi',
    'premium', 'dayanıklılık', 'su geçirmezlik', 'toz direnci'
  ]
};

interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  aspects: {
    [key: string]: {
      sentiment: 'positive' | 'neutral' | 'negative';
      count: number;
      examples: string[];
    };
  };
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().split(/\s+/);
  let sentimentScore = 0;
  const aspectAnalysis: {
    [key: string]: {
      positive: number;
      negative: number;
      examples: string[];
    }
  } = {};

  // Analyze text in chunks of 5 words for better context
  for (let i = 0; i < words.length; i++) {
    const chunk = words.slice(i, i + 5).join(' ');
    
    // Check sentiment
    sentimentWords.positive.forEach(word => {
      if (chunk.includes(word)) sentimentScore++;
    });
    
    sentimentWords.negative.forEach(word => {
      if (chunk.includes(word)) sentimentScore--;
    });

    // Analyze aspects
    Object.entries(aspects).forEach(([aspect, keywords]) => {
      keywords.forEach(keyword => {
        if (chunk.includes(keyword)) {
          if (!aspectAnalysis[aspect]) {
            aspectAnalysis[aspect] = { positive: 0, negative: 0, examples: [] };
          }
          
          // Determine sentiment for this specific mention
          const localSentiment = keywords.reduce((score, word) => {
            const context = words.slice(Math.max(0, i - 2), Math.min(words.length, i + 3));
            return context.reduce((s, w) => {
              if (sentimentWords.positive.includes(w)) return s + 1;
              if (sentimentWords.negative.includes(w)) return s - 1;
              return s;
            }, score);
          }, 0);

          if (localSentiment > 0) {
            aspectAnalysis[aspect].positive++;
            aspectAnalysis[aspect].examples.push(chunk);
          } else if (localSentiment < 0) {
            aspectAnalysis[aspect].negative++;
            aspectAnalysis[aspect].examples.push(chunk);
          }
        }
      });
    });
  }

  // Convert aspect analysis to final format
  const analyzedAspects = Object.entries(aspectAnalysis).reduce((acc, [aspect, data]) => {
    const total = data.positive + data.negative;
    if (total === 0) return acc;

    const score = (data.positive - data.negative) / total;
    acc[aspect] = {
      sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      count: total,
      examples: data.examples.slice(0, 3) // Keep only top 3 examples
    };
    return acc;
  }, {} as SentimentResult['aspects']);

  return {
    sentiment: sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral',
    score: sentimentScore,
    aspects: analyzedAspects
  };
}