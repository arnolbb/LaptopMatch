import { Sun, Moon, ArrowLeft, Cpu } from "lucide-react";
import { motion } from "motion/react";
import type { ResultData, UserPreferences } from "../types";
import { LaptopResultCard } from "./LaptopResultCard";
import { BuyingAdvicePanel } from "./BuyingAdvicePanel";

type ResultViewProps = {
  result: ResultData;
  preferences: UserPreferences | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
  onLogoClick?: () => void;
};

const RANK_META = [
  { badge: "01", label: "Pilihan Terbaik", highlight: true, score: 98 },
  { badge: "02", label: "Runner Up",       highlight: false, score: 92 },
  { badge: "03", label: "Alternatif",      highlight: false, score: 85 },
];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

export function ResultView({ result, preferences, isDarkMode, onToggleDarkMode, onReset, onLogoClick }: ResultViewProps) {
  return (
    <div className="min-h-screen bg-transparent text-ink">

      {/* ?? Nav ??????????????????????????????????????????????????????????????? */}
      <nav className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Cari Ulang
          </button>
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-1 select-none cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-extrabold text-ink">LAPTOPMATCH</span>
            <span className="font-mono text-xs font-bold text-accent">//</span>
          </button>
          <button
            onClick={onToggleDarkMode}
            className="w-8 h-8 rounded-none border border-border flex items-center justify-center text-muted hover:text-ink hover:border-border2 transition-colors duration-150 cursor-pointer"
            aria-label="Toggle tema"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </nav>

      {/* ?? Page header ??????????????????????????????????????????????????????? */}
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[0.625rem] text-accent font-semibold tracking-[0.16em] uppercase mb-1">
            LAPORAN ANALISIS AI
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-tight mb-1 uppercase text-ink">
            3 Rekomendasi Terbaik untuk Kamu
          </h1>
          <p className="text-[0.75rem] text-ink2 leading-relaxed">
            Dihasilkan secara instan oleh Gemini AI berdasarkan kriteria pencarian pasar Indonesia.
          </p>
        </motion.div>
      </div>

      {/* ?? User Preferences Summary Box ?????????????????????????????????????? */}
      {preferences && (
        <div className="mx-auto max-w-2xl px-5 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="bg-surface/50 border border-border p-4 font-mono text-[0.6875rem] space-y-2 select-none"
          >
            <div className="flex items-center gap-1.5 border-b border-border pb-1.5 text-muted uppercase font-bold tracking-wider">
              <span className="w-1 h-1 bg-accent shrink-0" />
              <span>KRITERIA PENCARIAN KAMU</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-ink">
              <div>
                <span className="text-muted">BUDGET:</span> {formatRupiah(preferences.budget)}
              </div>
              <div>
                <span className="text-muted">BRAND:</span> <span className="uppercase">{preferences.brand === "Bebas" ? "Semua" : preferences.brand}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted">KEBUTUHAN:</span> <span className="text-accent font-bold uppercase">{preferences.needs.join(", ")}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted">PRIORITAS FITUR:</span> <span className="uppercase">{preferences.priorities.length > 0 ? preferences.priorities.join(", ") : "Tidak spesifik"}</span>
              </div>
              <div>
                <span className="text-muted">OS PREFERENSI:</span> <span className="uppercase">{preferences.os === "Bebas" ? "Semua" : preferences.os}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ?? Cards List ???????????????????????????????????????????????????????? */}
      <div className="mx-auto max-w-2xl px-5 pb-6 space-y-5">
        {result.recommendations.map((rec, index) => {
          const meta = RANK_META[index] ?? { badge: String(index + 1).padStart(2, "0"), label: rec.title, highlight: false, score: 80 - index * 5 };
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <LaptopResultCard
                rec={rec}
                badge={meta.badge}
                label={meta.label}
                highlight={meta.highlight}
                matchScore={meta.score}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ?? Buying advice panel ??????????????????????????????????????????????? */}
      <div className="mx-auto max-w-2xl px-5 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <BuyingAdvicePanel advice={result.buyingAdvice} />
        </motion.div>
      </div>

    </div>
  );
}
