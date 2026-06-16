import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const PORT = 3000;

// â”€â”€ Simple in-memory rate limiter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;            // max 5 requests per window
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({
      error: "Terlalu banyak permintaan. Silakan coba lagi dalam " + retryAfter + " detik."
    });
  }

  entry.count++;
  next();
}

// â”€â”€ Input validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VALID_NEEDS = new Set([
  "Pelajar/Mahasiswa",
  "Kerja Kantoran",
  "Programming",
  "Desain & Editing",
  "Gaming",
  "Content Creator",
  "Data & AI/ML",
  "Mobilitas Tinggi",
]);

const VALID_PRIORITIES = new Set([
  "Performa", "Baterai", "Layar", "Bobot", "Port",
  "RAM/Storage", "Desain", "Harga", "GPU", "Keyboard",
]);

const VALID_OS = new Set(["Windows", "macOS", "Linux/Bebas"]);
const VALID_BRANDS = new Set(["Bebas", "ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"]);

type ValidatedInput = {
  budget: number;
  needs: string[];
  priorities: string[];
  os: string | null;
  brand: string | null;
};

function validateInput(body: unknown): { ok: true; data: ValidatedInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Body permintaan tidak valid." };
  }

  const b = body as Record<string, unknown>;

  // Budget
  if (typeof b.budget !== "number" || !Number.isFinite(b.budget)) {
    return { ok: false, error: "Budget harus berupa angka." };
  }
  if (b.budget < 1_000_000 || b.budget > 500_000_000) {
    return { ok: false, error: "Budget harus antara Rp 1.000.000 dan Rp 500.000.000." };
  }

  // Needs
  if (!Array.isArray(b.needs) || b.needs.length === 0 || b.needs.length > 8) {
    return { ok: false, error: "Pilih 1â€“8 kebutuhan utama." };
  }
  if (!b.needs.every((n: unknown) => typeof n === "string" && VALID_NEEDS.has(n))) {
    return { ok: false, error: "Satu atau lebih kebutuhan tidak valid." };
  }

  // Priorities
  const priorities = Array.isArray(b.priorities) ? b.priorities : [];
  if (priorities.length > 10) {
    return { ok: false, error: "Prioritas maksimal 10 item." };
  }
  if (!priorities.every((p: unknown) => typeof p === "string" && VALID_PRIORITIES.has(p))) {
    return { ok: false, error: "Satu atau lebih prioritas tidak valid." };
  }

  // OS
  let os: string | null = null;
  if (b.os !== null && b.os !== undefined) {
    if (typeof b.os !== "string" || !VALID_OS.has(b.os)) {
      return { ok: false, error: "Sistem operasi tidak valid." };
    }
    os = b.os;
  }

  // Brand
  let brand: string | null = null;
  if (b.brand !== null && b.brand !== undefined) {
    if (typeof b.brand !== "string" || !VALID_BRANDS.has(b.brand)) {
      return { ok: false, error: "Merek tidak valid." };
    }
    brand = b.brand;
  }

  return {
    ok: true,
    data: {
      budget: b.budget,
      needs: b.needs as string[],
      priorities: priorities as string[],
      os,
      brand,
    },
  };
}

// â”€â”€ AI client (singleton) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// â”€â”€ Response schema for Gemini â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      description: "Daftar 3 rekomendasi laptop",
      items: {
        type: Type.OBJECT,
        properties: {
          rank: { type: Type.INTEGER, description: "1, 2, atau 3" },
          title: { type: Type.STRING, description: "Label seperti '#1 Pilihan Terbaik'" },
          name: { type: Type.STRING, description: "Nama lengkap laptop" },
          price: { type: Type.STRING, description: "Estimasi harga dalam Rupiah (format: Rp X.XXX.XXX)" },
          specs: {
            type: Type.OBJECT,
            properties: {
              cpu: { type: Type.STRING },
              ram: { type: Type.STRING },
              storage: { type: Type.STRING },
              gpu: { type: Type.STRING },
              battery: { type: Type.STRING },
              weight: { type: Type.STRING },
            },
            required: ["cpu", "ram", "storage", "gpu", "battery", "weight"],
          },
          description: { type: Type.STRING, description: "Penjelasan ringkas mengapa laptop ini cocok" },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["rank", "title", "name", "price", "specs", "description", "pros", "cons"],
      },
    },
    buyingAdvice: { type: Type.STRING, description: "Saran pembelian keseluruhan" },
  },
  required: ["recommendations", "buyingAdvice"],
};

// â”€â”€ Server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function startServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/recommend", rateLimiter, async (req, res) => {
    try {
      const ai = getAIClient();
      if (!ai) {
        return res.status(500).json({ error: "GEMINI_API_KEY belum dikonfigurasi." });
      }

      // Validate input
      const validation = validateInput(req.body);
      if (!validation.ok) {
        return res.status(400).json({ error: (validation as { ok: false; error: string }).error });
      }

      const { budget, needs, priorities, os, brand } = validation.data;

      const prompt = `Anda adalah Pakar Laptop Indonesia.
Pengguna mencari laptop dengan kriteria berikut:
- Budget Maksimal: Rp ${budget.toLocaleString("id-ID")}
- Kebutuhan Utama: ${needs.join(", ")}
- Prioritas Fitur: ${priorities.length > 0 ? priorities.join(", ") : "Tidak spesifik"}
- Preferensi OS: ${os || "Bebas"}
- Preferensi Brand: ${brand || "Bebas"}

Berikan 3 rekomendasi laptop terbaik (yang nyata dan tersedia di pasar Indonesia) sesuai kriteria di atas:
1. Pilihan Terbaik
2. Runner Up
3. Alternatif Menarik

Estimasi harga harus serealistis mungkin berdasarkan harga pasar (Tokopedia/Shopee).

Untuk setiap laptop, berikan: nama, harga, spesifikasi kunci (CPU, RAM, Storage, GPU, Battery, Weight), deskripsi singkat, serta pros & cons.
Dan tambahkan satu paragraf singkat "Saran Pembelian" di akhir.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      // Basic sanity check on AI response
      if (!result.recommendations || !Array.isArray(result.recommendations)) {
        return res.status(502).json({ error: "Respons AI tidak sesuai format yang diharapkan." });
      }

      res.json(result);
    } catch (error: unknown) {
      // Differentiate error types for better diagnostics
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error generating recommendations:", message);

      if (message.includes("API_KEY") || message.includes("401") || message.includes("403")) {
        return res.status(401).json({ error: "API key tidak valid atau tidak memiliki akses." });
      }
      if (message.includes("429") || message.includes("quota") || message.includes("rate")) {
        return res.status(429).json({ error: "Batas permintaan API tercapai. Silakan coba lagi nanti." });
      }
      if (message.includes("SAFETY") || message.includes("blocked")) {
        return res.status(422).json({ error: "Permintaan diblokir oleh filter keamanan AI. Coba ubah kriteria Anda." });
      }
      if (message.includes("timeout") || message.includes("ETIMEDOUT")) {
        return res.status(504).json({ error: "Server AI tidak merespons tepat waktu. Silakan coba lagi." });
      }

      res.status(500).json({ error: "Gagal menghasilkan rekomendasi. Silakan coba lagi." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

