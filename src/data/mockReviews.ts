import { Review } from '../types/review';

const REVIEW_TEMPLATES = {
  positive: [
    {
      text: "PHONE_NAME harika bir telefon. Özellikle kamera performansı çok etkileyici.",
      aspects: ["kamera", "genel"]
    },
    {
      text: "Batarya ömrü mükemmel, tam gün kullanımda bile şarj sıkıntısı yaşamadım.",
      aspects: ["batarya"]
    },
    {
      text: "Ekran kalitesi ve parlaklık seviyesi beklentilerimin üzerinde.",
      aspects: ["ekran"]
    },
    {
      text: "İşlemci performansı oyunlarda bile çok iyi, hiç kasma yaşamadım.",
      aspects: ["performans"]
    }
  ],
  neutral: [
    {
      text: "PHONE_NAME fiyat/performans açısından ortalama bir telefon.",
      aspects: ["fiyat", "performans"]
    },
    {
      text: "Kamera normal ışıkta iyi ama gece çekimleri biraz geliştirilebilir.",
      aspects: ["kamera"]
    }
  ],
  negative: [
    {
      text: "Fiyatı biraz yüksek, daha uygun olabilirdi.",
      aspects: ["fiyat"]
    },
    {
      text: "Şarj hızı beklediğim kadar iyi değil.",
      aspects: ["batarya"]
    }
  ]
};

const USERNAMES = [
  "Teknoloji Sever",
  "Android Fan",
  "Mobil Uzmanı",
  "Telefon Gurusu",
  "Gadget Master"
];

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

export function generateMockReviews(phoneId: string, phoneName: string): Review[] {
  const reviewCount = Math.floor(Math.random() * 15) + 10; // 10-25 reviews
  const reviews: Review[] = [];

  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.random() > 0.3 ? 
      Math.floor(Math.random() * 2) + 4 : // 70% chance of 4-5 stars
      Math.floor(Math.random() * 3) + 1;  // 30% chance of 1-3 stars

    let template;
    if (rating >= 4) {
      template = REVIEW_TEMPLATES.positive[Math.floor(Math.random() * REVIEW_TEMPLATES.positive.length)];
    } else if (rating >= 3) {
      template = REVIEW_TEMPLATES.neutral[Math.floor(Math.random() * REVIEW_TEMPLATES.neutral.length)];
    } else {
      template = REVIEW_TEMPLATES.negative[Math.floor(Math.random() * REVIEW_TEMPLATES.negative.length)];
    }

    const review: Review = {
      id: `${phoneId}_${i}`,
      phoneId,
      userName: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
      rating,
      comment: template.text.replace('PHONE_NAME', phoneName),
      likes: Math.floor(Math.random() * 20),
      dislikes: Math.floor(Math.random() * 5),
      date: generateRandomDate(30), // Last 30 days
      aspects: template.aspects
    };

    reviews.push(review);
  }

  // Sort by date, newest first
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}