import { expect, test } from '@playwright/test';

test('product detail exposes facts, breadcrumb, SEO and contextual WhatsApp', async ({ page }) => {
  await page.goto('/produk/tuna');

  await expect(page.getByRole('heading', { level: 1, name: 'Tuna' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Produk');

  const href = await page.getByRole('link', { name: /Diskusikan produk/i }).getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('Tuna');

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas).toEqual(expect.arrayContaining([expect.stringContaining('Product')]));
  expect(schemas.join('')).toContain('BreadcrumbList');
});
