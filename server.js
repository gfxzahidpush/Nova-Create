import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ttsHandler from "./tts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static(__dirname)); // রুট ফোল্ডার থেকে ফাইল সার্ভ করবে

app.post("/api/tts", (req, res) => ttsHandler(req, res));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // index.html রুট-এ আছে
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
