const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

// Find the Games component and add `const currentLit = litMatchQuestions[litIndex];`
if (!code.includes('const currentLit = litMatchQuestions[litIndex];')) {
  code = code.replace(
    "const currentQuestion = playQuestions[currentIndex];",
    "const currentQuestion = playQuestions[currentIndex];\n  const currentLit = litMatchQuestions[litIndex];"
  );
  
  if (!code.includes('const handleLitOption =')) {
    code = code.replace(
      "const currentLit = litMatchQuestions[litIndex];",
      `const currentLit = litMatchQuestions[litIndex];\n  const handleLitOption = (opt: string) => {\n    if (opt === currentLit.answer) {\n      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#F59E0B', '#EF4444', '#10B981'] });\n      setFeedback('correct');\n      setTimeout(() => {\n        if (litIndex < litMatchQuestions.length - 1) {\n          setLitIndex(i => i + 1);\n          setFeedback('idle');\n        }\n      }, 1500);\n    } else {\n      setFeedback('wrong');\n      setTimeout(() => setFeedback('idle'), 1000);\n    }\n  };\n`
    );
  }
}

fs.writeFileSync('src/pages/Games.tsx', code);
