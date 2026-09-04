# Sanity Content Platform untuk Website PT Katalis Lintas Global

**Tanggal:** 4 September 2026  
**Status:** Disetujui dalam sesi desain; menunggu tinjauan dokumen oleh pengguna

## 1. Ringkasan

Website PT Katalis Lintas Global tetap menjadi company profile B2B. Sanity ditambahkan sebagai pusat pengelolaan konten yang dapat berubah agar staf nonteknis dapat memperbarui bukti aktivitas dan kredibilitas perusahaan tanpa menyunting kode.

Konten yang dikelola melalui Sanity mencakup berita, mitra kerja, kategori produk, produk, dokumentasi operasional, legalitas dan sertifikasi, serta fakta perusahaan. Struktur halaman, desain, logika teknis, profil inti, kontak, dan template WhatsApp tetap dikelola di dalam kode.

Website Astro tetap menggunakan static rendering. Saat staf memublikasikan konten di Sanity, webhook memicu Vercel Deploy Hook. Vercel kemudian membangun dan menerbitkan versi statis terbaru tanpa commit baru ke GitHub.

## 2. Tujuan

- Menunjukkan bahwa perusahaan aktif melalui berita dan dokumentasi kegiatan terbaru.
- Memungkinkan staf biasa mengelola konten publik melalui dashboard tanpa menyentuh repository.
- Menjadikan foto produk, proses, fasilitas, tim, armada, legalitas, dan mitra sebagai bukti kredibilitas yang kontekstual.
- Mengembangkan katalog tanpa perubahan kode, termasuk penambahan kategori dan halaman detail produk.
- Menjaga kecepatan, ketahanan, aksesibilitas, dan SEO website statis yang sudah ada.
- Mencegah publikasi klaim atau dokumen yang belum disetujui perusahaan.

## 3. Batas Cakupan

### 3.1 Termasuk

- Sanity Studio untuk satu staf tepercaya dengan akses Administrator pada paket Free.
- Tujuh kelompok konten yang dijelaskan pada bagian 5.
- Halaman daftar dan detail berita.
- Halaman detail produk dan katalog dengan kategori dinamis.
- Section Mitra Kerja dan Berita Terbaru di Beranda.
- Dokumentasi operasional yang ditempatkan sesuai konteks halaman.
- Pratinjau gambar legalitas dan sertifikasi tanpa unduhan.
- Integrasi webhook Sanity ke Vercel.
- Metadata SEO, structured data, sitemap, gambar responsif, dan internal linking.
- Migrasi Tuna dan Ikan Dasar sebagai konten awal.

### 3.2 Tidak termasuk

- Mengubah website menjadi portal berita.
- Dashboard Sanity di bawah path `/admin` pada domain publik.
- Server-side rendering atau pembacaan Sanity pada setiap kunjungan.
- Workflow persetujuan multi-level atau custom role pada paket berbayar.
- Preview draft langsung pada website publik.
- PDF legalitas, tombol unduh, atau penyimpanan dokumen internal.
- E-commerce, harga, checkout, akun pelanggan, komentar, pencarian, atau newsletter.
- Publikasi Udang dan Kakap sebelum ketersediaannya dikonfirmasi perusahaan.

## 4. Arsitektur

### 4.1 Komponen sistem

1. **Sanity Studio** berada dalam folder `studio/` di repository yang sama dan dideploy sebagai aplikasi terpisah pada domain Sanity.
2. **Sanity Content Lake** menggunakan dataset produksi publik karena paket Free hanya menyediakan dataset publik.
3. **Website Astro** membaca hanya dokumen yang sudah dipublikasikan saat proses build.
4. **Vercel** menyajikan hasil build statis dan mempertahankan deployment aktif apabila build baru gagal.
5. **Webhook Sanity** memanggil satu Vercel Deploy Hook untuk perubahan konten publik yang relevan.

### 4.2 Batas tanggung jawab

- `studio/` memiliki schema, struktur dashboard, validasi editor, dan konfigurasi deployment Studio.
- `src/lib/sanity/` memiliki client read-only, query GROQ, pemetaan respons, Portable Text, dan pembuatan URL gambar.
- Komponen Astro bertanggung jawab atas presentasi, aksesibilitas, fallback visual, dan internal linking.
- File data lokal tetap menjadi sumber profil inti, kontak, proses inti, template WhatsApp, dan aturan bisnis yang tidak boleh diubah staf secara bebas.
- Environment variable menyimpan Sanity project ID, dataset, versi API, dan URL deploy yang diperlukan. Token tulis tidak pernah tersedia pada frontend.

