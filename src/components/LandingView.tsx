import { Sun, Moon, ArrowRight, Cpu, Star, MapPin, Zap, CheckCircle2, Clock, Code, Monitor, Briefcase, Film, Gamepad2, GraduationCap, Sliders, Compass, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { HeroLaptopMockup } from "./HeroLaptopMockup";
import { UseCaseCard } from "./UseCaseCard";
import { RecommendationPreview } from "./RecommendationPreview";

type LandingViewProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onStart: (initialNeed?: string) => void;
  onLoadDemo: () => void;
};

const STEPS = [
  {
    num: "01",
    title: "Isi preferensi kamu",
    desc: "Budget, kebutuhan, prioritas fitur, merek, dan OS ? hanya 5 pertanyaan singkat.",
    icon: <Sliders className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "AI menganalisis kebutuhanmu",
    desc: "Gemini AI memilih dari ratusan laptop yang tersedia di pasar Indonesia saat ini.",
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Dapatkan 3 rekomendasi terbaik",
    desc: "Lengkap dengan spesifikasi, kelebihan/kekurangan, dan estimasi harga Tokopedia/Shopee.",
    icon: <Compass className="w-5 h-5" />,
  },
];

const FEATURES = [
  { icon: <MapPin className="w-4 h-4" />, text: "Harga pasar Indonesia (Tokopedia, Shopee)" },
  { icon: <CheckCircle2 className="w-4 h-4" />, text: "3 pilihan: Terbaik, Runner Up, Alternatif" },
  { icon: <Clock className="w-4 h-4" />, text: "Hasil dalam hitungan detik" },
  { icon: <Sliders className="w-4 h-4" />, text: "Dipersonalisasi untuk kebutuhanmu" },
];

const USE_CASES = [
  {
    title: "Mahasiswa",
    desc: "Ringan, baterai awet, dan nyaman untuk mengetik tugas kuliah.",
    icon: <GraduationCap className="w-4 h-4" />,
    categoryName: "Pelajar/Mahasiswa"
  },
  {
    title: "Programmer",
    desc: "Prosesor kencang, RAM besar, dan keyboard nyaman untuk coding.",
    icon: <Code className="w-4 h-4" />,
    categoryName: "Programming"
  },
  {
    title: "Designer",
    desc: "Layar akurasi warna tinggi (sRGB/DCI-P3) dan performa grafis mumpuni.",
    icon: <Monitor className="w-4 h-4" />,
    categoryName: "Desain & Editing"
  },
  {
    title: "Pekerja Kantoran",
    desc: "Desain profesional, webcam jernih, dan baterai tahan seharian.",
    icon: <Briefcase className="w-4 h-4" />,
    categoryName: "Kerja Kantoran"
  },
  {
    title: "Content Creator",
    desc: "Performa rendering video lancar dan storage super cepat.",
    icon: <Film className="w-4 h-4" />,
    categoryName: "Content Creator"
  },
  {
    title: "Gamer",
    desc: "Kartu grafis (GPU) dedicated dan refresh rate layar tinggi.",
    icon: <Gamepad2 className="w-4 h-4" />,
    categoryName: "Gaming"
  }
];

function fade(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  };
}

