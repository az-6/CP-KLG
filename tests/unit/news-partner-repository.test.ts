import { expect, it } from 'vitest';
import { normalizeNews, normalizePartners } from '../../src/lib/sanity/news-partner-repository';
import { sanityFixtures } from '../../src/data/sanity-fixtures';

it('returns newest active news and ordered partners', () => {
  const baseNews = sanityFixtures.news[0];
  const news = [
    { ...baseNews, _id: 'older', slug: 'older', publishedAt: '2026-01-01T00:00:00.000Z' },
    { ...baseNews, _id: 'hidden', slug: 'hidden', publishedAt: '2026-12-01T00:00:00.000Z', isActive: false },
    { ...baseNews, _id: 'newer', slug: 'newer', publishedAt: '2026-02-01T00:00:00.000Z' },
  ];
  const basePartner = sanityFixtures.partners[0];
  const partners = [
    { ...basePartner, _id: 'second', name: 'Second', order: 2 },
    { ...basePartner, _id: 'hidden', name: 'Hidden', order: 0, isActive: false },
    { ...basePartner, _id: 'first', name: 'First', order: 1 },
  ];

  expect(normalizeNews(news).map((item) => item.slug)).toEqual(['newer', 'older']);
  expect(normalizePartners(partners).map((item) => item.order)).toEqual([1, 2]);
});
