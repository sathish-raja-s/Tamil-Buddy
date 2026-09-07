import fs from 'fs';
let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

if (!code.includes('TamilVoiceButton')) {
  code = code.replace(
    "import { Play, Pause, ChevronRight, ChevronLeft, ArrowLeft, Volume2, Star, CheckCircle, Heart } from 'lucide-react';",
    "import { Play, Pause, ChevronRight, ChevronLeft, ArrowLeft, Volume2, Star, CheckCircle, Heart } from 'lucide-react';\nimport { TamilVoiceButton } from '../components/common/TamilVoiceButton';"
  );
  
  code = code.replace(
    /<div className="flex gap-2 mt-4 z-10">/g,
    `<div className="w-full flex justify-center mt-4 mb-4 z-10">
            <TamilVoiceButton text={section.tamilText} size="lg" label="கேட்டு கதை கேட்போம்" />
          </div>
          <div className="flex gap-2 mt-4 z-10">`
  );

  fs.writeFileSync('src/pages/Stories.tsx', code);
  console.log("Patched Stories");
}
