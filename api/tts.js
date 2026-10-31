// Cartesia TTS proxy — server side only. Never expose key to browser.
export default async function handler(req, res) {
  // CORS headers (for direct usage outside Vercel)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voiceId, modelId, speed } = req.body || {};
  if (!text || !voiceId) {
    return res.status(400).json({ error: "Missing text or voiceId" });
  }
  if (text.length > 500) {
    return res.status(400).json({ error: "Text too long (max 500 chars)" });
  }

  try {
    const response = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`,
        "Cartesia-Version": "2025-04-16",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: modelId || "sonic-2",
        transcript: text,
        voice: { mode: "id", id: voiceId },
        output_format: {
          container: "mp3",
          sample_rate: 44100,
          bit_rate: 128000,
        },
        language: "en",
        speed: speed || "normal",
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res
        .status(response.status)
        .json({ error: errText.slice(0, 300) || `HTTP ${response.status}` });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  }
