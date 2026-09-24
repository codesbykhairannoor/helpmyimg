# Playbook & Catatan Pembelajaran Indexing SaaS Global (HelpMyIMG)

Dokumen ini mencatat seluruh pembelajaran teknis dan operasional mengenai bagaimana mesin pencari (khususnya Google) memproses, merayap, dan mengindeks SaaS baru dengan arsitektur multabahasa.

---

## 1. Timeline & Realita Pasca-Submit Product Hunt

Mendaftarkan HelpMyIMG ke **Product Hunt** adalah langkah paling krusial yang sudah Anda lakukan. Product Hunt adalah **Seed Site** berbobot Domain Authority (DA) 90+ yang dipantau crawler Google setiap beberapa menit.

### Kapan Hasilnya Terlihat?
Google tidak langsung mengindeks dalam hitungan detik setelah submit di Product Hunt. Siklus alaminya adalah sebagai berikut:

| Waktu | Tahapan Googlebot & Mesin Pencari | Yang Akan Anda Lihat |
| :--- | :--- | :--- |
| **Jam 0 – 24** | Halaman HelpMyIMG di Product Hunt dirayap dan disimpan oleh Googlebot. Googlebot mengekstrak link keluar (*outbound link*) ke `https://helpmyimg.com`. | Link rujukan muncul di analitik / Search Console (bagian *External Links*). |
| **Hari 1 – 3** | Domain HelpMyIMG dimasukkan ke antrean perayapan prioritas tinggi (*High-Priority Ingestion Queue*). Bot mulai menguji homepage dan core tools (`/en/remove-background/`, dsb.). | Mulai muncul penambahan halaman saat dicek via `site:helpmyimg.com`. |
| **Hari 3 – 7** | Gelombang pertama indeks stabil. Status di Search Console berubah dari *"Discovered - currently not indexed"* menjadi *"Indexed"*. Google mulai menampilkan cuplikan bintang (Review Snippet) dan Breadcrumbs. | Core tools muncul di pencarian untuk query spesifik brand dan long-tail awal. |
| **Minggu 2 – 4** | Crawl budget harian naik secara eksponensial. Googlebot mulai merayap shard sitemap bahasa lainnya (Indonesia, Spanyol, Arab, dsb.). | Ratusan halaman multabahasa mulai terindeks bertahap. |

