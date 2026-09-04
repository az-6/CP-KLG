# Sanity Evidence and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place operational media, public credential previews, and approved company facts contextually, seed approved products, and complete secure Sanity-to-Vercel operations.

**Architecture:** One evidence repository groups active documents by controlled placement/type. Pages render optional accessible sections; a repeatable seed script creates only approved initial catalog records, and operations documentation defines the external deployment hook and verification workflow.

**Tech Stack:** Astro 7, Sanity Client, Sanity Image CDN, Vitest, Playwright, Vercel Deploy Hooks

**Spec:** `docs/superpowers/specs/2026-09-04-sanity-content-platform-design.md`

## Global Constraints

- Complete the foundation, product, and news/partners plans first.
- Dataset assets are public; never upload signatures, personal data, contracts, or internal documents.
- Credential content has image preview only—no PDF, download button, or file field.
- Operational media has no standalone gallery page.
- Build failures leave the previous Vercel deployment active.

---

### Task 1: Evidence repository grouped by page context

**Files:**
- Create: `src/lib/sanity/evidence-repository.ts`
- Test: `tests/unit/evidence-repository.test.ts`

**Interfaces:**
- Produces: `getHomeFacts(): Promise<CompanyFactDocument[]>`
- Produces: `getAboutEvidence(): Promise<{ facts; team; fleet; activities; credentials }>`
- Produces: `getProcessEvidence(): Promise<{ process; facilities }>`

- [ ] **Step 1: Write failing grouping tests**

```ts
it('groups only active evidence by controlled placement', () => {
  const grouped = groupEvidence(fixtures);
  expect(grouped.homeFacts.every(item => item.placement === 'home')).toBe(true);
  expect(grouped.about.team.every(item => item.documentationType === 'team')).toBe(true);
  expect(grouped.about.activities.every(item => item.documentationType === 'activity')).toBe(true);
  expect(grouped.process.facilities.every(item => item.documentationType === 'facility')).toBe(true);
  expect(JSON.stringify(grouped)).not.toContain('inactive-test-item');
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- tests/unit/evidence-repository.test.ts`

Expected: FAIL because repository is missing.

- [ ] **Step 3: Implement narrow queries and grouping**

```ts
export const EVIDENCE_QUERY = groq`{
  "facts": *[_type == "companyFact" && isActive == true] | order(order asc,label asc){_id,label,value,description,placement,order,isActive},
  "media": *[_type == "operationalMedia" && isActive == true] | order(order asc,title asc){_id,title,image,documentationType,order,isActive},
  "credentials": *[_type == "credential" && isActive == true] | order(order asc,name asc){_id,name,description,previewImage,order,isActive}
}`;
```

`groupEvidence` filters again defensively, sorts by order, maps `team`/`fleet`/`activity` to About and `process`/`facility` to Mutu & Proses.

- [ ] **Step 4: Run GREEN and commit**

Run: `npm test -- tests/unit/evidence-repository.test.ts`

```powershell
git add src/lib/sanity/evidence-repository.ts tests/unit/evidence-repository.test.ts
git commit -m "feat: query contextual company evidence"
```

---

### Task 2: Facts and operational galleries

**Files:**
- Create: `src/components/CompanyFacts.astro`
- Create: `src/components/MediaGallery.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/mutu-proses.astro`
- Modify: `src/pages/tentang-kami.astro`
- Test: `tests/e2e/evidence.spec.ts`

**Interfaces:**
- `CompanyFacts` props: `{ facts: CompanyFactDocument[]; label: string }`
- `MediaGallery` props: `{ items: OperationalMediaDocument[]; label: string }`

- [ ] **Step 1: Write failing contextual placement test**

```ts
test('evidence appears only on its intended page', async ({ page }) => {
  await page.goto('/mutu-proses');
  await expect(page.getByRole('region', { name: 'Dokumentasi proses dan fasilitas' })).toBeVisible();
  await expect(page.getByAltText('Test foto tim')).toHaveCount(0);
  await page.goto('/tentang-kami');
  await expect(page.getByAltText('Test foto tim')).toBeVisible();
  await expect(page.getByText('Test fakta Tentang Kami')).toBeVisible();
});
```

