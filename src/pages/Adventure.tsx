import { useAchievements } from '../context/AchievementContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Star, ArrowRight, Lightbulb, Gamepad2, PenTool, BrainCircuit } from 'lucide-react';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';
import { Mascot } from '../components/mascot/Mascot';
import { QUIZ_LEVELS } from '../data/levelDataGenerator';
import { useProgress } from '../hooks/useProgress';
import { TamilLevel, QuizQuestion } from '../types';
import { GameEngine } from '../components/adventure/GameEngine';
import { Assessment } from '../components/adventure/Assessment';
import { LetterTracingCanvas } from '../components/adventure/LetterTracingCanvas';
import { audio } from '../lib/audio';

export function Adventure() {
  const { unlockBadge } = useAchievements();

  const { progress, addXP, completeLevel, completeQuestion } = useProgress();
  const [activeView, setActiveView] = useState<'map' | 'level' | 'game' | 'trace' | 'quiz' | 'result'>('map');
  const [selectedLevel, setSelectedLevel] = useState<TamilLevel | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  
  // Gameplay state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [preTestScore, setPreTestScore] = useState<number | null>(null);
  const [postTestScore, setPostTestScore] = useState<number | null>(null);

  // Derive unlocked status (Level 1 is always unlocked. Others unlock if prev is completed)
  const isLevelUnlocked = (levelNum: number) => {
    if (levelNum === 1) return true;
    return progress.completedLevels.includes(levelNum - 1);
  };

  const handleStartLevel = (level: TamilLevel) => {
    setSelectedLevel(level);
    setCurrentQuizIndex(0);
    setLevelScore(0);
    setActiveView('level');
  };

  const handleGameComplete = (score: number, xp: number) => {
    addXP(xp);
    setActiveView('trace');
  };

  const handleTraceComplete = (score: number, xp: number) => {
    addXP(xp);
    setActiveView('quiz');
  };

  const handleAnswer = (optionId: string, isCorrect: boolean, qId: string, xpReward: number) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    setShowFeedback(true);

    let earnedStars = 0;
    if (isCorrect) {
      setLevelScore(s => s + 1);
      earnedStars = 3;
      triggerMiniCelebration();
    } else {
      earnedStars = 1;
    }

    completeQuestion(qId, earnedStars, isCorrect ? xpReward : 5);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      setShowHint(false);
      
      if (currentQuizIndex < 2) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        // Complete Level
        if (selectedLevel) {
          completeLevel(selectedLevel.level);
        }
        setActiveView('post-test');
      }
    }, 2500);
  };

  // Views

  const renderMap = () => {
    // Group levels by chapters
    const chapters = Array.from({ length: 10 }, (_, i) => {
      const chapterNum = i + 1;
      const chapterLevels = QUIZ_LEVELS.filter(l => l.chapter === chapterNum);
      let chapterTitle = '';
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
      return { chapterNum, chapterTitle, chapterLevels };
    });

    return (
      <div className="space-y-12 w-full max-w-5xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-purple-100 shadow-sm gap-4 sticky top-4 z-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Tamil Adventure Map</h1>
            <p className="text-slate-500">100 Levels • Games • Tracing • Quizzes</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-yellow-50 px-4 py-2 rounded-xl font-bold text-yellow-600 flex items-center gap-2 border border-yellow-200">
              <Star size={20} className="fill-current" /> {progress.xp} XP
            </div>
            <button onClick={() => {
              const nextUnfinished = QUIZ_LEVELS.find(l => !progress.completedLevels.includes(l.level));
              if (nextUnfinished) handleStartLevel(nextUnfinished);
            }} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors">
              Continue Learning
            </button>
          </div>
        </div>

        {chapters.map(chapter => (
          <div key={chapter.chapterNum} className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{chapter.chapterTitle}</h2>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {chapter.chapterLevels.map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.level);
                const completed = progress.completedLevels.includes(lvl.level);
                
                return (
                  <button
                    key={lvl.level}
                    disabled={!unlocked}
                    onClick={() => handleStartLevel(lvl)}
                    className={`relative p-4 rounded-2xl border-b-4 flex flex-col items-center justify-center gap-2 transition-all ${
                      completed ? 'bg-purple-100 border-purple-300 hover:border-purple-400' :
                      unlocked ? 'bg-white dark:bg-slate-800 border-purple-200 hover:border-purple-400 shadow-sm hover:-translate-y-1' :
                      'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner ${
                      completed ? 'bg-purple-500 text-white' :
                      unlocked ? 'bg-purple-100 text-purple-600' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {lvl.level}
                    </div>
                    <div className="text-xs font-bold text-center text-slate-600 dark:text-slate-300 line-clamp-2 w-full mt-2">
                      {lvl.title.split('-')[0]}
                    </div>
                    {!unlocked && <Lock size={16} className="absolute top-2 right-2 text-slate-400" />}
                    {completed && <Star size={16} className="absolute top-2 right-2 text-yellow-500 fill-current drop-shadow-sm" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLevelIntro = () => {
    if (!selectedLevel) return null;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <button onClick={() => setActiveView('map')} className="text-purple-600 font-bold hover:underline mb-4">← Back to Map</button>
        
        <div className="glass-panel p-8 text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Level {selectedLevel.level}</h2>
          <h3 className="text-xl text-purple-600 font-bold">{selectedLevel.title}</h3>
          <p className="text-slate-500">{selectedLevel.description}</p>
          
          <div className="flex justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase">{selectedLevel.difficulty}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-3xl border-2 bg-white dark:bg-slate-800 border-blue-200 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <Gamepad2 size={32} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">1. Play</div>
            <p className="text-sm text-slate-500">Interactive Game</p>
          </div>
          <div className="p-6 rounded-3xl border-2 bg-white dark:bg-slate-800 border-green-200 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <PenTool size={32} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">2. Trace</div>
            <p className="text-sm text-slate-500">Writing Practice</p>
          </div>
          <div className="p-6 rounded-3xl border-2 bg-white dark:bg-slate-800 border-purple-200 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2">
              <BrainCircuit size={32} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">3. Quiz</div>
            <p className="text-sm text-slate-500">Test Knowledge</p>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => setActiveView('pre-test')}
            className="px-12 py-4 bg-purple-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-purple-700 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            Start Adventure <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    if (!selectedLevel) return null;
    const q = selectedLevel.questions[currentQuizIndex];

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-slate-500 font-bold">Level {selectedLevel.level} • Quiz {currentQuizIndex + 1}/3</div>
          <div className="text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-100">+{q.xp} XP</div>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuizIndex) / 3) * 100}%` }}
          />
        </div>

        <div className="glass-panel p-8 space-y-8 relative">
          <button 
            onClick={() => setShowHint(true)}
            className="absolute top-4 right-4 p-2 text-yellow-500 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"
            title="Hint"
          >
            <Lightbulb size={24} />
          </button>

          <div className="text-center space-y-4">
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {q.type}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {q.question}
            </h2>
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm font-medium flex gap-3 items-start"
              >
                <Lightbulb className="flex-shrink-0 mt-0.5" size={18} />
                <p>{q.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-300 shadow-sm";
              
              if (showFeedback) {
                if (opt.isCorrect) btnClass = "bg-green-100 border-2 border-green-500 text-green-800 shadow-inner";
                else if (isSelected) btnClass = "bg-red-100 border-2 border-red-500 text-red-800";
                else btnClass = "bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 text-slate-400 opacity-50";
              }

              return (
                <button
                  key={opt.id}
                  disabled={showFeedback}
                  onClick={() => handleAnswer(opt.id, opt.isCorrect, q.id, q.xp)}
                  className={`p-6 rounded-2xl text-2xl md:text-3xl font-tamil font-bold transition-all flex items-center justify-center min-h-[100px] ${btnClass}`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border font-medium ${
                  q.options.find(o => o.id === selectedOption)?.isCorrect
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="font-bold mb-1">
                  {q.options.find(o => o.id === selectedOption)?.isCorrect ? 'அருமை! (Awesome!) 🎉' : 'பரவாயில்லை! (Almost there!) 💪'}
                </div>
                <p className="text-sm opacity-90">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!selectedLevel) return null;
    
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 py-12">
        <Mascot size="lg" state="celebrating" />
        <div className="glass-panel p-12 w-full text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
          
          <h1 className="text-4xl font-bold text-purple-600">Level {selectedLevel.level} Complete! 🎉</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">You scored {levelScore} out of 3 on Quizzes</p>
          
          <div className="flex justify-center gap-4 py-4">
            <div className="px-6 py-4 bg-yellow-50 rounded-2xl border border-yellow-200 flex flex-col items-center">
              <Star size={32} className="text-yellow-500 fill-current mb-2" />
              <span className="font-bold text-yellow-700">+50 Bonus XP</span>
            </div>
            {levelScore === 3 && (
              <div className="px-6 py-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col items-center">
                <span className="text-3xl mb-2">🏆</span>
                <span className="font-bold text-purple-700">Perfect Level!</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <button 
              onClick={() => setActiveView('map')}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700"
            >
              Continue Adventure 🚀
            </button>
            <button 
              onClick={() => handleStartLevel(selectedLevel)}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-purple-600 border-2 border-purple-200 rounded-xl font-bold hover:bg-purple-50"
            >
              Replay Level
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[70vh]">
      {activeView === 'map' && renderMap()}
      {activeView === 'level' && renderLevelIntro()}
      {activeView === 'pre-test' && selectedLevel && (
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
      {activeView === 'game' && selectedLevel?.games[0] && (
        <GameEngine activity={selectedLevel.games[0]} onComplete={handleGameComplete} />
      )}
      {activeView === 'trace' && selectedLevel?.tracing[0] && (
        <LetterTracingCanvas activity={selectedLevel.tracing[0]} onComplete={handleTraceComplete} />
      )}
      {activeView === 'quiz' && renderPlaying()}
      {activeView === 'result' && renderResult()}
    </div>
  );
}
