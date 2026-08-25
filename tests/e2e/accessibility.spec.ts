import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/produk', '/mutu-proses', '/tentang-kami', '/hubungi-kami']) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const serious = results.violations.filter(
      ({ impact }) => impact === 'serious' || impact === 'critical',
    );
    expect(serious).toEqual([]);
  });
}