- [ ] **Step 2: Run RED, then implement components and page queries**

Run: `npm run test:e2e -- tests/e2e/evidence.spec.ts`

Expected: FAIL because evidence sections do not exist.

Use `SanityImage` for every gallery item. Render figure/caption only when caption exists. On Beranda remove the hard-coded `trustFacts` array and render `CompanyFacts` only when valid home facts exist. On About render facts/team/fleet/activity; on Process render process/facility. Entire optional sections, including the home facts strip, disappear for empty arrays.

- [ ] **Step 3: Run GREEN, responsive and accessibility checks**

Run: `npm run test:e2e -- tests/e2e/evidence.spec.ts tests/e2e/responsive.spec.ts tests/e2e/accessibility.spec.ts`

Expected: contextual, mobile, keyboard, and serious-axe checks PASS.

- [ ] **Step 4: Commit**

```powershell
git add src/components/CompanyFacts.astro src/components/MediaGallery.astro src/pages/index.astro src/pages/mutu-proses.astro src/pages/tentang-kami.astro tests/e2e/evidence.spec.ts
git commit -m "feat: show contextual company evidence"
```

---

### Task 3: Accessible credential previews without downloads

**Files:**
- Create: `src/components/CredentialGallery.astro`
- Modify: `src/pages/tentang-kami.astro`
- Modify: `tests/e2e/evidence.spec.ts`

**Interfaces:**
- `CredentialGallery` props: `{ credentials: CredentialDocument[] }`
- Dialog contract: native `<dialog>` with open button per credential and close button inside.

- [ ] **Step 1: Add failing interaction and privacy-shape test**

```ts
test('credential preview opens accessibly and exposes no downloads', async ({ page }) => {
  await page.goto('/tentang-kami');
  await page.getByRole('button', { name: /Perbesar Test legalitas/i }).click();
  await expect(page.getByRole('dialog', { name: 'Test legalitas' })).toBeVisible();
  await expect(page.locator('a[download], a[href$=".pdf"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Tutup pratinjau' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
```

- [ ] **Step 2: Run RED, implement native dialog behavior, run GREEN**

Run: `npm run test:e2e -- tests/e2e/evidence.spec.ts`

Expected before implementation: FAIL due to missing dialog.

Each card renders name, description, preview image, and a button. The dialog uses `showModal()`, closes on its explicit button and `cancel`, restores focus to the opener, and contains no anchor or file URL.

