import { expect, test } from '@playwright/test';

const contentPaths = ['/', '/produk', '/produk/tuna', '/mutu-proses', '/tentang-kami', '/hubungi-kami'];

for (const viewport of [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  for (const path of contentPaths) {
    test(`${path} does not overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
}
