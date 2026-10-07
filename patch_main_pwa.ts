import fs from 'fs';

let content = fs.readFileSync('src/main.tsx', 'utf8');

if (!content.includes('registerSW')) {
  content = `import { registerSW } from 'virtual:pwa-register';\n\nconst updateSW = registerSW({\n  onNeedRefresh() {\n    if (confirm('New version available. Update Tamil Buddy?')) {\n      updateSW(true);\n    }\n  },\n  onOfflineReady() {\n    console.log('App ready to work offline');\n  },\n});\n\n` + content;
  fs.writeFileSync('src/main.tsx', content);
}
