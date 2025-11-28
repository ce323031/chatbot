import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const dataset = JSON.parse(fs.readFileSync("dataset_full.json"));

app.post("/chat", (req, res) => {
  const userMsg = req.body.message.toLowerCase();
  const matched = dataset.find(d => d.input.toLowerCase() === userMsg);
  const reply = matched ? matched.output : "Maaf, aku tidak mengerti 😅";
  res.json({ reply });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
