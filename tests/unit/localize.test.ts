import { describe, expect, it } from 'vitest';
import { sanityFixtures } from '../../src/data/sanity-fixtures';
import { localizeCredential, localizeFact, localizeNews, localizeProduct } from '../../src/lib/sanity/localize';
import { localizeCatalog, normalizeCatalog } from '../../src/lib/sanity/product-repository';

const [tuna, ikanDasar] = sanityFixtures.products;

describe('Sanity English localization', () => {
  it('leaves Indonesian content untouched', () => {
    expect(localizeProduct(tuna, 'id')).toBe(tuna);
  });

  it('uses English fields when they are filled in', () => {
    const product = localizeProduct(tuna, 'en', sanityFixtures.categories);
    expect(product.excerpt).toBe(tuna.en?.excerpt);
    expect(product.categoryName).toBe('Tuna Category');
    expect(product.images[0].alt).toBe('Test photo of the Tuna product');
    expect(JSON.stringify(product.description)).toContain('Test description of the Tuna product.');
  });

  it('falls back to Indonesian when English is empty', () => {
    const product = localizeProduct(ikanDasar, 'en', sanityFixtures.categories);
    expect(product.name).toBe(ikanDasar.name);
    expect(product.excerpt).toBe(ikanDasar.excerpt);
    expect(product.categoryName).toBe('Kategori Ikan Dasar');
  });

  it('treats blank English strings as empty', () => {
    const product = localizeProduct({ ...tuna, en: { name: '   ', excerpt: '' } }, 'en');
    expect(product.name).toBe(tuna.name);
    expect(product.excerpt).toBe(tuna.excerpt);
  });

  it('keeps catalog order and filtering from the Indonesian data', () => {
    const catalog = normalizeCatalog(sanityFixtures.categories, sanityFixtures.products);
    const english = localizeCatalog(catalog, 'en');
    expect(english.products.map((item) => item.slug)).toEqual(catalog.products.map((item) => item.slug));
    expect(english.categories.map((item) => item.name)).toEqual(['Tuna Category', 'Kategori Ikan Dasar']);
  });

  it('localizes news, image alt text inside the body, facts, and credentials', () => {
    const article = localizeNews(sanityFixtures.news[0], 'en');
    expect(article.title).toBe('Test News');
    expect(JSON.stringify(article.body)).toContain('Test photo inside the article');

    const fact = localizeFact(sanityFixtures.companyFacts[1], 'en');
    expect(fact.label).toBe('Test fact About');
    expect(localizeFact(sanityFixtures.companyFacts[0], 'en').label).toBe('Test fakta Beranda');

    expect(localizeCredential(sanityFixtures.credentials[0], 'en').name).toBe('Test Legal Document');
  });
});
