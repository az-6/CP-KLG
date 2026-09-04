# Sanity Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separately deployable Sanity Studio, validated schemas for all seven content groups, and typed read-only Astro infrastructure without changing public pages yet.

**Architecture:** `studio/` owns authoring schemas and deployment; `src/lib/sanity/` owns public read configuration and image URLs. Production builds require valid public Sanity configuration, while automated browser tests explicitly use deterministic fixtures.

**Tech Stack:** Astro 7, TypeScript, Sanity Studio, `@sanity/client`, `@sanity/image-url`, GROQ, Vitest

**Spec:** `docs/superpowers/specs/2026-09-04-sanity-content-platform-design.md`

## Global Constraints

- Node.js must remain `>=22.12.0`.
- Astro output remains static.
- Sanity Studio is deployed separately, never mounted at `/admin`.
- Production uses a public dataset and read-only unauthenticated queries; no write token enters Astro or browser output.
- Drafts and inactive documents never become public content.
- All public images require meaningful alt text.
- No Udang or Kakap seed documents are created.

---

### Task 1: Root dependencies and runtime configuration

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `vitest.config.ts`
- Create: `src/env.d.ts`
- Create: `src/lib/sanity/config.ts`
- Test: `tests/unit/sanity-config.test.ts`

**Interfaces:**
- Produces: `getSanityConfig(env): SanityRuntimeConfig`
- Produces: `isSanityFixtureMode(env): boolean`

- [ ] **Step 1: Write the failing configuration tests**

```ts
import { describe, expect, it } from 'vitest';
import { getSanityConfig, isSanityFixtureMode } from '../../src/lib/sanity/config';

describe('Sanity configuration', () => {
  it('requires project and dataset outside fixture mode', () => {
    expect(() => getSanityConfig({})).toThrow('PUBLIC_SANITY_PROJECT_ID');
  });

  it('returns explicit public configuration', () => {
    expect(getSanityConfig({
      PUBLIC_SANITY_PROJECT_ID: 'abc12345',
      PUBLIC_SANITY_DATASET: 'production',
      PUBLIC_SANITY_API_VERSION: '2026-09-04',
    })).toEqual({ projectId: 'abc12345', dataset: 'production', apiVersion: '2026-09-04' });
  });

  it('recognizes fixture mode only when explicitly enabled', () => {
    expect(isSanityFixtureMode({ SANITY_DATA_MODE: 'fixture' })).toBe(true);
    expect(isSanityFixtureMode({})).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/unit/sanity-config.test.ts`

Expected: FAIL because `src/lib/sanity/config.ts` does not exist.

- [ ] **Step 3: Install root packages and add scripts**

Run: `npm install @sanity/client @sanity/image-url @portabletext/types astro-portabletext groq`

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "studio:dev": "npm --prefix studio run dev",
    "studio:build": "npm --prefix studio run build",
    "check:all": "npm test && npm run build && npm run studio:build && npm run test:e2e"
  }
}
```

- [ ] **Step 4: Declare environment variables and implement validation**

Append to `.env.example`:

```dotenv
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-09-04
```

Add deterministic non-production values to `vitest.config.ts`:

```ts
export default defineConfig({
  test: { environment: 'node' },
  define: {
    'import.meta.env.PUBLIC_SANITY_PROJECT_ID': JSON.stringify('test1234'),
    'import.meta.env.PUBLIC_SANITY_DATASET': JSON.stringify('production'),
    'import.meta.env.PUBLIC_SANITY_API_VERSION': JSON.stringify('2026-09-04'),
  },
});
```

Create `src/env.d.ts`:

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
  readonly PUBLIC_SANITY_API_VERSION?: string;
  readonly SANITY_DATA_MODE?: 'fixture';
}

interface ImportMeta { readonly env: ImportMetaEnv; }
```

Create `src/lib/sanity/config.ts`:

