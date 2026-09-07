const fs = require('fs');
let code = fs.readFileSync('src/pages/Chat.tsx', 'utf-8');

if (!code.includes('import { audio } from')) {
  code = code.replace(
    "import { MessageSquare, Bot, Send, Sparkles } from 'lucide-react';",
    "import { MessageSquare, Bot, Send, Sparkles } from 'lucide-react';\nimport { audio } from '../lib/audio';"
  );
  
  // onClick of modes
  code = code.replace(
    "onClick={() => setMode('quiz')}",
    "onClick={() => { audio.playPop(); setMode('quiz'); }}"
  );
  code = code.replace(
    "onClick={() => setMode('story')}",
    "onClick={() => { audio.playPop(); setMode('story'); }}"
  );
  code = code.replace(
    "onClick={() => setMode('chat')}",
    "onClick={() => { audio.playPop(); setMode('chat'); }}"
  );

  fs.writeFileSync('src/pages/Chat.tsx', code);
}
