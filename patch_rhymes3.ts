import fs from 'fs';
let code = fs.readFileSync('src/pages/Rhymes.tsx', 'utf8');

if (!code.includes('import { TamilVoiceButton }')) {
  code = code.replace(
    "import { AudioService } from '../utils/audioService';",
    "import { AudioService } from '../utils/audioService';\nimport { TamilVoiceButton } from '../components/common/TamilVoiceButton';"
  );
  fs.writeFileSync('src/pages/Rhymes.tsx', code);
}
