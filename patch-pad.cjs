const fs = require('fs');
let code = fs.readFileSync('src/pages/WritingPad.tsx', 'utf-8');

if (!code.includes('import { audio } from')) {
  code = code.replace(
    "import { Trash2, PenTool, Eraser, Palette, Undo, Redo } from 'lucide-react';",
    "import { Trash2, PenTool, Eraser, Palette, Undo, Redo } from 'lucide-react';\nimport { audio } from '../lib/audio';"
  );
  
  // onClick of undo/redo/clear
  code = code.replace(
    "const handleUndo = () => {",
    "const handleUndo = () => {\n    audio.playPop();"
  );
  code = code.replace(
    "const handleRedo = () => {",
    "const handleRedo = () => {\n    audio.playPop();"
  );
  code = code.replace(
    "const clearPad = () => {",
    "const clearPad = () => {\n    audio.playError();" // slightly low sound for clear
  );
  code = code.replace(
    "onClick={() => setIsEraser(false)}",
    "onClick={() => { audio.playPop(); setIsEraser(false); }}"
  );
  code = code.replace(
    "onClick={() => setIsEraser(true)}",
    "onClick={() => { audio.playPop(); setIsEraser(true); }}"
  );
  code = code.replace(
    "onClick={() => { setColor(c); setIsEraser(false); }}",
    "onClick={() => { audio.playPop(); setColor(c); setIsEraser(false); }}"
  );
  code = code.replace(
    "onClick={() => setBrushSize(size)}",
    "onClick={() => { audio.playPop(); setBrushSize(size); }}"
  );

  fs.writeFileSync('src/pages/WritingPad.tsx', code);
}
