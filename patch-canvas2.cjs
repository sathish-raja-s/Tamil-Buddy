const fs = require('fs');
let code = fs.readFileSync('src/components/adventure/LetterTracingCanvas.tsx', 'utf-8');

// Add PlayCircle to imports
code = code.replace(
  "import { motion, AnimatePresence } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';\nimport { PlayCircle } from 'lucide-react';"
);

// Add isWatching state
code = code.replace(
  "const [finalScore, setFinalScore] = useState(0);",
  "const [finalScore, setFinalScore] = useState(0);\n  const [isWatching, setIsWatching] = useState(false);"
);

// Add handleWatch function
const handleWatch = `
  const handleWatch = () => {
    if (isWatching) return;
    setIsWatching(true);
    clearCanvas();
    audio.playSparkle();
    setTimeout(() => {
      setIsWatching(false);
    }, 3500);
  };
`;
code = code.replace(
  "const getPoint = (e:",
  handleWatch + "\n  const getPoint = (e:"
);

// Prevent drawing while watching
code = code.replace(
  "if (showScore) return;",
  "if (showScore || isWatching) return;"
);
code = code.replace(
  "if (!isDrawing || showScore) return;",
  "if (!isDrawing || showScore || isWatching) return;"
);

// Add animation SVG to render
const watchSVG = `
        {/* Watch Me Animation Overlay */}
        <AnimatePresence>
        {isWatching && (
          <motion.svg 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full pointer-events-none z-15" 
            viewBox="0 0 400 400"
          >
            <motion.text 
              x="50%" y="50%" 
              dominantBaseline="middle" textAnchor="middle" 
              fontSize={activity.character.length > 2 ? "120" : "280"}
              className="font-tamil font-bold"
              fill="transparent"
              stroke="#8B5CF6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              {activity.character}
            </motion.text>
          </motion.svg>
        )}
        </AnimatePresence>
`;
code = code.replace(
  "{/* Score Overlay */}",
  watchSVG + "\n        {/* Score Overlay */}"
);

// Update buttons layout
const newButtons = `
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button 
          onClick={handleWatch}
          disabled={isWatching || showScore}
          className="flex-1 py-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <PlayCircle size={20} /> Watch
        </button>
        <button 
          onClick={clearCanvas}
          disabled={isWatching || showScore}
          className="flex-1 py-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800 rounded-xl font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50"
        >
          🗑️ Clear
        </button>
        <button 
          onClick={handleFinish}
          disabled={strokes === 0 || isWatching || showScore}
          className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md disabled:opacity-50"
        >
          ✅ Finish
        </button>
      </div>
`;
code = code.replace(
  /<div className="flex gap-4 w-full">[\s\S]*?<\/div>/,
  newButtons.trim()
);

fs.writeFileSync('src/components/adventure/LetterTracingCanvas.tsx', code);
