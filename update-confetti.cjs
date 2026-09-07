const fs = require('fs');

const replaceInFile = (file) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');
  
  // Add import if missing
  if (!code.includes("import { triggerGrandCelebration, triggerMiniCelebration } from")) {
    // We can replace the standard confetti import if it exists, or just append
    if (code.includes("import confetti from 'canvas-confetti';")) {
      code = code.replace(
        "import confetti from 'canvas-confetti';",
        "import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';"
      );
    } else {
      code = "import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';\n" + code;
    }
  }

  // Common replacements for games
  code = code.replace(/confetti\(\{.*particleCount: 150.*\}\);/g, "triggerMiniCelebration();");
  code = code.replace(/confetti\(\{.*particleCount: 100.*\}\);/g, "triggerGrandCelebration();");
  code = code.replace(/confetti\(\{.*particleCount: 30.*\}\);/g, "triggerMiniCelebration();");
  code = code.replace(/confetti\(\{.*particleCount: 50.*\}\);/g, "triggerMiniCelebration();");
  
  // Replace multiline if any
  code = code.replace(/confetti\(\{[\s\S]*?\}\);/g, "triggerGrandCelebration();"); // catch all others and turn into grand celebration!

  fs.writeFileSync(file, code);
};

['src/pages/Games.tsx', 'src/pages/Adventure.tsx', 'src/pages/Learn.tsx', 'src/pages/Stories.tsx', 'src/pages/Rhymes.tsx', 'src/pages/Heritage.tsx'].forEach(replaceInFile);
