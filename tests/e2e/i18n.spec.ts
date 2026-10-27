import { expect, test } from '@playwright/test';

for (const [path, heading, counterpart] of [
  ['/en/', 'Consistent Quality Fish Supply', '/'],
  ['/en/quality-process', 'Quality and Process', '/mutu-proses'],
  ['/en/about', 'About PT Katalis Lintas Global', '/tentang-kami'],
  ['/en/contact', "Let's Discuss Your Supply Needs", '/hubungi-kami'],
  ['/en/products', 'Products for B2B Supply', '/produk'],
  ['/en/products/tuna', 'Tuna', '/produk/tuna'],
  ['/en/news', 'News', '/berita'],
  ['/en/news/test-berita', 'Test News', '/berita/test-berita'],
] as const) {
  test(`${path} is English and paired with ${counterpart}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveAttribute('href', `http://localhost:4321${counterpart}`);
    await expect(page.getByRole('link', { name: /Bahasa Indonesia/ })).toHaveAttribute('href', counterpart);
  });
}

test('English navigation stays in English for products and news', async ({ page }) => {
  await page.goto('/en/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/en/products');
  await expect(nav.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/en/news');

  await nav.getByRole('link', { name: 'Products' }).click();
  await expect(page).toHaveURL(/\/en\/products$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tuna Category' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View Tuna details/ })).toHaveAttribute('href', '/en/products/tuna');
});

test('English product detail uses English content and an English WhatsApp message', async ({ page }) => {
  await page.goto('/en/products/tuna');
  await expect(page.getByText('Test description of the Tuna product.')).toBeVisible();
  await expect(page.getByText('Available on confirmation')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Products');
  const href = await page.locator('[data-whatsapp-source="product-detail"]').getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('the product Tuna');
});

test('English pages fall back to Indonesian content that has no translation yet', async ({ page }) => {
  await page.goto('/en/products/ikan-dasar');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'Ikan Dasar' })).toBeVisible();
  await expect(page.getByText('Product Information')).toBeVisible();
});

test('English news article is translated and links back to English news', async ({ page }) => {
  await page.goto('/en/news/test-berita');
  await expect(page.getByText('Test article body for checking the website layout.')).toBeVisible();
  await expect(page.getByAltText('Test photo inside the article')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'News' })).toHaveAttribute('href', '/en/news');
});

test('Indonesian pages link to their English counterpart', async ({ page }) => {
  await page.goto('/mutu-proses');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'http://localhost:4321/en/quality-process');
  await expect(page.getByRole('link', { name: /English/ })).toHaveAttribute('href', '/en/quality-process');
});

test('English WhatsApp CTA carries an English meeting message', async ({ page }) => {
  await page.goto('/en/');
  const href = await page.locator('[data-whatsapp-source="hero"]').getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/6281319426006\?text=/);
  expect(decodeURIComponent(href!)).toContain('schedule a meeting');
});

test('locations map lists the company address and the five branches', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Lokasi Kami' });
  await expect(section.getByRole('img', { name: /Peta Indonesia/ })).toBeVisible();
  const items = section.locator('.locations__list li');
  await expect(items).toHaveCount(6);
  for (const city of ['Muara Baru', 'Padang', 'Kupang', 'Bitung', 'Manokwari', 'Jayapura']) {
    await expect(items.filter({ hasText: city })).toHaveCount(1);
  }
});

for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 1000 }]) {
  for (const path of ['/en/', '/en/quality-process', '/en/about', '/en/contact', '/en/products', '/en/products/tuna', '/en/news', '/en/news/test-berita']) {
    test(`${path} does not overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });
  }
}
