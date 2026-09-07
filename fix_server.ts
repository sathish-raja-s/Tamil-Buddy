import fs from 'fs';
const code = fs.readFileSync('server.ts', 'utf8');
const fixed = code.replace(/  \}\);\n  \}\);\n  \/\/ Gemini/g, '  });\n  // Gemini');
fs.writeFileSync('server.ts', fixed);
