# PT Katalis Lintas Global — Company Profile

Website company profile B2B statis untuk PT Katalis Lintas Global. Dibangun menggunakan Astro 7 dan TypeScript, dengan fokus pada kecepatan, aksesibilitas, SEO, serta konversi pertemuan bisnis melalui WhatsApp.

## Menjalankan proyek

Persyaratan: Node.js 22.12 atau versi lebih baru.

```bash
npm ci
npm run dev
```

Perintah verifikasi:

```bash
npm audit
npm test
npm run check
npm run build
npm run test:e2e
```

## Konten perusahaan

- `src/data/company.ts` menyimpan identitas, pesan utama, bukti, proses, dan informasi kontak.
- `src/data/products.ts` menyimpan katalog produk yang sudah disetujui.
- `src/assets/` digunakan untuk foto produk, fasilitas, proses, tim, dan dokumen publik.
- Jangan menambahkan klaim, kapasitas, sertifikasi, nama ilmiah, atau wilayah distribusi yang belum disetujui perusahaan.

Salin `.env.example` menjadi `.env` untuk pengembangan lokal dan isi nilai resmi:

```dotenv
PUBLIC_WHATSAPP_NUMBER=628123456789
PUBLIC_COMPANY_EMAIL=contact@example.com
PUBLIC_COMPANY_ADDRESS=Alamat perusahaan yang disetujui untuk publikasi
PUBLIC_OPERATING_HOURS=Senin-Jumat 08.00-17.00 WIB
PUBLIC_MAP_URL=https://maps.google.com/
SITE_URL=https://example.com
```

Nomor WhatsApp menggunakan format internasional berupa angka saja. Bila belum dikonfigurasi, website mengarahkan CTA ke bagian kontak dan tidak membuat nomor palsu.

## Deployment Vercel

1. Import repository `az-6/CP-KLG` di Vercel.
2. Gunakan framework preset **Astro**.
3. Gunakan build command `npm run build` dan output directory `dist`.
4. Pilih Node.js 22.x atau lebih baru.
5. Tambahkan environment variables resmi dari `.env.example`.
6. Aktifkan Vercel Web Analytics jika diperlukan.

Setiap pull request dapat menggunakan Preview Deployment. Branch `main` digunakan untuk deployment produksi.
