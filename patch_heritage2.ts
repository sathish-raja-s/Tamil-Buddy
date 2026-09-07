import fs from 'fs';
let code = fs.readFileSync('src/pages/Heritage.tsx', 'utf8');

code = code.replace(
  /<div className="font-tamil font-bold text-2xl text-amber-600">\{v\.word\}<\/div>/g,
  `<div className="flex justify-between items-start">
                  <div className="font-tamil font-bold text-2xl text-amber-600">{v.word}</div>
                  <TamilVoiceButton text={v.word} size="sm" label="" />
                </div>`
);
fs.writeFileSync('src/pages/Heritage.tsx', code);
console.log("Patched Heritage Vocabulary");
