import fs from 'fs';

// Fix Layout.tsx
let layout = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');
if (!layout.includes('import { useEffect }')) {
    layout = layout.replace("import React from 'react';", "import React, { useEffect } from 'react';");
}
fs.writeFileSync('src/components/layout/Layout.tsx', layout);

// Fix ParentDashboard.tsx
let dashboard = fs.readFileSync('src/pages/ParentDashboard.tsx', 'utf8');
dashboard = dashboard.replace('sort((a, b) => b[1] - a[1])', 'sort((a, b) => (b[1] as number) - (a[1] as number))');
fs.writeFileSync('src/pages/ParentDashboard.tsx', dashboard);

// Fix useProgress.ts export if needed
let hook = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');
if (!hook.includes('recordActivityTime,')) {
    hook = hook.replace('resetProgress \n   };', 'resetProgress, recordActivityTime, recordQuizResult \n   };');
    hook = hook.replace('resetProgress\n   };', 'resetProgress, recordActivityTime, recordQuizResult \n   };');
    fs.writeFileSync('src/hooks/useProgress.ts', hook);
}
