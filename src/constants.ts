export const NEEDS_CATEGORIES = [
  "Pelajar/Mahasiswa",
  "Kerja Kantoran",
  "Programming",
  "Desain & Editing",
  "Gaming",
  "Content Creator",
  "Data & AI/ML",
  "Mobilitas Tinggi",
] as const;

export const PRIORITIES = [
  "Performa", "Baterai", "Layar", "Bobot", "Port",
  "RAM/Storage", "Desain", "Harga", "GPU", "Keyboard",
] as const;

// "Semua / Bebas" is the default — keep value as "Bebas" for API compat
export const OS_OPTIONS = [
  { label: "Semua / Bebas", value: "Bebas" },
  { label: "Windows", value: "Windows" },
  { label: "macOS", value: "macOS" },
  { label: "Linux / Bebas", value: "Linux/Bebas" },
] as const;

export const BRAND_OPTIONS = ["Bebas", "ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"] as const;

export const BUDGET_MIN = 3_000_000;
export const BUDGET_MAX = 30_000_000;
export const BUDGET_DEFAULT = 15_000_000;

export const FETCH_TIMEOUT_MS = 30_000;
