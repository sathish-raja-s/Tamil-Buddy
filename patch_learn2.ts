import fs from 'fs';
let code = fs.readFileSync('src/pages/Learn.tsx', 'utf8');

const replacement = `<div className="flex gap-4 w-full flex-col sm:flex-row">
                    <div className="flex-1 flex gap-2">
                      <TamilVoiceButton
                        text={selectedLetter.letter + " ... " + selectedLetter.word}
                        className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-colors border-2 border-blue-200 active:scale-95"
                        label="Listen"
                        size="md"
                      />
                      <TamilVoiceButton
                        text={selectedLetter.letter + " ... " + selectedLetter.word}
                        options={{ pace: 0.75 }}
                        className="flex-1 py-4 bg-teal-50 text-teal-600 rounded-2xl font-bold hover:bg-teal-100 transition-colors border-2 border-teal-200 active:scale-95"
                        label="🐢 மெதுவாக"
                        size="md"
                      />
                    </div>
`;

code = code.replace(
  /<div className="flex gap-4 w-full">[\s\S]*?<TamilVoiceButton[\s\S]*?\/>/,
  replacement
);
fs.writeFileSync('src/pages/Learn.tsx', code);
console.log("Patched Learn2.tsx");
