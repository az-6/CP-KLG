const phonePattern = /^\d{8,15}$/;

export function buildMeetingMessage(context?: { productName?: string }): string {
  const subject = context?.productName
    ? `produk ${context.productName}`
    : 'kebutuhan pasokan ikan';

  return `Halo PT Katalis Lintas Global, saya [nama] dari [perusahaan]. Kami bergerak sebagai [distributor/pedagang besar] dan ingin menjadwalkan pertemuan untuk membahas ${subject}.`;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  if (!phonePattern.test(number)) throw new Error('Invalid WhatsApp number');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getMeetingHref(number: string, productName?: string): string {
  if (!phonePattern.test(number)) return '/hubungi-kami#kontak';
  return buildWhatsAppUrl(number, buildMeetingMessage({ productName }));
}
