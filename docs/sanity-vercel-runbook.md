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
SITE_URL=https://katalislintasglobal.com
```

Salin project ID asli dari Sanity Manage. Domain kanonis produksi adalah apex `https://katalislintasglobal.com`, tanpa `www` dan tanpa trailing slash; `www` diset sebagai Redirect ke apex di Vercel Settings → Domains. Nilai kosong, `test1234`, localhost, dan domain contoh dilarang di Production. Jangan menambahkan token tulis Sanity ke environment website.

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

Status: **Terbukti aktif** (diverifikasi 16 September 2026).

Bukti diambil dari attempt log webhook Sanity
(`Webhooks` → `Vercel Production Deploy` → `Show attempt log`, hook id
`7esFc4YQk3KEX1sm`) dan dicocokkan ke Vercel Deployments lewat job id yang
dikembalikan Vercel pada body respons tiap attempt.

Delapan attempt tercatat, seluruhnya `isFailure: false` dengan `resultCode: 201`,
dan masing-masing menghasilkan tepat satu deployment produksi bertanda
`deployHookName: "Sanity Production"` kurang dari dua detik sesudahnya.

| Attempt webhook (WIB) | Jeda ke deployment | Vercel deployment ID |
| --- | --- | --- |
| 4 Sep 2026 19:12:52 | 0,90 detik | `dpl_4SLwebVmNZ1EjpEz8tt8p8fWViFt` |
| 4 Sep 2026 19:12:56 | 1,56 detik | `dpl_A6SKC59tUkprF1VdbSzCQMPpeQqG` |
| 4 Sep 2026 19:14:57 | 1,37 detik | `dpl_2ehGwqWTFRPLWyjhKphcQLjnJXfo` |
| 4 Sep 2026 19:15:55 | 0,97 detik | `dpl_3B5tsarwYUpFkrW62bEgN5KCm26U` |
| 9 Sep 2026 20:38:23 | 1,00 detik | `dpl_DxSvoRPaGS9oJPnvqpWzrucrgY3W` |
| 9 Sep 2026 20:42:34 | 0,76 detik | `dpl_C8sryZPavy7hzD8RTNh6g14TYmv5` |
| 9 Sep 2026 20:43:07 | 0,82 detik | `dpl_2y6Jd5q2Bob5fqdfpr2HjDaWTDvq` |
| 9 Sep 2026 20:46:05 | 0,92 detik | `dpl_3Qe9a9o7GCQYmQHgt8BFxgZkrK2F` |

Konfigurasi webhook saat verifikasi: dataset `production`, status `Enabled`,
target Vercel Deploy Hook `Sanity Production` pada project `cp-klg`
(`prj_ioV3T7f0iufbPpQzLeNOdOEZEjVn`). URL hook sengaja tidak dicatat di sini.

Yang **belum** diverifikasi, dan masih perlu dijalankan sesuai Bagian 5 bila
dibutuhkan bukti penuh:

- Publish terkendali dengan artikel uji bernama, beserta pencatatan canonical
  dan JSON-LD `NewsArticle` pada URL artikelnya.
- Jalur Unpublish → deployment baru → URL artikel menghasilkan 404.

Attempt log Sanity menyimpan riwayat terbatas, jadi salin bukti ke tabel ini
setiap kali verifikasi diulang. Jangan mengganti status di atas tanpa bukti
dari dashboard dan URL produksi.

## 6. Pemecahan masalah

- Tidak ada delivery webhook: periksa status hook, dataset, filter, serta bahwa dokumen benar-benar di-Publish/Unpublish dan bukan hanya disimpan sebagai draft.
- Delivery gagal: periksa attempt/message log Sanity dan pastikan URL hook belum dicabut.
- Delivery sukses tetapi tidak ada deployment: periksa Deploy Hook di Vercel dan koneksi repository/branch `main`.
- Build gagal: buka log build Vercel, perbaiki penyebabnya, lalu deploy ulang. Deployment produksi sebelumnya tetap melayani website.
- Build sukses tetapi konten tidak tampil: periksa `isActive`, status Publish, referensi kategori produk, environment project/dataset, dan URL kanonis.
