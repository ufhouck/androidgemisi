import { Review } from '../types/review';

const REVIEW_TEMPLATES = {
  positive: [
    {
      text: "PHONE_NAME harika bir telefon. Özellikle kamera performansı çok etkileyici. Gece çekimleri ve portre modu muhteşem.",
      aspects: ["kamera", "genel"],
      rating: 5
    },
    {
      text: "Batarya ömrü mükemmel, tam gün yoğun kullanımda bile şarj sıkıntısı yaşamadım. Hızlı şarj özelliği de çok kullanışlı.",
      aspects: ["batarya"],
      rating: 5
    },
    {
      text: "Ekran kalitesi ve parlaklık seviyesi beklentilerimin üzerinde. HDR desteği ile Netflix ve YouTube izlemek çok keyifli.",
      aspects: ["ekran"],
      rating: 4
    },
    {
      text: "İşlemci performansı oyunlarda bile çok iyi, hiç kasma yaşamadım. Çoklu görev yönetimi de sorunsuz.",
      aspects: ["performans"],
      rating: 5
    }
  ],
  neutral: [
    {
      text: "PHONE_NAME fiyat/performans açısından ortalama bir telefon. Bazı özellikleri iyi olsa da fiyatı biraz yüksek.",
      aspects: ["fiyat", "performans"],
      rating: 3
    },
    {
      text: "Kamera normal ışıkta iyi ama gece çekimleri biraz geliştirilebilir. Zoom kalitesi rakiplerinin gerisinde.",
      aspects: ["kamera"],
      rating: 3
    }
  ],
  negative: [
    {
      text: "Fiyatı çok yüksek, sunduğu özellikler düşünüldüğünde daha uygun olabilirdi. Rakipleri daha iyi seçenekler sunuyor.",
      aspects: ["fiyat"],
      rating: 2
    },
    {
      text: "Şarj hızı beklediğim kadar iyi değil. Tam şarj için yaklaşık 2 saat beklemek gerekiyor.",
      aspects: ["batarya"],
      rating: 2
    }
  ]
};

const USERNAMES = [
  "Teknoloji Sever",
  "Android Fan",
  "Mobil Uzmanı",
  "Telefon Gurusu",
  "Gadget Master",
  "Tech Reviewer",
  "Mobile Expert",
  "Smart User",
  "Power User",
  "Tech Enthusiast"
];

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

export function generateMockReviews(phoneId: string, phoneName: string): Review[] {
  const reviewCount = Math.floor(Math.random() * 15) + 15; // 15-30 reviews
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
      rating: template.rating,
      comment: template.text.replace(/PHONE_NAME/g, phoneName),
      likes: Math.floor(Math.random() * 50),
      dislikes: Math.floor(Math.random() * 10),
      date: generateRandomDate(90), // Son 90 gün
      aspects: template.aspects
    };

    reviews.push(review);
  }

  // Tarihe göre sırala, en yeni en üstte
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}