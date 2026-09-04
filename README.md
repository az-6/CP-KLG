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
- Kategori dan produk publik dikelola melalui Sanity; fixture lokal hanya digunakan saat pengujian otomatis.
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

## Sanity CMS

Sanity Studio berada di folder `studio/` dan dideploy terpisah dari website. Tambahkan konfigurasi berikut ke `.env` lokal serta environment deployment yang sesuai:

```dotenv
PUBLIC_SANITY_PROJECT_ID=id-project-sanity
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-09-04
SANITY_STUDIO_PROJECT_ID=id-project-sanity
SANITY_STUDIO_DATASET=production
```

Jalankan Studio untuk penyuntingan konten:

```bash
npm run studio:dev
```

Validasi build Studio dengan:

```bash
npm run studio:build
```

Dataset `production` harus bersifat publik agar website statis dapat membaca konten tanpa token rahasia. `SANITY_DATA_MODE=fixture` hanya digunakan oleh pengujian browser otomatis dan tidak boleh diaktifkan pada deployment produksi.

> Semua aset dalam dataset Free bersifat publik; jangan unggah data pribadi, tanda tangan, kontrak, atau dokumen internal.

### Seed katalog awal yang disetujui

Script seed hanya membuat kategori serta draft Tuna dan Ikan Dasar. Script memakai `createIfNotExists`, sehingga dapat dijalankan ulang tanpa membuat duplikat atau menimpa perubahan editor. Produk tetap nonaktif dan belum dapat dipublikasikan sampai foto resmi ditambahkan serta seluruh isinya diperiksa.

1. Buat token Editor sementara di Sanity Manage.
2. Atur variabel hanya pada sesi PowerShell aktif:

   ```powershell
   $env:SANITY_STUDIO_PROJECT_ID='id-project-asli'
   $env:SANITY_STUDIO_DATASET='production'
   $env:SANITY_WRITE_TOKEN='token-sementara'
   npm --prefix studio run seed:approved
   ```

3. Jalankan perintah yang sama untuk kedua kali bila ingin memastikan tidak ada duplikat.
4. Periksa keempat dokumen di Studio, tambahkan foto resmi dan alt text, lalu terbitkan produk hanya setelah disetujui.
5. Hapus variabel lokal dan segera cabut token di Sanity Manage:

   ```powershell
   Remove-Item Env:SANITY_WRITE_TOKEN
   ```

Jangan simpan token tulis di `.env`, repository, screenshot terminal, atau platform hosting website.

## Deployment Vercel

1. Import repository `az-6/CP-KLG` di Vercel.
2. Gunakan framework preset **Astro**.
3. Gunakan build command `npm run build` dan output directory `dist`.
4. Pilih Node.js 22.x atau lebih baru.
5. Atur `SITE_URL` ke domain produksi. Tambahkan environment variables lain hanya bila ingin mengganti nilai resmi bawaan.
6. Aktifkan Vercel Web Analytics jika diperlukan.

Setiap pull request dapat menggunakan Preview Deployment. Branch `main` digunakan untuk deployment produksi.