```ts
export interface SanityRuntimeConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

type Env = Record<string, string | undefined>;

export const isSanityFixtureMode = (env: Env) => env.SANITY_DATA_MODE === 'fixture';

export function getSanityConfig(env: Env): SanityRuntimeConfig {
  const projectId = env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is required');
  return {
    projectId,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.PUBLIC_SANITY_API_VERSION || '2026-09-04',
  };
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- tests/unit/sanity-config.test.ts`

Expected: 3 tests PASS.

```powershell
git add package.json package-lock.json .env.example vitest.config.ts src/env.d.ts src/lib/sanity/config.ts tests/unit/sanity-config.test.ts
git commit -m "feat: add Sanity runtime foundation"
```

---

### Task 2: Sanity Studio shell and shared schema objects

**Files:**
- Create: `studio/package.json`
- Create: `studio/package-lock.json`
- Create: `studio/sanity.config.ts`
- Create: `studio/sanity.cli.ts`
- Create: `studio/tsconfig.json`
- Create: `studio/schemaTypes/objects/imageWithAlt.ts`
- Create: `studio/schemaTypes/objects/seoFields.ts`
- Create: `studio/schemaTypes/objects/portableContent.ts`
- Create: `studio/schemaTypes/index.ts`

**Interfaces:**
- Produces schema types: `imageWithAlt`, `seoFields`, `portableContent`
- Consumes environment: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`

- [ ] **Step 1: Scaffold the isolated Studio package**

Create `studio/package.json`:

```json
{
  "name": "pt-klg-sanity-studio",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "@sanity/vision": "latest",
    "@sanity/client": "latest",
    "react": "latest",
    "react-dom": "latest",
    "sanity": "latest",
    "styled-components": "latest"
  },
  "devDependencies": { "typescript": "latest" }
}
```

Run: `npm install --prefix studio`

- [ ] **Step 2: Create the Free Sanity project and add strict Studio configuration**

Sign in at Sanity Manage, create a project named `PT Katalis Lintas Global`, select the Free plan, and create a public dataset named `production`. Copy the generated project ID into local environment variables `SANITY_STUDIO_PROJECT_ID` and `PUBLIC_SANITY_PROJECT_ID`; set both dataset variables to `production`. Never commit the generated project ID as a hard-coded Studio default.

```ts
// studio/sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID is required');

