import { expect, test } from '@playwright/test';

test('catalog exposes approved product categories', async ({ page }) => {
  await page.goto('/produk');
  await expect(page.locator('[data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('[data-product-category="ikan-dasar"]')).toBeVisible();
});

test('category controls filter products accessibly', async ({ page }) => {
  await page.goto('/produk');
  const tunaButton = page.getByRole('button', { name: 'Tuna' });
  await tunaButton.click();
  await expect(tunaButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('[data-product-category="ikan-dasar"]')).toBeHidden();
});
