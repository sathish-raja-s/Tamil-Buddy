const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

// Looking at the grep, it seems the state is defined differently
// "const [activeGame, setActiveGame] = useState<'match' | 'trace'>('match');"
// But litIndex was missing!

if (!code.includes('const [litIndex, setLitIndex] = useState(0);')) {
  code = code.replace(
    "const [activeGame, setActiveGame] = useState",
    "const [litIndex, setLitIndex] = useState(0);\n  const [activeGame, setActiveGame] = useState"
  );
}

fs.writeFileSync('src/pages/Games.tsx', code);
