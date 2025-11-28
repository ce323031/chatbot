import express from "express";
import cors from "cors";
import { GoogleSpreadsheet } from "google-spreadsheet";

const app = express();
app.use(cors());
app.use(express.json());

// Ganti dengan ID sheet-mu dan API Key
const SPREADSHEET_ID = "MASUKKAN_SPREADSHEET_ID";
const API_KEY = "MASUKKAN_GOOGLE_API_KEY";

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// Fungsi ambil dataset dari Google Sheets
async function fetchDataset() {
  await doc.useApiKey(API_KEY);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  return rows.map(r => ({
    input: r.input.toLowerCase(),
    output: r.output
  }));
}

// Endpoint chat
app.post("/chat", async (req, res) => {
  const userMsg = req.body.message.toLowerCase();
  try {
    const dataset = await fetchDataset();
    const match = dataset.find(d => d.input === userMsg);
    const reply = match ? match.output : "Maaf, aku belum mengerti pertanyaanmu.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error: gagal mengambil dataset dari Google Sheets." });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
