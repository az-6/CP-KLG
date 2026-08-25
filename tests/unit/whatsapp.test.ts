import { describe, expect, it } from 'vitest';
import { buildMeetingMessage, buildWhatsAppUrl, getMeetingHref } from '../../src/lib/whatsapp';

describe('WhatsApp links', () => {
  it('encodes company and product context', () => {
    const message = buildMeetingMessage({ productName: 'Tuna' });
    expect(buildWhatsAppUrl('628123456789', message)).toBe(
      `https://wa.me/628123456789?text=${encodeURIComponent(message)}`,
    );
    expect(message).toContain('Tuna');
    expect(message).toContain('menjadwalkan pertemuan');
  });

  it('falls back to the contact section when a number is not configured', () => {
    expect(getMeetingHref('')).toBe('/hubungi-kami#kontak');
  });
});
