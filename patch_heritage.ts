import fs from 'fs';

const code = fs.readFileSync('src/pages/Heritage.tsx', 'utf8');

// We need to add TamilVoiceButton
let newCode = code.replace(
  "import { AudioService } from '../utils/audioService';", 
  "import { AudioService } from '../utils/audioService';\nimport { TamilVoiceButton } from '../components/common/TamilVoiceButton';"
);

// We need to replace the play/pause logic with TamilVoiceButton for the main item lyrics.
// Wait, the Heritage page uses a Play/Pause button for a sequence.
// TamilVoiceService.playSequence can be used with TamilVoiceButton?
// The prompt says: "Use natural Tamil pronunciation." "Each poem should have: 🔊 கேட்டு கற்க"
// Actually, `TamilVoiceButton` is for simple text. For stories/rhymes (sequences), there is a custom player.

fs.writeFileSync('src/pages/Heritage.tsx', newCode);
console.log("Patched Heritage");
