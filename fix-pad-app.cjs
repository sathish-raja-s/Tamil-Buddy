const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes("import { WritingPad }")) {
  code = code.replace("import { Heritage } from './pages/Heritage';", "import { Heritage } from './pages/Heritage';\nimport { WritingPad } from './pages/WritingPad';");
}

if (!code.includes('<Route path="pad"')) {
  code = code.replace('<Route path="chat" element={<Chat />} />', '<Route path="chat" element={<Chat />} />\n          <Route path="pad" element={<WritingPad />} />');
}

fs.writeFileSync('src/App.tsx', code);
