# Sanity Product Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hard-coded catalog with active Sanity categories/products and add SEO-ready product detail pages without publishing unconfirmed products.

**Architecture:** A product repository owns GROQ and fixture switching; pages consume typed catalog results. Static detail routes are generated only from active published products whose active category resolves.

**Tech Stack:** Astro 7, TypeScript, Sanity GROQ, Portable Text, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-09-04-sanity-content-platform-design.md`

## Global Constraints

- Complete `2026-09-04-sanity-foundation-implementation.md` first.
- Only Tuna and Ikan Dasar exist in initial content; Udang and Kakap remain unpublished.
- Category filters come from Sanity and remain keyboard accessible.
- Product pages never invent price, stock, rating, review, certification, or scientific name.
- Product CTA includes the product name in the WhatsApp message.

---

### Task 1: Product repository and query normalization

**Files:**
- Create: `src/lib/sanity/product-repository.ts`
- Test: `tests/unit/product-repository.test.ts`

**Interfaces:**
- Produces: `getProductCatalog(): Promise<{ categories: ProductCategoryDocument[]; products: ProductDocument[] }>`
- Produces: `getActiveProducts(): Promise<ProductDocument[]>`

- [ ] **Step 1: Write failing normalization tests**

```ts
import { expect, it } from 'vitest';
import { normalizeCatalog } from '../../src/lib/sanity/product-repository';

