import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory Rate Limiter (Token bucket / sliding window: max 10 requests per minute)
  const chatRateLimitMap = new Map<string, { count: number; resetAt: number }>();
  const CHAT_RATE_LIMIT = 10;
  const CHAT_WINDOW_MS = 60 * 1000;

  const chatRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const clientId = (req.headers["x-session-id"] as string) || req.ip || "global-client";
    const now = Date.now();
    const entry = chatRateLimitMap.get(clientId);

    if (!entry || now > entry.resetAt) {
      chatRateLimitMap.set(clientId, { count: 1, resetAt: now + CHAT_WINDOW_MS });
      return next();
    }

    if (entry.count >= CHAT_RATE_LIMIT) {
      const waitSeconds = Math.ceil((entry.resetAt - now) / 1000);
      return res.status(429).json({
        error: "Buddy needs a short break! 😊 Please try again in a moment.",
        rateLimited: true,
        retryAfter: waitSeconds
      });
    }

    entry.count += 1;
    next();
  };

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: Date.now(), cachedAudioItems: audioCache.size });
  });

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
      res.setHeader("X-Cache", "HIT");
      return res.send(audioCache.get(cacheKey));
    }

    res.setHeader("X-Cache", "MISS");

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

    // Fallback to Google Translate TTS proxy
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ta&q=${encodeURIComponent(text)}`;
    https.get(url, (response) => {
      res.writeHead(response.statusCode || 200, response.headers);
      response.pipe(res);
    }).on('error', (e) => {
      console.error("TTS proxy error:", e);
      res.status(500).send("Error fetching audio");
    });
  });

  // Gemini Chat Route with Rate Limiting and Fallback Resilience
  app.post("/api/chat", chatRateLimiter, async (req, res) => {
    try {
      const { message, history, weakLetters } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      let responseText = "";

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });
          
          const systemInstruction = `You are a friendly, encouraging Tamil learning buddy for kids. The user struggles with these Tamil letters: ${weakLetters || "None currently"}. When generating practice, focus gently on these. 
You must speak simply. Primarily use Tamil, but provide English translations in parentheses to help them learn if it's a new word.
Keep your answers very short (1-3 sentences max) so they are easy to read and listen to. Use emojis to be fun!`;

          const contents = (history || []).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));
          
          contents.push({ role: 'user', parts: [{ text: message || "வணக்கம்" }] });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI_CALL_TIMEOUT")), 6000)
          );

          const aiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          const response = (await Promise.race([aiPromise, timeoutPromise])) as any;
          responseText = response?.text || "";
        } catch (apiError: any) {
          console.warn("Gemini call timed out or failed, engaging server fallback:", apiError?.message);
        }
      }

      // Safe local fallback if API key is unconfigured or call timed out
      if (!responseText) {
        const lowerMsg = (message || "").toLowerCase();
        if (lowerMsg.includes("அ") || lowerMsg.includes("letter a")) {
          responseText = "அ என்பது ஒரு தமிழ் உயிரெழுத்து. உதாரணம்: அம்மா (Mother), அணில் (Squirrel). அருமை! ⭐";
        } else if (lowerMsg.includes("வணக்கம்") || lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
          responseText = "வணக்கம்! நான் உங்கள் தமிழ் Buddy. இன்று நாம் என்ன கற்கலாம்? உயிர் எழுத்துக்கள், கதைகள் அல்லது பாட்டுகள் படிக்கலாமா? 😊";
        } else if (lowerMsg.includes("உயிரெழுத்து") || lowerMsg.includes("vowel")) {
          responseText = "தமிழ் உயிரெழுத்துக்கள் மொத்தம் 12: அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ. 📚";
        } else {
          responseText = "அருமையான கேள்வி! தமிழ் மொழியில் 247 எழுத்துக்கள் உள்ளன. நாம் தொடர்ந்து ஆர்வமாகப் படிப்போம்! 🌟";
        }
      }

      res.json({ text: responseText, isFallback: !apiKey });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.json({
        text: "வணக்கம்! நான் உங்கள் தமிழ் Buddy. நாம் தொடர்ந்து தமிழ் எழுத்துக்களைப் படிப்போம்! ⭐",
        isFallback: true
      });
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
