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
PUBLIC_COMPANY_EMAIL=
PUBLIC_COMPANY_ADDRESS=Muara Baru, Jakarta Utara
PUBLIC_OPERATING_HOURS=
PUBLIC_MAP_URL=
SITE_URL=https://domain-produksi-anda.example
```

Domain kanonis produksi adalah `https://katalislintasglobal.com` (apex, tanpa `www`). Nilai itu sudah menjadi cadangan di `astro.config.ts` untuk build dengan `VERCEL_ENV=production`, sehingga build produksi tidak pernah jatuh ke domain `*.vercel.app` meski `SITE_URL` lupa diisi. Untuk lokal isi `SITE_URL` dengan `http://localhost:4321`.

Nomor WhatsApp menggunakan format internasional berupa angka saja. Tautan WhatsApp ditampilkan tanpa nama kontak. Nomor resmi dan alamat Muara Baru sudah menjadi nilai bawaan. Environment variables dapat digunakan untuk menggantinya saat deployment. Biarkan email, jam operasional, dan URL peta kosong sampai data publiknya disetujui.

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

Panduan operasional:

- [Panduan editor Sanity](docs/sanity-editor-guide.md)
- [Runbook Sanity ke Vercel](docs/sanity-vercel-runbook.md)

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
5. Jadikan `katalislintasglobal.com` sebagai domain **Primary** dan `www.katalislintasglobal.com` sebagai **Redirect** ke apex, bukan sebaliknya. Canonical situs menunjuk apex, jadi arah redirect yang terbalik membuat kanonikalisasi bentrok.
6. Atur `SITE_URL=https://katalislintasglobal.com` (tanpa trailing slash), `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`, dan `PUBLIC_SANITY_API_VERSION=2026-09-04` untuk Production dan Preview. Jangan memakai ID pengujian atau domain contoh di Production.
7. Environment variable hanya dibaca saat build. Setelah mengubah `SITE_URL`, wajib redeploy — deployment lama tetap memakai nilai lama.
8. Aktifkan Vercel Web Analytics jika diperlukan.

## Google Search Console

Properti terdaftar sebagai **URL prefix** `https://katalislintasglobal.com`,
diverifikasi 16 September 2026 dengan metode **File HTML**.

Verifikasi dilakukan dari akun `zhafariaditya76@gmail.com`, dan akun
`zhafariaditya7@gmail.com` ditambahkan sebagai **Pemilik** terdelegasi pada
tanggal yang sama. Keduanya melihat properti yang sama. Perhatikan bahwa kedua
alamat hanya berbeda satu karakter; pastikan akun yang benar saat membuka
Search Console.

`public/google683bfbd009f7c223.html` adalah berkas verifikasi kepemilikan.
**Jangan dihapus, dipindahkan, atau diubah isinya.** Google memeriksanya ulang
secara berkala; bila berkas hilang, verifikasi dicabut dan akses ke data
Search Console ikut hilang.

Peta situs `https://katalislintasglobal.com/sitemap-index.xml` sudah dikirim
pada 16 September 2026.

Dua pemeriksaan berikut baru bisa dilakukan setelah Google menjemput dan
mengindeks, dan masih terbuka per 16 September 2026:

- Status peta situs berubah dari `Tidak dapat mengambil peta situs` menjadi
  berhasil dibaca dengan 7 halaman ditemukan. Peta situsnya sendiri sudah
  diverifikasi sehat: HTTP 200, `Content-Type: application/xml`, dan tetap 200
  saat diminta dengan user agent Googlebot.
- Laporan **Pengindeksan halaman** bebas dari `Alternate page with proper
  canonical tag` yang menunjuk ke `cp-klg.vercel.app`. Laporan ini masih
  berstatus memproses data pada hari pendaftaran.

Setiap pull request dapat menggunakan Preview Deployment. Branch `main` digunakan untuk deployment produksi.
Setelah Deploy Hook dan webhook dikonfigurasi sesuai runbook, Publish atau Unpublish di Sanity akan memicu rebuild otomatis; staf tidak perlu melakukan push Git untuk perubahan konten.
