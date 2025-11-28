import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Pastikan dataset path aman
const datasetPath = path.join(__dirname, "dataset_full.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));

app.post("/chat", (req, res) => {
  const userMsg = req.body.message.toLowerCase();
  const match = dataset.find(d => d.input.toLowerCase() === userMsg);
  const reply = match ? match.output : "Maaf, aku belum mengerti pertanyaanmu.";
  res.json({ reply });
});

// WAJIB untuk hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
