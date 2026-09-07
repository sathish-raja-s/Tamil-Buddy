const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('AuthProvider')) {
  code = code.replace(
    "import { AchievementProvider } from './context/AchievementContext';",
    "import { AchievementProvider } from './context/AchievementContext';\nimport { AuthProvider } from './context/AuthContext';"
  );
  
  code = code.replace(
    "<AchievementProvider>",
    "<AuthProvider>\n    <AchievementProvider>"
  );
  
  code = code.replace(
    "</AchievementProvider>",
    "</AchievementProvider>\n    </AuthProvider>"
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
