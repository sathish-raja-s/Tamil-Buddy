const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');
code = code.replace(
  '<LetterTracingCanvas \n              key={selectedActivity.id}',
  '<LetterTracingCanvas \n              key={selectedActivity.id}'
);
// I'll just remove the key if it's complaining, or add it to Props.
