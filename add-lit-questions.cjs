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

if (!code.includes('const litMatchQuestions =')) {
  // Inject before Games component
  code = code.replace(
    "export function Games() {",
    questionsData + "\nexport function Games() {"
  );
}

// I also need to make sure `currentLit` and `handleLitOption` are defined. Let's check if they exist.
