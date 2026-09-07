const fs = require('fs');
let code = fs.readFileSync('src/pages/Rhymes.tsx', 'utf-8');

const replacement = `  const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress();

  const categories = ['All', ...new Set(RHYMES_DATA.map(r => r.category))];
  
  const filteredRhymes = RHYMES_DATA.filter(r => {
    const matchesCat = filter === 'All' || r.category === filter;
    const matchesSearch = r.titleTamil.includes(search) || r.titleEnglish.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const rhyme = RHYMES_DATA.find(r => r.id === selectedRhyme);`;

code = code.replace(/const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress\(\);\s+const rhyme = RHYMES_DATA\.find\(r => r\.id === selectedRhyme\);/m, replacement);

fs.writeFileSync('src/pages/Rhymes.tsx', code);