### 4.3 Alur publikasi

1. Staf membuat atau menyunting draft di Sanity Studio.
2. Validasi schema mencegah publikasi konten wajib yang belum lengkap.
3. Staf menekan **Publish**.
4. Webhook yang difilter untuk tipe konten dalam cakupan memanggil Vercel Deploy Hook.
5. Vercel menjalankan pemeriksaan dan build Astro dengan data publik terbaru dari Sanity.
6. Jika build berhasil, deployment baru menjadi aktif. Jika gagal, deployment sebelumnya tetap tayang.

Draft, dokumen nonaktif, dan dokumen tanpa slug valid tidak dibuat menjadi halaman publik serta tidak masuk sitemap.

## 5. Model Konten Sanity

### 5.1 Berita

Field:

- `title`: wajib, judul artikel.
- `slug`: wajib, unik, dibuat dari judul tetapi dapat diperbaiki sebelum publikasi.
- `publishedAt`: wajib, tanggal dan waktu terbit.
- `excerpt`: wajib, ringkasan untuk kartu dan fallback meta description.
- `coverImage`: wajib, gambar sampul.
- `coverImage.alt`: wajib, deskripsi gambar yang bermakna.
- `body`: wajib, Portable Text yang mendukung paragraf, subjudul, daftar, tautan, dan beberapa gambar.
- Setiap gambar di dalam `body` memiliki alt text wajib dan caption opsional.
- `seoTitle`: opsional dengan fallback ke judul dan batas panjang yang jelas di Studio.
- `seoDescription`: opsional dengan fallback ke ringkasan dan batas panjang yang jelas di Studio.
- `socialImage`: opsional dengan fallback ke gambar sampul.
- `isActive`: menentukan apakah artikel dibuat menjadi halaman publik.

Kategori berita dan profil penulis tidak dibuat pada versi pertama. Penulis dan penerbit untuk metadata artikel adalah PT Katalis Lintas Global.

### 5.2 Mitra Kerja

Field:

- `name`: wajib.
- `logo`: wajib.
- `logo.alt`: wajib.
- `order`: wajib untuk pengurutan.
- `isActive`: wajib.

Logo tidak memiliki URL tujuan dan tidak menggunakan gaya yang menyiratkan bahwa elemen dapat diklik.

### 5.3 Kategori Produk

Field:

- `name`: wajib.
- `slug`: wajib dan unik.
- `description`: opsional.
- `order`: wajib.
- `isActive`: wajib.

Staf Administrator dapat menambah, mengubah, mengurutkan, dan menonaktifkan kategori. Produk hanya dapat memilih kategori aktif yang tersedia.

### 5.4 Produk

Field:

- `name`: wajib.
- `slug`: wajib dan unik.
- `category`: wajib, referensi ke Kategori Produk.
- `scientificName`: opsional dan hanya diisi jika telah diverifikasi.
- `excerpt`: wajib untuk kartu dan fallback meta description.
- `description`: wajib, konten lengkap yang dapat diformat.
- `images`: minimal satu gambar dengan alt text wajib dan caption opsional.
- `sizes`, `forms`, `condition`, `packaging`, dan `volume`: opsional.
- `order`: wajib.
- `availabilityStatus`: status publik yang dikontrol, tanpa klaim stok real-time.
- `isActive`: wajib.
- `seoTitle`, `seoDescription`, dan `socialImage`: opsional dengan fallback aman.

Tidak ada harga, rating, ulasan, atau klaim stok yang dibuat secara otomatis.

### 5.5 Dokumentasi Operasional

Field:

- `title`: wajib untuk identifikasi di Studio.
- `image`: wajib.
- `image.alt`: wajib.
- `caption`: opsional.
- `documentationType`: wajib, salah satu dari `process`, `facility`, `team`, `fleet`, atau `activity`.
- `order`: wajib.
- `isActive`: wajib.

Jenis dokumentasi menentukan penempatan gambar pada website dan tidak membuat halaman Galeri tersendiri.

### 5.6 Legalitas dan Sertifikasi

Field:

- `name`: wajib.
- `description`: wajib.
- `previewImage`: wajib.
- `previewImage.alt`: wajib.
- `order`: wajib.
- `isActive`: wajib.

Konten ini hanya menampilkan nama, keterangan, dan gambar pratinjau. Tidak ada upload PDF, URL unduhan, nomor dokumen wajib, atau masa berlaku wajib. Gambar dapat dibuka lebih besar. Informasi sensitif harus disamarkan sebelum aset diunggah.

