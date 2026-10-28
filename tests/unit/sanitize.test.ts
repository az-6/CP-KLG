import { describe, expect, it } from 'vitest';
import { sanityFixtures } from '../../src/data/sanity-fixtures';
import { hasImageAsset, sanitizeNews, sanitizeProduct } from '../../src/lib/sanity/sanitize';
import type { SanityImage } from '../../src/types/sanity';

// Kasus nyata 2026-10-28: SEO → Social image diisi teks alternatif tanpa berkas gambar.
const imageWithoutFile = { _type: 'image', alt: 'Tuna loin utuh' } as unknown as SanityImage;

describe('Sanity image sanitizing', () => {
  it('recognizes images that have an uploaded file', () => {
    expect(hasImageAsset(sanityFixtures.products[0].images[0])).toBe(true);
    expect(hasImageAsset(imageWithoutFile)).toBe(false);
    expect(hasImageAsset(undefined)).toBe(false);
  });

  it('drops product images and SEO images that have no file', () => {
    const product = sanitizeProduct({
      ...sanityFixtures.products[0],
      images: [imageWithoutFile, ...sanityFixtures.products[0].images],
      seo: { title: 'Tuna', socialImage: imageWithoutFile },
      en: { seo: { socialImage: imageWithoutFile } },
    });
    expect(product.images).toHaveLength(1);
    expect(product.seo?.socialImage).toBeUndefined();
    expect(product.seo?.title).toBe('Tuna');
    expect(product.en?.seo?.socialImage).toBeUndefined();
  });

  it('drops body images without a file and hides news without a cover file', () => {
    const [article] = sanityFixtures.news;
    const [clean] = sanitizeNews([{ ...article, body: [...article.body, imageWithoutFile] }]);
    expect(clean.body).toHaveLength(article.body.length);
    expect(sanitizeNews([{ ...article, coverImage: imageWithoutFile }])).toHaveLength(0);
  });
});