> **Tips Maksimalkan Product Hunt**:
> 1. Tulis komentar pertama (*Maker's Comment*) yang menjelaskan bahwa HelpMyIMG bekerja 100% lokal di browser pengguna menggunakan WebAssembly tanpa upload gambar ke server (menonjolkan *privacy-first*).
> 2. Bagikan link Product Hunt ke komunitas (Twitter/X, Reddit r/SideProject, r/webdev, LinkedIn) untuk mengumpulkan komentar dan upvotes awal.

---

## 2. Empat Pembelajaran Teknis Krusial (Technical Pitfalls)

### Pembelajaran 1: Jangan Eager-Load Model AI Binary pada Initial Page Load
* **Masalah**:
  Sebelumnya, `aiService.ts` memanggil Web Worker dan mendownload model ONNX sebesar 40MB dari Hugging Face (`briaai/RMBG-1.4`) di dalam *constructor* saat homepage baru pertama kali dimuat.
* **Dampak**:
  Googlebot menolak mengikuti pengalihan (redirect 302/307) file binary besar di sandbox pengujian, sehingga Search Console menampilkan pesan error:
  `Aset halaman 2/17 tidak dapat dimuat: Error pengalihan XHR (config.json & model_quantized.onnx)`.
  Selain itu, kuota pengguna di perangkat seluler terbuang 40MB hanya untuk sekadar membaca landing page.
* **Solusi Standar Global**:
  **100% Lazy Loading**. Worker dan model AI hanya diinisialisasi saat pengguna benar-benar menekan tombol upload gambar atau memilih tool penghapus latar belakang.

### Pembelajaran 2: Screenshot GSC Dibatasi Tinggi Viewport (DOM HTML adalah Kunci)
* **Masalah**:
  Tangkapan layar di tab `SCREENSHOT` Google Search Console terpotong di tengah halaman dan tidak menampilkan FAQ/Footer bawah.
* **Realita Googlebot**:
  Alat inspeksi Google sengaja membatasi rendering gambar screenshot (maksimal ~2000px) untuk menghemat memori server mereka saat menguji miliaran URL per hari.
* **Fakta**:
  Google **TIDAK** mengindeks halaman berdasarkan gambar screenshot. Google mengindeks kode mentah di tab **`HTML`** (DOM Tree). Selama tab `HTML` memuat seluruh 643 baris teks, FAQ, dan footer, halaman tersebut 100% terbaca utuh oleh bot pengindeks.

### Pembelajaran 3: Sitemap Monolitik Menghambat Bot vs Sitemap Sharding
* **Masalah**:
  Satu file `sitemap.xml` berukuran 3.800+ baris campur aduk 30 bahasa membingungkan bot dan memboroskan kuota rayap.
* **Solusi**:
  Dipecah menjadi **30 Shard Bahasa** independen (`sitemap-en.xml`, `sitemap-id.xml`, dll.) yang dinaungi oleh sitemap index utama, dilengkapi tag `<priority>` dan `<changefreq>`.

### Pembelajaran 4: Schema.org Graph Interconnection
* **Kebutuhan**:
  Google butuh validasi bahwa website adalah aplikasi fungsional.
* **Solusi**:
  Injeksi 6 entitas terhubung: `Organization`, `WebSite`, `WebPage`, `SoftwareApplication` (rating 4.8 bintang, harga $0 Free, WebAssembly requirement), `BreadcrumbList`, dan `FAQPage`.
* **Hasil Uji**:
  Terbukti langsung menghasilkan status hijau: **"6 item valid terdeteksi"** dan **"Halaman dapat diindeks"** di Google Rich Results Test.

---

## 3. Panduan Validasi Ulang & Minta Indexing di Google Search Console

Setelah perbaikan lazy loading AI dipush ke GitHub dan terdeploy di hosting (misal Vercel), lakukan langkah validasi ini:

1. **Pastikan Deployment Selesai**:
   Buka dashboard Vercel / hosting Anda, pastikan commit terbaru (`fix(perf): lazy load AI Web Worker`) sudah berstatus *Ready* / *Production*.
2. **Buka Google Search Console**:
   Ketik URL utama di bar atas:
   ```text
   https://helpmyimg.com/en/
   ```
   (Atau URL tool spesifik: `https://helpmyimg.com/en/remove-background/`).
3. **Klik Tombol "Uji URL Langsung" (Test Live URL)**:
   * Tunggu sekitar 10–20 detik saat Googlebot menjalankan simulasi perayapan terbaru.
4. **Cek Bagian Aset Halaman**:
   * Klik *"Lihat halaman yang diuji"*.
   * Buka tab *"Info Selengkapnya"* -> *"Aset Halaman"*.
   * Perhatikan bahwa pesan error pengalihan XHR Hugging Face (`config.json` dan `model_quantized.onnx`) **sekarang sudah hilang**.
5. **Klik Tombol "Minta Pengindeksan" (Request Indexing)**:
   * Setelah hasil uji langsung menunjukkan centang hijau, tekan tombol **Minta Pengindeksan**.
   * Akan muncul jendela konfirmasi: *"URL telah ditambahkan ke antrean prioritas perayapan"*.
6. **Lakukan Hal yang Sama untuk 3-5 Tool Utama**:
   * Ulangi permintaan indeks untuk URL halaman unggulan:
     - `https://helpmyimg.com/en/remove-background/`
     - `https://helpmyimg.com/en/compress-image/`
     - `https://helpmyimg.com/id/hapus-latar-belakang/`
     - `https://helpmyimg.com/id/kompres-gambar/`
7. **Pantau Pertumbuhan Indeks**:
   Cek setiap 1–2 hari di Google Search Console (menu **Pages**) atau cari di Google:
   ```text
   site:helpmyimg.com
   ```
