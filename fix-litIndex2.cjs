const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

// I need to add `const [litIndex, setLitIndex] = useState(0);` inside the Games component.
// Let's find where to insert it.

code = code.replace(
  "const [activeGame, setActiveGame] = useState<'match' | 'tracing' | 'literature'>('match');",
  "const [activeGame, setActiveGame] = useState<'match' | 'tracing' | 'literature'>('match');\n  const [litIndex, setLitIndex] = useState(0);"
);

fs.writeFileSync('src/pages/Games.tsx', code);
