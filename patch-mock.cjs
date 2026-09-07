const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

// fix Story import
code = code.replace(/import \{ Story, QuizQuestion \} from '\.\.\/types';/, "import { TamilStory as Story, QuizQuestion } from '../types';");
code = code.replace(/import \{.*?Story.*?\} from '\.\.\/types';/, "import { TamilStory as Story, QuizQuestion } from '../types';");

// fix multiple-choice types in QuizQuestion
code = code.replace(/type: 'multiple-choice'/g, "type: 'practice'");

fs.writeFileSync('src/data/mockData.ts', code);
