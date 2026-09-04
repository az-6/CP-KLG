import { expect, test } from '@playwright/test';

test('catalog uses active Sanity categories and product detail links', async ({ page }) => {
  await page.goto('/produk');
  await expect(page.getByRole('button', { name: 'Kategori Tuna' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Lihat detail Tuna/i })).toHaveAttribute('href', '/produk/tuna');
  await expect(page.getByText(/Contoh katalog/i)).toHaveCount(0);
});

test('category controls filter products accessibly', async ({ page }) => {
  await page.goto('/produk');
  const tunaButton = page.getByRole('button', { name: 'Kategori Tuna' });
  await tunaButton.click();
  await expect(tunaButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-product-filter-item][data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('[data-product-filter-item][data-product-category="ikan-dasar"]:visible')).toHaveCount(0);
});
