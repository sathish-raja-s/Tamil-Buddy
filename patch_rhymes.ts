import fs from 'fs';
let code = fs.readFileSync('src/pages/Rhymes.tsx', 'utf8');

if (!code.includes('TamilVoiceButton')) {
  code = code.replace(
    "import { Play, Pause, ArrowLeft, Volume2, Star, CheckCircle, Heart, Search, Music } from 'lucide-react';",
    "import { Play, Pause, ArrowLeft, Volume2, Star, CheckCircle, Heart, Search, Music } from 'lucide-react';\nimport { TamilVoiceButton } from '../components/common/TamilVoiceButton';"
  );
  
  code = code.replace(
    /<div className="font-tamil font-bold text-2xl text-blue-600">\{v\.word\}<\/div>/g,
    `<div className="flex justify-between items-start">
                  <div className="font-tamil font-bold text-2xl text-blue-600">{v.word}</div>
                  <TamilVoiceButton text={v.word} size="sm" label="" />
                </div>`
  );

  fs.writeFileSync('src/pages/Rhymes.tsx', code);
  console.log("Patched Rhymes");
}
