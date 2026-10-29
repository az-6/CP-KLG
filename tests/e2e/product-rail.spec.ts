import { expect, test } from '@playwright/test';

const scrollLeft = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.querySelector<HTMLElement>('[data-rail-track]')!.scrollLeft);
const maxScroll = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const track = document.querySelector<HTMLElement>('[data-rail-track]')!;
    return track.scrollWidth - track.clientWidth;
  });

test('homepage product rail loops in both directions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const track = page.getByRole('list', { name: 'Daftar produk' });
  await expect(track.getByRole('listitem')).toHaveCount(2);

  const prev = page.getByRole('button', { name: 'Produk sebelumnya' });
  const next = page.getByRole('button', { name: 'Produk berikutnya' });
  await expect(prev).toBeEnabled();
  await expect(next).toBeEnabled();

  // Di awal, "sebelumnya" melompat ke ujung.
  await prev.click();
  const end = await maxScroll(page);
  await expect.poll(() => scrollLeft(page)).toBeGreaterThanOrEqual(end - 2);

  // Di ujung, "berikutnya" kembali ke awal.
  await next.click();
  await expect.poll(() => scrollLeft(page)).toBeLessThanOrEqual(2);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('product rail hides its buttons when every product fits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-rail-controls]')).toBeHidden();
});

test('product cards show names without descriptions on the homepage and catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-rail-track] .product-card__excerpt')).toHaveCount(0);
  await expect(page.locator('[data-rail-current]')).toHaveCount(0);

  await page.goto('/produk');
  await expect(page.locator('.product-card__excerpt')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Tuna', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat detail Tuna' })).toHaveAttribute('href', '/produk/tuna');
});
