import fs from 'fs';

let content = fs.readFileSync('src/pages/Chat.tsx', 'utf8');

// We need to pass weak letters to the backend.
// Currently it sends: { message, history }
if (!content.includes('progress.analytics')) {
  content = content.replace(
    'export function Chat() {',
    "import { useProgress } from '../hooks/useProgress';\n\nexport function Chat() {"
  );
  
  content = content.replace(
    'const [isTyping, setIsTyping] = useState(false);',
    "const [isTyping, setIsTyping] = useState(false);\n  const { progress } = useProgress();\n  const weakLetters = Object.entries(progress.analytics?.weakLetters || {}).filter(([_, count]) => (count as number) > 0).map(([l]) => l).join(', ');"
  );
  
  content = content.replace(
    'body: JSON.stringify({ message: input, history: messages }),',
    'body: JSON.stringify({ message: input, history: messages, weakLetters }),'
  );
  
  fs.writeFileSync('src/pages/Chat.tsx', content);
}

// Then update server.ts to accept weakLetters
let server = fs.readFileSync('server.ts', 'utf8');
if (!server.includes('weakLetters')) {
  server = server.replace(
    'const { message, history } = req.body;',
    'const { message, history, weakLetters } = req.body;'
  );
  
  server = server.replace(
    'const systemInstruction = `You are a friendly, encouraging Tamil learning buddy for kids.',
    'const systemInstruction = `You are a friendly, encouraging Tamil learning buddy for kids. The user struggles with these Tamil letters: ${weakLetters || "None currently"}. When generating practice, focus gently on these.'
  );
  fs.writeFileSync('server.ts', server);
}
