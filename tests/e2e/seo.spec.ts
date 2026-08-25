import { expect, test } from '@playwright/test';

test('homepage has canonical and social metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:4321/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Katalis Lintas Global/);
  await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
});

test('crawler endpoints are generated', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap: http://localhost:4321/sitemap-index.xml');
});

test('unknown route offers recovery links', async ({ page }) => {
  await page.goto('/tidak-ada');
  await expect(page.getByRole('link', { name: 'Kembali ke Beranda' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat Produk' })).toBeVisible();
});
