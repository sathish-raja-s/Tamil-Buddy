const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { Heritage }')) {
  content = content.replace("import { Rhymes } from './pages/Rhymes';", "import { Rhymes } from './pages/Rhymes';\nimport { Heritage } from './pages/Heritage';");
}

if (!content.includes('<Route path="heritage"')) {
  content = content.replace('<Route path="rhymes" element={<Rhymes />} />', '<Route path="rhymes" element={<Rhymes />} />\n          <Route path="heritage" element={<Heritage />} />');
}

fs.writeFileSync('src/App.tsx', content);
