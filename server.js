import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const dataset = JSON.parse(fs.readFileSync("./dataset_full.json", "utf-8"));

app.post("/chat", (req, res) => {
  const userMsg = req.body.message.toLowerCase();
  const match = dataset.find(d => d.input.toLowerCase() === userMsg);
  const reply = match ? match.output : "Maaf, aku belum mengerti pertanyaanmu.";
  res.json({ reply });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
