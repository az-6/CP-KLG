# PT Katalis Lintas Global Company Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, accessible, trust-led B2B company profile that turns Indonesian seafood distributors and wholesalers into qualified WhatsApp meeting conversations.

**Architecture:** Astro 7 statically renders five Indonesian-language pages from typed company and product data. Shared Astro components own navigation, proof blocks, product cards, metadata, and contextual WhatsApp links; small client scripts handle only the mobile menu, product filter, analytics, and image fallbacks. GitHub is the source of truth and Vercel builds the static output from `main` with preview deployments for pull requests.

**Tech Stack:** Node.js 22.12+, npm, Astro 7.2.6+, TypeScript strict mode, plain CSS with design tokens, Astro Image with Sharp 0.35.3+, `@astrojs/sitemap`, `@vercel/analytics`, Vitest, Playwright, and `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-08-25-company-profile-pt-katalis-lintas-global-design.md`

## Global Constraints

- Version one is Indonesian-only and targets domestic distributors and wholesalers buying commercial tonnage.
- Render statically; do not add a database, CMS, API route, server-side rendering, or Vercel Function.
- The primary conversion is a contextual WhatsApp link requesting a business meeting.
- Do not publish prices, real-time stock, buyer accounts, online payments, or automated calendar booking.
- Never fabricate products, scientific names, certifications, licenses, capacity figures, distribution areas, contact details, or customer claims.
- Publish only owner-approved content; omit unapproved optional facts instead of substituting marketing claims.
- Use portrait phone photography without stretching; crop around the subject and provide meaningful alternative text.
- Keep essential content and navigation usable if analytics or enhancement scripts fail.
- Node.js must be `>=22.12.0`; use Astro 7.2.6 or newer with TypeScript strict mode.
- Deploy the static build to Vercel from the connected GitHub repository.

## File Structure

```text
.
├── astro.config.ts                 # Static output, canonical site URL, sitemap
├── package.json                    # Runtime, checks, unit tests, E2E tests
├── playwright.config.ts            # Local preview server and browser projects
├── tsconfig.json                   # Astro strict TypeScript settings
├── vitest.config.ts                # Unit-test-only file matching
├── public/
│   ├── favicon.svg                 # Brand favicon derived from approved logo
│   └── social-card.jpg             # Approved Open Graph image
├── src/
│   ├── assets/                     # Optimized source photos and approved documents
│   ├── components/
│   │   ├── Analytics.astro         # Vercel analytics and click tracking bootstrap
│   │   ├── ButtonLink.astro        # Consistent CTA/link treatment
│   │   ├── Footer.astro            # Company contact and secondary navigation
│   │   ├── Header.astro            # Responsive primary navigation
│   │   ├── Hero.astro              # Responsive hero and portrait-photo composition
│   │   ├── ProcessTimeline.astro   # Five-step quality process
│   │   ├── ProductCard.astro       # Product facts and contextual WhatsApp CTA
│   │   ├── ProofCard.astro         # Claim-to-evidence presentation
│   │   └── SectionHeading.astro    # Shared section headings
│   ├── data/
│   │   ├── company.ts              # Approved identity, contacts, proof, facilities
│   │   ├── navigation.ts           # Header/footer links
│   │   └── products.ts             # Approved product catalog
│   ├── layouts/
│   │   └── BaseLayout.astro        # Document shell, SEO, header, footer, analytics
│   ├── lib/
│   │   ├── content-validation.ts   # Runtime/build validation for publishable data
│   │   ├── seo.ts                  # Metadata and JSON-LD builders
│   │   └── whatsapp.ts             # wa.me URL and meeting-message builders
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── hubungi-kami.astro
│   │   ├── index.astro
│   │   ├── mutu-proses.astro
│   │   ├── produk.astro
│   │   ├── robots.txt.ts           # Prerendered crawler policy using canonical site URL
│   │   └── tentang-kami.astro
│   ├── styles/
│   │   └── global.css              # Tokens, resets, typography, layout, utilities
│   └── types/
│       └── content.ts              # Shared company and product contracts
└── tests/
    ├── e2e/
    │   ├── accessibility.spec.ts
    │   ├── navigation.spec.ts
    │   ├── products.spec.ts
    │   ├── responsive.spec.ts
    │   ├── seo.spec.ts
    │   └── whatsapp.spec.ts
    └── unit/
        ├── content-validation.test.ts
        ├── seo.test.ts
        └── whatsapp.test.ts
```

