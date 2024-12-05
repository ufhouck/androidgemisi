import fs from 'fs';
import path from 'path';

export function generateRobots(baseUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/*

Sitemap: ${baseUrl}/sitemap.xml`;
}

export async function createRobots(baseUrl: string): Promise<void> {
  try {
    const robots = generateRobots(baseUrl);
    const publicDir = path.resolve(process.cwd(), 'public');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
    console.log('robots.txt başarıyla oluşturuldu');
  } catch (error) {
    console.error('robots.txt oluşturulurken hata:', error);
  }
}