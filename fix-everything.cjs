const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

const questionsData = `
const litMatchQuestions = [
  {
    category: "Thirukkural",
    title: "அகர முதல எழுத்தெல்லாம்...",
    answer: "திருவள்ளுவர்",
    options: ["ஔவையார்", "திருவள்ளுவர்", "கம்பர்"]
  },
  {
    category: "Aathichudi",
    title: "அறம் செய விரும்பு",
    answer: "ஔவையார்",
    options: ["பாரதியார்", "திருவள்ளுவர்", "ஔவையார்"]
  },
  {
    category: "Bharathiyar Kavithaigal",
    title: "ஓடி விளையாடு பாப்பா...",
    answer: "பாரதியார்",
    options: ["பாரதியார்", "திருவள்ளுவர்", "கம்பர்"]
  }
];
`;

if (!code.includes('const litMatchQuestions = [')) {
  code = code.replace("export function Games() {", questionsData + "\nexport function Games() {");
}

if (!code.includes('const currentLit = litMatchQuestions')) {
  code = code.replace(
    "const [activeGame, setActiveGame] = useState",
    "const currentLit = litMatchQuestions[litIndex];\n  const [activeGame, setActiveGame] = useState"
  );
}

if (!code.includes('const handleLitOption =')) {
  code = code.replace(
    "const handleMatch = (selectedImg: string) => {",
    `const handleLitOption = (opt: string) => {\n    if (opt === currentLit.answer) {\n      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#F59E0B', '#EF4444', '#10B981'] });\n      setFeedback('correct');\n      setTimeout(() => {\n        if (litIndex < litMatchQuestions.length - 1) {\n          setLitIndex(i => i + 1);\n          setFeedback('idle');\n        }\n      }, 1500);\n    } else {\n      setFeedback('wrong');\n      setTimeout(() => setFeedback('idle'), 1000);\n    }\n  };\n\n  const handleMatch = (selectedImg: string) => {`
  );
}

fs.writeFileSync('src/pages/Games.tsx', code);
