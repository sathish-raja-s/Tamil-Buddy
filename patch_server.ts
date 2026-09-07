import fs from 'fs';

const code = fs.readFileSync('server.ts', 'utf8');

const ttsRoute = `
const audioCache = new Map<string, Buffer>();

app.get("/api/tts", async (req, res) => {
    const text = req.query.q as string;
    const speaker = (req.query.speaker as string) || "ishita";
    const pace = parseFloat((req.query.pace as string) || "1.0");
    
    if (!text) {
      return res.status(400).send("Missing text");
    }

    const cacheKey = \`\${speaker}_\${pace}_\${text}\`;
    if (audioCache.has(cacheKey)) {
        res.setHeader("Content-Type", "audio/wav");
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
    const url = \`https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ta&q=\${encodeURIComponent(text)}\`;
    https.get(url, (response) => {
      res.writeHead(response.statusCode || 200, response.headers);
      response.pipe(res);
    }).on('error', (e) => {
      console.error("TTS proxy error:", e);
      res.status(500).send("Error fetching audio");
    });
  });
`;

let newCode = code.replace(/app\.get\("\/api\/tts".*?\}\);/s, ttsRoute.trim());
if (newCode === code) {
  // If replacement failed, let's just insert it manually.
  console.error("Replacement failed.");
} else {
  fs.writeFileSync('server.ts', newCode);
  console.log("Patched server.ts");
}
