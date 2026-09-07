const fs = require('fs');
let code = fs.readFileSync('src/pages/WritingPad.tsx', 'utf-8');

// The original clearPad logic:
/*
  const clearPad = () => {
    if (window.confirm("Are you sure you want to clear the pad?")) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };
*/
// The issue is iframe restrictions blocking window.confirm().
// I will rewrite clearPad to skip window.confirm.

const replacement = `
  const clearPad = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
`;

code = code.replace(/const clearPad = \(\) => {[\s\S]*?};/, replacement.trim());
fs.writeFileSync('src/pages/WritingPad.tsx', code);
