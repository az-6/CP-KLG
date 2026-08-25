import { describe, expect, it } from 'vitest';
import { buildOrganizationJsonLd, serializeJsonLd } from '../../src/lib/seo';
import type { CompanyProfile } from '../../src/types/content';

const company: CompanyProfile = {
  name: 'PT Katalis Lintas Global',
  shortName: 'Katalis Lintas Global',
  slogan: 'Kualitas Terjaga, Spesifikasi Anda.',
  heroTitle: 'Title',
  heroDescription: 'Description',
  about: 'About',
  contact: { whatsappNumber: '628123456789' },
  proofs: [],
  process: [],
};

describe('SEO helpers', () => {
  it('omits unavailable optional contact data', () => {
    const schema = buildOrganizationJsonLd(company, new URL('https://example.com'));
    expect(schema).not.toHaveProperty('email');
    expect(schema).not.toHaveProperty('address');
  });

  it('escapes opening tags in JSON-LD', () => {
    expect(serializeJsonLd({ value: '</script>' })).not.toContain('</script>');
  });
});
