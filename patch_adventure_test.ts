import fs from 'fs';

let content = fs.readFileSync('src/pages/Adventure.tsx', 'utf8');

// Add import
content = content.replace(
  "import { GameEngine } from '../components/adventure/GameEngine';",
  "import { GameEngine } from '../components/adventure/GameEngine';\nimport { Assessment } from '../components/adventure/Assessment';"
);

// Add states
content = content.replace(
  "const [levelScore, setLevelScore] = useState(0);",
  "const [levelScore, setLevelScore] = useState(0);\n  const [preTestScore, setPreTestScore] = useState<number | null>(null);\n  const [postTestScore, setPostTestScore] = useState<number | null>(null);"
);

// Modify Start Adventure button in renderLevelIntro
content = content.replace(
  "onClick={() => setActiveView('game')}",
  "onClick={() => setActiveView('pre-test')}"
);

// Modify handleQuizComplete
content = content.replace(
  "setActiveView('result');",
  "setActiveView('post-test');"
);

// Modify renderResult
content = content.replace(
  '<h2 className="text-4xl font-bold text-green-500 mb-4">Level Complete! 🎉</h2>',
  `<h2 className="text-4xl font-bold text-green-500 mb-4">Level Complete! 🎉</h2>
        {preTestScore !== null && postTestScore !== null && (
          <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-2xl mb-6">
            <h3 className="font-bold text-indigo-800 text-lg mb-4">Learning Impact</h3>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-sm text-indigo-500 font-bold uppercase">Pre-Test</p>
                <p className="text-3xl font-bold text-slate-700">{preTestScore}%</p>
              </div>
              <div className="text-3xl text-indigo-300">→</div>
              <div className="text-center">
                <p className="text-sm text-indigo-500 font-bold uppercase">Post-Test</p>
                <p className="text-3xl font-bold text-green-600">{postTestScore}%</p>
              </div>
            </div>
            {postTestScore > preTestScore && (
              <div className="mt-4 text-sm font-bold text-green-600 bg-green-100 py-1 px-3 rounded-full inline-block">
                +{postTestScore - preTestScore}% Improvement!
              </div>
            )}
          </div>
        )}`
);

// Add views to render loop
content = content.replace(
  "{activeView === 'game' && selectedLevel?.games[0] && (",
  `{activeView === 'pre-test' && selectedLevel && (
        <Assessment 
          type="pre-test"
          title={selectedLevel.title}
          questions={selectedLevel.questions.slice(0, 2)}
          onComplete={(score) => {
            setPreTestScore(score);
            setActiveView('game');
          }}
        />
      )}
      {activeView === 'post-test' && selectedLevel && (
        <Assessment 
          type="post-test"
          title={selectedLevel.title}
          questions={selectedLevel.questions.slice(-2)}
          onComplete={(score) => {
            setPostTestScore(score);
            setActiveView('result');
          }}
        />
      )}
      {activeView === 'game' && selectedLevel?.games[0] && (`
);

fs.writeFileSync('src/pages/Adventure.tsx', content);
