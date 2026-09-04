# Panduan Editor Sanity

Panduan ini ditujukan untuk staf yang mengelola konten publik PT Katalis Lintas Global. Website tetap merupakan company profile; berita dipakai untuk menunjukkan aktivitas perusahaan.

## Prinsip keamanan

Semua konten dan aset pada dataset publik dapat diakses melalui internet. Jangan unggah data pribadi, tanda tangan, kontrak, dokumen internal, nomor identitas, informasi rekening, atau berkas legalitas yang belum disetujui untuk publik.

Gunakan hanya foto, nama mitra, fakta perusahaan, dan dokumen yang sudah mendapat persetujuan internal. Jangan menulis harga, stok, kapasitas, sertifikasi, nama ilmiah, atau wilayah distribusi tanpa sumber resmi.

## Masuk dan mengenali menu

1. Buka alamat Sanity Studio perusahaan yang diberikan Administrator.
2. Masuk memakai akun yang telah diundang.
3. Pilih kelompok konten: **Berita**, **Mitra Kerja**, **Kategori Produk**, **Produk**, **Dokumentasi Operasional**, **Legalitas & Sertifikasi**, atau **Fakta Perusahaan**.
4. Buat dokumen baru dengan tombol **Create/New**, atau buka dokumen yang sudah ada untuk mengubahnya.

## Membuat berita

1. Pilih **Berita**, lalu buat dokumen baru.
2. Isi **Title/Judul** dengan judul yang spesifik dan faktual.
3. Pada **Slug**, gunakan tombol **Generate**. Jangan mengubah slug berita yang sudah terbit tanpa koordinasi karena URL lama akan hilang.
4. Isi tanggal publikasi dan ringkasan 40–240 karakter.
5. Unggah gambar cover. Isi teks alternatif yang menjelaskan isi gambar, misalnya: “Tim Katalis memeriksa kemasan ikan di area kerja”. Hindari teks seperti “foto” atau nama file saja.
6. Isi badan artikel. Gambar dapat ditambahkan di antara paragraf; setiap gambar wajib memiliki teks alternatif dan keterangan bila diperlukan.
7. Isi bagian SEO jika judul atau deskripsi khusus dibutuhkan. Gunakan judul maksimal sekitar 60 karakter dan deskripsi maksimal sekitar 160 karakter.
8. Periksa ejaan, fakta, tanggal, foto, dan izin publikasi sebelum memilih **Publish**.

## Produk dan kategori

1. Buat atau pilih kategori aktif terlebih dahulu.
2. Isi nama, slug, ringkasan, deskripsi, dan minimal satu foto produk resmi.
3. Isi spesifikasi hanya bila datanya disetujui. Kolom kosong tidak akan ditampilkan di website.
4. Aktifkan **isActive** hanya untuk produk yang boleh tampil.
5. Publikasikan kategori sebelum produk yang merujuk kategori tersebut.

## Mitra, dokumentasi, fakta, dan legalitas

- **Mitra Kerja:** unggah logo resmi dan isi nama serta urutannya. Logo tampil sebagai gambar dan tidak dapat diklik.
- **Dokumentasi Operasional:** pilih tipe yang tepat—process, facility, team, fleet, atau activity—karena tipe menentukan halaman tempat foto muncul.
- **Fakta Perusahaan:** pilih penempatan Beranda atau Tentang Kami. Jangan memasukkan angka atau klaim yang belum disahkan.
- **Legalitas & Sertifikasi:** unggah hanya gambar pratinjau publik. Jangan mengunggah PDF, tanda tangan, kontrak, atau dokumen internal.

## Setelah Publish

1. Publish memicu build website otomatis. Perubahan tidak muncul seketika; tunggu sampai deployment Vercel selesai.
2. Buka URL publik dan periksa halaman terkait, gambar, teks alternatif, tampilan ponsel, serta tautannya.
3. Jika konten salah, perbaiki lalu Publish lagi.
4. Untuk menarik konten, gunakan **Unpublish**. Tunggu deployment berikutnya, lalu pastikan URL atau bagian tersebut sudah hilang.
5. Jika perubahan belum tampil atau deployment gagal, jangan membuat banyak publish berulang. Catat judul dokumen dan waktu Publish, lalu hubungi Administrator website untuk memeriksa log webhook dan deployment.
