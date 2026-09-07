import fs from 'fs';
let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

code = code.replace(
  /<div className="font-tamil font-bold text-2xl text-purple-600">\{v\.word\}<\/div>/g,
  `<div className="flex justify-between items-start">
                    <div className="font-tamil font-bold text-2xl text-purple-600">{v.word}</div>
                    <TamilVoiceButton text={v.word} size="sm" label="" />
                  </div>`
);
fs.writeFileSync('src/pages/Stories.tsx', code);
console.log("Patched Stories Vocabulary");
