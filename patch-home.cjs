const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

if (!code.includes('import { audio } from')) {
  code = code.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport { audio } from '../lib/audio';"
  );
  
  // Make the link buttons play sound (We can't easily intercept Link onClick without adding onClick, let's just add onClick to Links)
  code = code.replace(
    /<Link\n/g,
    "<Link onClick={() => audio.playPop()}\n"
  );
  
  code = code.replace(
    /<Link to=/g,
    "<Link onClick={() => audio.playPop()} to="
  );

  fs.writeFileSync('src/pages/Home.tsx', code);
}
