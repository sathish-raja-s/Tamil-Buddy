const fs = require('fs');
let code = fs.readFileSync('src/pages/Progress.tsx', 'utf-8');

const heatMapCode = `
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📊 Your Writing Progress</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Letters Learned</p>
                <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">12 / 247</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Mastered</p>
                <p className="text-3xl font-black text-green-700 dark:text-green-300 mt-1">5</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Avg Accuracy</p>
                <p className="text-3xl font-black text-purple-700 dark:text-purple-300 mt-1">89%</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Practice Streak</p>
                <p className="text-3xl font-black text-orange-700 dark:text-orange-300 mt-1">🔥 7 Days</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">👨‍👩‍👧 Parent / Teacher Report</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex justify-between"><span>Best Letter:</span> <span className="font-bold text-green-600">அ — 98%</span></li>
                <li className="flex justify-between"><span>Needs Practice:</span> <span className="font-bold text-amber-600">ஈ — 65%</span></li>
                <li className="flex justify-between"><span>Stroke Order Accuracy:</span> <span className="font-bold">92%</span></li>
              </ul>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🎯 Letter Mastery Heatmap</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'].map((letter, i) => {
                const status = i < 5 ? 'mastered' : i < 8 ? 'practice' : 'learning';
                const colors = {
                  mastered: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
                  practice: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
                  learning: 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                };
                return (
                  <button 
                    key={letter}
                    onClick={() => navigate('/adventure')}
                    className={\`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl font-tamil font-bold transition-all \${colors[status]}\`}
                    title={status === 'mastered' ? 'Mastered (90%+)' : status === 'practice' ? 'Needs Practice' : 'Not Learned Yet'}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 pt-2 px-2">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-400" /> Mastered</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-400" /> Practice</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-300" /> Learning</span>
            </div>
          </div>
        </div>
      </div>
`;

code = code.replace(
  '<div className="glass-panel p-8">',
  heatMapCode + '\n      <div className="glass-panel p-8 mt-6">'
);

fs.writeFileSync('src/pages/Progress.tsx', code);