it('drops inactive and orphaned products and empty categories', () => {
  const result = normalizeCatalog(
    [{ _id: 'c1', name: 'Tuna', slug: 'tuna', order: 1, isActive: true }],
    [
      { _id: 'p1', name: 'Tuna', slug: 'tuna', categoryId: 'c1', excerpt: 'Valid product excerpt for business buyers.', images: [], order: 1, isActive: true },
      { _id: 'p2', name: 'Hidden', slug: 'hidden', categoryId: 'c1', excerpt: 'Hidden product excerpt for testing only.', images: [], order: 2, isActive: false },
    ],
  );
  expect(result.products.map(item => item.slug)).toEqual(['tuna']);
  expect(result.categories.map(item => item.slug)).toEqual(['tuna']);
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- tests/unit/product-repository.test.ts`

Expected: FAIL because the repository does not exist.

- [ ] **Step 3: Implement published GROQ and pure normalization**

```ts
import groq from 'groq';
export const PRODUCT_CATALOG_QUERY = groq`{
  "categories": *[_type == "productCategory" && isActive == true] | order(order asc, name asc){_id,name,"slug":slug.current,description,order,isActive},
  "products": *[_type == "product" && isActive == true && defined(slug.current)] | order(order asc,name asc){_id,name,"slug":slug.current,"categoryId":category->_id,"categoryName":category->name,"categorySlug":category->slug.current,scientificName,excerpt,description,images,sizes,forms,condition,packaging,volume,availabilityStatus,order,isActive,seo}
}`;
```

`normalizeCatalog` must remove inactive records, products without a resolved active category, and categories with zero products, then sort by `order` and name. `getProductCatalog` returns fixture data when `SANITY_DATA_MODE === 'fixture'`; otherwise it calls `sanityClient.fetch(PRODUCT_CATALOG_QUERY)` and lets failures abort the build.

- [ ] **Step 4: Run GREEN and commit**

Run: `npm test -- tests/unit/product-repository.test.ts`

Expected: PASS.

```powershell
git add src/lib/sanity/product-repository.ts tests/unit/product-repository.test.ts
git commit -m "feat: query active Sanity products"
```

---

### Task 2: Dynamic catalog and product cards

**Files:**
- Modify: `src/pages/produk.astro`
- Modify: `src/components/ProductCard.astro`
- Modify: `src/pages/index.astro`
- Delete after cutover verification: `src/data/products.ts`
- Modify: `tests/e2e/products.spec.ts`

**Interfaces:**
- Consumes: `getProductCatalog()`
- Product card contract: `{ product: ProductDocument; headingLevel?: 'h2' | 'h3' }`

- [ ] **Step 1: Replace obsolete E2E expectations with failing Sanity expectations**

```ts
test('catalog uses active Sanity categories and product detail links', async ({ page }) => {
  await page.goto('/produk');
  await expect(page.getByRole('button', { name: 'Tuna' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Lihat detail Tuna/i })).toHaveAttribute('href', '/produk/tuna');
  await expect(page.getByText(/Contoh katalog/i)).toHaveCount(0);
});
```

- [ ] **Step 2: Run RED**

Run: `npm run test:e2e -- tests/e2e/products.spec.ts`

Expected: FAIL because cards still use anchors/placeholders and no detail route link.

- [ ] **Step 3: Convert catalog and card rendering**

In `produk.astro`, await `getProductCatalog()`, map category buttons from `categories`, and assign `data-product-category={product.categorySlug}`. In `ProductCard.astro`, use `SanityImage`, `product.categoryName`, `product.excerpt`, and a normal detail link:

```astro
<ButtonLink href={`/produk/${product.slug}`} label={`Lihat detail ${product.name}`} variant="text" />
```

Move the product-specific WhatsApp CTA to the detail page. Update the Beranda product preview to show at most four active products returned by the repository.

- [ ] **Step 4: Run GREEN and remove hard-coded product data**

Run: `npm run test:e2e -- tests/e2e/products.spec.ts && npm run check`

Expected: catalog and filter tests PASS. Confirm `rg "data/products" src` returns no matches, then delete `src/data/products.ts` and remove obsolete `ProductCategory`/placeholder fields from `src/types/content.ts` only after all consumers have migrated.

- [ ] **Step 5: Commit**

```powershell
git add src/pages/produk.astro src/pages/index.astro src/components/ProductCard.astro src/types/content.ts tests/e2e/products.spec.ts
git rm src/data/products.ts
git commit -m "feat: render catalog from Sanity"
```

---

### Task 3: Product and breadcrumb SEO helpers

**Files:**
- Modify: `src/lib/seo.ts`
- Test: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `buildProductJsonLd(product, company, site): object`
- Produces: `buildBreadcrumbJsonLd(items, site): object`

- [ ] **Step 1: Write failing schema tests**

```ts
it('builds factual product and breadcrumb schemas without fake offers', () => {
  const schema = buildProductJsonLd(product, company, new URL('https://example.com'));
  expect(schema.url).toBe('https://example.com/produk/tuna');
  expect(schema).not.toHaveProperty('offers');
  expect(schema).not.toHaveProperty('aggregateRating');
  expect(buildBreadcrumbJsonLd([{ name: 'Beranda', path: '/' }, { name: 'Tuna', path: '/produk/tuna' }], new URL('https://example.com'))['@type']).toBe('BreadcrumbList');
});
```

- [ ] **Step 2: Run RED, then update helpers**

Run: `npm test -- tests/unit/seo.test.ts`

Expected: FAIL because the old product helper points to `/produk#slug` and breadcrumb helper is absent.

Implement product `name`, `description`, canonical detail `url`, image URL array when present, and `brand`. Implement ordered breadcrumb `ListItem` entries with positions starting at 1.

- [ ] **Step 3: Run GREEN and commit**

Run: `npm test -- tests/unit/seo.test.ts`

Expected: PASS.

```powershell
git add src/lib/seo.ts tests/unit/seo.test.ts
git commit -m "feat: add product detail SEO schemas"
```

---

### Task 4: Static product detail pages

**Files:**
- Create: `src/pages/produk/[slug].astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/PortableContent.astro`
- Create: `src/components/ProductGallery.astro`
- Test: `tests/e2e/product-detail.spec.ts`

**Interfaces:**
- Consumes: `getActiveProducts()`, `buildProductJsonLd`, `buildBreadcrumbJsonLd`
- `getStaticPaths()` returns `{ params: { slug }, props: { product } }[]`

- [ ] **Step 1: Write the failing detail-page test**

```ts
test('product detail exposes facts, breadcrumb, SEO and contextual WhatsApp', async ({ page }) => {
  await page.goto('/produk/tuna');
  await expect(page.getByRole('heading', { level: 1, name: 'Tuna' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Produk');
  const href = await page.getByRole('link', { name: /Diskusikan produk/i }).getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('Tuna');
  expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toEqual(expect.arrayContaining([expect.stringContaining('Product')]));
});
```

- [ ] **Step 2: Run RED**

Run: `npm run test:e2e -- tests/e2e/product-detail.spec.ts`

Expected: FAIL with 404.

- [ ] **Step 3: Implement static paths and accessible content**

`[slug].astro` must call `getActiveProducts()` in `getStaticPaths`, render metadata fallbacks `seo.title ?? name` and `seo.description ?? excerpt`, use the first product image as social image fallback, render only populated specification rows, and use `getMeetingHref(number, product.name)`.

`PortableContent.astro` must configure `astro-portabletext` to render only paragraph/headings/lists/links and `imageWithAlt` through `SanityImage`; external links receive `rel="noopener noreferrer"`.

- [ ] **Step 4: Run GREEN and accessibility checks**

Run: `npm run test:e2e -- tests/e2e/product-detail.spec.ts tests/e2e/accessibility.spec.ts && npm run build`

Expected: PASS and `/produk/tuna/index.html` exists in `dist`.

- [ ] **Step 5: Commit**

```powershell
git add src/pages/produk/[slug].astro src/components/Breadcrumbs.astro src/components/PortableContent.astro src/components/ProductGallery.astro tests/e2e/product-detail.spec.ts
git commit -m "feat: add product detail pages"
```

---

### Task 5: Product catalog exit verification

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

- [ ] **Step 1: Add `/produk/tuna` to accessibility and responsive matrices**

```ts
const contentPaths = ['/', '/produk', '/produk/tuna', '/mutu-proses', '/tentang-kami', '/hubungi-kami'];
```

- [ ] **Step 2: Run complete verification**

Run: `npm test && npm run build && npm run test:e2e`

Expected: every command exits 0, all dynamic category/product checks pass, and no serious axe violations appear.

- [ ] **Step 3: Inspect build output and commit test changes**

Run: `Get-ChildItem dist/produk -Recurse -File | Select-Object FullName`

Expected: catalog and Tuna/Ikan Dasar detail pages exist; Udang and Kakap paths do not exist.

```powershell
git add tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
git commit -m "test: verify Sanity product experience"
```

