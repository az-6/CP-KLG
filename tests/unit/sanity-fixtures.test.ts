import { expect, it } from 'vitest';
import { sanityFixtures } from '../../src/data/sanity-fixtures';

it('contains only approved initial product names', () => {
  expect(sanityFixtures.products.map((item) => item.name)).toEqual(['Tuna', 'Ikan Dasar']);
  expect(JSON.stringify(sanityFixtures)).not.toMatch(/Udang|Kakap/);
});
