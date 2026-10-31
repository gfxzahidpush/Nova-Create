// Local dev server — works both locally AND on Railway/Render/Replit
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ttsHandler from "./api/tts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/tts", (req, res) => ttsHandler(req, res));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ NOVA Voice Studio → http://localhost:${PORT}`);
});
