import React, { useState, useEffect } from "react";
import { ChevronRight, Laptop, Cpu, Battery, Weight, DollarSign, Monitor, AlertCircle, CheckCircle2, ChevronLeft, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NEEDS_CATEGORIES = [
  "Pelajar/Mahasiswa",
  "Kerja Kantoran",
  "Programming",
  "Desain & Editing",
  "Gaming",
  "Content Creator",
  "Data & AI/ML",
  "Mobilitas Tinggi"
];

const PRIORITIES = [
  "Performa", "Baterai", "Layar", "Bobot", "Port",
  "RAM/Storage", "Desain", "Harga", "GPU", "Keyboard"
];

const OS_OPTIONS = ["Windows", "macOS", "Linux/Bebas"];

const BRAND_OPTIONS = ["Bebas", "ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"];

type Recommendation = {
  rank: number;
  title: string;
  name: string;
  price: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    battery: string;
    weight: string;
  };
  description: string;
  pros: string[];
  cons: string[];
};

type ResultData = {
  recommendations: Recommendation[];
  buyingAdvice: string;
};

export default function App() {
  const [budget, setBudget] = useState<number>(15000000);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string>("Bebas");
  const [selectedBrand, setSelectedBrand] = useState<string>("Bebas");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark mode

  useEffect(() => {
    // Add or remove dark class on document element so body styles apply
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const submitForm = async () => {
    if (selectedNeeds.length === 0) {
      alert("Pilih minimal 1 kebutuhan utama.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan rekomendasi AI");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi server AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-bg-main text-text-main pb-20 transition-colors">
        <header className="px-4 md:px-6 py-4 md:py-6 border-b border-card-hover bg-card-bg/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              <h1 className="font-display font-bold text-lg md:text-xl tracking-tight">LaptopMatch</h1>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-bg-main border border-card-hover rounded-full text-muted hover:text-text-main transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setResult(null)}
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-text-main transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Cari Ulang
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-6 mt-6 md:mt-8 space-y-8 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Rekomendasi AI Untuk Anda</h2>
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto px-2">
              Berdasarkan budget {formatRupiah(budget)}, kebutuhan {selectedNeeds.join(", ")}
              {selectedBrand !== "Bebas" ? `, dan khusus untuk merek ${selectedBrand}` : ""}.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {result.recommendations.map((rec) => (
              <motion.div 
                key={rec.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: rec.rank * 0.1 }}
                className="bg-card-bg border border-card-hover rounded-2xl overflow-hidden shadow-lg md:shadow-xl"
              >
                <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="md:w-1/3 flex flex-col gap-3 md:gap-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-xs md:text-sm w-fit">
                      {rec.title}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold leading-snug">{rec.name}</h3>
                    <div className="text-xl md:text-2xl font-bold text-accent">{rec.price}</div>
                    <p className="text-muted leading-relaxed mt-1 md:mt-2 text-sm md:text-base">{rec.description}</p>
                  </div>
                  
                  <div className="md:w-2/3 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      <SpecBadge icon={<Cpu className="w-4 h-4" />} label="CPU" value={rec.specs.cpu} />
                      <SpecBadge icon={<Monitor className="w-4 h-4" />} label="GPU" value={rec.specs.gpu} />
                      <SpecBadge icon={<Laptop className="w-4 h-4" />} label="RAM" value={rec.specs.ram} />
                      <SpecBadge icon={<Battery className="w-4 h-4" />} label="Baterai" value={rec.specs.battery} />
                      <SpecBadge icon={<Weight className="w-4 h-4" />} label="Bobot" value={rec.specs.weight} />
                      <div className="bg-bg-main p-3 rounded-xl border border-card-hover flex flex-col justify-center">
                        <span className="text-xs text-muted">Storage</span>
                        <span className="font-medium text-xs md:text-sm truncate">{rec.specs.storage}</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-success/5 border border-success/10 rounded-xl p-4">
                        <h4 className="font-bold text-success flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4" /> Kelebihan
                        </h4>
                        <ul className="space-y-2 text-sm text-text-main/80">
                          {rec.pros.map((pro, i) => (
                            <li key={i} className="flex gap-2"><span className="text-success mt-0.5">•</span> <span>{pro}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-danger/5 border border-danger/10 rounded-xl p-4">
                        <h4 className="font-bold text-danger flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4" /> Kekurangan
                        </h4>
                        <ul className="space-y-2 text-sm text-text-main/80">
                          {rec.cons.map((con, i) => (
                            <li key={i} className="flex gap-2"><span className="text-danger mt-0.5">•</span> <span>{con}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 md:p-8">
            <h3 className="font-display font-bold text-lg md:text-xl mb-2 md:mb-3 flex items-center gap-2 text-accent">
              💡 Saran Pembelian
            </h3>
            <p className="text-text-main/90 leading-relaxed text-base md:text-lg">
              {result.buyingAdvice}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-main pb-24 transition-colors">
      <header className="px-4 md:px-6 py-4 md:py-6 border-b border-card-hover flex items-center justify-between">
        <div className="w-10"></div> {/* Spacer for symmetry */}
        <div className="flex items-center gap-2 md:gap-3">
          <Laptop className="w-6 h-6 md:w-8 md:h-8 text-accent" />
          <h1 className="font-display font-extrabold text-xl md:text-2xl tracking-tight">LaptopMatch</h1>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 md:p-2.5 bg-card-bg border border-card-hover rounded-full text-muted hover:text-text-main transition-colors shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6 mt-4 md:mt-12 space-y-8 md:space-y-10">
        <div className="text-center space-y-3 md:space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight px-2">
            Temukan Laptop <span className="text-accent">Sempurna</span>
          </h2>
          <p className="text-muted text-base md:text-lg px-4">AI bantu merangkum pilihan terbaik untuk pasar Indonesia sesuai kebutuhan kamu.</p>
        </div>

        <div className="bg-card-bg border border-card-hover rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl md:shadow-2xl space-y-8 md:space-y-10">
          
          {/* Step 1: Budget */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
              <div>
                <h3 className="font-display font-bold text-lg md:text-xl">Budget Maksimal</h3>
                <p className="text-muted text-xs md:text-sm mt-1">Geser untuk menentukan dana pembeliaan.</p>
              </div>
              <div className="text-xl md:text-2xl font-bold text-accent">
                {formatRupiah(budget)}
              </div>
            </div>
            
            <div className="relative pt-4 px-1 flex-1 w-full pl-2 pr-2">
              <input 
                type="range" 
                min="3000000" 
                max="50000000" 
                step="1000000" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-bg-main rounded-lg appearance-none cursor-pointer relative z-10"
                style={{
                  background: `linear-gradient(to right, var(--color-accent) ${(budget - 3000000) / (50000000 - 3000000) * 100}%, var(--color-card-hover) ${(budget - 3000000) / (50000000 - 3000000) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted mt-3">
                <span>Rp 3 Jt</span>
                <span>Rp 25 Jt</span>
                <span>Rp 50 Jt</span>
              </div>
            </div>
          </section>

          {/* Step 2: Needs */}
          <section className="space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl flex items-center gap-2">
                Kebutuhan Utama <span className="text-[10px] md:text-xs bg-danger/20 text-danger px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Wajib</span>
              </h3>
              <p className="text-muted text-xs md:text-sm mt-1">Pilih minimal 1 agar AI lebih akurat.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              {NEEDS_CATEGORIES.map(need => {
                const isActive = selectedNeeds.includes(need);
                return (
                  <button
                    key={need}
                    onClick={() => toggleSelection(need, selectedNeeds, setSelectedNeeds)}
                    className={`px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      isActive 
                        ? 'bg-accent text-white border-accent shadow-md shadow-accent/25 ring-1 ring-accent/20' 
                        : 'bg-bg-main text-muted border-card-hover hover:border-accent/40 hover:bg-accent/5 hover:text-text-main'
                    }`}
                  >
                    {need}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Priorities */}
          <section className="space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl">Prioritas Spesifikasi</h3>
              <p className="text-muted text-xs md:text-sm mt-1">Apa yang paling penting bagi kamu? (Opsional)</p>
            </div>
             <div className="flex flex-wrap gap-2 md:gap-3">
              {PRIORITIES.map(priority => {
                const isActive = selectedPriorities.includes(priority);
                return (
                  <button
                    key={priority}
                    onClick={() => toggleSelection(priority, selectedPriorities, setSelectedPriorities)}
                    className={`px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      isActive 
                        ? 'bg-text-main text-bg-main border-text-main shadow-md' 
                        : 'bg-bg-main text-muted border-card-hover hover:border-text-main/30 hover:bg-text-main/5 hover:text-text-main'
                    }`}
                  >
                    {priority}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 4: Brand */}
          <section className="space-y-4 pt-2">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl">Preferensi Merek</h3>
              <p className="text-muted text-xs md:text-sm mt-1">Pilih merek tertentu jika ada (Opsional)</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {BRAND_OPTIONS.map(brand => {
                const isActive = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      isActive 
                        ? 'bg-accent text-white border-accent shadow-md shadow-accent/25 ring-1 ring-accent/20' 
                        : 'bg-bg-main text-muted border-card-hover hover:border-accent/40 hover:bg-accent/5 hover:text-text-main'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 5: OS */}
          <section className="space-y-4 pt-2">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl">Sistem Operasi</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {OS_OPTIONS.map(os => {
                const isActive = selectedOS === os;
                return (
                  <button
                    key={os}
                    onClick={() => setSelectedOS(os)}
                    className={`py-3 md:py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                      isActive 
                        ? 'bg-accent/10 text-accent border-accent shadow-sm' 
                        : 'bg-bg-main text-muted border-card-hover hover:border-accent/40 hover:bg-accent/5 hover:text-text-main'
                    }`}
                  >
                    {os}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={submitForm}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-base md:text-lg shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              <>
                Temukan Laptop Terbaik <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm flex items-start gap-3 w-full animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SpecBadge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-bg-main p-2.5 md:p-3 rounded-xl border border-card-hover flex flex-col gap-1 md:gap-1.5">
      <div className="flex items-center gap-1.5 text-muted text-[10px] md:text-xs font-medium">
        {icon} <span>{label}</span>
      </div>
      <div className="font-medium text-xs md:text-sm truncate" title={value}>{value}</div>
    </div>
  );
}
