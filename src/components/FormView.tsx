import { useState, useEffect } from "react";
import { type ReactNode } from "react";
import { Sun, Moon, AlertCircle, ArrowRight, ArrowLeft, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  NEEDS_CATEGORIES,
  PRIORITIES,
  OS_OPTIONS,
  BRAND_OPTIONS,
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_DEFAULT,
  FETCH_TIMEOUT_MS,
} from "../constants";
import type { ResultData, UserPreferences } from "../types";

type FormViewProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResult: (data: ResultData, preferences: UserPreferences) => void;
  onBack: () => void;
  initialNeed?: string;
  onLogoClick?: () => void;
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

// ?? Section card ?????????????????????????????????????????????????????????????
function SectionCard({
  step,
  title,
  hint,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-none p-5 md:p-6">
      <div className="flex items-baseline gap-2.5 mb-4">
        <span className="font-mono text-[0.625rem] font-bold text-accent tracking-widest shrink-0">{step}</span>
        <div>
          <h2 className="text-[0.9375rem] font-bold tracking-tight text-ink uppercase">{title}</h2>
          {hint && <p className="text-[0.75rem] text-muted mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ?? Toggle chip ???????????????????????????????????????????????????????????????
type ChipProps = { label: string; active: boolean; onClick: () => void; key?: string | number };
function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none border text-[0.8125rem] font-medium
        transition-all duration-150 select-none cursor-pointer
        ${active
          ? "bg-accent text-bg border-accent"
          : "bg-bg text-ink2 border-border hover:border-accent/50 hover:text-ink hover:bg-accent-lt/40"
        }
      `}
    >
      {active && <span className="w-1.5 h-1.5 bg-bg shrink-0" />}
      {label}
    </button>
  );
}

// ?? Radio row ?????????????????????????????????????????????????????????????????
type RadioRowProps = { label: string; active: boolean; onClick: () => void; key?: string | number };
function RadioRow({ label, active, onClick }: RadioRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-2.5 rounded-none border
        text-[0.8125rem] font-medium transition-all duration-150 select-none cursor-pointer
        ${active
          ? "bg-accent-lt border-accent text-accent"
          : "bg-bg border-border text-ink2 hover:border-accent/40 hover:bg-accent-lt/30 hover:text-ink"
        }
      `}
    >
      <span>{label}</span>
      <span className={`
        w-3.5 h-3.5 rounded-none border flex items-center justify-center transition-colors
        ${active ? "border-accent bg-accent" : "border-border2 bg-transparent"}
      `}>
        {active && <span className="w-1.5 h-1.5 bg-bg block" />}
      </span>
    </button>
  );
}

