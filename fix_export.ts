import fs from 'fs';
let hook = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');
hook = hook.replace('toggleFavoriteRhyme,\n    resetProgress \n  };', 'toggleFavoriteRhyme,\n    resetProgress,\n    recordActivityTime,\n    recordQuizResult\n  };');
hook = hook.replace('toggleFavoriteRhyme,\n    resetProgress   \n};', 'toggleFavoriteRhyme,\n    resetProgress,\n    recordActivityTime,\n    recordQuizResult\n  };');
hook = hook.replace('toggleFavoriteRhyme,\n    resetProgress   };\n}', 'toggleFavoriteRhyme,\n    resetProgress,\n    recordActivityTime,\n    recordQuizResult\n  };\n}');
fs.writeFileSync('src/hooks/useProgress.ts', hook);
