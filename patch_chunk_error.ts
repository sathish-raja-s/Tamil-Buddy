import fs from 'fs';

let content = fs.readFileSync('src/main.tsx', 'utf8');

if (!content.includes('Loading chunk failed')) {
  content = `window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Loading chunk failed')) {
    if (confirm('New version available. Updating Tamil Buddy...')) {
      window.location.reload();
    }
  }
});\n\n` + content;
  fs.writeFileSync('src/main.tsx', content);
}
