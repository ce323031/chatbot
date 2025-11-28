import express from "express";
import cors from "cors";
import fs from "fs";
import { GoogleSpreadsheet } from "google-spreadsheet";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG
const SPREADSHEET_ID = "MASUKKAN_SPREADSHEET_ID";
const API_KEY = "MASUKKAN_GOOGLE_API_KEY";
const LOCAL_DATASET_PATH = "./dataset_full.json";

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// Fungsi ambil dataset dari Google Sheets
async function fetchDatasetFromSheets() {
  await doc.useApiKey(API_KEY);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows.map(r => ({ input: r.input.toLowerCase(), output: r.output }));
}

// Fungsi ambil dataset dari lokal
function fetchDatasetFromLocal() {
  if (!fs.existsSync(LOCAL_DATASET_PATH)) return [];
  const data = JSON.parse(fs.readFileSync(LOCAL_DATASET_PATH, "utf-8"));
  return data.map(d => ({ input: d.input.toLowerCase(), output: d.output }));
}

// Endpoint chat
app.post("/chat", async (req, res) => {
  const userMsg = req.body.message.toLowerCase();

  try {
    let dataset = [];
    try {
      dataset = await fetchDatasetFromSheets();
    } catch (err) {
      console.warn("Gagal ambil dari Sheets, fallback ke dataset lokal.");
      dataset = fetchDatasetFromLocal();
    }

    if (dataset.length === 0) {
      return res.json({ reply: "Dataset kosong, tidak ada jawaban." });
    }

    const match = dataset.find(d => d.input === userMsg);
    const reply = match ? match.output : "Maaf, aku belum mengerti pertanyaanmu.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error: gagal memproses permintaan." });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
