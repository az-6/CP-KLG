import { expect, test } from '@playwright/test';

test('catalog distinguishes primary and placeholder categories', async ({ page }) => {
  await page.goto('/produk');
  await expect(page.locator('article[data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('article[data-product-slug="ikan-dasar"]')).toBeVisible();
  await expect(page.getByText('Udang', { exact: true })).toBeVisible();
  await expect(page.getByText('Contoh katalog')).toHaveCount(2);
  await expect(page.locator('article[data-product-slug="udang"]')).toContainText('Ketersediaan belum dipublikasikan');
  await expect(page.locator('article[data-product-slug="kakap"]')).toContainText('Ketersediaan belum dipublikasikan');
});

test('category controls filter products accessibly', async ({ page }) => {
  await page.goto('/produk');
  const tunaButton = page.getByRole('button', { name: 'Tuna' });
  await tunaButton.click();
  await expect(tunaButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-product-filter-item][data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('[data-product-filter-item][data-product-category="ikan-dasar"]:visible')).toHaveCount(0);
});
