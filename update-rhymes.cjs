const fs = require('fs');

let content = fs.readFileSync('src/pages/Rhymes.tsx', 'utf-8');

// Add AudioService import
if (!content.includes('AudioService')) {
  content = content.replace("import { RHYMES_DATA }", "import { AudioService } from '../utils/audioService';\nimport { RHYMES_DATA }");
}
if (!content.includes('useEffect')) {
  content = content.replace("useState } from 'react'", "useState, useEffect } from 'react'");
}

const useEffectHook = `
  const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress();
  
  const rhyme = RHYMES_DATA.find(r => r.id === selectedRhyme);

  useEffect(() => {
    if (isPlaying && rhyme) {
      AudioService.playTamilSequence(rhyme.lyrics.map(l => l.tamilText), () => {
        setIsPlaying(false);
      });
    } else {
      AudioService.stop();
    }
    return () => AudioService.stop();
  }, [isPlaying, rhyme]);
`;

content = content.replace(
  /const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress\(\);[\s\S]*?const rhyme = RHYMES_DATA\.find\(r => r\.id === selectedRhyme\);/, 
  useEffectHook.trim()
);

fs.writeFileSync('src/pages/Rhymes.tsx', content);
