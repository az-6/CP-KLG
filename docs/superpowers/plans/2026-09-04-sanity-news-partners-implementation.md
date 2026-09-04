# Sanity News and Partners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an SEO-ready news system and a non-clickable partner-logo section managed through Sanity.

**Architecture:** One repository fetches published active news and partners, using deterministic fixtures in browser tests. Static article routes use Portable Text; the homepage independently hides either optional section when its query result is empty.

**Tech Stack:** Astro 7, Sanity GROQ, Portable Text, JSON-LD, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-09-04-sanity-content-platform-design.md`

## Global Constraints

- Complete the Sanity foundation plan first.
- News supports cover and inline images with required alt text.
- Homepage shows at most three newest active articles.
- Partners are images only: no anchor, button, click handler, or pointer cursor.
- Empty News Latest and Partners sections render no heading or empty-state box on the homepage.

---

### Task 1: News and partner repository

**Files:**
- Create: `src/lib/sanity/news-partner-repository.ts`
- Test: `tests/unit/news-partner-repository.test.ts`

**Interfaces:**
- Produces: `getPublishedNews(): Promise<NewsDocument[]>`
- Produces: `getLatestNews(limit = 3): Promise<NewsDocument[]>`
- Produces: `getActivePartners(): Promise<PartnerDocument[]>`

- [ ] **Step 1: Write failing sort/filter tests**

```ts
it('returns newest active news and ordered partners', () => {
  expect(normalizeNews(newsFixture).map(item => item.slug)).toEqual(['newer', 'older']);
  expect(normalizePartners(partnerFixture).map(item => item.order)).toEqual([1, 2]);
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- tests/unit/news-partner-repository.test.ts`

Expected: FAIL because repository functions do not exist.

- [ ] **Step 3: Implement narrow published queries**

```ts
export const NEWS_QUERY = groq`*[_type == "news" && isActive == true && defined(slug.current)] | order(publishedAt desc){_id,title,"slug":slug.current,publishedAt,_updatedAt,excerpt,coverImage,body,seo,isActive}`;
export const PARTNER_QUERY = groq`*[_type == "partner" && isActive == true] | order(order asc,name asc){_id,name,logo,order,isActive}`;
```

Fixture mode returns the corresponding `sanityFixtures` arrays. Live mode uses `sanityClient.fetch` and propagates query failures.

- [ ] **Step 4: Run GREEN and commit**

Run: `npm test -- tests/unit/news-partner-repository.test.ts`

```powershell
git add src/lib/sanity/news-partner-repository.ts tests/unit/news-partner-repository.test.ts
git commit -m "feat: query Sanity news and partners"
```

---

### Task 2: News card, list page, and navigation

**Files:**
- Create: `src/components/NewsCard.astro`
- Create: `src/pages/berita/index.astro`
- Modify: `src/data/navigation.ts`
- Modify: `src/components/Footer.astro`
- Test: `tests/e2e/news.spec.ts`

**Interfaces:**
- Consumes: `getPublishedNews()`
- News card props: `{ article: NewsDocument; headingLevel?: 'h2' | 'h3' }`

- [ ] **Step 1: Write failing list/navigation tests**

```ts
test('news listing exposes newest published article and navigation', async ({ page }) => {
  await page.goto('/berita');
  await expect(page.getByRole('heading', { level: 1, name: 'Berita' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Baca Test Berita/i })).toHaveAttribute('href', '/berita/test-berita');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Berita' })).toBeVisible();
});
```

- [ ] **Step 2: Run RED**

Run: `npm run test:e2e -- tests/e2e/news.spec.ts`

Expected: FAIL with 404 and missing nav link.

- [ ] **Step 3: Implement semantic cards and list**

`NewsCard.astro` renders `<article>`, `SanityImage`, `<time datetime>`, heading, excerpt, and a link whose accessible name is `Baca ${article.title}`. `berita/index.astro` awaits `getPublishedNews()`, renders metadata/canonical `/berita`, and shows a concise page-level empty message only when there are no articles.

Insert `{ label: 'Berita', href: '/berita' }` between Tentang Kami and Hubungi Kami, and add the same destination to the footer.

- [ ] **Step 4: Run GREEN and commit**

Run: `npm run test:e2e -- tests/e2e/news.spec.ts && npm run check`

```powershell
git add src/components/NewsCard.astro src/pages/berita/index.astro src/data/navigation.ts src/components/Footer.astro tests/e2e/news.spec.ts
git commit -m "feat: add Sanity news listing"
```

---

### Task 3: Article SEO and detail route

**Files:**
- Modify: `src/lib/seo.ts`
- Create: `src/pages/berita/[slug].astro`
- Test: `tests/unit/seo.test.ts`
- Modify: `tests/e2e/news.spec.ts`

**Interfaces:**
- Produces: `buildNewsArticleJsonLd(article, company, site): object`
- Consumes: `Breadcrumbs`, `PortableContent`, `getPublishedNews()`

- [ ] **Step 1: Add failing JSON-LD test**

```ts
it('builds complete NewsArticle data from visible article facts', () => {
  const schema = buildNewsArticleJsonLd(article, company, new URL('https://example.com'));
  expect(schema).toMatchObject({
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: company.name },
    publisher: { '@type': 'Organization', name: company.name },
  });
  expect(schema.mainEntityOfPage).toBe('https://example.com/berita/test-berita');
});
```

- [ ] **Step 2: Run RED, then implement schema helper**

Run: `npm test -- tests/unit/seo.test.ts`

Expected: FAIL because helper is missing.

Use `dateModified: article._updatedAt`, an image URL only when present, and the article canonical URL. Do not add a person author.

- [ ] **Step 3: Add failing article-route E2E case**

```ts
test('article detail renders Portable Text, images and article schema', async ({ page }) => {
  await page.goto('/berita/test-berita');
  await expect(page.getByRole('heading', { level: 1, name: 'Test Berita' })).toBeVisible();
  await expect(page.locator('article img')).toHaveCount(2);
  await expect(page.locator('script[type="application/ld+json"]')).toContainText('NewsArticle');
});
```

- [ ] **Step 4: Implement route and run GREEN**

`getStaticPaths()` maps all results from `getPublishedNews()` to slug props. The page renders breadcrumb, title, `<time>`, excerpt, cover, Portable Text, and at most three other articles excluding the current `_id`. Metadata uses SEO overrides with fallbacks.

Run: `npm test -- tests/unit/seo.test.ts && npm run test:e2e -- tests/e2e/news.spec.ts && npm run build`

Expected: PASS and `dist/berita/test-berita/index.html` exists.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/seo.ts src/pages/berita/[slug].astro tests/unit/seo.test.ts tests/e2e/news.spec.ts
git commit -m "feat: add SEO-ready news articles"
```

---

### Task 4: Conditional homepage News and Partners sections

**Files:**
- Create: `src/components/PartnerGrid.astro`
- Create: `src/lib/optional-sections.ts`
- Modify: `src/pages/index.astro`
- Modify: `tests/e2e/homepage.spec.ts`
- Create: `tests/unit/optional-sections.test.ts`

**Interfaces:**
- Consumes: `getLatestNews(3)`, `getActivePartners()`
- Produces pure helper: `hasItems<T>(items: T[]): boolean`

- [ ] **Step 1: Add failing homepage tests**

```ts
test('homepage shows non-clickable partners and three-or-fewer latest articles', async ({ page }) => {
  await page.goto('/');
  const partners = page.getByRole('region', { name: 'Mitra Kerja' });
  await expect(partners).toBeVisible();
  await expect(partners.locator('a,button')).toHaveCount(0);
  expect(await page.locator('[data-latest-news] article').count()).toBeLessThanOrEqual(3);
});
```

- [ ] **Step 2: Run RED, implement sections, and preserve agreed order**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts`

Expected: FAIL because sections do not exist.

Fetch both arrays with `Promise.all`. Render Partners after the facts strip and before products; render News Latest after the company preview and before the final CTA. Wrap each entire `<section>` in a length check so headings also disappear when empty.

- [ ] **Step 3: Verify empty behavior with pure rendering condition**

```ts
export const hasItems = <T>(items: T[]) => items.length > 0;
```

Unit-test `hasItems([]) === false`; use this helper for both homepage sections to keep behavior consistent.

- [ ] **Step 4: Run GREEN and commit**

Run: `npm test -- tests/unit/optional-sections.test.ts && npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/responsive.spec.ts`

```powershell
git add src/components/PartnerGrid.astro src/pages/index.astro src/lib/optional-sections.ts tests/unit/optional-sections.test.ts tests/e2e/homepage.spec.ts
git commit -m "feat: add homepage news and partners"
```

---

### Task 5: News/partners exit verification

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`
- Modify: `tests/e2e/seo.spec.ts`

- [ ] **Step 1: Add new URLs to page matrices**

Include `/berita` and `/berita/test-berita` in accessibility and responsive checks.

- [ ] **Step 2: Assert sitemap and canonical article output**

```ts
test('published news URL appears in generated sitemap', async ({ request }) => {
  const response = await request.get('/sitemap-0.xml');
  expect(await response.text()).toContain('/berita/test-berita');
});
```

- [ ] **Step 3: Run full verification and commit**

Run: `npm test && npm run build && npm run test:e2e`

Expected: all commands exit 0; news list/detail, non-clickable partners, sitemap, accessibility, and responsive tests pass.

```powershell
git add tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts tests/e2e/seo.spec.ts
git commit -m "test: verify news and partner experience"
```
