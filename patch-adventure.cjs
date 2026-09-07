const fs = require('fs');
let code = fs.readFileSync('src/pages/Adventure.tsx', 'utf-8');

if (!code.includes('import { audio } from')) {
  code = code.replace(
    "import { LetterTracingCanvas } from '../components/adventure/LetterTracingCanvas';",
    "import { LetterTracingCanvas } from '../components/adventure/LetterTracingCanvas';\nimport { audio } from '../lib/audio';"
  );
  
  // onClick of a node
  code = code.replace(
    "onClick={() => handleNodeClick(letter.id)}",
    "onClick={() => { audio.playPop(); handleNodeClick(letter.id); }}"
  );
  
  // onComplete tracing
  code = code.replace(
    "handleTracingComplete = () => {",
    "handleTracingComplete = () => {\n    audio.playSuccess();"
  );
  
  // play again button
  code = code.replace(
    "onClick={() => setSelectedNode(null)}",
    "onClick={() => { audio.playPop(); setSelectedNode(null); }}"
  );

  fs.writeFileSync('src/pages/Adventure.tsx', code);
}