Run again; expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add src/components/CredentialGallery.astro src/pages/tentang-kami.astro tests/e2e/evidence.spec.ts
git commit -m "feat: add accessible credential previews"
```

---

### Task 4: Idempotent approved-content seed script

**Files:**
- Create: `studio/scripts/seed-approved-content.mjs`
- Modify: `studio/package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_WRITE_TOKEN`
- Produces deterministic IDs: `product-category-tuna`, `product-category-ikan-dasar`, `product-tuna`, `product-ikan-dasar`

- [ ] **Step 1: Add seed script command**

```json
"seed:approved": "node scripts/seed-approved-content.mjs"
```

- [ ] **Step 2: Implement idempotent transactions**

```js
import { createClient } from '@sanity/client';
const required = ['SANITY_STUDIO_PROJECT_ID', 'SANITY_WRITE_TOKEN'];
for (const key of required) if (!process.env[key]) throw new Error(`${key} is required`);
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-09-04',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
```

Use `createIfNotExists` for published category IDs `product-category-tuna` and `product-category-ikan-dasar`, plus draft product IDs `drafts.product-tuna` and `drafts.product-ikan-dasar`. Use exactly these approved excerpts: “Pilihan tuna untuk kebutuhan pasokan distributor dan pedagang besar.” and “Beragam ikan dasar untuk kebutuhan perdagangan dalam volume besar.” Represent each description as one Portable Text paragraph containing the same approved sentence. Set product `isActive: false`; leave `images` empty so Studio requires approved photography before publication. Do not create any other product, partner, legal, capacity, or certificate record.

- [ ] **Step 3: Document safe execution and run once against the project**

Document token creation, temporary PowerShell environment variables, `npm --prefix studio run seed:approved`, post-run Studio review, and immediate token revocation. Never write the token into `.env.example`, git, terminal screenshots, or logs.

Expected first run: four documents created. Expected second run: no duplicates and existing editor changes preserved.

- [ ] **Step 4: Commit script and documentation**

```powershell
git add studio/scripts/seed-approved-content.mjs studio/package.json studio/package-lock.json README.md
git commit -m "feat: seed approved Sanity catalog"
```

---

### Task 5: Sanity-to-Vercel deployment operations

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Create: `docs/sanity-editor-guide.md`
- Create: `docs/sanity-vercel-runbook.md`

**Interfaces:**
- Sanity webhook filter: `_type in ["news","partner","productCategory","product","operationalMedia","credential","companyFact"]`
- Webhook target: Vercel Deploy Hook stored only in Sanity Manage.

- [ ] **Step 1: Document exact Vercel configuration**

In the runbook require these Production and Preview variables:

The runbook must list `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`, `PUBLIC_SANITY_API_VERSION=2026-09-04`, and `SITE_URL`, then instruct the deployer to copy the real Sanity project ID and canonical production URL from their respective dashboards. Empty or example-domain values are forbidden in Production.

Explain how to create one Vercel Deploy Hook for `main`, copy it once, and treat the URL as a secret.

- [ ] **Step 2: Document exact Sanity webhook configuration**

Use the document filter above, projection `{_type, "id": _id}`, POST method, drafts/versions disabled, and the Vercel Deploy Hook as target. Explain that draft edits must not trigger the hook.

- [ ] **Step 3: Write the Indonesian staff guide**

Cover login, draft creation, slug generation, image upload, alt text examples, public-data warning, Publish, expected deployment wait, checking the public URL, unpublishing, and whom to contact when deployment fails. Use screenshots only after the real Studio is available; until then, use numbered UI labels rather than fabricated images.

- [ ] **Step 4: Perform one real publish verification**

Create a clearly labeled temporary test news item, publish it, confirm exactly one Vercel deployment starts, confirm the article becomes available with canonical/JSON-LD, then unpublish it and confirm the next deployment removes the route. Record date, deployment IDs, and outcome in the runbook; do not retain the temporary article.

- [ ] **Step 5: Commit operational documentation**

```powershell
git add README.md .env.example docs/sanity-editor-guide.md docs/sanity-vercel-runbook.md
git commit -m "docs: add Sanity publishing operations"
```

---

### Task 6: Final quality and security gate

**Files:**
- Modify as failures require: only files already owned by the four implementation plans

- [ ] **Step 1: Scan for secrets and prohibited content**

Run:

```powershell
rg -n "SANITY_WRITE_TOKEN|api\.vercel\.com/v1/integrations/deploy|BEGIN PRIVATE|Udang|Kakap" . -g '!node_modules/**' -g '!dist/**' -g '!.git/**'
```

Expected: no secret values or deploy-hook URL; Udang/Kakap may appear only in specs/plans/tests asserting their absence, never in production data or rendered fixtures.

- [ ] **Step 2: Run complete automated verification**

Run: `npm test && npm run build && npm run studio:build && npm run test:e2e`

Expected: every command exits 0; Astro check has zero errors; all unit/E2E/axe tests pass.

- [ ] **Step 3: Verify generated routes and sitemap**

Confirm `dist/berita/test-berita/index.html`, `dist/produk/tuna/index.html`, and `dist/produk/ikan-dasar/index.html` exist in fixture build; confirm no `dist/produk/udang` or `dist/produk/kakap`; inspect sitemap for active news/products only.

- [ ] **Step 4: Manual responsive and keyboard acceptance**

At 360 px, 768 px, and 1440 px, inspect Beranda, Produk, one product detail, Berita, one news detail, Mutu & Proses, and Tentang Kami. Keyboard-test header navigation, category filters, all links, WhatsApp CTA, and credential dialog including Escape/focus restoration.

- [ ] **Step 5: Record the verification handoff**

Do not mutate or commit files in this verification task. If a check fails, return to the task that owns the failing file, add a regression test there, fix it, rerun that task's gate, and commit from that owning task. Record the exact passing command counts and manual verification outcome in the final handoff.