---

### Task 1: Scaffold the Static Astro Project and Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `src/pages/index.astro`
- Create: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: Node.js `>=22.12.0` and npm.
- Produces: `npm run dev`, `npm run build`, `npm test`, and `npm run test:e2e`; a static `/` route for later tasks.

- [ ] **Step 1: Create the package manifest and strict Astro configuration**

```json
{
  "name": "pt-klg-company-profile",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@astrojs/sitemap": "latest",
    "@vercel/analytics": "^2.0.0",
    "astro": "^7.2.6"
  },
  "devDependencies": {
    "@astrojs/check": "latest",
    "@axe-core/playwright": "latest",
    "@playwright/test": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

Use `tsconfig.json` with `{ "extends": "astro/tsconfigs/strict" }` and create this configuration:

```ts
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  output: 'static',
  site,
  integrations: [sitemap()],
});
```

Create `playwright.config.ts` exactly as follows:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

- [ ] **Step 2: Install dependencies and browser runtime**

Run: `npm install`  
Expected: `package-lock.json` is created with no install error.

Run: `npx playwright install chromium`  
Expected: Chromium installs successfully.

- [ ] **Step 3: Write the failing homepage smoke test**

```ts
import { expect, test } from '@playwright/test';

test('homepage identifies the company', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Pasokan Ikan Berkualitas Konsisten',
  );
});
```

Configure Playwright with `baseURL: 'http://127.0.0.1:4321'` and a `webServer` running `npm run dev -- --host 127.0.0.1`.

- [ ] **Step 4: Run the smoke test and verify failure**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts`  
Expected: FAIL because the homepage and heading do not exist yet.

- [ ] **Step 5: Add the minimal Astro homepage**

```astro
---
---
<html lang="id">
  <head><title>PT Katalis Lintas Global</title></head>
  <body>
    <main>
      <h1>Pasokan Ikan Berkualitas Konsisten untuk Bisnis Anda</h1>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Verify the scaffold**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts`  
Expected: PASS.

Run: `npm run build`  
Expected: type checking and static build complete successfully.

- [ ] **Step 7: Commit the scaffold**

```bash
git add package.json package-lock.json astro.config.ts tsconfig.json playwright.config.ts .gitignore src/pages/index.astro tests/e2e/navigation.spec.ts
git commit -m "build: scaffold static Astro site"
```

### Task 2: Define Verified Content Contracts and WhatsApp URLs

**Files:**
- Create: `src/types/content.ts`
- Create: `src/data/company.ts`
- Create: `src/data/navigation.ts`
- Create: `src/data/products.ts`
- Create: `src/lib/content-validation.ts`
- Create: `src/lib/whatsapp.ts`
- Create: `tests/unit/content-validation.test.ts`
- Create: `tests/unit/whatsapp.test.ts`

**Interfaces:**
- Consumes: owner-approved identity and product facts plus `PUBLIC_WHATSAPP_NUMBER` in international digits without `+` or spaces.
- Produces: `CompanyProfile`, `Product`, `ProductCategory`; `validateCompanyProfile(profile): string[]`; `buildMeetingMessage(context?): string`; `buildWhatsAppUrl(number, message): string`.

- [ ] **Step 1: Write failing validation and URL tests**

