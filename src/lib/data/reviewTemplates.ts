export const reviewTemplates = {
  positive: [
    {
      comment: "PHONE_NAME ile gerçekten etkileyici bir deneyim yaşıyorum. Özellikle kamera sistemi gece çekimlerinde ve portre modunda muhteşem sonuçlar veriyor. Batarya ömrü tam gün yoğun kullanımda bile beni yarı yolda bırakmıyor. Ekran kalitesi ve parlaklık seviyesi her koşulda mükemmel görüntü sunuyor.",
      aspects: ["kamera", "batarya", "ekran"],
      rating: 5,
      sentiment: "positive",
      summary: "Üstün kamera performansı ve uzun batarya ömrü ile tam bir amiral gemisi deneyimi."
    },
    {
      comment: "PHONE_NAME'in performansı beklentilerimin üzerinde çıktı. Oyunlarda ve günlük kullanımda hiçbir takılma yaşamıyorum. Hızlı şarj özelliği çok kullanışlı, 30 dakikada %70'e ulaşıyor. Tasarımı da oldukça şık ve premium hissiyat veriyor.",
      aspects: ["performans", "şarj", "tasarım"],
      rating: 5,
      sentiment: "positive",
      summary: "Güçlü performans ve hızlı şarj özelliğiyle öne çıkan premium telefon."
    },
    {
      comment: "PHONE_NAME'in yapay zeka özellikleri günlük kullanımı çok kolaylaştırıyor. Fotoğraf düzenleme ve çeviri özellikleri çok başarılı. Ses kalitesi stereo hoparlörlerle birlikte film izlerken ve müzik dinlerken harika bir deneyim sunuyor.",
      aspects: ["yapay zeka", "ses", "özellikler"],
      rating: 4,
      sentiment: "positive",
      summary: "Akıllı özellikleri ve ses kalitesiyle kullanıcı dostu bir telefon."
    }
  ],
  neutral: [
    {
      comment: "PHONE_NAME fiyat/performans açısından dengeli bir telefon. Kamera normal ışıkta iyi sonuçlar veriyor ama gece çekimleri biraz geliştirilebilir. Batarya ortalama bir kullanımda günü çıkarıyor ama yoğun kullanımda zorlanabiliyor.",
      aspects: ["kamera", "batarya", "fiyat"],
      rating: 3,
      sentiment: "neutral",
      summary: "Orta segment için yeterli özelliklere sahip, dengeli bir telefon."
    },
    {
      comment: "PHONE_NAME'in tasarımı güzel ama biraz kalın ve ağır. Tek elle kullanımı zor olabiliyor. Yazılım güncellemeleri biraz geç geliyor ve bazı küçük hatalar can sıkıcı olabiliyor. Yine de genel performans tatmin edici.",
      aspects: ["tasarım", "yazılım", "performans"],
      rating: 3,
      sentiment: "neutral",
      summary: "Bazı eksikleri olsa da genel kullanımda tatmin edici bir telefon."
    }
  ],
  negative: [
    {
      comment: "PHONE_NAME için ödediğim fiyatı hak etmiyor. Kamera uygulaması yavaş açılıyor ve bazen donuyor. Pil ömrü vasat, tam şarjla günü zor çıkarıyor. Ayrıca cihaz oyun oynarken çok ısınıyor.",
      aspects: ["fiyat", "kamera", "batarya", "ısınma"],
      rating: 2,
      sentiment: "negative",
      summary: "Fiyatına göre düşük performans ve pil ömrü hayal kırıklığı yaratıyor."
    },
    {
      comment: "PHONE_NAME'de sürekli yazılım hataları ve donmalar yaşıyorum. Parmak izi okuyucu güvenilmez ve yavaş çalışıyor. Ekran çizilmelere karşı dayanıksız, kısa sürede kullanım izleri oluştu.",
      aspects: ["yazılım", "güvenlik", "dayanıklılık"],
      rating: 1,
      sentiment: "negative",
      summary: "Yazılım sorunları ve düşük yapı kalitesi ile hayal kırıklığı."
    }
  ]
} as const;