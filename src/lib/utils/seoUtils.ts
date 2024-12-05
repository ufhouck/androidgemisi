export const generateMetaTags = (page: string, data?: any) => {
  const baseTitle = 'Android Gemisi';
  const basePath = 'https://androidgemisi.com';

  switch (page) {
    case 'home':
      return {
        title: `${baseTitle} - Android Telefon Karşılaştırma Platformu`,
        description: 'En güncel Android telefonları karşılaştırın, fiyatları takip edin ve kullanıcı deneyimlerini inceleyin.',
        keywords: 'android telefon, telefon karşılaştırma, samsung galaxy, xiaomi, google pixel, oneplus',
        canonical: basePath
      };

    case 'phone':
      const phone = data;
      return {
        title: `${phone.name} İnceleme ve Kullanıcı Yorumları | ${baseTitle}`,
        description: `${phone.name} özellikleri, fiyatı, kullanıcı yorumları ve detaylı incelemesi. ${phone.specs.processor} işlemci, ${phone.specs.camera} kamera.`,
        keywords: `${phone.name}, ${phone.name} fiyat, ${phone.name} inceleme, ${phone.name} yorum`,
        canonical: `${basePath}/telefon/${phone.slug}`
      };

    case 'compare':
      return {
        title: 'Android Telefon Karşılaştırma | Android Gemisi',
        description: 'En popüler Android telefonları özellik ve fiyat açısından karşılaştırın. Detaylı karşılaştırma ve kullanıcı yorumları.',
        keywords: 'telefon karşılaştırma, android telefon karşılaştırma, samsung vs xiaomi, pixel vs oneplus',
        canonical: `${basePath}/karsilastir`
      };

    default:
      return {
        title: baseTitle,
        description: 'Android telefon karşılaştırma ve inceleme platformu',
        keywords: 'android telefon, telefon karşılaştırma',
        canonical: basePath
      };
  }
};

export const generateStructuredData = (page: string, data?: any) => {
  const baseUrl = 'https://androidgemisi.com';

  switch (page) {
    case 'phone':
      const phone = data;
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: phone.name,
        description: `${phone.name} özellikleri ve kullanıcı yorumları`,
        image: `${baseUrl}/images/phones/${phone.slug}.jpg`,
        review: {
          '@type': 'AggregateRating',
          ratingValue: phone.rating,
          reviewCount: phone.reviews?.length || 0
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'TRY',
          lowPrice: phone.price.tr.replace(/[^0-9]/g, ''),
          highPrice: phone.price.tr.replace(/[^0-9]/g, '')
        }
      };

    case 'compare':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Android Telefon Karşılaştırma',
        description: 'En popüler Android telefonları karşılaştırın'
      };

    default:
      return null;
  }
};