```ts
import { describe, expect, it } from 'vitest';
import { validateCompanyProfile } from '../../src/lib/content-validation';
import { buildMeetingMessage, buildWhatsAppUrl } from '../../src/lib/whatsapp';

describe('validateCompanyProfile', () => {
  it('rejects a non-numeric WhatsApp number', () => {
    expect(validateCompanyProfile({
      name: 'PT Katalis Lintas Global',
      slogan: 'Kualitas Terjaga, Spesifikasi Anda.',
      whatsappNumber: '+62 812',
    }))
      .toContain('whatsappNumber must contain international digits only');
  });
});

describe('WhatsApp links', () => {
  it('encodes company and product context', () => {
    const message = buildMeetingMessage({ productName: 'Tuna' });
    expect(buildWhatsAppUrl('628123456789', message)).toBe(
      `https://wa.me/628123456789?text=${encodeURIComponent(message)}`,
    );
    expect(message).toContain('Tuna');
    expect(message).toContain('menjadwalkan pertemuan');
  });
});
```

- [ ] **Step 2: Run the unit tests and verify failure**

Run: `npm test -- tests/unit/content-validation.test.ts tests/unit/whatsapp.test.ts`  
Expected: FAIL because the modules are absent.

- [ ] **Step 3: Implement focused data contracts**

```ts
import type { ImageMetadata } from 'astro';

export type ProductCategory = 'tuna' | 'ikan-dasar' | 'lainnya';

export interface Product {
  slug: string;
  name: string;
  scientificName?: string;
  category: ProductCategory;
  image: ImageMetadata;
  imageAlt: string;
  sizes: string[];
  forms: string[];
  condition: Array<'Segar' | 'Beku'>;
  packaging: string[];
  volume?: string;
}

export interface CompanyProfile {
  name: 'PT Katalis Lintas Global';
  slogan: 'Kualitas Terjaga, Spesifikasi Anda.';
  whatsappNumber: string;
  email?: string;
  address?: string;
  operatingHours?: string;
}
```

`company.ts` must contain the approved name, slogan, hero copy, and only supplied contact/proof facts. `products.ts` must export only owner-approved product records; product fixture data stays inside tests and is never rendered as company inventory.

- [ ] **Step 4: Implement deterministic validation and WhatsApp helpers**

```ts
export function buildMeetingMessage(context?: { productName?: string }): string {
  const subject = context?.productName
    ? `produk ${context.productName}`
    : 'kebutuhan pasokan ikan';
  return `Halo PT Katalis Lintas Global, saya [nama] dari [perusahaan]. Kami bergerak sebagai [distributor/pedagang besar] dan ingin menjadwalkan pertemuan untuk membahas ${subject}.`;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  if (!/^\d{8,15}$/.test(number)) throw new Error('Invalid WhatsApp number');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
```

`validateCompanyProfile` returns an empty array for valid content and explicit messages for an empty name, invalid phone digits, malformed email, and unapproved empty proof labels.

- [ ] **Step 5: Populate verified content and assets gate**

Before proceeding to page work, obtain the official WhatsApp number, email, address, operating hours, logo file, final product inventory, product attributes, proof figures, certification display names, and approved photos. Add only received facts to `company.ts` and `products.ts`; omit optional fields that the owner does not approve for publication.

- [ ] **Step 6: Verify contracts and commit**

Run: `npm test -- tests/unit/content-validation.test.ts tests/unit/whatsapp.test.ts`  
Expected: PASS.

Run: `npm run check`  
Expected: no TypeScript or Astro diagnostics.

```bash
git add src/types src/data src/lib tests/unit
git commit -m "feat: add verified company content model"
```

### Task 3: Build the Shared Layout, Navigation, and SEO Foundation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/Analytics.astro`
- Create: `src/lib/seo.ts`
- Create: `src/styles/global.css`
- Create: `tests/unit/seo.test.ts`
- Modify: `tests/e2e/navigation.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `company`, `navigation`, `buildWhatsAppUrl`, and per-page `{ title, description, image?, canonicalPath }`.
- Produces: `BaseLayout` slots page content into a consistent document shell; `buildOrganizationJsonLd()` returns safe JSON-LD without empty optional fields.

- [ ] **Step 1: Write failing navigation and SEO tests**

```ts
test('primary navigation exposes all five pages', async ({ page }) => {
  await page.goto('/');
  for (const label of ['Beranda', 'Produk', 'Mutu & Proses', 'Tentang Kami', 'Hubungi Kami']) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }
});

