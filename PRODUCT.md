# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: distributors and large-scale traders (pedagang besar) in Indonesia who buy fish in tonnage. They arrive mostly on a phone, often from a link shared in WhatsApp, and they are deciding whether PT Katalis Lintas Global is a credible, consistent supplier worth a business meeting. They need certainty about consistency of quality, supply capability, size or grade, product form, packaging, cold chain, and whether the supplier follows buyer specifications.

Secondary (confirmed 2026-10-24): English-reading visitors. The English version exists for general credibility, not for a specific export or foreign-buyer target.

## Product Purpose

A B2B company profile for PT Katalis Lintas Global, a supplier of tuna and various demersal fish (ikan dasar). The site builds trust before a business conversation and moves a qualified buyer to request a meeting over WhatsApp. Success is the number of qualified buyers who tap "Jadwalkan Pertemuan" and ask for a meeting. No transactions, prices, or real-time stock.

## Positioning

A fish supplier for distributors and wholesalers whose promise is consistent quality, hygienic handling, and specifications that follow the buyer. Slogan: "Kualitas Terjaga, Spesifikasi Anda." Operates from Muara Baru, Jakarta Utara, with branches in Padang, Kupang, Bitung, Manokwari, and Jayapura.

## Operating Context

- Buyers evaluate the supplier before a meeting; the meeting is requested through WhatsApp with a prefilled introduction message (general and per-product templates in `src/lib/whatsapp.ts`).
- Content is edited by staff in Sanity Studio (`studio/`): products, categories, news, partners, company facts, credentials, operational media. Publishing in Sanity triggers a Vercel rebuild.
- The site is static Astro 7 + TypeScript on Vercel, canonical domain `https://katalislintasglobal.com`.

## Capabilities and Constraints

- Pages: Beranda, Produk (+ detail), Mutu & Proses, Tentang Kami, Berita (+ detail), Hubungi Kami, 404.
- Languages (confirmed 2026-10-24, extended 2026-10-27): Indonesian is primary; the whole site has an English version under /en/, including products and news. Sanity documents carry an optional "English" group (plus altEn/captionEn on images); empty English fields fall back to Indonesian text.
- Branch locations (confirmed 2026-10-24): Padang, Kupang, Bitung, Manokwari, Jayapura. Head office: Muara Baru, Jakarta Utara (labelled "Kantor pusat" on 2026-10-27 when the owner asked for a shorter address wording; the head-office role is inferred, not yet explicitly confirmed). The site should show these on a map of Indonesia. The role of each location (office, cold storage, receiving point, etc.) is **undecided**; do not label roles until the company confirms them.
- Home hero (owner's decision, 2026-10-24): text only for now; the owner plans to use a video there later. No product photo in the hero.
- No prices, stock, accounts, forms, or chat other than WhatsApp.
- Optional sections (facts, partners, news, credentials, media) render only when Sanity has approved content.
- Mobile-first; must work without JavaScript for core content and navigation.

## Brand Commitments

- The existing KLG logo (`src/assets/logo-klg-transparent.png`, mark `src/assets/logo-mark-transparent.png`: globe with airplane, blue) is used as-is.
- The palette stays rooted in the logo's blue.
- Everything else about the current visual identity is not binding (confirmed 2026-10-24).
- Copy must not read as AI-generated: no em dashes (—) in visible copy, no generic marketing filler. Owner's stated problems with the current site: generic/template look, not convincing to buyers, hero especially generic.

## Evidence on Hand

- Logo files above; two phone photos of a tuna loin (`src/assets/tuna-loin-1.jpeg` portrait, `tuna-loin-2.jpeg` landscape).
- Company data in `src/data/company.ts`: established 2020, WhatsApp 6281319426006, address Muara Baru, Jakarta Utara, three proofs, five process steps.
- Sanity may hold approved facts, partners, credentials, operational media, and news; production content varies.
- Absent and not to be fabricated: certifications, capacity figures, distribution reach, scientific names, email, operating hours, testimonials, customer names, photos of facilities or branches. Do not add claims, capacities, certifications, or regions the company has not approved.

## Product Principles

1. Prove, don't claim: every main promise sits beside the operational evidence that supports it.
2. The meeting request is the one action; it appears on every page but never ahead of the evidence.
3. Real over decorative: the company's own photos, locations, and process outrank stock imagery and ornament.
4. Facts only: an unapproved number or certification is omitted, never invented.
5. Built for a phone opened from WhatsApp, fast on mobile networks.

## Accessibility & Inclusion

Visible keyboard focus, adequate contrast, comfortable touch targets, meaningful alt text, reduced-motion respect, and core content without JavaScript (existing axe-core e2e suite in `tests/e2e/accessibility.spec.ts`).
