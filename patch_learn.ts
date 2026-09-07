import fs from 'fs';
let code = fs.readFileSync('src/pages/Learn.tsx', 'utf8');

if (!code.includes('TamilVoiceButton')) {
  code = code.replace(
    "import { AudioService } from '../utils/audioService';",
    "import { AudioService } from '../utils/audioService';\nimport { TamilVoiceButton } from '../components/common/TamilVoiceButton';"
  );
  
  code = code.replace(
    /onClick=\{\(\) => handlePlaySound\(selectedLetter\.letter \+ " \. " \+ selectedLetter\.word\)\}[\s\S]*?Listen\s*<\/button>/m,
    `<TamilVoiceButton
                      text={selectedLetter.letter + " ... " + selectedLetter.word}
                      className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-colors border-2 border-blue-200 active:scale-95"
                      label="Listen"
                      size="lg"
                    />`
  );
  fs.writeFileSync('src/pages/Learn.tsx', code);
  console.log("Patched Learn.tsx");
}