test('homepage has canonical and social metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Katalis Lintas Global/);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts tests/e2e/seo.spec.ts`  
Expected: FAIL because shared navigation and metadata are missing.

- [ ] **Step 3: Implement design tokens and shared document shell**

Define `--color-navy`, `--color-ocean`, `--color-white`, `--color-charcoal`, spacing, radius, shadow, content width, and fluid type tokens in `global.css`. Apply a mobile-first reset, visible `:focus-visible`, 44px minimum interactive targets, `prefers-reduced-motion`, and a `.container` utility.

`BaseLayout.astro` must render UTF-8 charset, responsive viewport, unique title/description, canonical link, Open Graph metadata, organization JSON-LD, skip link, `Header`, main slot, `Footer`, and `Analytics`.

- [ ] **Step 4: Implement resilient header and footer**

Use semantic `<nav aria-label="Navigasi utama">`. The mobile menu button owns `aria-expanded` and `aria-controls`; a six-line inline script toggles `hidden` and the expanded state. With scripts disabled, desktop links remain in document order and the WhatsApp link remains a normal anchor.

- [ ] **Step 5: Verify navigation, metadata, and type safety**

Run: `npm test -- tests/unit/seo.test.ts`  
Expected: PASS with Organization JSON-LD omitting missing optional contact fields.

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts tests/e2e/seo.spec.ts`  
Expected: PASS.

Run: `npm run build`  
Expected: static build succeeds.

- [ ] **Step 6: Commit the shared foundation**

```bash
git add src/layouts src/components/Header.astro src/components/Footer.astro src/components/Analytics.astro src/lib/seo.ts src/styles tests/unit/seo.test.ts tests/e2e src/pages/index.astro
git commit -m "feat: add shared layout navigation and SEO"
```

### Task 4: Implement the Reusable Trust-Led Component System

**Files:**
- Create: `src/components/ButtonLink.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/ProcessTimeline.astro`
- Create: `src/components/ProofCard.astro`
- Create: `src/components/SectionHeading.astro`
- Create: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: typed copy, approved image metadata, and ordinary anchor URLs.
- Produces: reusable presentational components with no hidden content state and no component-specific global data access.

- [ ] **Step 1: Write a failing responsive component test**

```ts
test('hero and proof content do not overflow a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  await expect(page.getByRole('link', { name: 'Jadwalkan Pertemuan' })).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm run test:e2e -- tests/e2e/responsive.spec.ts`  
Expected: FAIL because the hero and CTA system are absent.

- [ ] **Step 3: Implement components with explicit props**

`ButtonLink` accepts `{ href: string; variant: 'primary' | 'secondary' | 'text'; external?: boolean; analyticsSource?: string }`. `Hero` accepts the approved heading, body, primary/secondary CTA objects, and one wide image or two portrait images. `ProofCard` accepts `{ title, description, evidence, iconName }`; icons are decorative and hidden from assistive technology.

- [ ] **Step 4: Add portrait-safe responsive styling**

Use `aspect-ratio: 4 / 5` and `object-fit: cover` for portrait evidence cards. Hero portrait compositions become a two-column media panel from 768px upward and a single cropped frame below it. Never upscale an image beyond its intrinsic dimensions; the Astro `Image` component supplies responsive widths and modern formats.

- [ ] **Step 5: Verify responsive behavior and commit**

Run: `npm run test:e2e -- tests/e2e/responsive.spec.ts`  
Expected: PASS at 360px, 768px, and 1440px viewports with no horizontal overflow.

```bash
git add src/components src/styles/global.css tests/e2e/responsive.spec.ts
git commit -m "feat: add trust-led responsive components"
```

### Task 5: Assemble the Trust-Led Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `tests/e2e/navigation.spec.ts`
- Create: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: company data, approved proof facts, product categories, and Task 4 components.
- Produces: the complete `/` conversion narrative and links to all detailed pages.

- [ ] **Step 1: Write the failing homepage narrative test**

```ts
test('homepage presents trust evidence before the final meeting CTA', async ({ page }) => {
  await page.goto('/');
  const headings = await page.locator('main h2').allTextContents();
  expect(headings).toEqual(expect.arrayContaining([
    'Produk untuk Kebutuhan Bisnis Anda',
    'Mengapa Memilih Kami',
    'Mutu dari Penerimaan hingga Pengiriman',
    'Spesifikasi Mengikuti Kebutuhan Buyer',
  ]));
  await expect(page.getByRole('link', { name: 'Jadwalkan Pertemuan' }).last()).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts`  
Expected: FAIL because the narrative sections are absent.

- [ ] **Step 3: Assemble the nine homepage sections**

Render, in order: hero; verified trust bar; Tuna/Ikan Dasar category preview; the three differentiators; process summary; facilities/compliance evidence; buyer specification options; short company profile; final meeting CTA. If no approved quantitative trust fact exists, render qualitative proof cards instead of empty numbers.

- [ ] **Step 4: Verify semantic ordering and commit**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/navigation.spec.ts`  
Expected: PASS and exactly one `<h1>` on `/`.

```bash
git add src/pages/index.astro tests/e2e/homepage.spec.ts tests/e2e/navigation.spec.ts
git commit -m "feat: build trust-led homepage"
```

### Task 6: Build the Product Catalog and Contextual Product CTAs

**Files:**
- Create: `src/components/ProductCard.astro`
- Create: `src/pages/produk.astro`
- Create: `tests/e2e/products.spec.ts`
- Create: `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consumes: `products: Product[]`, `buildMeetingMessage({ productName })`, and `buildWhatsAppUrl()`.
- Produces: `/produk`; filter buttons with `data-category`; product links with `data-whatsapp-source="product"` and `data-product-slug`.

- [ ] **Step 1: Write failing catalog and WhatsApp tests**

```ts
test('filters approved products without removing them from the document', async ({ page }) => {
  await page.goto('/produk');
  await page.getByRole('button', { name: 'Tuna' }).click();
  await expect(page.locator('[data-product-category="tuna"]')).toBeVisible();
  await expect(page.locator('[data-product-category="ikan-dasar"]')).toBeHidden();
});

test('product CTA carries product and meeting context', async ({ page }) => {
  await page.goto('/produk');
  const link = page.locator('[data-whatsapp-source="product"]').first();
  await expect(link).toHaveAttribute('href', /wa\.me\/\d+\?text=/);
  expect(decodeURIComponent((await link.getAttribute('href'))!)).toContain('menjadwalkan pertemuan');
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:e2e -- tests/e2e/products.spec.ts tests/e2e/whatsapp.spec.ts`  
Expected: FAIL because `/produk` and product cards do not exist.

- [ ] **Step 3: Implement accessible catalog cards and filter enhancement**

Render all approved products on the server. Filter buttons use `aria-pressed`; a small script toggles each card's `hidden` property by `data-product-category`. Without JavaScript, all products remain visible. Each card renders only non-empty approved attributes and uses the product-specific WhatsApp message.

- [ ] **Step 4: Verify catalog behavior and commit**

Run: `npm run test:e2e -- tests/e2e/products.spec.ts tests/e2e/whatsapp.spec.ts`  
Expected: PASS for All, Tuna, Ikan Dasar, and any populated Lainnya category.

Run: `npm run check`  
Expected: no invalid product type or Astro diagnostic.

```bash
git add src/components/ProductCard.astro src/pages/produk.astro tests/e2e/products.spec.ts tests/e2e/whatsapp.spec.ts
git commit -m "feat: add product catalog and contextual meetings"
```

### Task 7: Build Quality, About, and Contact Pages

**Files:**
- Create: `src/pages/mutu-proses.astro`
- Create: `src/pages/tentang-kami.astro`
- Create: `src/pages/hubungi-kami.astro`
- Modify: `tests/e2e/navigation.spec.ts`
- Modify: `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consumes: approved process steps, facilities, certifications, company facts, contact data, and shared components.
- Produces: three statically rendered detail pages with page-specific metadata and a shared meeting CTA.

- [ ] **Step 1: Write failing route-content tests**

```ts
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
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts`  
Expected: FAIL with missing routes.

- [ ] **Step 3: Implement the three evidence-led pages**

`mutu-proses.astro` renders the approved receiving, sorting/grading, hygienic handling, cold storage, packaging, and distribution evidence. `tentang-kami.astro` renders only approved operations, facilities, sourcing network, values, and public legal/certification names. `hubungi-kami.astro` renders approved contact fields and the prefilled meeting CTA; omit the map if no approved public location URL exists.

- [ ] **Step 4: Verify routes, WhatsApp fallback, and commit**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts tests/e2e/whatsapp.spec.ts`  
Expected: PASS; every page has one visible primary meeting CTA, and each CTA is a normal `https://wa.me/` anchor that works outside the installed app.

```bash
git add src/pages tests/e2e/navigation.spec.ts tests/e2e/whatsapp.spec.ts
git commit -m "feat: add quality company and contact pages"
```

### Task 8: Add Analytics, Crawler Files, Structured Data, and Failure States

**Files:**
- Modify: `src/components/Analytics.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `public/favicon.svg`
- Create: `public/social-card.jpg`
- Modify: `tests/e2e/seo.spec.ts`
- Modify: `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consumes: CTA attributes `data-whatsapp-source` and optional `data-product-slug`; canonical `site` from Astro config.
- Produces: Vercel page-view analytics, `WhatsAppMeeting` custom events, `/404`, `/robots.txt`, `/sitemap-index.xml`, and Organization/Product JSON-LD.

- [ ] **Step 1: Write failing analytics, 404, and crawler tests**

```ts
test('WhatsApp click sends only approved analytics fields', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    (window as any).__tracked = [];
    window.addEventListener('klg:analytics', (event: Event) => {
      (window as any).__tracked.push((event as CustomEvent).detail);
    });
  });
  await page.getByRole('link', { name: 'Jadwalkan Pertemuan' }).first().click({ noWaitAfter: true });
  expect(await page.evaluate(() => (window as any).__tracked[0])).toMatchObject({
    name: 'WhatsAppMeeting',
    source: 'hero',
  });
});

test('unknown path offers recovery links', async ({ page }) => {
  await page.goto('/tidak-ada');
  await expect(page.getByRole('link', { name: 'Kembali ke Beranda' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat Produk' })).toBeVisible();
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:e2e -- tests/e2e/seo.spec.ts tests/e2e/whatsapp.spec.ts`  
Expected: FAIL because analytics dispatch and failure routes are absent.

- [ ] **Step 3: Implement privacy-limited analytics**

Render `@vercel/analytics/astro` in `Analytics.astro`. Attach one delegated click listener to `[data-whatsapp-source]`, emit a local `klg:analytics` event for testability, and call `track('WhatsAppMeeting', { source, product })` only with the source label and product slug. Never include names, phone numbers, message text, query strings, or contact data. Catch analytics errors so navigation continues. Custom events require a Vercel Pro or Enterprise plan; page views remain the baseline metric when custom events are unavailable.

- [ ] **Step 4: Implement crawler and failure assets**

Create a branded 404 page with Beranda and Produk recovery links. Generate `robots.txt` as a prerendered endpoint so it always uses `Astro.site`:

```ts
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const sitemap = new URL('/sitemap-index.xml', origin);
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
```

Build JSON-LD from verified organization and product fields; omit absent optional properties. Generate the favicon from the approved logo and the social card from approved brand assets.

- [ ] **Step 5: Verify static production output and commit**

Run: `npm run build`  
Expected: `dist/` contains all five routes, `404.html`, `robots.txt`, and a sitemap.

Run: `npm run test:e2e -- tests/e2e/seo.spec.ts tests/e2e/whatsapp.spec.ts`  
Expected: PASS; analytics failure does not cancel WhatsApp navigation.

```bash
git add src/components/Analytics.astro src/layouts/BaseLayout.astro src/pages/404.astro src/pages/robots.txt.ts src/lib/seo.ts public tests/e2e
git commit -m "feat: add analytics SEO and failure recovery"
```

### Task 9: Complete Accessibility, Responsive, Performance, and Deployment Gates

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the finished static site and all test commands.
- Produces: repeatable CI validation, documented content-update workflow, and a Vercel-ready `main` branch.

- [ ] **Step 1: Write the accessibility test**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/produk', '/mutu-proses', '/tentang-kami', '/hubungi-kami']) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'))
      .toEqual([]);
  });
}
```

- [ ] **Step 2: Run the full suite and correct actual failures**

Run: `npm test`  
Expected: all validation, SEO, and WhatsApp unit tests pass.

Run: `npm run test:e2e`  
Expected: all Chromium navigation, catalog, responsive, SEO, analytics, WhatsApp, and accessibility tests pass.

Run: `npm run build`  
Expected: Astro check and static generation pass with no diagnostics.

- [ ] **Step 3: Add CI with exact quality gates**

Create `.github/workflows/ci.yml` triggered by pushes and pull requests. Use `actions/checkout`, `actions/setup-node` with Node 22 and npm cache, then run `npm ci`, `npx playwright install --with-deps chromium`, `npm test`, `npm run build`, and `npm run test:e2e`.

- [ ] **Step 4: Document local work and Vercel deployment**

In `README.md`, document Node 22.12+, `npm ci`, `npm run dev`, tests, the responsibilities of `company.ts` and `products.ts`, photo placement rules, and the requirement to verify claims before publishing. Document Vercel import of `az-6/CP-KLG`, framework preset Astro, build command `npm run build`, output directory `dist`, Node.js 22.x, and the production `SITE_URL` environment value when a custom domain is available.

- [ ] **Step 5: Verify the Git and deployment boundary**

Run: `git status --short`  
Expected: only intended CI/README/test changes are present before commit.

Run: `npm run build`  
Expected: clean `dist/` generation using the production URL resolution rules.

- [ ] **Step 6: Commit the release gates**

```bash
git add .github/workflows/ci.yml README.md tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
git commit -m "test: add release and Vercel deployment gates"
```

- [ ] **Step 7: Connect Vercel after owner approval**

Import `https://github.com/az-6/CP-KLG` in Vercel, enable Web Analytics, confirm Node.js 22.x, and deploy `main`. Verify the production deployment by opening all five routes, testing one generic and one product-specific WhatsApp CTA without sending the message, confirming the social preview, and checking that a page view reaches the Vercel Analytics dashboard.

## Final Acceptance Checklist

- [ ] All five Indonesian pages and the custom 404 are statically generated.
- [ ] Approved product data renders correctly and filters without requiring JavaScript for access.
- [ ] Every WhatsApp CTA uses the official number and correct meeting context.
- [ ] No price, live stock, unsupported export claim, or unapproved quantitative claim appears.
- [ ] Portrait photos remain sharp, undistorted, and meaningfully cropped at 360px, 768px, and 1440px.
- [ ] Unit, E2E, accessibility, type, and build checks pass.
- [ ] Canonical metadata, Open Graph metadata, robots policy, sitemap, and JSON-LD validate.
- [ ] Analytics failure never blocks WhatsApp navigation.
- [ ] GitHub CI passes and Vercel serves the production static deployment.