export default defineConfig({
  name: 'default',
  title: 'PT Katalis Lintas Global',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

```ts
// studio/sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
```

- [ ] **Step 3: Define reusable image and SEO objects**

```ts
// studio/schemaTypes/objects/imageWithAlt.ts
import { defineField, defineType } from 'sanity';
export const imageWithAlt = defineType({
  name: 'imageWithAlt', title: 'Gambar', type: 'image', options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Teks alternatif', type: 'string', validation: r => r.required().min(5) }),
    defineField({ name: 'caption', title: 'Keterangan', type: 'string' }),
  ],
});
```

```ts
// studio/schemaTypes/objects/seoFields.ts
import { defineField, defineType } from 'sanity';
export const seoFields = defineType({
  name: 'seoFields', title: 'SEO', type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.max(60).warning('Usahakan maksimal 60 karakter') }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: r => r.max(160).warning('Usahakan maksimal 160 karakter') }),
    defineField({ name: 'socialImage', type: 'imageWithAlt' }),
  ],
});
```

```ts
// studio/schemaTypes/objects/portableContent.ts
import { defineArrayMember, defineType } from 'sanity';
export const portableContent = defineType({
  name: 'portableContent', title: 'Isi', type: 'array',
  of: [
    defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Subjudul', value: 'h2' }, { title: 'Sub-subjudul', value: 'h3' }] }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
  validation: r => r.required().min(1),
});
```

- [ ] **Step 4: Register objects and verify the Studio compiles**

```ts
// studio/schemaTypes/index.ts
import { imageWithAlt } from './objects/imageWithAlt';
import { portableContent } from './objects/portableContent';
import { seoFields } from './objects/seoFields';
export const schemaTypes = [imageWithAlt, portableContent, seoFields];
```

After loading `SANITY_STUDIO_PROJECT_ID` from the local environment, run: `npm run studio:build`

Expected: Studio build succeeds and emits no schema errors.

- [ ] **Step 5: Commit**

```powershell
git add studio package.json package-lock.json
git commit -m "feat: scaffold Sanity Studio"
```

---

### Task 3: Seven validated document schemas

**Files:**
- Create: `studio/schemaTypes/documents/news.ts`
- Create: `studio/schemaTypes/documents/partner.ts`
- Create: `studio/schemaTypes/documents/productCategory.ts`
- Create: `studio/schemaTypes/documents/product.ts`
- Create: `studio/schemaTypes/documents/operationalMedia.ts`
- Create: `studio/schemaTypes/documents/credential.ts`
- Create: `studio/schemaTypes/documents/companyFact.ts`
- Modify: `studio/schemaTypes/index.ts`

**Interfaces:**
- Produces document `_type` values: `news`, `partner`, `productCategory`, `product`, `operationalMedia`, `credential`, `companyFact`
- All displayable documents produce `isActive: boolean` and `order: number` where manual ordering applies.

- [ ] **Step 1: Add news and partner schemas**

```ts
// studio/schemaTypes/documents/news.ts
import { defineField, defineType } from 'sanity';
export const news = defineType({
  name: 'news', title: 'Berita', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required().min(5) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString(), validation: r => r.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: r => r.required().min(40).max(240) }),
    defineField({ name: 'coverImage', type: 'imageWithAlt', validation: r => r.required() }),
    defineField({ name: 'body', type: 'portableContent', validation: r => r.required() }),
    defineField({ name: 'seo', type: 'seoFields' }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

```ts
// studio/schemaTypes/documents/partner.ts
import { defineField, defineType } from 'sanity';
export const partner = defineType({
  name: 'partner', title: 'Mitra Kerja', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'logo', type: 'imageWithAlt', validation: r => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

- [ ] **Step 2: Add category and product schemas**

```ts
// studio/schemaTypes/documents/productCategory.ts
import { defineField, defineType } from 'sanity';
export const productCategory = defineType({
  name: 'productCategory', title: 'Kategori Produk', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name', maxLength: 80 }, validation: r => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

```ts
// studio/schemaTypes/documents/product.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
export const product = defineType({
  name: 'product', title: 'Produk', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'productCategory' }], options: { filter: 'isActive == true' }, validation: r => r.required() }),
    defineField({ name: 'scientificName', type: 'string' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: r => r.required().min(30).max(240) }),
    defineField({ name: 'description', type: 'portableContent', validation: r => r.required() }),
    defineField({ name: 'images', type: 'array', of: [defineArrayMember({ type: 'imageWithAlt' })], validation: r => r.required().min(1) }),
    ...['sizes', 'forms', 'condition', 'packaging'].map(name => defineField({ name, type: 'array', of: [defineArrayMember({ type: 'string' })] })),
    defineField({ name: 'volume', type: 'string' }),
    defineField({ name: 'availabilityStatus', type: 'string', options: { list: ['Tersedia berdasarkan konfirmasi', 'Musiman', 'Tidak ditampilkan'] }, initialValue: 'Tersedia berdasarkan konfirmasi', validation: r => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
    defineField({ name: 'seo', type: 'seoFields' }),
  ],
});
```

- [ ] **Step 3: Add operational evidence schemas**

```ts
// studio/schemaTypes/documents/operationalMedia.ts
import { defineField, defineType } from 'sanity';
export const operationalMedia = defineType({
  name: 'operationalMedia', title: 'Dokumentasi Operasional', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'image', type: 'imageWithAlt', validation: r => r.required() }),
    defineField({ name: 'documentationType', type: 'string', options: { list: ['process', 'facility', 'team', 'fleet', 'activity'] }, validation: r => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

```ts
// studio/schemaTypes/documents/credential.ts
import { defineField, defineType } from 'sanity';
export const credential = defineType({
  name: 'credential', title: 'Legalitas & Sertifikasi', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: r => r.required() }),
    defineField({ name: 'previewImage', type: 'imageWithAlt', validation: r => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

```ts
// studio/schemaTypes/documents/companyFact.ts
import { defineField, defineType } from 'sanity';
export const companyFact = defineType({
  name: 'companyFact', title: 'Fakta Perusahaan', type: 'document',
  fields: [
    defineField({ name: 'label', type: 'string', validation: r => r.required() }),
    defineField({ name: 'value', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({ name: 'placement', type: 'string', options: { list: [{ title: 'Beranda', value: 'home' }, { title: 'Tentang Kami', value: 'about' }] }, validation: r => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true, validation: r => r.required() }),
  ],
});
```

- [ ] **Step 4: Register every document and build Studio**

Update `schemaTypes` to include the three objects followed by all seven documents. Run:

Run: `npm run studio:build`

Expected: PASS with all seven document types registered and no schema validation error.

- [ ] **Step 5: Commit**

```powershell
git add studio/schemaTypes
git commit -m "feat: define Sanity content schemas"
```

---

### Task 4: Typed frontend client and responsive Sanity images

**Files:**
- Create: `src/types/sanity.ts`
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/image.ts`
- Create: `src/components/SanityImage.astro`
- Test: `tests/unit/sanity-image.test.ts`

**Interfaces:**
- Produces: `sanityClient`
- Produces: `getSanityImageSet(image, widths): { src; srcset }`
- Produces component: `<SanityImage image alt widths sizes loading class />`

- [ ] **Step 1: Write failing image helper tests**

```ts
import { expect, it } from 'vitest';
import { getSanityImageSet } from '../../src/lib/sanity/image';

it('creates encoded responsive image widths', () => {
  const set = getSanityImageSet({ asset: { _ref: 'image-abc-1200x800-jpg', _type: 'reference' } }, [400, 800]);
  expect(set.src).toContain('w=800');
  expect(set.srcset).toContain('w=400');
  expect(set.srcset).toContain('400w');
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- tests/unit/sanity-image.test.ts`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Define frontend types and client**

Define `SanityImage`, `SeoFields`, `NewsDocument`, `PartnerDocument`, `ProductCategoryDocument`, `ProductDocument`, `OperationalMediaDocument`, `CredentialDocument`, and `CompanyFactDocument` in `src/types/sanity.ts`. Use `_id: string`, slug strings projected by GROQ, `PortableTextBlock[]` for rich text, and literal unions matching schema list values.

```ts
import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  asset: { _ref: string; _type: 'reference' };
  alt: string;
  caption?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
}
export interface SeoFields { title?: string; description?: string; socialImage?: SanityImage }
export interface ProductCategoryDocument { _id: string; name: string; slug: string; description?: string; order: number; isActive: boolean }
export interface ProductDocument {
  _id: string; name: string; slug: string; categoryId: string; categoryName: string; categorySlug: string;
  scientificName?: string; excerpt: string; description: PortableTextBlock[]; images: SanityImage[];
  sizes?: string[]; forms?: string[]; condition?: string[]; packaging?: string[]; volume?: string;
  availabilityStatus: 'Tersedia berdasarkan konfirmasi' | 'Musiman' | 'Tidak ditampilkan';
  order: number; isActive: boolean; seo?: SeoFields;
}
export interface NewsDocument {
  _id: string; title: string; slug: string; publishedAt: string; _updatedAt: string; excerpt: string;
  coverImage: SanityImage; body: PortableTextBlock[]; seo?: SeoFields; isActive: boolean;
}
export interface PartnerDocument { _id: string; name: string; logo: SanityImage; order: number; isActive: boolean }
export type DocumentationType = 'process' | 'facility' | 'team' | 'fleet' | 'activity';
export interface OperationalMediaDocument { _id: string; title: string; image: SanityImage; documentationType: DocumentationType; order: number; isActive: boolean }
export interface CredentialDocument { _id: string; name: string; description: string; previewImage: SanityImage; order: number; isActive: boolean }
export interface CompanyFactDocument { _id: string; label: string; value: string; description?: string; placement: 'home' | 'about'; order: number; isActive: boolean }
```

```ts
// src/lib/sanity/client.ts
import { createClient } from '@sanity/client';
import { getSanityConfig } from './config';
const config = getSanityConfig(import.meta.env);
export const sanityClient = createClient({ ...config, useCdn: false, perspective: 'published' });
```

- [ ] **Step 4: Implement image builder and component**

```ts
// src/lib/sanity/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
const builder = createImageUrlBuilder(sanityClient);

type SanityImageSource = Parameters<typeof builder.image>[0];

export function getSanityImageSet(image: SanityImageSource, widths = [480, 768, 1200]) {
  const urls = widths.map(width => ({ width, url: builder.image(image).width(width).auto('format').fit('max').url() }));
  return { src: urls.at(-1)!.url, srcset: urls.map(item => `${item.url} ${item.width}w`).join(', ') };
}
```

`SanityImage.astro` must render a real `<img>` with `src`, `srcset`, `sizes`, `alt`, `width`, `height`, `loading`, and `decoding="async"`; callers must pass explicit display dimensions.

- [ ] **Step 5: Run GREEN, check, and commit**

Run: `npm test -- tests/unit/sanity-image.test.ts && npm run check`

Expected: PASS with zero Astro diagnostics.

```powershell
git add src/types/sanity.ts src/lib/sanity src/components/SanityImage.astro tests/unit/sanity-image.test.ts
git commit -m "feat: add typed Sanity frontend client"
```

---

### Task 5: Deterministic fixture mode and foundation verification

**Files:**
- Create: `src/data/sanity-fixtures.ts`
- Modify: `playwright.config.ts`
- Modify: `README.md`
- Test: `tests/unit/sanity-fixtures.test.ts`

**Interfaces:**
- Produces: `sanityFixtures` containing at least one valid document per type.
- E2E contract: `SANITY_DATA_MODE=fixture` is set only by Playwright/local test commands.

- [ ] **Step 1: Add a fixture validity test**

```ts
import { expect, it } from 'vitest';
import { sanityFixtures } from '../../src/data/sanity-fixtures';

it('contains only approved initial product names', () => {
  expect(sanityFixtures.products.map(item => item.name)).toEqual(['Tuna', 'Ikan Dasar']);
  expect(JSON.stringify(sanityFixtures)).not.toMatch(/Udang|Kakap/);
});
```

- [ ] **Step 2: Run RED, then add complete typed fixtures**

Run: `npm test -- tests/unit/sanity-fixtures.test.ts`

Expected: FAIL because the fixture module does not exist.

Create typed fixture arrays for Tuna, Ikan Dasar, one category per product, one news item, one partner, one item for each operational media type, one credential, and home/about facts. Use Sanity test image references and never claim a real certificate, capacity, or partner; fixture labels must begin with `Test` so they cannot be mistaken for approved production facts.

- [ ] **Step 3: Isolate fixture mode to automated browser tests**

Add to `playwright.config.ts` web server environment:

```ts
SANITY_DATA_MODE: 'fixture',
PUBLIC_SANITY_PROJECT_ID: 'test1234',
PUBLIC_SANITY_DATASET: 'production',
PUBLIC_SANITY_API_VERSION: '2026-09-04',
```

- [ ] **Step 4: Document local setup and public-dataset warning**

Update `README.md` with exact commands `npm run studio:dev`, `npm run studio:build`, the required environment names, and this warning: “Semua aset dalam dataset Free bersifat publik; jangan unggah data pribadi, tanda tangan, kontrak, atau dokumen internal.”

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run check`

Expected: all unit tests PASS and Astro reports zero errors.

```powershell
git add src/data/sanity-fixtures.ts playwright.config.ts README.md tests/unit/sanity-fixtures.test.ts
git commit -m "test: add deterministic Sanity fixtures"
```

**Foundation exit gate:** `npm test`, `npm run check`, and `npm run studio:build` pass with configured Studio project ID. No public page depends on Sanity yet.
