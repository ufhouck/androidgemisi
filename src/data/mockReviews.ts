import { Review } from '../types/review';

// Her telefon için örnek yorumlar
export const generateMockReviews = (phoneId: string, phoneName: string): Review[] => {
  const reviews: Review[] = [];
  const reviewCount = Math.floor(Math.random() * 10) + 5; // 5-15 arası yorum

  const sampleComments = [
    {
      positive: [
        `${phoneName} gerçekten harika bir telefon. Kamera performansı özellikle gece çekimlerinde çok başarılı.`,
        `Batarya ömrü beklediğimden çok daha iyi. Tam gün rahatlıkla idare ediyor.`,
        `İşlemci performansı oyunlarda bile çok iyi, hiç kasma yaşamadım.`,
        `Ekran kalitesi muhteşem, özellikle HDR içeriklerde fark yaratıyor.`,
        `Tasarımı çok şık ve premium hissettiriyor. Renk seçenekleri de güzel.`
      ],
      negative: [
        `Fiyatı biraz yüksek, daha uygun olabilirdi.`,
        `Şarj adaptörünün kutudan çıkmaması üzücü.`,
        `Kamera çıkıntısı biraz fazla, masada sallanıyor.`,
        `Ağır bir telefon, tek elle kullanımı zor.`,
        `Hoparlör sesi biraz düşük kalıyor.`
      ]
    }
  ];

  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.random() > 0.7 ? 
      Math.floor(Math.random() * 3) + 3 : // %70 ihtimalle 3-5 arası
      Math.floor(Math.random() * 2) + 4;  // %30 ihtimalle 4-5 arası

    const isPositive = rating >= 4;
    const comments = isPositive ? sampleComments[0].positive : sampleComments[0].negative;
    const comment = comments[Math.floor(Math.random() * comments.length)];

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Son 30 gün içinde

    reviews.push({
      id: `${phoneId}_${i}`,
      phoneId,
      userName: `Kullanıcı${Math.floor(Math.random() * 1000)}`,
      rating,
      comment,
      likes: Math.floor(Math.random() * 20),
      dislikes: Math.floor(Math.random() * 5),
      date: date.toISOString()
    });
  }

  return reviews;
};