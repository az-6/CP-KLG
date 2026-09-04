import { expect, test } from '@playwright/test';

test('generic CTA uses official configured number and meeting context', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('[data-whatsapp-source="hero"]');
  const href = await link.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/6281319426006\?text=/);
  expect(decodeURIComponent(href!)).toContain('menjadwalkan pertemuan');
});

test('contact page exposes both official WhatsApp contacts', async ({ page }) => {
  await page.goto('/hubungi-kami');

  const contactSection = page.locator('#kontak');
  const primary = contactSection.getByRole('link', { name: 'WhatsApp Zuhud' });
  const secondary = contactSection.getByRole('link', { name: 'WhatsApp Hanggi' });
  await expect(primary).toHaveAttribute('href', /^https:\/\/wa\.me\/6281319426006\?text=/);
  await expect(secondary).toHaveAttribute('href', /^https:\/\/wa\.me\/628151931083\?text=/);
  await expect(contactSection.getByText('Muara Baru, Jakarta Utara')).toBeVisible();

  const secondaryHref = await secondary.getAttribute('href');
  expect(decodeURIComponent(secondaryHref!)).toContain('menjadwalkan pertemuan');
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