export function LandingView({ isDarkMode, onToggleDarkMode, onStart, onLoadDemo }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-transparent text-ink">

      {/* ?? Nav ??????????????????????????????????????????????????????????????? */}
      <nav className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto max-w-4xl px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1 select-none">
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-extrabold text-ink">LAPTOPMATCH</span>
            <span className="font-mono text-xs font-bold text-accent">//</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="w-8 h-8 rounded-none border border-border flex items-center justify-center text-muted hover:text-ink hover:border-border2 transition-colors duration-150 cursor-pointer"
            aria-label="Toggle tema"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </nav>

      {/* ?? Hero ??????????????????????????????????????????????????????????????? */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-5 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text */}
          <div className="md:col-span-7 space-y-6 text-left">
            <motion.div {...fade(0.05)}>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-accent-lt text-accent font-mono text-[0.625rem] font-bold tracking-wider border border-accent/20">
                <span className="w-1.5 h-1.5 bg-accent shrink-0 animate-pulse" />
                CORE ENGINE: GEMINI 2.5 FLASH
              </span>
            </motion.div>

            <motion.h1 {...fade(0.12)} className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1]">
              Temukan Laptop Terbaik<br />
              <span className="text-accent">untuk Kebutuhanmu.</span>
            </motion.h1>

            <motion.p {...fade(0.2)} className="text-[0.9375rem] text-ink2 leading-relaxed max-w-[46ch]">
              Asisten beli laptop bertenaga AI untuk pasar Indonesia. Dapatkan 3 rekomendasi terbaik berdasarkan budget, preferensi, dan kebutuhan spesifik kamu secara instan.
            </motion.p>

            <motion.div {...fade(0.28)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onStart()}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-none bg-accent text-bg font-mono text-xs uppercase tracking-[0.15em] font-bold hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLoadDemo}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-none border border-border text-ink font-mono text-xs uppercase tracking-[0.15em] font-bold hover:bg-surface active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Lihat Contoh Hasil
              </button>
            </motion.div>

            <motion.p {...fade(0.32)} className="text-[0.6875rem] font-mono text-muted uppercase tracking-wider">
              GRATIS ? TANPA PENDAFTARAN ? HARGA RUPIAH REALISTIS
            </motion.p>
          </div>

          {/* Right Column: Visual Mockup */}
          <motion.div {...fade(0.25)} className="md:col-span-5 flex justify-center">
            <HeroLaptopMockup />
          </motion.div>

        </div>
        </div>
      </section>

      {/* ?? Use Cases ?????????????????????????????????????????????????????????? */}
      <section className="bg-surface/30 py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <motion.div {...fade(0.35)} className="mb-10">
            <p className="font-mono text-[0.625rem] text-accent font-semibold tracking-[0.16em] uppercase mb-2">PILIH PREFERENSI</p>
            <h2 className="text-[1.5rem] font-bold tracking-tight text-ink">Rekomendasi Berdasarkan Kebutuhan</h2>
            <p className="text-[0.8125rem] text-ink2 mt-1">Pilih salah satu use case di bawah untuk langsung memicu wizard kuesioner.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {USE_CASES.map((uc, i) => (
              <motion.div key={uc.title} {...fade(0.38 + i * 0.05)}>
                <UseCaseCard
                  title={uc.title}
                  desc={uc.desc}
                  icon={uc.icon}
                  categoryName={uc.categoryName}
                  onClick={onStart}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ?? How it works ??????????????????????????????????????????????????????? */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:py-24">
        <motion.div {...fade(0.4)} className="mb-10 text-center">
          <p className="font-mono text-[0.625rem] text-accent font-semibold tracking-[0.16em] uppercase mb-2">SISTEM ANALISIS</p>
          <h2 className="text-[1.5rem] font-bold tracking-tight text-ink">3 Langkah Mudah Menuju Rekomendasi</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              {...fade(0.45 + i * 0.08)}
              className="bg-surface border border-border rounded-none p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 bg-accent-lt flex items-center justify-center text-accent shrink-0">
                  {step.icon}
                </div>
                <span className="font-mono text-[0.6875rem] text-muted font-bold tracking-widest">{step.num}</span>
              </div>
              <h3 className="text-[0.875rem] font-bold text-ink mb-1.5 tracking-tight">{step.title}</h3>
              <p className="text-[0.75rem] text-ink2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ?? Recommendation Preview Section ????????????????????????????????????? */}
      <section className="bg-surface/30 py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Preview Title */}
            <div className="md:col-span-5 space-y-4 text-left">
              <span className="font-mono text-[0.625rem] text-accent font-semibold tracking-[0.16em] uppercase">ANALYTICS ENGINE</span>
              <h2 className="text-[1.5rem] font-bold tracking-tight text-ink">Preview Laporan Rekomendasi</h2>
              <p className="text-[0.8125rem] text-ink2 leading-relaxed">
                Setiap hasil dilengkapi spesifikasi kunci, harga estimasi, kecocokan persentase, kelebihan/kekurangan, serta tautan langsung untuk memeriksa ketersediaan pasar lokal.
              </p>
              <div className="pt-2">
                <button
                  onClick={onLoadDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Lihat demo hasil lengkap <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Preview Component */}
            <div className="md:col-span-7">
              <RecommendationPreview />
            </div>

          </div>
        </div>
      </section>

      {/* ?? Features strip ????????????????????????????????????????????????????? */}
      <section className="border-y border-border bg-surface py-10">
        <div className="mx-auto max-w-4xl px-5">
          <motion.div {...fade(0.5)} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-accent-lt flex items-center justify-center text-accent shrink-0">
                  {f.icon}
                </div>
                <p className="text-[0.75rem] font-mono font-semibold leading-snug mt-1 text-ink">{f.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ?? Bottom CTA ????????????????????????????????????????????????????????? */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:py-24 text-center">
        <motion.div {...fade(0.52)} className="space-y-6">
          <h2 className="text-[1.75rem] font-bold tracking-tight text-ink">
            Siap Menemukan Laptop Terbaikmu?
          </h2>
          <p className="text-[0.875rem] text-ink2 max-w-[40ch] mx-auto leading-relaxed">
            Hanya butuh 2 menit. Dapatkan 3 pilihan terbaik terkurasi AI tanpa dipungut biaya apapun.
          </p>
          <button
            onClick={() => onStart()}
            className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-none bg-accent text-bg font-mono text-xs uppercase tracking-[0.15em] font-bold hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Mulai Rekomendasi
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* ?? Footer ???????????????????????????????????????????????????????????? */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-4xl px-5 flex items-center justify-between">
          <div className="flex items-center gap-1 select-none">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] font-extrabold text-ink">LAPTOPMATCH</span>
            <span className="font-mono text-[0.6875rem] font-bold text-accent">//</span>
          </div>
          <p className="text-[0.6875rem] font-mono text-muted uppercase">? 2026 LAPTOPMATCH INDONESIA</p>
        </div>
      </footer>

    </div>
  );
}