### 5.7 Fakta Perusahaan

Field:

- `label`: wajib.
- `value`: wajib.
- `description`: opsional.
- `placement`: wajib, nilai terkontrol untuk Beranda atau Tentang Kami.
- `order`: wajib.
- `isActive`: wajib.

Fakta hanya dipublikasikan setelah angka dan klaimnya disetujui perusahaan.

## 6. Struktur Halaman dan Penempatan

### 6.1 Beranda

Urutan utama:

1. Hero.
2. Fakta perusahaan.
3. Mitra Kerja.
4. Produk Utama.
5. Bukti mutu.
6. Proses.
7. Profil singkat.
8. Berita Terbaru.
9. CTA pertemuan.

Mitra Kerja tampil sebagai grid logo proporsional di atas latar netral. Berita Terbaru menampilkan maksimal tiga artikel terbaru. Masing-masing section disembunyikan jika tidak mempunyai konten aktif.

### 6.2 Daftar Berita

Path: `/berita`

- Menampilkan artikel aktif dari yang terbaru.
- Kartu berisi gambar sampul, tanggal, judul, ringkasan, dan tautan baca.
- Tidak ada filter kategori pada versi pertama.
- Kondisi tanpa artikel memberikan halaman yang valid dan informatif, sementara section Berita di Beranda tetap disembunyikan.

### 6.3 Detail Berita

Path: `/berita/[slug]`

- Breadcrumb.
- Judul, tanggal terbit, dan ringkasan.
- Gambar sampul responsif.
- Portable Text dengan foto isi responsif.
- Rekomendasi berita lain yang tersedia.
- Metadata dan structured data artikel.

### 6.4 Daftar Produk

Path: `/produk`

- Data kategori dan produk berasal dari Sanity.
- Filter kategori dibuat secara dinamis.
- Kartu produk menuju halaman detail produk.
- Kategori kosong tidak ditampilkan sebagai pilihan filter.

### 6.5 Detail Produk

Path: `/produk/[slug]`

- Breadcrumb.
- Nama produk dan nama ilmiah bila tersedia.
- Galeri foto responsif.
- Ringkasan, deskripsi, dan hanya spesifikasi yang terisi.
- CTA WhatsApp membawa konteks nama produk.
- Internal link kembali ke kategori dan katalog.

### 6.6 Mutu & Proses

- Tahapan proses inti yang sudah ada tetap digunakan.
- Dokumentasi bertipe `process` dan `facility` ditempatkan pada bagian yang relevan.
- Section dokumentasi disembunyikan jika kosong.

### 6.7 Tentang Kami

- Profil dan nilai inti yang sudah ada tetap digunakan.
- Fakta perusahaan dengan placement Tentang Kami ditampilkan sesuai urutan.
- Dokumentasi `team` dan `fleet` ditempatkan secara kontekstual.
- Legalitas dan sertifikasi tampil sebagai kartu pratinjau gambar tanpa unduhan.
- Section yang tidak mempunyai konten aktif disembunyikan.

## 7. SEO

### 7.1 SEO halaman

- Setiap berita dan produk memiliki title unik, meta description, canonical URL, Open Graph, dan metadata X/Twitter.
- Nilai SEO manual bersifat opsional dan memiliki fallback dari judul, ringkasan, serta gambar utama.
- Slug bersifat unik dan tidak berubah secara otomatis setelah artikel atau produk dipublikasikan.
- Breadcrumb visual disertai structured data `BreadcrumbList`.
- Internal link menghubungkan Beranda, daftar, kategori, halaman detail, dan konten terkait.

### 7.2 Structured data

- Detail berita menggunakan `NewsArticle` dengan headline, image, datePublished, dateModified, author, publisher, mainEntityOfPage, dan canonical URL yang sesuai isi terlihat.
- PT Katalis Lintas Global menjadi `Organization` author dan publisher untuk berita.
- Detail produk menggunakan `Product` hanya dengan properti faktual yang tersedia. Harga, offer, rating, review, dan inventory tidak direkayasa.
- Structured data `Organization` yang sudah ada tetap menjadi identitas utama dan digunakan secara konsisten.
- Markup diuji menggunakan Google Rich Results Test dan tidak menjanjikan rich result atau peringkat.

