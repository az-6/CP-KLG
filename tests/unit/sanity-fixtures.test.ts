import { expect, it } from 'vitest';
import { sanityFixtures } from '../../src/data/sanity-fixtures';

it('contains only approved initial product names', () => {
  expect(sanityFixtures.products.map((item) => item.name)).toEqual(['Tuna', 'Ikan Dasar']);
  expect(JSON.stringify(sanityFixtures)).not.toMatch(/Udang|Kakap/);
});

it('uses image references accepted by the Sanity image URL builder', () => {
  const serialized = JSON.stringify(sanityFixtures);
  const references = [...serialized.matchAll(/image-[A-Za-z0-9]+-1200x800-jpg/g)].map(([value]) => value);
  expect(references.length).toBeGreaterThanOrEqual(10);
  expect(serialized.match(/image-[^"\\]+/g)).toEqual(references);
});