export function FormView({ isDarkMode, onToggleDarkMode, onResult, onBack, initialNeed, onLogoClick }: FormViewProps) {
  const [budget, setBudget] = useState<number>(BUDGET_DEFAULT);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(initialNeed ? [initialNeed] : []);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string>("Bebas");
  const [selectedBrand, setSelectedBrand] = useState<string>("Bebas");
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialNeed) {
      setSelectedNeeds([initialNeed]);
      // If a need is passed, we can fast-track or just ensure it is selected
    }
  }, [initialNeed]);

  const toggleNeed = (item: string) => {
    setSelectedNeeds(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    setValidationError(null);
  };

  const togglePriority = (item: string) =>
    setSelectedPriorities(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const sliderPct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  const handleNextStep = () => {
    if (currentStep === 2 && selectedNeeds.length === 0) {
      setValidationError("Pilih minimal satu kebutuhan untuk melanjutkan.");
      return;
    }
    setValidationError(null);
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitForm = async () => {
    if (selectedNeeds.length === 0) {
      setValidationError("Pilih minimal satu kebutuhan untuk melanjutkan.");
      setCurrentStep(2);
      return;
    }
    setValidationError(null);
    setError(null);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          needs: selectedNeeds,
          priorities: selectedPriorities,
          os: selectedOS === "Bebas" ? null : selectedOS,
          brand: selectedBrand === "Bebas" ? null : selectedBrand,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const msg = body?.error;
        if (response.status === 429) throw new Error(msg || "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.");
        if (response.status === 400) throw new Error(msg || "Data permintaan tidak valid.");
        throw new Error(msg || "Gagal mendapatkan rekomendasi.");
      }

      onResult(await response.json(), {
        budget,
        needs: selectedNeeds,
        priorities: selectedPriorities,
        os: selectedOS,
        brand: selectedBrand,
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Permintaan habis waktu. Server AI mungkin sedang sibuk.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const STEPS_NAV = [
    { num: 1, label: "Budget" },
    { num: 2, label: "Kebutuhan" },
    { num: 3, label: "Prioritas" },
    { num: 4, label: "Merek & OS" },
    { num: 5, label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-ink">

      {/* ?? Nav ????????????????????????????????????????????????????????????? */}
      <nav className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> KELUAR
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

      {/* ?? Page header ????????????????????????????????????????????????????? */}
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-4">
        <div>
          <p className="font-mono text-[0.625rem] text-accent font-semibold tracking-[0.16em] uppercase mb-1">
            WIZARD REKOMENDASI
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-ink uppercase mb-1">
            Spesifikasikan Laptop Idealmu
          </h1>
          <p className="text-[0.75rem] text-ink2 leading-relaxed">
            Ikuti langkah demi langkah untuk formulasi rekomendasi berbasis kecerdasan buatan.
          </p>
        </div>
      </div>

      {/* ?? Wizard Form ????????????????????????????????????????????????????? */}
      <div className="mx-auto max-w-2xl px-5 pb-10">
        
        {/* Step Progress Indicator */}
        <div className="mb-6 border border-border p-4 bg-surface flex flex-row items-center justify-between gap-2 text-[0.6875rem] font-mono">
          <div className="flex items-center gap-2 select-none">
            <span className="text-accent font-bold">Langkah 0{currentStep}</span>
            <span className="text-muted">/</span>
            <span className="text-ink uppercase tracking-wider font-semibold">{STEPS_NAV[currentStep - 1].label}</span>
          </div>
          <div className="flex gap-1">
            {STEPS_NAV.map(s => (
              <div 
                key={s.num} 
                className={`w-3 h-1.5 transition-colors duration-150 ${
                  s.num === currentStep 
                    ? "bg-accent" 
                    : s.num < currentStep 
                      ? "bg-accent-lt border border-accent/20" 
                      : "bg-border2"
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Form Wizard Pages */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                className="w-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionCard step="Langkah 01" title="Batasan Budget Maksimal">
                  <div className="space-y-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[1.5rem] font-bold text-ink tabular-nums" aria-live="polite">
                        {formatRupiah(budget)}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-muted tabular-nums shrink-0">
                        / {formatRupiah(BUDGET_MAX)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={500_000}
                      value={budget}
                      onChange={e => setBudget(Number(e.target.value))}
                      style={{
                        "--slider-pct": `${sliderPct}%`,
                      } as any}
                      className="w-full"
                      aria-label="Budget maksimal"
                    />
                    <div className="flex justify-between font-mono text-[0.625rem] text-muted uppercase tracking-wider">
                      <span>MIN: {formatRupiah(BUDGET_MIN)}</span>
                      <span>MAX: {formatRupiah(BUDGET_MAX)}</span>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                className="w-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionCard step="Langkah 02" title="Kebutuhan Penggunaan Utama" hint="Pilih minimal satu kategori yang sesuai dengan aktivitas harianmu.">
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-start gap-2.5 text-danger text-[0.8125rem] py-2.5 px-3.5 rounded-sm bg-danger-lt border border-danger/25 mb-4"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>{validationError}</p>
                    </motion.div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {NEEDS_CATEGORIES.map(need => (
                      <Chip
                        key={need}
                        label={need}
                        active={selectedNeeds.includes(need)}
                        onClick={() => toggleNeed(need)}
                      />
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                className="w-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionCard step="Langkah 03" title="Prioritas Fitur Utama" hint="Opsional ? pilih aspek perangkat keras yang paling kamu prioritaskan.">
                  <div className="flex flex-wrap gap-2">
                    {PRIORITIES.map(priority => (
                      <Chip
                        key={priority}
                        label={priority}
                        active={selectedPriorities.includes(priority)}
                        onClick={() => togglePriority(priority)}
                      />
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                className="w-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SectionCard step="Langkah 04A" title="Preferensi Merek">
                    <div className="flex flex-wrap gap-2">
                      {BRAND_OPTIONS.map(brand => (
                        <Chip
                          key={brand}
                          label={brand}
                          active={selectedBrand === brand}
                          onClick={() => setSelectedBrand(brand)}
                        />
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard step="Langkah 04B" title="Sistem Operasi (OS)">
                    <div className="space-y-2">
                      {OS_OPTIONS.map(({ label, value }) => (
                        <RadioRow
                          key={value}
                          label={label}
                          active={selectedOS === value}
                          onClick={() => setSelectedOS(value)}
                        />
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                className="w-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionCard step="Langkah 05" title="Review Pilihan Anda" hint="Periksa kembali formulasi preferensi sebelum memicu komputasi rekomendasi AI.">
                  <div className="border border-border bg-bg/50 divide-y divide-border font-mono text-xs">
                    <div className="flex justify-between p-3">
                      <span className="text-muted uppercase font-semibold">BATASAN BUDGET</span>
                      <span className="text-ink font-bold">{formatRupiah(budget)}</span>
                    </div>
                    <div className="flex flex-col p-3 gap-1.5">
                      <span className="text-muted uppercase font-semibold">KEBUTUHAN UTAMA</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedNeeds.map(need => (
                          <span key={need} className="bg-accent-lt text-accent px-1.5 py-0.5 text-[0.6875rem] font-bold">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col p-3 gap-1.5">
                      <span className="text-muted uppercase font-semibold">PRIORITAS FITUR</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPriorities.length > 0 ? (
                          selectedPriorities.map(p => (
                            <span key={p} className="bg-surface2 border border-border text-ink2 px-1.5 py-0.5 text-[0.6875rem]">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted italic">Bebas / Tidak spesifik</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-muted uppercase font-semibold">PREFERENSI MEREK</span>
                      <span className="text-ink font-bold uppercase">{selectedBrand === "Bebas" ? "Semua Merek" : selectedBrand}</span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-muted uppercase font-semibold">SISTEM OPERASI</span>
                      <span className="text-ink font-bold uppercase">
                        {selectedOS === "Bebas" ? "Semua OS" : OS_OPTIONS.find(o => o.value === selectedOS)?.label || selectedOS}
                      </span>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Control Panel */}
        <div className="mt-6 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-4 py-3 rounded-none border border-border text-[0.6875rem] font-mono font-bold uppercase tracking-wider hover:bg-surface active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-5 py-3 rounded-none bg-accent text-bg text-[0.6875rem] font-mono font-bold uppercase tracking-wider hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              Lanjut <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={submitForm}
              disabled={isLoading}
              aria-busy={isLoading}
              className="
                flex items-center gap-2 py-4.5 px-6 rounded-none
                bg-accent text-bg font-mono text-xs uppercase tracking-[0.15em] font-bold
                transition-all duration-150
                hover:opacity-90 active:scale-[0.99]
                disabled:opacity-45 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  MEMPROSES...
                </span>
              ) : (
                <>Dapatkan Rekomendasi <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>

        {/* Submission Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mt-4 flex items-start gap-2.5 text-danger text-[0.8125rem] py-3 px-4 rounded-none bg-danger-lt border border-danger/25"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
