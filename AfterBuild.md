# Dokumentasi AfterBuild ? LaptopMatch V2

Dokumen ini memuat detail implementasi, arsitektur, sistem desain, dan fitur-fitur yang telah dibangun pada website **LaptopMatch V2**.

---

## 1. Deskripsi Aplikasi
**LaptopMatch V2** adalah platform pintar pemilih laptop terpersonalisasi untuk pasar Indonesia yang ditenagai oleh Gemini AI. Pengguna menjawab kuesioner singkat mengenai anggaran, kebutuhan utama, prioritas fitur, serta sistem operasi/merek yang diminati, lalu AI akan menyajikan 3 rekomendasi terbaik lengkap dengan harga estimasi pasar lokal (Tokopedia/Shopee), kelebihan/kekurangan, spesifikasi teknis, serta saran pembelian.

---

## 2. Arsitektur & Teknologi Utama
Aplikasi ini dikembangkan dengan arsitektur modern yang ringan dan cepat:
- **Frontend**: React 19 (TypeScript) & Vite.
- **Styling**: Tailwind CSS v4 (menggunakan skema warna OKLCH dan variabel CSS dinamis).
- **Backend (Local)**: Express (TypeScript) terintegrasi sebagai server API mandiri yang menyajikan aset frontend statis pada lingkungan produksi.
- **Backend (Vercel)**: Vercel Serverless Function menggunakan Node.js runtime (`api/recommend.ts`).
- **AI Engine**: `@google/genai` SDK terhubung dengan model `gemini-2.5-flash` menggunakan skema JSON terstruktur (*structured output*).
- **Animasi**: `motion` (Framer Motion v12) untuk transisi halaman yang natural.

---

## 3. Sistem Desain Premium (Tech-Editorial)
Sesuai dengan panduan desain, website ini menggunakan estetika editorial jurnalistik teknologi yang bersih dan klinis tanpa ornamen yang tidak perlu:
- **Tema Warna**: Dark-first secara default (dapat ditoggle ke Light mode). Menggunakan pondasi arang (*charcoal foundation*) dengan aksen warna *cold-teal* tunggal.
- **Tipografi**:
  - Judul / UI: `Space Grotesk` (geometric sans, tracking rapat `-0.025em`).
  - Label spesifikasi, harga, kode, dan tombol: `JetBrains Mono` (monospace).
- **Elemen Bentuk (Shape)**:
  - Sudut kotak tajam sempurna (`rounded-none` / 2px radius) untuk semua kartu, tombol, badge, dan chip untuk menghadirkan kesan presisi industri.
  - Penanda aktif berbentuk titik kotak (*square dot*) dan kotak pilihan (*square checkbox*).
  - Peniadaan bayangan (*no shadows*) ? menggunakan garis pembatas tipis (`1px border`) bernuansa monokromatik.
- **Indikator Pro/Kontra**: Menggunakan simbol monospace plus (`+`) dan minus (`-`) untuk mempertegas nuansa tabel data teknis.

---

## 4. Fitur Baru LaptopMatch V2
Berikut adalah pembaruan fitur utama yang dibangun dalam V2 sesuai spesifikasi PRD V2:
1. **Landing Page Baru**:
   - Tampilan hero yang lebih profesional dengan headline: *"Temukan Laptop Terbaik untuk Kebutuhanmu."*
   - CTA Sekunder: *"Lihat Contoh Hasil"* yang memicu pemuatan data rekomendasi tiruan (*mock demo data*) secara instan.
   - Komponen **HeroLaptopMockup** (`src/components/HeroLaptopMockup.tsx`): Mockup laptop interaktif bergaya skema teknis yang menampilkan data spesifikasi hardware virtual dan kartu mengambang *AI Match Score* (98.4%).
   - Komponen **UseCaseCard** (`src/components/UseCaseCard.tsx`): Kartu pintasan pencarian untuk Mahasiswa, Programmer, Designer, Pekerja Kantoran, Content Creator, dan Gamer yang langsung mengarah ke form dengan kategori terpilih.
   - Komponen **RecommendationPreview** (`src/components/RecommendationPreview.tsx`): Pratinjau visual laporan rekomendasi di landing page.
2. **Form Wizard 5-Langkah**:
   - Antarmuka kuesioner kini terbagi menjadi 5 langkah terpadu: **Budget** -> **Kebutuhan** -> **Prioritas** -> **Merek & OS** -> **Review Pilihan**.
   - Dilengkapi progress bar langkah, validasi input untuk setiap step, serta transisi animasi halus antar halaman kuesioner.
3. **Hasil Rekomendasi Bergaya Laporan AI**:
   - Judul laporan yang lebih dinamis: *"3 Rekomendasi Terbaik untuk Kamu"*.
   - Kotak ringkasan kriteria (*preferences summary box*) di bagian atas laporan rekomendasi.
   - Kartu hasil **LaptopResultCard** (`src/components/LaptopResultCard.tsx`):
     - Memuat **MatchScoreBadge** (`src/components/MatchScoreBadge.tsx`) yang menampilkan skor persentase kecocokan rekomendasi (98%, 92%, dan 85%).
     - Menyediakan tombol pintasan pencarian pasar lokal terintegrasi untuk Tokopedia (hijau) dan Shopee (oranye).
     - Fitur **Inspektur Hardware Detail**: Akordeon interaktif ("Lihat Detail Spec") yang menampilkan tabel spesifikasi perangkat keras lengkap secara mendalam ketika diklik.
   - Komponen **BuyingAdvicePanel** (`src/components/BuyingAdvicePanel.tsx`): Saran pembelian keseluruhan yang diformat khusus dalam kotak panel informatif.

---

## 5. Konfigurasi Deployment Vercel
Untuk mendukung penyajian fungsi serverless dan *routing* aplikasi SPA di Vercel:
1. **Serverless Function** (`api/recommend.ts`):
   - Merupakan replika logika backend `server.ts` yang disesuaikan untuk berjalan di lingkungan *serverless cloud* Vercel (tanpa mendengarkan *port* 3000 secara manual).
   - Memproses permintaan POST dari aplikasi frontend, melakukan validasi kriteria, membatasi laju permintaan (*rate limit*), dan melakukan kueri langsung ke Gemini API.
2. **Vercel Routing** (`vercel.json`):
   - Mengarahkan semua permintaan `/api/*` secara transparan ke folder `/api/`.
   - Mengarahkan seluruh lalu lintas rute frontend SPA (`/*`) kembali ke `/index.html` untuk menghindari kesalahan halaman 404 ketika pengguna memuat ulang (*refresh*) halaman pada path sub-direktori.
