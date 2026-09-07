const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

code = code.replace(/id: \\`um_\\\$\\{meiIndex\\}_\\\$\\{uyirIndex\\}\\`,/g, "id: `um_${meiIndex}_${uyirIndex}`,");
code = code.replace(/pronunciation: \\`\\\$\\{mei.pronunciation.replace\\('i',''\\)\\} \\+ \\\$\\{UYIR_LETTERS\\[uyirIndex\\].pronunciation\\}\\`,/g, "pronunciation: `${mei.pronunciation.replace('i','')} + ${UYIR_LETTERS[uyirIndex].pronunciation}`,");

// Since the regexes might fail due to escaping madness, I will just rewrite those two lines completely by finding the blocks
const lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('id: \\`um_\\${meiIndex}_\\${uyirIndex}\\`')) {
        lines[i] = "        id: `um_${meiIndex}_${uyirIndex}`,";
    }
    if (lines[i].includes('pronunciation: \\`\\${mei.pronunciation.replace')) {
        lines[i] = "        pronunciation: `${mei.pronunciation.replace('i','')} + ${UYIR_LETTERS[uyirIndex].pronunciation}`,";
    }
}
fs.writeFileSync('src/data/mockData.ts', lines.join('\n'));
