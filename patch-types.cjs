const fs = require('fs');
let code = fs.readFileSync('src/components/tracing/TamilTracingCanvas.tsx', 'utf-8');
code = code.replace('interface Props {', 'interface Props {\n  key?: string | number;');
fs.writeFileSync('src/components/tracing/TamilTracingCanvas.tsx', code);
