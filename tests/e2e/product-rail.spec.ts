import { expect, test } from '@playwright/test';

test('homepage product rail scrolls with its buttons and reports position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const track = page.getByRole('list', { name: 'Daftar produk' });
  await expect(track.getByRole('listitem')).toHaveCount(2);

  const prev = page.getByRole('button', { name: 'Produk sebelumnya' });
  const next = page.getByRole('button', { name: 'Produk berikutnya' });
  await expect(prev).toBeDisabled();
  await expect(page.locator('[data-rail-current]')).toHaveText('1');

  await next.click();
  await expect(page.locator('[data-rail-current]')).toHaveText('2');
  await expect(prev).toBeEnabled();
  await expect(next).toBeDisabled();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('product rail hides its buttons when every product fits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-rail-controls]')).toBeHidden();
});

test('catalog cards show product names without descriptions', async ({ page }) => {
  await page.goto('/produk');
  await expect(page.locator('.product-card__excerpt')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Tuna', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat detail Tuna' })).toHaveAttribute('href', '/produk/tuna');
});
