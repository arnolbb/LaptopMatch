# PRD.md — LaptopMatch V2

## Fokus Versi 2

LaptopMatch V2 berfokus pada redesign UI/UX dari aplikasi yang sudah ada.

Tujuan utamanya adalah mengubah LaptopMatch dari:

“AI recommendation prototype”

menjadi:

“Premium AI laptop buying assistant”

V2 tidak bertujuan membuat ulang backend, mengganti AI provider, atau menghapus logic yang sudah berjalan. Integrasi Gemini, validasi input, rate limiter, dan structured output tetap dipertahankan.

## Scope Utama

1. Redesign landing page agar lebih premium dan meyakinkan.
2. Mengubah form menjadi step-by-step wizard.
3. Membuat halaman hasil rekomendasi terasa seperti laporan pembelian dari AI.
4. Menambahkan elemen visual seperti AI Match Score, laptop mockup, recommendation preview, dan buying advice panel.
5. Memastikan tampilan responsive di mobile, tablet, dan desktop.

## Halaman yang Dikembangkan

### Landing Page

Landing page harus memiliki:

* Hero section yang kuat.
* Headline: “Temukan Laptop Terbaik untuk Kebutuhanmu.”
* CTA utama: “Mulai Sekarang.”
* CTA sekunder: “Lihat Contoh Hasil.”
* Laptop mockup visual.
* Floating card “AI Match Score.”
* Section “3 Langkah Mudah.”
* Use case cards untuk Mahasiswa, Programmer, Designer, Pekerja Kantoran, Content Creator, dan Gamer.
* Preview hasil rekomendasi.

### Form Wizard

Form rekomendasi dibuat menjadi 5 step:

1. Budget
2. Kebutuhan utama
3. Prioritas fitur
4. Brand & OS
5. Review pilihan

Setiap step harus ringan, jelas, dan mudah dipahami user awam.

### Result Page

Halaman hasil harus menampilkan:

* Judul: “3 Rekomendasi Terbaik untuk Kamu.”
* Summary pilihan user.
* 3 kartu rekomendasi laptop.
* Match Score.
* Spesifikasi utama.
* Kelebihan dan kekurangan.
* Alasan AI memilih laptop.
* CTA “Lihat Detail”, “Cari di Tokopedia”, dan “Cari di Shopee.”
* Panel “Saran Pembelian dari AI.”

## Komponen Baru

Komponen yang disarankan:

* `HeroLaptopMockup.tsx`
* `RecommendationPreview.tsx`
* `UseCaseCard.tsx`
* `StepWizard.tsx`
* `BudgetSlider.tsx`
* `PreferenceChip.tsx`
* `MatchScoreBadge.tsx`
* `LaptopResultCard.tsx`
* `BuyingAdvicePanel.tsx`

## Acceptance Criteria

V2 dianggap selesai jika:

* Landing page tampil baru dan lebih premium.
* Form sudah berbentuk step-by-step wizard.
* Result page tampil seperti report rekomendasi AI.
* Semua halaman responsive.
* Dark/light mode tetap berjalan.
* Integrasi Gemini tetap berjalan.
* API key tetap aman di backend.
* Rate limiter tetap aktif.
* Validasi input tidak rusak.
* Structured output tetap digunakan.
* Tidak ada error TypeScript.
* User dapat menyelesaikan flow dari landing sampai result tanpa hambatan.

## Catatan Implementasi untuk Codex

Codex harus mempertahankan:

* `server.ts`
* API route yang sudah ada
* Environment variable Gemini API key
* Rate limiter
* Validasi input
* Error handling
* Structured output schema

Prioritaskan perubahan pada:

* `src/components/LandingView.tsx`
* `src/components/FormView.tsx`
* `src/components/ResultView.tsx`
* `src/components/SpecBadge.tsx`
* File global CSS
* Komponen baru di folder `src/components/`

Jangan menambahkan fitur besar seperti auth, database, payment, atau admin dashboard pada V2.
::: 
