const fs = require('fs');

let content = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

// Ensure HERITAGE_DATA is imported
if (!content.includes('import { HERITAGE_DATA }')) {
  content = content.replace("import { TAMIL_LETTERS } from '../data/mockData';", "import { TAMIL_LETTERS } from '../data/mockData';\nimport { HERITAGE_DATA } from '../data/heritageData';");
}

const stateChanges = `
  const [activeGame, setActiveGame] = useState<'match' | 'trace' | 'literature'>('match');
  const [litIndex, setLitIndex] = useState(0);

  const litMatchQuestions = useMemo(() => {
    const valid = HERITAGE_DATA.filter(h => h.author);
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    return shuffle(valid).map(item => {
      const otherAuthors = shuffle(valid.filter(v => v.author !== item.author));
      const options = shuffle([
        item.author,
        otherAuthors[0]?.author || 'கம்பர்',
        otherAuthors[1]?.author || 'இளங்கோவடிகள்'
      ]);
      return {
        title: item.titleTamil,
        category: item.category,
        answer: item.author,
        options
      };
    });
  }, []);

  const currentLit = litMatchQuestions[litIndex] || { title: '', answer: '', options: [] };
  
  const handleLitOption = (option: string) => {
    if (feedback !== 'idle') return;
    if (option === currentLit.answer) {
      setFeedback('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        if (litIndex < litMatchQuestions.length - 1) {
          setLitIndex(prev => prev + 1);
          setFeedback('idle');
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };
`;

content = content.replace(/const \[activeGame, setActiveGame\] = useState\S*\('match'\);/, stateChanges.trim());

const buttonChanges = `
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => setActiveGame('match')}
            className={\`px-6 py-2 rounded-full font-bold transition-all \${activeGame === 'match' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}\`}
          >
            Picture Match
          </button>
          <button 
            onClick={() => setActiveGame('trace')}
            className={\`px-6 py-2 rounded-full font-bold transition-all \${activeGame === 'trace' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}\`}
          >
            Letter Tracing
          </button>
          <button 
            onClick={() => setActiveGame('literature')}
            className={\`px-6 py-2 rounded-full font-bold transition-all \${activeGame === 'literature' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'}\`}
          >
            இலக்கிய வேட்டை
          </button>
        </div>
`;

content = content.replace(/<div className="flex gap-4 justify-center">[\s\S]*?<\/div>/, buttonChanges.trim());

const uiChanges = `
        {activeGame === 'literature' ? (
          <>
            <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-full">
              Level {litIndex + 1} / {litMatchQuestions.length}
            </div>
            
            {feedback === 'correct' && litIndex === litMatchQuestions.length - 1 ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <Mascot size="lg" state="celebrating" />
                <h2 className="text-3xl font-bold text-amber-600">Great Job! 🎉</h2>
                <button 
                  onClick={() => { setLitIndex(0); setFeedback('idle'); }}
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold shadow-3d hover:-translate-y-1"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <>
                <div className="text-center space-y-4 max-w-2xl">
                  <div className="text-amber-500 font-bold tracking-widest uppercase">{currentLit.category}</div>
                  <h2 className="text-4xl md:text-5xl font-tamil font-bold text-slate-800 leading-snug">"{currentLit.title}"</h2>
                  <p className="text-xl text-slate-500 font-medium">இந்த வரியை எழுதியவர் யார்?</p>
                </div>

                <div className="flex flex-col w-full max-w-md gap-4 mt-8">
                  {currentLit.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLitOption(opt)}
                      className="w-full bg-white rounded-2xl p-6 text-xl md:text-2xl font-tamil font-bold text-slate-700 shadow-sm border-2 border-slate-100 hover:border-amber-300 transition-all flex items-center justify-between group"
                    >
                      {opt} <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">?</div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {feedback === 'correct' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-10 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg flex items-center gap-3"
                    >
                      சூப்பர்! 🎉 சரியான விடை!
                    </motion.div>
                  )}
                  {feedback === 'wrong' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-10 bg-red-400 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg flex items-center gap-3"
                    >
                      மீண்டும் முயற்சி செய்! 💪
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </>
        ) : activeGame === 'match' ? (
`;

content = content.replace(/\{activeGame === 'match' \? \(/, uiChanges.trim());

fs.writeFileSync('src/pages/Games.tsx', content);
