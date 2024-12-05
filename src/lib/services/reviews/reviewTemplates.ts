import { ReviewTemplate } from '../../../types/review';

export const reviewTemplates: Record<string, ReviewTemplate[]> = {
  flagship: [
    {
      aspects: ['kamera', 'performans'],
      templates: [
        {
          rating: 5,
          comment: 'Kamera sistemi gerçekten etkileyici. Özellikle gece çekimleri ve portre modu muhteşem sonuçlar veriyor. İşlemci performansı da üst düzey, en zorlu oyunlarda bile takılma yaşamadım.',
          sentiment: 'positive'
        },
        {
          rating: 4,
          comment: 'Kamera yetenekleri çok iyi ancak bazı durumlarda aşırı keskinleştirme yapıyor. Performans konusunda hiçbir sıkıntı yaşamadım, her şey çok akıcı.',
          sentiment: 'positive'
        }
      ]
    },
    {
      aspects: ['batarya', 'şarj'],
      templates: [
        {
          rating: 5,
          comment: 'Batarya ömrü tam gün yoğun kullanımda bile yetiyor. Hızlı şarj özelliği ile 30 dakikada %70\'e ulaşıyor. Kablosuz şarj desteği de çok kullanışlı.',
          sentiment: 'positive'
        },
        {
          rating: 3,
          comment: 'Pil ömrü ortalama, yoğun kullanımda günü zor çıkarıyor. Hızlı şarj desteği iyi olsa da cihaz şarj olurken çok ısınıyor.',
          sentiment: 'neutral'
        }
      ]
    },
    {
      aspects: ['ekran', 'tasarım'],
      templates: [
        {
          rating: 5,
          comment: 'Ekran kalitesi ve parlaklık seviyesi mükemmel. HDR içeriklerde renk doğruluğu çok başarılı. Premium tasarımı ve malzeme kalitesi üst düzey.',
          sentiment: 'positive'
        },
        {
          rating: 4,
          comment: 'Ekran çok iyi ama maksimum parlaklık güneş altında yetersiz kalabiliyor. Tasarım şık ancak telefon biraz ağır.',
          sentiment: 'positive'
        }
      ]
    }
  ],
  midrange: [
    {
      aspects: ['kamera', 'performans'],
      templates: [
        {
          rating: 4,
          comment: 'Kamera performansı fiyat segmentine göre başarılı. Gündüz çekimleri çok iyi, gece biraz geliştirilebilir. Günlük kullanımda performans yeterli.',
          sentiment: 'positive'
        },
        {
          rating: 3,
          comment: 'Kamera normal ışıkta iyi sonuçlar veriyor ama düşük ışıkta zorlanıyor. Performans temel uygulamalarda iyi ancak ağır oyunlarda zorlanıyor.',
          sentiment: 'neutral'
        }
      ]
    },
    {
      aspects: ['batarya', 'şarj'],
      templates: [
        {
          rating: 4,
          comment: 'Batarya kullanımı optimize edilmiş, normal kullanımda rahat bir gün gidiyor. Şarj hızı tatmin edici seviyede.',
          sentiment: 'positive'
        },
        {
          rating: 3,
          comment: 'Pil ömrü normal kullanımda yeterli ama yoğun kullanımda yetersiz kalıyor. Şarj hızı ortalama.',
          sentiment: 'neutral'
        }
      ]
    }
  ],
  budget: [
    {
      aspects: ['kamera', 'performans'],
      templates: [
        {
          rating: 3,
          comment: 'Fiyatına göre kamera performansı kabul edilebilir düzeyde. Temel uygulamalarda performans yeterli ama ağır uygulamalarda zorlanıyor.',
          sentiment: 'neutral'
        },
        {
          rating: 2,
          comment: 'Kamera kalitesi düşük ışıkta çok yetersiz. Uygulamalar geç açılıyor ve sık donmalar yaşanıyor.',
          sentiment: 'negative'
        }
      ]
    },
    {
      aspects: ['batarya', 'fiyat'],
      templates: [
        {
          rating: 4,
          comment: 'Batarya ömrü beklentilerimin üzerinde, tam gün kullanım sunuyor. Fiyat/performans oranı gayet iyi.',
          sentiment: 'positive'
        },
        {
          rating: 3,
          comment: 'Pil kullanımı normal, günü çıkarıyor. Fiyatına göre sunduğu özellikler makul seviyede.',
          sentiment: 'neutral'
        }
      ]
    }
  ]
};