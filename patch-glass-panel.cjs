const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  '@apply bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-xl rounded-3xl transition-colors duration-500;',
  '@apply bg-white/80 dark:bg-slate-800/90 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-xl rounded-3xl transition-colors duration-500 text-slate-800 dark:text-slate-100;'
);

fs.writeFileSync('src/index.css', code);
