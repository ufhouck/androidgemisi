import { phones } from '../../data/phones';
import { slugifyPhoneName } from './phoneUtils';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  images?: {
    loc: string;
    caption: string;
  }[];
}

export function generateSitemap(baseUrl: string): string {
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/karsilastir`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/yorumlar`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8'
    }
  ];

  // Add phone detail pages with images
  phones.forEach(phone => {
    const slug = slugifyPhoneName(phone.name);
    urls.push({
      loc: `${baseUrl}/telefon/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.7',
      images: [
        {
          loc: `${baseUrl}/images/phones/${slug}.jpg`,
          caption: `${phone.name} fotoğrafı`
        }
      ]
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.images ? url.images.map(img => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('') : ''}
  </url>`).join('\n')}
</urlset>`;
}