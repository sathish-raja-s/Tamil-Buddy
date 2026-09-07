const fs = require('fs');
let code = fs.readFileSync('src/pages/Progress.tsx', 'utf-8');

// The stat for Badges was using Math.floor(progress.xp / 100).toString()
code = code.replace(
  /value: Math.floor\(progress.xp \/ 100\).toString\(\)/,
  'value: badges.filter(b => b.isUnlocked).length.toString()'
);

fs.writeFileSync('src/pages/Progress.tsx', code);
