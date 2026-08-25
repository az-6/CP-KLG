import { expect, test } from '@playwright/test';

test('generic CTA uses official configured number and meeting context', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('[data-whatsapp-source="hero"]');
  const href = await link.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/628123456789\?text=/);
  expect(decodeURIComponent(href!)).toContain('menjadwalkan pertemuan');
});

test('product CTA carries product context', async ({ page }) => {
  await page.goto('/produk');
  const link = page.locator('[data-whatsapp-source="product"]').first();
  const href = await link.getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('produk Tuna');
});

test('WhatsApp click emits privacy-limited analytics data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    (window as typeof window & { __tracked?: unknown[] }).__tracked = [];
    window.addEventListener('klg:analytics', (event) => {
      (window as typeof window & { __tracked?: unknown[] }).__tracked?.push((event as CustomEvent).detail);
    });
    document.addEventListener('click', (event) => event.preventDefault(), { capture: true });
  });

  await page.locator('[data-whatsapp-source="hero"]').click();
  const event = await page.evaluate(() => (window as typeof window & { __tracked?: unknown[] }).__tracked?.[0]);
  expect(event).toEqual({ name: 'WhatsAppMeeting', source: 'hero', product: null });
});
