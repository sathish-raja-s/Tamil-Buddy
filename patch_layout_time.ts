import fs from 'fs';

let content = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');

if (!content.includes('const { recordActivityTime } = useProgress();')) {
  content = content.replace(
    'export function Layout() {',
    `import { useProgress } from '../../hooks/useProgress';\n\nexport function Layout() {\n  const { recordActivityTime } = useProgress();\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      recordActivityTime(1);\n    }, 60000);\n    return () => clearInterval(interval);\n  }, []);`
  );
  
  if (!content.includes('useEffect')) {
      content = content.replace('import React', 'import React, { useEffect }');
  }
  
  fs.writeFileSync('src/components/layout/Layout.tsx', content);
}
