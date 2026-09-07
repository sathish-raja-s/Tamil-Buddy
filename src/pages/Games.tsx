import { useAchievements } from '../context/AchievementContext';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';
import { Mascot } from '../components/mascot/Mascot';
import { TAMIL_LETTERS } from '../data/mockData';
import { HERITAGE_DATA } from '../data/heritageData';
import { LetterTracingCanvas } from '../components/adventure/LetterTracingCanvas';
import { TracingActivity } from '../types';
import { audio } from '../lib/audio';


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

export function Games() {
  const { unlockBadge } = useAchievements();

  const [litIndex, setLitIndex] = useState(0);
  const currentLit = litMatchQuestions[litIndex];
    
  const handleLitOption = (opt: string) => {
    if (opt === currentLit.answer) {
      audio.playSuccess();
      unlockBadge('b4');
      triggerMiniCelebration();
      setFeedback('correct');
      setTimeout(() => {
        if (litIndex < litMatchQuestions.length - 1) {
          setLitIndex(i => i + 1);
          setFeedback('idle');
        }
      }, 1500);
    } else {
      audio.playError();
      audio.playError();
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };
  const [activeGame, setActiveGame] = useState<'match' | 'trace'>('match');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  // Tracing game state
  const [traceIndex, setTraceIndex] = useState(0);

  // Generate dynamic Picture Match questions using TAMIL_LETTERS
  const matchWords = useMemo(() => {
    const validWords = TAMIL_LETTERS.filter(l => l.word && l.illustration && l.illustration !== '📝');
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    return validWords.map(w => {
      const otherWords = shuffle(validWords.filter(other => other.illustration !== w.illustration));
      const options = shuffle([
        w.illustration,
        otherWords[0].illustration,
        otherWords[1].illustration
      ]);
      
      return {
        word: w.word,
        answer: w.illustration,
        options,
        english: w.englishMeaning
      };
    });
  }, []);

  const currentWord = matchWords[currentIndex];
  // TAMIL_LETTERS contains all 247 letters
  const currentTraceLetter = TAMIL_LETTERS[traceIndex];

  const handleOptionClick = (option: string) => {
    if (feedback !== 'idle') return;

    if (option === currentWord.answer) {
      setFeedback('correct');
      triggerGrandCelebration();
      setTimeout(() => {
        if (currentIndex < matchWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setFeedback('idle');
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };

  const isMatchComplete = feedback === 'correct' && currentIndex === matchWords.length - 1;

  const handleNextTrace = () => {
    triggerMiniCelebration();
    if (traceIndex < TAMIL_LETTERS.length - 1) {
      setTraceIndex(prev => prev + 1);
    } else {
      setTraceIndex(0);
    }
  };

  const tracingActivity: TracingActivity = {
    id: currentTraceLetter.id,
    character: currentTraceLetter.letter,
    type: currentTraceLetter.category as any,
    difficulty: 1,
    xp: 10
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 flex flex-col items-center pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Learning Games</h1>
        <p className="text-slate-600 dark:text-slate-300">Master all 247 Tamil Letters!</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => { audio.playPop(); setActiveGame('match'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeGame === 'match' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 dark:text-slate-300'}`}
          >
            Picture Match
          </button>
          <button 
            onClick={() => { audio.playPop(); setActiveGame('trace'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeGame === 'trace' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 dark:text-slate-300'}`}
          >
            Letter Tracing
          </button>
          <button 
            onClick={() => { audio.playPop(); setActiveGame('literature'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeGame === 'literature' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 text-slate-600 dark:text-slate-300'}`}
          >
            இலக்கிய வேட்டை
          </button>
        </div>
      </div>

      <div className="glass-panel w-full p-8 md:p-12 flex flex-col items-center gap-12 relative overflow-hidden min-h-[500px]">
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
                  <h2 className="text-4xl md:text-5xl font-tamil font-bold text-slate-800 dark:text-slate-100 leading-snug">"{currentLit.title}"</h2>
                  <p className="text-xl text-slate-500 font-medium">இந்த வரியை எழுதியவர் யார்?</p>
                </div>

                <div className="flex flex-col w-full max-w-md gap-4 mt-8">
                  {currentLit.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLitOption(opt)}
                      className="w-full bg-white dark:bg-slate-800 rounded-2xl p-6 text-xl md:text-2xl font-tamil font-bold text-slate-700 dark:text-slate-200 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-amber-300 transition-all flex items-center justify-between group"
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
          <>
            <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full">
              Level {currentIndex + 1} / {matchWords.length}
            </div>

            {isMatchComplete ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <Mascot size="lg" state="celebrating" />
                <h2 className="text-3xl font-bold text-purple-600">Great Job! 🎉</h2>
                <button 
                  onClick={() => { setCurrentIndex(0); setFeedback('idle'); }}
                  className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <>
                <div className="text-center">
                  <motion.div 
                    key={`word-${currentIndex}`}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-6xl md:text-8xl font-tamil font-bold text-slate-800 dark:text-slate-100"
                  >
                    {currentWord.word}
                  </motion.div>
                  <p className="text-slate-400 font-medium mt-2 text-xl">{currentWord.english}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {currentWord.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionClick(opt)}
                      className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-800 rounded-3xl text-6xl md:text-7xl shadow-sm border-b-4 border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-colors flex items-center justify-center"
                    >
                      {opt}
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
                      சூப்பர்! 🎉 சரியான பதில்!
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
        ) : (
          <div className="w-full flex flex-col items-center gap-4 relative">
            <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full z-10">
              Letter {traceIndex + 1} / {TAMIL_LETTERS.length}
            </div>
            
            <LetterTracingCanvas 
              key={currentTraceLetter.id} 
              activity={tracingActivity} 
              onComplete={handleNextTrace} 
            />

            <div className="flex gap-4 mt-8 w-full max-w-md justify-between px-4">
              <button
                onClick={() => setTraceIndex(prev => Math.max(0, prev - 1))}
                disabled={traceIndex === 0}
                className="px-6 py-2 bg-slate-100 text-slate-500 font-bold rounded-full disabled:opacity-50 hover:bg-slate-200 transition-colors"
              >
                Previous Letter
              </button>
              <button
                onClick={() => setTraceIndex(prev => Math.min(TAMIL_LETTERS.length - 1, prev + 1))}
                disabled={traceIndex === TAMIL_LETTERS.length - 1}
                className="px-6 py-2 bg-slate-100 text-slate-500 font-bold rounded-full disabled:opacity-50 hover:bg-slate-200 transition-colors"
              >
                Skip Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
