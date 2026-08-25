import { expect, test } from '@playwright/test';

test('homepage identifies the company and exposes primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Pasokan Ikan Berkualitas Konsisten',
  );

  const nav = page.getByRole('navigation', { name: 'Navigasi utama' });
  for (const label of ['Beranda', 'Produk', 'Mutu & Proses', 'Tentang Kami', 'Hubungi Kami']) {
    await expect(nav.getByRole('link', { name: label })).toBeVisible();
  }
});

for (const [path, heading] of [
  ['/mutu-proses', 'Mutu dan Proses'],
  ['/tentang-kami', 'Tentang PT Katalis Lintas Global'],
  ['/hubungi-kami', 'Mari Diskusikan Kebutuhan Pasokan Anda'],
] as const) {
  test(`${path} exposes its primary heading`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });
}

test('mobile menu exposes navigation state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Navigasi utama' })).toBeVisible();
});

test('mobile menu clears its scroll lock at the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await expect(page.locator('body')).toHaveClass(/menu-open/);

  await page.setViewportSize({ width: 1200, height: 844 });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
});
