import { expect, test } from '@playwright/test';

test('evidence appears only on its intended page', async ({ page }) => {
  await page.goto('/mutu-proses');
  await expect(page.getByRole('region', { name: 'Dokumentasi proses dan fasilitas' })).toBeVisible();
  await expect(page.getByAltText('Test foto tim')).toHaveCount(0);

  await page.goto('/tentang-kami');
  await expect(page.getByAltText('Test foto tim')).toBeVisible();
  await expect(page.getByText('Test fakta Tentang Kami')).toBeVisible();
});
