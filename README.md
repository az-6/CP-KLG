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
- `src/data/products.ts` menyimpan kategori utama dan contoh katalog; item placeholder harus memakai `isPlaceholder: true`.
- `src/assets/` digunakan untuk foto produk, fasilitas, proses, tim, dan dokumen publik.
- Jangan menambahkan klaim, kapasitas, sertifikasi, nama ilmiah, atau wilayah distribusi yang belum disetujui perusahaan.

Salin `.env.example` menjadi `.env` untuk pengembangan lokal dan isi nilai resmi:

```dotenv
PUBLIC_WHATSAPP_NUMBER=6281319426006
PUBLIC_WHATSAPP_CONTACT=Zuhud
PUBLIC_SECONDARY_WHATSAPP_NUMBER=628151931083
PUBLIC_SECONDARY_WHATSAPP_CONTACT=Hanggi
PUBLIC_COMPANY_EMAIL=
PUBLIC_COMPANY_ADDRESS=Muara Baru, Jakarta Utara
PUBLIC_OPERATING_HOURS=
PUBLIC_MAP_URL=
SITE_URL=https://domain-produksi-anda.example
```

Nomor WhatsApp menggunakan format internasional berupa angka saja. Kontak Zuhud, Hanggi, dan alamat Muara Baru sudah menjadi nilai resmi bawaan. Environment variables dapat digunakan untuk menggantinya saat deployment. Biarkan email, jam operasional, dan URL peta kosong sampai data publiknya disetujui.

## Deployment Vercel

1. Import repository `az-6/CP-KLG` di Vercel.
2. Gunakan framework preset **Astro**.
3. Gunakan build command `npm run build` dan output directory `dist`.
4. Pilih Node.js 22.x atau lebih baru.
5. Atur `SITE_URL` ke domain produksi. Tambahkan environment variables lain hanya bila ingin mengganti nilai resmi bawaan.
6. Aktifkan Vercel Web Analytics jika diperlukan.

Setiap pull request dapat menggunakan Preview Deployment. Branch `main` digunakan untuk deployment produksi.
