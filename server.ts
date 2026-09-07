import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // TTS Proxy Route
  const audioCache = new Map<string, Buffer>();

app.get("/api/tts", async (req, res) => {
    const text = req.query.q as string;
    const speaker = (req.query.speaker as string) || "ishita";
    const pace = parseFloat((req.query.pace as string) || "1.0");
    
    if (!text) {
      return res.status(400).send("Missing text");
    }

    const cacheKey = `${speaker}_${pace}_${text}`;
    if (audioCache.has(cacheKey)) {
        res.setHeader("Content-Type", "audio/wav");
                    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.send(audioCache.get(cacheKey));
    }

    const sarvamKey = process.env.SARVAM_API_KEY;
    if (sarvamKey) {
        try {
            const response = await fetch("https://api.sarvam.ai/text-to-speech", {
                method: "POST",
                headers: {
                    "api-subscription-key": sarvamKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: [text],
                    target_language_code: "ta-IN",
                    speaker: speaker,
                    pitch: 0,
                    pace: pace,
                    loudness: 1.5,
                    speech_sample_rate: 16000,
                    enable_preprocessing: true,
                    model: "bulbul:v3"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.audios && data.audios[0]) {
                    const audioBuffer = Buffer.from(data.audios[0], "base64");
                    audioCache.set(cacheKey, audioBuffer);
                    res.setHeader("Content-Type", "audio/wav");
                    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                    return res.send(audioBuffer);
                }
            } else {
                console.error("Sarvam API error:", await response.text());
            }
        } catch (error) {
            console.error("Failed to fetch from Sarvam AI", error);
        }
    }

    // Fallback
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ta&q=${encodeURIComponent(text)}`;
    https.get(url, (response) => {
      res.writeHead(response.statusCode || 200, response.headers);
      response.pipe(res);
    }).on('error', (e) => {
      console.error("TTS proxy error:", e);
      res.status(500).send("Error fetching audio");
    });
  });

  // Gemini Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Please configure it in the Settings menu." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are a friendly, encouraging Tamil learning buddy for kids. 
You must speak simply. Primarily use Tamil, but provide English translations in parentheses to help them learn if it's a new word.
Keep your answers very short (1-3 sentences max) so they are easy to read and listen to. Use emojis to be fun!`;

      const contents = (history || []).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to generate response." });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
