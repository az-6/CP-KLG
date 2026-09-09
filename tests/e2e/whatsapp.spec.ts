import { expect, test } from '@playwright/test';

test('generic CTA uses official configured number and meeting context', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('[data-whatsapp-source="hero"]');
  const href = await link.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/6281319426006\?text=/);
  expect(decodeURIComponent(href!)).toContain('menjadwalkan pertemuan');
});

test('contact page exposes a single WhatsApp contact without a personal name', async ({ page }) => {
  await page.goto('/hubungi-kami');

  const contactSection = page.locator('#kontak');
  const whatsapp = contactSection.getByRole('link', { name: 'WhatsApp' });
  await expect(whatsapp).toHaveCount(1);
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/6281319426006\?text=/);
  await expect(contactSection.getByText('Muara Baru, Jakarta Utara')).toBeVisible();
  await expect(contactSection.getByText('Est. 2020')).toBeVisible();

  const href = await whatsapp.getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('menjadwalkan pertemuan');
});

test('product CTA carries product context', async ({ page }) => {
  await page.goto('/produk/tuna');
  const link = page.locator('[data-whatsapp-source="product-detail"]');
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
