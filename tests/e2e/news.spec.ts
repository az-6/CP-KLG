import { expect, test } from '@playwright/test';

test('news listing exposes newest published article and navigation', async ({ page }) => {
  await page.goto('/berita');
  await expect(page.getByRole('heading', { level: 1, name: 'Berita' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Baca Test Berita/i })).toHaveAttribute('href', '/berita/test-berita');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Berita' })).toBeVisible();
});

test('article detail renders Portable Text, images and article schema', async ({ page }) => {
  await page.goto('/berita/test-berita');
  await expect(page.getByRole('heading', { level: 1, name: 'Test Berita' })).toBeVisible();
  await expect(page.locator('article img')).toHaveCount(2);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.join('')).toContain('NewsArticle');
});