Rujukan implementasi: [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article?hl=id) dan [general structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### 7.3 Sitemap dan crawling

- Sitemap berisi canonical URL seluruh berita dan produk aktif yang berhasil dibangun.
- Dokumen draft, nonaktif, tidak lengkap, atau tanpa slug valid tidak masuk sitemap.
- `lastmod` hanya menggunakan waktu perubahan konten utama yang akurat.
- `robots.txt` tetap menunjuk ke sitemap produksi.
- Setelah domain produksi aktif, sitemap didaftarkan melalui Google Search Console.

Rujukan implementasi: [Google sitemap guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en).

### 7.4 SEO gambar

- Semua gambar informatif dirender menggunakan elemen HTML `<img>` atau `<picture>`, bukan hanya CSS background.
- Alt text wajib pada gambar sampul, isi artikel, produk, dokumentasi, mitra, dan legalitas.
- Sanity Image CDN digunakan untuk format dan ukuran responsif.
- Setiap gambar mempunyai `src` fallback, dimensi yang diketahui untuk mengurangi layout shift, dan `srcset`/`sizes` yang sesuai.
- Gambar di bawah viewport menggunakan lazy loading; gambar utama halaman tidak ditunda secara agresif.
- Logo dan dokumen tidak dipotong; foto menggunakan focal point atau crop yang ditentukan editor bila diperlukan.

Rujukan implementasi: [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images).

## 8. Tampilan dan Aksesibilitas

- Desain mengikuti sistem warna, tipografi, spacing, radius, dan komponen website yang ada.
- Grid desktop berubah menjadi satu kolom atau grid lebih kecil pada viewport mobile.
- Logo mitra mempertahankan rasio asli dan memiliki ruang visual seragam.
- Kartu noninteraktif tidak memiliki hover atau cursor yang menyiratkan tautan.
- Gambar pratinjau legalitas yang dapat diperbesar memiliki kontrol keyboard, label yang jelas, fokus yang terlihat, dan mekanisme menutup yang aksesibel.
- Heading mengikuti hierarki semantik; artikel menggunakan elemen `<article>` dan waktu memakai `<time>`.
- Tautan dan tombol mempunyai accessible name yang menjelaskan tujuannya.
- Portable Text hanya merender komponen dan mark yang diizinkan, sehingga struktur serta keamanan tampilan terjaga.

## 9. Ketahanan dan Kondisi Gagal

- Jika Sanity tidak tersedia saat deployment sedang tayang, website aktif tetap dapat diakses karena kontennya statis.
- Jika query, validasi, atau render gagal saat build, deployment baru gagal dan deployment sebelumnya tetap aktif.
- Build produksi tidak diam-diam mengganti kegagalan Sanity dengan daftar kosong, karena hal itu dapat menghapus konten publik tanpa peringatan.
- Pengembangan lokal dapat menampilkan pesan konfigurasi yang jelas apabila environment variable Sanity belum tersedia.
- Section opsional disembunyikan ketika hasil query valid tetapi kosong.
- Referensi kategori yang rusak atau dokumen wajib tidak lengkap ditolak oleh validasi dan pemeriksaan build.
- Artikel atau produk yang dihapus/nonaktif tidak lagi memiliki static route setelah deployment berikutnya dan mengarah ke halaman 404.
- Gambar yang gagal dimuat mempertahankan nama/keterangan konten dan fallback visual tanpa merusak layout.

## 10. Keamanan dan Tata Kelola Konten

- Dataset Free dianggap publik. Semua teks, metadata, gambar, dan aset di dalamnya harus aman untuk konsumsi publik.
- Dokumen internal, nomor identitas, tanda tangan, informasi pribadi, kontrak, dan materi sensitif tidak boleh diunggah.
- Legalitas harus disamarkan dan mendapat persetujuan perusahaan sebelum dipublikasikan.
- Website menggunakan akses baca publik tanpa token tulis.
- Deploy Hook URL diperlakukan sebagai rahasia dan hanya disimpan di konfigurasi webhook Sanity/Vercel.
- Satu staf tepercaya menerima peran Administrator. Penambahan pengguna baru memerlukan persetujuan pemilik perusahaan.
- Field status aktif tidak menggantikan draft/publish; keduanya digunakan agar staf dapat menghentikan penayangan tanpa menghapus dokumen.

## 11. Migrasi Konten

- Kategori awal: Tuna dan Ikan Dasar.
- Produk awal menggunakan informasi Tuna dan Ikan Dasar yang sudah disetujui pada website, kemudian dilengkapi melalui Studio.
- Udang dan Kakap tidak dimigrasikan sebagai produk publik karena masih berstatus contoh/belum dikonfirmasi.
- Konten lokal lama dipertahankan sampai hasil migrasi diverifikasi di preview deployment.
- Peralihan ke Sanity dilakukan setelah query, halaman, SEO, dan empty state lolos pengujian.
- Tidak ada placeholder klaim, foto, sertifikasi, legalitas, atau fakta perusahaan.

## 12. Pengujian dan Kriteria Penerimaan

### 12.1 Sanity Studio

- Studio dapat dibangun dan dideploy.
- Ketujuh jenis konten muncul dengan struktur editor yang jelas.
- Field wajib, slug unik, alt text, referensi, urutan, dan batas metadata divalidasi.
- Staf dapat membuat draft, mengunggah gambar, dan memublikasikan konten tanpa menyentuh kode.

### 12.2 Integrasi data

- Query hanya mengambil dokumen published dan aktif.
- Query mempertahankan urutan kategori, produk, mitra, dokumentasi, legalitas, dan fakta.
- Portable Text merender blok yang diizinkan dan foto isi dengan benar.
- Kegagalan query produksi menggagalkan build dengan pesan yang dapat ditindaklanjuti.

### 12.3 Halaman publik

- `/berita` dan seluruh `/berita/[slug]` yang aktif dapat dibangun.
- `/produk` dan seluruh `/produk/[slug]` yang aktif dapat dibangun.
- Beranda menampilkan maksimal tiga berita terbaru dan seluruh mitra aktif sesuai urutan.
- Section Berita Terbaru dan Mitra Kerja menghilang ketika datanya kosong.
- Filter kategori mengikuti data Sanity dan dapat digunakan dengan keyboard.
- Dokumentasi, legalitas, dan fakta muncul hanya pada penempatan yang ditentukan.
- CTA produk mengirim nama produk dalam konteks WhatsApp.

### 12.4 SEO dan kualitas

- Canonical, metadata sosial, sitemap, `NewsArticle`, `Product`, `BreadcrumbList`, dan `Organization` sesuai halaman.
- Draft serta dokumen nonaktif tidak dapat ditemukan melalui route atau sitemap.
- Gambar memiliki alt text, dimensi, dan varian responsif.
- Tidak ada overflow pada viewport 360 px, 768 px, dan 1440 px.
- Halaman baru tidak memiliki pelanggaran aksesibilitas serius pada pemeriksaan otomatis dan lulus pemeriksaan keyboard manual.
- Unit test, Astro check, production build, Sanity Studio build, dan Playwright lulus.

### 12.5 Webhook

- Memublikasikan satu dokumen percobaan memicu satu deployment Vercel.
- Perubahan draft tidak memicu deployment.
- Deployment berhasil mengambil konten yang baru dipublikasikan.
- URL Deploy Hook tidak terekspos di source code atau output browser.

## 13. Deployment dan Operasional

- Sanity Studio dideploy ke domain Sanity terpisah, misalnya subdomain `*.sanity.studio` yang tersedia saat deployment.
- Website tetap dideploy di Vercel dari branch produksi.
- Environment variable Sanity dikonfigurasi pada local development, Vercel Preview, dan Vercel Production.
- Webhook difilter ke jenis dokumen dalam cakupan dan mengabaikan draft agar penyuntingan tidak menghasilkan deployment berulang.
- Staf menerima panduan singkat untuk login, membuat draft, mengisi alt text, memeriksa data, memublikasikan, dan menunggu deployment selesai.
- Penggunaan paket Free dipantau dari dashboard Sanity. Jika kebutuhan role terpisah atau kuota meningkat, perusahaan dapat mengevaluasi paket Growth tanpa mengubah arsitektur konten.

## 14. Keputusan yang Disetujui

- Sanity dipilih karena staf nonteknis akan mengelola konten.
- Paket awal adalah Free dengan satu staf tepercaya sebagai Administrator.
- Studio menggunakan domain Sanity terpisah, bukan `/admin` pada website.
- Astro tetap statis dan pembaruan dilakukan melalui webhook Sanity ke Vercel.
- Sanity mengelola seluruh konten yang dapat berubah dalam cakupan, bukan hanya berita dan mitra.
- Mitra Kerja tampil di Beranda sebagai gambar tanpa tautan.
- Berita Terbaru dan Mitra Kerja disembunyikan jika kosong.
- Artikel mendukung beberapa foto di dalam isi.
- Staf dapat menambah dan mengubah kategori produk.
- Setiap produk mempunyai halaman detail.
- Dokumentasi operasional ditempatkan secara kontekstual dan tidak memiliki halaman Galeri.
- Legalitas hanya memiliki pratinjau gambar tanpa PDF atau tombol unduh.
- Tuna dan Ikan Dasar menjadi konten migrasi awal; Udang dan Kakap tidak dipublikasikan.

