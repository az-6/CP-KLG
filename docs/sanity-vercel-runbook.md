# Runbook Sanity ke Vercel

Dokumen ini menjelaskan konfigurasi produksi untuk website Astro statis. Setiap Publish/Unpublish di Sanity memicu build baru; deployment Vercel sebelumnya tetap aktif bila build baru gagal.

## 1. Prasyarat

- Repository terhubung ke Vercel dengan production branch `main`.
- Proyek Sanity dan dataset publik `production` sudah dibuat.
- Sanity Studio sudah dideploy pada domain terpisah dari website.
- Administrator memiliki akses ke pengaturan proyek Sanity dan Vercel.

## 2. Environment Vercel

Tambahkan variabel berikut untuk **Production** dan **Preview**:

```dotenv
PUBLIC_SANITY_PROJECT_ID=<project-id-asli-dari-Sanity-Manage>
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-09-04
SITE_URL=https://<domain-kanonis-produksi>
```

Salin project ID asli dari Sanity Manage dan domain kanonis dari Vercel. Nilai kosong, `test1234`, localhost, dan domain contoh dilarang di Production. Jangan menambahkan token tulis Sanity ke environment website.

## 3. Membuat Vercel Deploy Hook

1. Buka proyek Vercel → **Settings** → **Git** → **Deploy Hooks**.
2. Buat satu hook bernama `Sanity production`, pilih branch `main`, lalu salin URL satu kali.
3. Perlakukan URL tersebut seperti password karena siapa pun yang memilikinya dapat memicu deployment.
4. Simpan URL hanya sebagai target webhook di Sanity Manage. Jangan masukkan ke repository, `.env`, dokumentasi, screenshot, atau chat.
5. Jika URL bocor, hapus/revoke hook dan buat hook baru.

Referensi: [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks).

## 4. Membuat webhook Sanity

Di Sanity Manage buka proyek → **API** → **Webhooks**, lalu buat document webhook dengan pengaturan:

- Name: `Vercel production rebuild`
- URL: Vercel Deploy Hook rahasia
- Dataset: `production`
- Trigger: Create, Update, Delete
- HTTP method: `POST`
- Filter:

  ```groq
  _type in ["news","partner","productCategory","product","operationalMedia","credential","companyFact"]
  ```

- Projection:

  ```groq
  {_type, "id": _id}
  ```

- Drafts: disabled
- Versions/Content Releases: disabled
- Status: enabled

Draft dan version memang diabaikan secara default; jangan mengaktifkannya karena setiap penyimpanan editor dapat memicu build yang tidak diperlukan. Unpublish harus tetap memicu webhook melalui operasi delete pada dokumen publik.

Referensi: [Sanity GROQ-powered webhooks](https://www.sanity.io/docs/content-lake/webhooks) dan [webhook best practices](https://www.sanity.io/docs/content-lake/webhook-best-practices).

## 5. Verifikasi Publish → Deploy → Website

Lakukan setelah project ID, Studio publik, Vercel project, dan webhook asli tersedia:

1. Buat berita bernama `Test Integrasi Publish YYYY-MM-DD`, isi slug, ringkasan, cover, satu paragraf, alt text, dan aktifkan konten.
2. Catat waktu, lalu Publish satu kali.
3. Di Sanity webhook message/attempt log, pastikan satu delivery sukses.
4. Di Vercel Deployments, pastikan tepat satu deployment dari Deploy Hook dimulai dan selesai sukses.
5. Buka URL artikel. Periksa status 200, canonical yang benar, dan JSON-LD `NewsArticle`.
6. Catat deployment ID serta hasil.
7. Unpublish artikel sementara.
8. Pastikan satu deployment baru selesai dan URL artikel menghasilkan 404.
9. Hapus draft sementara jika masih tersisa.

### Catatan verifikasi nyata

Status: **Belum dilakukan**.

Alasan: project ID Sanity asli, URL Studio, Vercel project, Deploy Hook, dan akses akun belum tersedia pada sesi implementasi lokal. Jangan mengganti status ini tanpa bukti dari dashboard dan URL produksi.

| Pemeriksaan | Nilai |
| --- | --- |
| Tanggal/waktu Publish | Belum tersedia |
| Delivery webhook Publish | Belum tersedia |
| Vercel deployment ID Publish | Belum tersedia |
| URL artikel + canonical/JSON-LD | Belum tersedia |
| Tanggal/waktu Unpublish | Belum tersedia |
| Delivery webhook Unpublish | Belum tersedia |
| Vercel deployment ID Unpublish | Belum tersedia |
| Konfirmasi route terhapus | Belum tersedia |

## 6. Pemecahan masalah

- Tidak ada delivery webhook: periksa status hook, dataset, filter, serta bahwa dokumen benar-benar di-Publish/Unpublish dan bukan hanya disimpan sebagai draft.
- Delivery gagal: periksa attempt/message log Sanity dan pastikan URL hook belum dicabut.
- Delivery sukses tetapi tidak ada deployment: periksa Deploy Hook di Vercel dan koneksi repository/branch `main`.
- Build gagal: buka log build Vercel, perbaiki penyebabnya, lalu deploy ulang. Deployment produksi sebelumnya tetap melayani website.
- Build sukses tetapi konten tidak tampil: periksa `isActive`, status Publish, referensi kategori produk, environment project/dataset, dan URL kanonis.
