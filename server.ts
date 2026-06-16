import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/recommend", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { budget, needs, priorities, os, brand } = req.body;

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
                title: { type: Type.STRING, description: "Label seperti '#1 Pilihan Terbaik', '#2 Runner Up'" },
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
                  required: ["cpu", "ram", "storage", "gpu", "battery", "weight"]
                },
                description: { type: Type.STRING, description: "Penjelasan ringkas mengapa laptop ini cocok" },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["rank", "title", "name", "price", "specs", "description", "pros", "cons"]
            }
          },
          buyingAdvice: { type: Type.STRING, description: "Saran pembelian keseluruhan (misal tips cek garansi atau nunggu diskon)" }
        },
        required: ["recommendations", "buyingAdvice"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      res.json(result);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
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
