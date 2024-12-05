import { generateSitemap } from '../lib/utils/sitemapGenerator';
import fs from 'fs';
import path from 'path';

export async function createSitemap(baseUrl: string): Promise<void> {
  try {
    const sitemap = generateSitemap(baseUrl);
    const publicDir = path.resolve(process.cwd(), 'public');
    
    // public dizini yoksa oluştur
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // sitemap.xml dosyasını oluştur
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap başarıyla oluşturuldu');
  } catch (error) {
    console.error('Sitemap oluşturulurken hata:', error);
  }
}