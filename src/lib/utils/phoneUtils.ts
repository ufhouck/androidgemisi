export function generatePhoneId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
}

export function slugifyPhoneName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[+]/g, 'plus')  // Replace + with 'plus'
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
}

export function formatPrice(amount: number, currency: 'tr' | 'eu' | 'us'): string {
  switch (currency) {
    case 'tr':
      return `${amount.toLocaleString('tr-TR')} ₺`;
    case 'eu':
      return `${amount.toLocaleString('de-DE')} €`;
    case 'us':
      return `$${amount.toLocaleString('en-US')}`;
  }
}