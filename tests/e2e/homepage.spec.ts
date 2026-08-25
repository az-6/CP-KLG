import { expect, test } from '@playwright/test';

test('homepage presents the trust-led narrative', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('main h1')).toHaveCount(1);
  const headings = await page.locator('main h2').allTextContents();
  expect(headings).toEqual(expect.arrayContaining([
    'Produk untuk Kebutuhan Bisnis Anda',
    'Kepercayaan Dibangun dari Bukti',
    'Mutu dari Penerimaan hingga Pengiriman',
    'Spesifikasi Mengikuti Kebutuhan Buyer',
  ]));
  await expect(page.getByRole('link', { name: 'Jadwalkan Pertemuan' }).last()).toBeVisible();
});
