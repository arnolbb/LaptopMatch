import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LandingView } from "./components/LandingView";
import { FormView } from "./components/FormView";
import { ResultView } from "./components/ResultView";
import type { ResultData, UserPreferences } from "./types";

type View = "landing" | "form" | "result";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } },
};

const MOCK_DEMO_RESULT: ResultData = {
  recommendations: [
    {
      rank: 1,
      title: "#1 Pilihan Terbaik",
      name: "Lenovo Legion Slim 5 16ARP8",
      price: "Rp 19.499.000",
      specs: {
        cpu: "AMD Ryzen 7 7735HS",
        ram: "16GB LPDDR5 6400MHz",
        storage: "512GB SSD NVMe Gen4",
        gpu: "NVIDIA GeForce RTX 4060 8GB",
        battery: "80Whr up to 6 hours",
        weight: "2.3 kg"
      },
      description: "Performa seimbang luar biasa untuk rendering 3D, coding berat, dan gaming intens. Efisiensi daya Ryzen 7 HS-series terbukti mendinginkan suhu kerja laptop dengan sangat baik.",
      pros: [
        "Performa grafis RTX 4060 tangguh",
        "Suhu kerja dingin dengan pendingin Legion Coldfront 5.0",
        "Layar IPS 165Hz akurasi warna tinggi"
      ],
      "cons": [
        "Bobot laptop dan charger bawaan relatif berat",
        "Speaker internal standar"
      ]
    },
    {
      "rank": 2,
      "title": "Runner Up",
      "name": "ASUS TUF Gaming A15 FA507UV",
      "price": "Rp 18.299.000",
      "specs": {
        "cpu": "AMD Ryzen 9 8945H",
        "ram": "16GB DDR5 5600MHz",
        "storage": "512GB SSD NVMe PCIe 4.0",
        "gpu": "NVIDIA GeForce RTX 4060 8GB",
        "battery": "90Whr up to 8 hours",
        "weight": "2.2 kg"
      },
      "description": "Konstruksi bersertifikasi militer yang kokoh dengan baterai jumbo 90Whr. Sangat cocok bagi Anda yang membutuhkan performa tinggi namun tetap ingin membawa laptop bepergian.",
      "pros": [
        "Kapasitas baterai besar di kelasnya",
        "Build quality solid standar militer MIL-STD-810H",
        "Prosesor Ryzen 9 kelas atas"
      ],
      "cons": [
        "Layar hanya sRGB 100% IPS standar",
        "Kipas bising pada performa puncak"
      ]
    },
    {
      "rank": 3,
      "title": "Alternatif",
      "name": "HP Victus 16-r1013TX",
      "price": "Rp 17.899.000",
      "specs": {
        "cpu": "Intel Core i7-14700HX",
        "ram": "16GB DDR5 (Dual Channel)",
        "storage": "512GB SSD NVMe Gen4",
        "gpu": "NVIDIA GeForce RTX 4060 8GB",
        "battery": "70Whr up to 4 hours",
        "weight": "2.33 kg"
      },
      "description": "Alternatif berbasis Intel Core Gen 14 HX-series yang memiliki keunggulan performa multi-core murni yang luar biasa tinggi, ideal untuk rendering video super cepat.",
      "pros": [
        "Prosesor Intel Core i7-14700HX performa tinggi",
        "Desain minimalis profesional tidak terlalu mencolok",
        "Layar 16.1 inci yang lega"
      ],
      "cons": [
        "Ketahanan baterai relatif singkat",
        "Bahan casing plastik polikarbonat"
      ]
    }
  ],
  "buyingAdvice": "Untuk performa gaming dan produktivitas jangka panjang terbaik di rentang harga 17-20 juta Rupiah, Lenovo Legion Slim 5 adalah pilihan utama berkat kualitas layar dan sistem pendingin terbaiknya. Jika Anda membutuhkan daya tahan baterai ekstra saat bepergian, ASUS TUF A15 dengan baterai 90Whr adalah pilihan alternatif yang sangat bijak. Gunakan Tokopedia atau Shopee untuk membandingkan harga distributor resmi guna mendapatkan cashback dan garansi resmi Indonesia."
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [view, setView] = useState<View>("landing");
  const [result, setResult] = useState<ResultData | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [initialNeed, setInitialNeed] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDark = () => setIsDarkMode(d => !d);

  const handleStart = (need?: string) => {
    setInitialNeed(need);
    setView("form");
  };

  const handleLogoClick = () => {
    setResult(null);
    setPreferences(null);
    setInitialNeed(undefined);
    setView("landing");
  };

  const handleResult = (data: ResultData, prefs: UserPreferences) => {
    setResult(data);
    setPreferences(prefs);
    setView("result");
  };

  const handleReset = () => {
    setResult(null);
    setPreferences(null);
    setView("form");
  };

  const handleLoadDemo = () => {
    setResult(MOCK_DEMO_RESULT);
    setPreferences({
      budget: 20000000,
      needs: ["Gaming", "Programming"],
      priorities: ["Performa", "Layar"],
      os: "Windows",
      brand: "Lenovo",
    });
    setView("result");
  };

  return (
    <div className="min-h-screen bg-bg bg-grid text-ink">
      <AnimatePresence mode="wait">
      {view === "landing" && (
        <motion.div key="landing" {...pageVariants} className="w-full">
          <LandingView
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDark}
            onStart={handleStart}
            onLoadDemo={handleLoadDemo}
          />
        </motion.div>
      )}
      {view === "form" && (
        <motion.div key="form" {...pageVariants} className="w-full">
          <FormView
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDark}
            onResult={(data, prefs) => handleResult(data, prefs)}
            onBack={() => setView("landing")}
            initialNeed={initialNeed}
            onLogoClick={handleLogoClick}
          />
        </motion.div>
      )}
      {view === "result" && result && (
        <motion.div key="result" {...pageVariants} className="w-full">
          <ResultView
            result={result}
            preferences={preferences}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDark}
            onReset={handleReset}
            onLogoClick={handleLogoClick}
          />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
