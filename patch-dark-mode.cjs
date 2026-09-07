const fs = require('fs');
const glob = require('fs').readdirSync('src/pages');

for (const file of glob) {
  if (file.endsWith('.tsx')) {
    let path = 'src/pages/' + file;
    let code = fs.readFileSync(path, 'utf-8');
    
    code = code.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
    code = code.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
    code = code.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
    code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-800');
    code = code.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/50');
    code = code.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
    code = code.replace(/border-slate-100/g, 'border-slate-100 dark:border-slate-700');
    
    // De-dupe if I accidentally double appended
    code = code.replace(/dark:text-slate-100 dark:text-slate-100/g, 'dark:text-slate-100');
    code = code.replace(/dark:text-slate-200 dark:text-slate-200/g, 'dark:text-slate-200');
    code = code.replace(/dark:text-slate-300 dark:text-slate-300/g, 'dark:text-slate-300');
    code = code.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');
    
    fs.writeFileSync(path, code);
  }
}
