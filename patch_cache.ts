import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// Replace res.setHeader("Content-Type", "audio/wav"); with additional Cache-Control
code = code.replace(
  /res\.setHeader\("Content-Type", "audio\/wav"\);/g,
  `res.setHeader("Content-Type", "audio/wav");
                    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");`
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts cache headers");
