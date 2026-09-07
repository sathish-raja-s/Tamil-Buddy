const fs = require('fs');

let content = fs.readFileSync('src/pages/Adventure.tsx', 'utf-8');

const updatedChapters = `
      if (chapterNum === 1) chapterTitle = '🌱 Tamil Beginner';
      if (chapterNum === 2) chapterTitle = '🌿 Letter Explorer';
      if (chapterNum === 3) chapterTitle = '🎵 Bharathiyar & Aathichudi I';
      if (chapterNum === 4) chapterTitle = '🌸 Bharathiyar & Aathichudi II';
      if (chapterNum === 5) chapterTitle = '💡 Thirukkural & Proverbs I';
      if (chapterNum === 6) chapterTitle = '💬 Thirukkural & Proverbs II';
      if (chapterNum === 7) chapterTitle = '👵 Avvaiyar & Bharathidasan I';
      if (chapterNum === 8) chapterTitle = '🎶 Avvaiyar & Bharathidasan II';
      if (chapterNum === 9) chapterTitle = '🌿 Sangam Literature I';
      if (chapterNum === 10) chapterTitle = '🏛️ Classical Tamil Heritage';
`;

content = content.replace(/if \(chapterNum === 1\) chapterTitle = '🌱 Tamil Beginner';[\s\S]*?if \(chapterNum === 10\) chapterTitle = '👑 Tamil Champion';/, updatedChapters.trim());

fs.writeFileSync('src/pages/Adventure.tsx', content);
