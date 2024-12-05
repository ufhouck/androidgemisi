import { Review } from '../types/review';

const USER_NAMES = [
  'Teknoloji Meraklısı',
  'Mobil Uzmanı',
  'Android Kullanıcısı',
  'Fotoğraf Tutkunu',
  'Oyun Sever',
  'Günlük Kullanıcı',
  'Tech Reviewer',
  'Profesyonel Kullanıcı',
  'Yazılımcı',
  'Sosyal Medya Fenomeni'
];

const REVIEW_TEMPLATES = {
  flagship: [
    // Positive Reviews
    {
      comment: 'Kamera performansı gerçekten etkileyici. Özellikle gece çekimleri ve portre modu muhteşem sonuçlar veriyor. Yapay zeka özellikleri fotoğraf düzenlemede çok başarılı.',
      rating: 5,
      aspects: ['kamera', 'yapay_zeka']
    },
    {
      comment: 'Batarya ömrü tam gün yoğun kullanımda bile yetiyor. Hızlı şarj özelliği çok kullanışlı, 30 dakikada %70\'e ulaşıyor.',
      rating: 5,
      aspects: ['batarya', 'şarj']
    },
    // Neutral Reviews
    {
      comment: 'Fiyatı biraz yüksek ama sunduğu özellikler düşünüldüğünde makul sayılabilir. Kamera iyi ancak zoom performansı rakiplerinin gerisinde.',
      rating: 3,
      aspects: ['fiyat', 'kamera']
    },
    // Negative Reviews
    {
      comment: 'Aşırı ısınma sorunu yaşıyorum, özellikle oyun oynarken ve kamera kullanırken çok ısınıyor. Batarya ömrü beklenenden düşük.',
      rating: 2,
      aspects: ['performans', 'batarya']
    }
  ],
  midrange: [
    // Positive Reviews
    {
      comment: 'Fiyat/performans oranı çok iyi. Günlük kullanımda hiç takılma yaşamadım, kamera performansı da tatmin edici.',
      rating: 4,
      aspects: ['fiyat', 'performans', 'kamera']
    },
    // Neutral Reviews
    {
      comment: 'Ortalama bir telefon. Kamera normal ışıkta iyi ama gece çekimleri zayıf. Pil ömrü normal kullanımda idare ediyor.',
      rating: 3,
      aspects: ['kamera', 'batarya']
    },
    // Negative Reviews
    {
      comment: 'Yazılım optimizasyonu kötü, sık sık donmalar yaşıyorum. Parmak izi okuyucu yavaş ve güvenilmez.',
      rating: 2,
      aspects: ['yazılım', 'güvenlik']
    }
  ],
  budget: [
    // Positive Reviews
    {
      comment: 'Bu fiyata göre gayet iyi bir telefon. Temel ihtiyaçlar için fazlasıyla yeterli, pil ömrü de tatmin edici.',
      rating: 4,
      aspects: ['fiyat', 'batarya']
    },
    // Neutral Reviews
    {
      comment: 'Beklentileri karşılayan bir model. Kamera performansı fiyatına göre normal, ama gece çekimleri zayıf.',
      rating: 3,
      aspects: ['kamera']
    },
    // Negative Reviews
    {
      comment: 'Çok yavaş ve kasıyor. Multitasking neredeyse imkansız, uygulamalar sürekli yeniden başlıyor.',
      rating: 2,
      aspects: ['performans']
    }
  ]
};

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

function determinePhoneTier(brand: string, model: string): 'flagship' | 'midrange' | 'budget' {
  const modelLower = model.toLowerCase();
  
  if (modelLower.includes('ultra') || 
      modelLower.includes('pro+') || 
      modelLower.includes('plus+') ||
      modelLower.includes('s24') ||
      modelLower.includes('14 pro')) {
    return 'flagship';
  }
  
  if (modelLower.includes('lite') || 
      modelLower.includes('a1') || 
      modelLower.includes('m1') ||
      modelLower.includes('redmi')) {
    return 'budget';
  }
  
  return 'midrange';
}

export function generateMockReviews(phoneId: string, brand: string): Review[] {
  const tier = determinePhoneTier(brand, phoneId);
  const templates = REVIEW_TEMPLATES[tier];
  const reviews: Review[] = [];
  const usedUserNames = new Set<string>();

  templates.forEach((template, index) => {
    let userName;
    do {
      userName = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
    } while (usedUserNames.has(userName));

    usedUserNames.add(userName);

    reviews.push({
      id: `${phoneId}_${index}`,
      phoneId,
      userName,
      rating: template.rating,
      comment: template.comment,
      likes: Math.floor(Math.random() * 50),
      dislikes: Math.floor(Math.random() * 10),
      date: generateRandomDate(90),
      aspects: template.aspects,
      sentiment: template.rating >= 4 ? 'positive' : 
                template.rating <= 2 ? 'negative' : 'neutral'
    });
  });

  return reviews.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}