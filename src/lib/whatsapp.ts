import type { Locale } from '../i18n';

const phonePattern = /^\d{8,15}$/;

export function buildMeetingMessage(context?: { productName?: string }, locale: Locale = 'id'): string {
  if (locale === 'en') {
    const subject = context?.productName ? `the product ${context.productName}` : 'our fish supply needs';
    return `Hello PT Katalis Lintas Global, I am [name] from [company]. We operate as a [distributor/wholesaler] and would like to schedule a meeting to discuss ${subject}.`;
  }

  const subject = context?.productName
    ? `produk ${context.productName}`
    : 'kebutuhan pasokan ikan';

  return `Halo PT Katalis Lintas Global, saya [nama] dari [perusahaan]. Kami bergerak sebagai [distributor/pedagang besar] dan ingin menjadwalkan pertemuan untuk membahas ${subject}.`;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  if (!phonePattern.test(number)) throw new Error('Invalid WhatsApp number');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getMeetingHref(number: string, productName?: string, locale: Locale = 'id'): string {
  if (!phonePattern.test(number)) return locale === 'en' ? '/en/contact#contact' : '/hubungi-kami#kontak';
  return buildWhatsAppUrl(number, buildMeetingMessage({ productName }, locale));
}

export const isWhatsAppHref = (href: string) => href.startsWith('https://wa.me/');
