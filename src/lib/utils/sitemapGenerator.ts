import { phones } from '../../data/phones';
import { PHONE_CATALOG } from '../../data/phoneCatalog';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function generateSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  const urls = [
    // Ana sayfalar
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'karsilastir', priority: '0.9', changefreq: 'daily' },
    { url: 'yorumlar', priority: '0.8', changefreq: 'daily' },
  ];

  // Telefon detay sayfaları
  phones.forEach(phone => {
    urls.push({
      url: `telefon/${slugify(phone.name)}`,
      priority: '0.7',
      changefreq: 'daily'
    });
  });

  // XML oluştur
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${url ? '/' + url : ''}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}