const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

code = code.replace(/id: \\`um_\\\${meiIndex}_\\\${uyirIndex}\\`,/g, "id: `um_${meiIndex}_${uyirIndex}`,");
code = code.replace(/pronunciation: \\`\\\${mei\.pronunciation\.replace\('i',''\)} \+ \\\${UYIR_LETTERS\[uyirIndex\]\.pronunciation}\\`,/g, "pronunciation: `${mei.pronunciation.replace('i','')} + ${UYIR_LETTERS[uyirIndex].pronunciation}`,");

fs.writeFileSync('src/data/mockData.ts', code);
