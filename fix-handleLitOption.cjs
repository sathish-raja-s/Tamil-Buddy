const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

if (!code.includes('const handleLitOption =')) {
  // Let's add it right after currentLit
  code = code.replace(
    "const currentLit = litMatchQuestions[litIndex];",
    `const currentLit = litMatchQuestions[litIndex];
    
  const handleLitOption = (opt: string) => {
    if (opt === currentLit.answer) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#F59E0B', '#EF4444', '#10B981'] });
      setFeedback('correct');
      setTimeout(() => {
        if (litIndex < litMatchQuestions.length - 1) {
          setLitIndex(i => i + 1);
          setFeedback('idle');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };`
  );
  fs.writeFileSync('src/pages/Games.tsx', code);
}
