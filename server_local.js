import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const datasetPath = path.join(__dirname, "dataset_full.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));

app.post("/chat", (req, res) => {
  const userMsg = req.body.message.toLowerCase();
  const matched = dataset.find(d => d.input.toLowerCase() === userMsg);
  const reply = matched ? matched.output : "Maaf, aku tidak mengerti 😅";
  res.json({ reply });
});

app.listen(3000, () => console.log("LOCAL backend running on port 3000"));
