import fs from 'fs';

let content = fs.readFileSync('src/pages/ParentDashboard.tsx', 'utf8');

if (!content.includes('Generate Report')) {
  content = content.replace(
    '<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Parent / Teacher Dashboard</h1>',
    `<div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Parent / Teacher Dashboard</h1>
          <button onClick={() => window.print()} className="bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold shadow-sm hidden sm:block">
            Generate Report 🖨️
          </button>
        </div>`
  );
  fs.writeFileSync('src/pages/ParentDashboard.tsx', content);
}
