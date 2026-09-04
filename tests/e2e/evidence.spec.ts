import { expect, test } from '@playwright/test';

test('evidence appears only on its intended page', async ({ page }) => {
  await page.goto('/mutu-proses');
  await expect(page.getByRole('region', { name: 'Dokumentasi proses dan fasilitas' })).toBeVisible();
  await expect(page.getByAltText('Test foto tim')).toHaveCount(0);

  await page.goto('/tentang-kami');
  await expect(page.getByAltText('Test foto tim')).toBeVisible();
  await expect(page.getByText('Test fakta Tentang Kami')).toBeVisible();
});

test('credential preview opens accessibly and exposes no downloads', async ({ page }) => {
  await page.goto('/tentang-kami');
  const opener = page.getByRole('button', { name: /Perbesar Test Dokumen Legalitas/i });
  await opener.click();
  await expect(page.getByRole('dialog', { name: 'Test Dokumen Legalitas' })).toBeVisible();
  await expect(page.locator('a[download], a[href$=".pdf"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Tutup pratinjau' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(opener).toBeFocused();
});
