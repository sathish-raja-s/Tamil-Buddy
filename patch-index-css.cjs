const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  '@import "tailwindcss";',
  '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));'
);

code = code.replace(
  '@apply bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen text-slate-800 antialiased font-sans;',
  '@apply bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 min-h-screen text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-500;'
);

code = code.replace(
  '@apply bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl;',
  '@apply bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-xl rounded-3xl transition-colors duration-500;'
);

fs.writeFileSync('src/index.css', code);
