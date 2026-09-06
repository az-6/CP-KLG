import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('mobile navigation keeps keyboard focus visible and restores it on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await toggle.click();
  await page.locator('.header-cta').focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.header-cta')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('main')).not.toHaveAttribute('inert');
});

test('primary contact button remains readable on hover', async ({ page }) => {
  await page.goto('/hubungi-kami');
  const button = page.locator('[data-whatsapp-source="contact-primary"]');
  await button.hover();
  await expect(button).toHaveCSS('background-color', 'rgb(9, 103, 101)');
  const result = await new AxeBuilder({ page }).include('[data-whatsapp-source="contact-primary"]').withRules(['color-contrast']).analyze();
  expect(result.violations).toEqual([]);
});

for (const path of ['/', '/produk', '/tentang-kami', '/mutu-proses', '/hubungi-kami', '/berita']) {
  test(`${path} fits a narrow mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
