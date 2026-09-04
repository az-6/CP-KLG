import { expect, it } from 'vitest';
import { normalizeCatalog } from '../../src/lib/sanity/product-repository';
import type { ProductCategoryDocument, ProductDocument } from '../../src/types/sanity';

const category = (overrides: Partial<ProductCategoryDocument> = {}): ProductCategoryDocument => ({
  _id: 'c1',
  name: 'Tuna',
  slug: 'tuna',
  order: 1,
  isActive: true,
  ...overrides,
});

const product = (overrides: Partial<ProductDocument> = {}): ProductDocument => ({
  _id: 'p1',
  name: 'Tuna',
  slug: 'tuna',
  categoryId: 'c1',
  categoryName: 'Tuna',
  categorySlug: 'tuna',
  excerpt: 'Valid product excerpt for business buyers.',
  description: [],
  images: [],
  availabilityStatus: 'Tersedia berdasarkan konfirmasi',
  order: 1,
  isActive: true,
  ...overrides,
});

it('drops inactive and orphaned products and empty categories', () => {
  const result = normalizeCatalog(
    [category(), category({ _id: 'c2', name: 'Kosong', slug: 'kosong', order: 2 })],
    [
      product(),
      product({ _id: 'p2', slug: 'hidden', name: 'Hidden', isActive: false }),
      product({ _id: 'p3', slug: 'orphan', name: 'Orphan', categoryId: 'missing' }),
    ],
  );

  expect(result.products.map((item) => item.slug)).toEqual(['tuna']);
  expect(result.categories.map((item) => item.slug)).toEqual(['tuna']);
});

it('sorts categories and products by order, then name', () => {
  const result = normalizeCatalog(
    [category({ _id: 'c2', name: 'B', slug: 'b', order: 0 }), category()],
    [
      product({ _id: 'p2', name: 'Zeta', slug: 'zeta', categoryId: 'c2', categoryName: 'B', categorySlug: 'b', order: 0 }),
      product({ _id: 'p3', name: 'Alpha', slug: 'alpha', categoryId: 'c2', categoryName: 'B', categorySlug: 'b', order: 0 }),
      product(),
    ],
  );

  expect(result.categories.map((item) => item.slug)).toEqual(['b', 'tuna']);
  expect(result.products.map((item) => item.slug)).toEqual(['alpha', 'zeta', 'tuna']);
});
