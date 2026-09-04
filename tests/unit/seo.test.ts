import { describe, expect, it } from 'vitest';
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildProductJsonLd,
  serializeJsonLd,
} from '../../src/lib/seo';
import { sanityFixtures } from '../../src/data/sanity-fixtures';
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

  it('builds factual product and breadcrumb schemas without fake offers', () => {
    const schema = buildProductJsonLd(sanityFixtures.products[0], company, new URL('https://example.com'));

    expect(schema.url).toBe('https://example.com/produk/tuna');
    expect(schema).not.toHaveProperty('offers');
    expect(schema).not.toHaveProperty('aggregateRating');
    expect(schema.image).toBeInstanceOf(Array);

    const breadcrumb = buildBreadcrumbJsonLd(
      [{ name: 'Beranda', path: '/' }, { name: 'Tuna', path: '/produk/tuna' }],
      new URL('https://example.com'),
    );
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement.map((item) => item.position)).toEqual([1, 2]);
  });
});
