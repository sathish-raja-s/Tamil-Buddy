import { useAchievements } from '../context/AchievementContext';
import React from 'react';
import { motion } from 'motion/react';
import { Flame, Star, Trophy, BookOpen, Lock } from 'lucide-react';

import { Mascot } from '../components/mascot/Mascot';
import { useProgress } from '../hooks/useProgress';
import { QUIZ_LEVELS } from '../data/levelDataGenerator';
import { useNavigate } from 'react-router-dom';

const CHAPTERS = [
  { num: 1, title: 'Tamil Beginner', desc: 'Uyir letters basics' },
  { num: 2, title: 'Letter Explorer', desc: 'Mei letters basics' },
  { num: 3, title: 'Mei Master', desc: 'Consonants mastery' },
  { num: 4, title: 'Uyirmei Explorer', desc: 'Combinations intro' },
  { num: 5, title: 'Uyirmei Builder', desc: 'Vowels + Consonants' },
  { num: 6, title: 'Uyirmei Master', desc: 'Advanced letters' },
  { num: 7, title: 'Word Explorer', desc: 'Basic vocabulary' },
  { num: 8, title: 'Word Builder', desc: 'Spelling challenges' },
  { num: 9, title: 'Sentence Master', desc: 'Short phrases' },
  { num: 10, title: 'Tamil Champion', desc: 'Complete mastery' },
];

export function Progress() {
  const { badges } = useAchievements();
  const { progress } = useProgress();
  const navigate = useNavigate();

  const totalCompletedLevels = progress.completedLevels.length;
  const currentChapterNum = Math.min(10, Math.floor(totalCompletedLevels / 10) + 1);
  const currentChapter = CHAPTERS.find(c => c.num === currentChapterNum);
  
  const stats = [
    { icon: <Flame className="w-8 h-8 text-orange-500" />, label: 'Day Streak', value: '1', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { icon: <Star className="w-8 h-8 text-yellow-500" />, label: 'XP Points', value: progress.xp.toString(), color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { icon: <Trophy className="w-8 h-8 text-purple-500" />, label: 'Badges', value: badges.filter(b => b.isUnlocked).length.toString(), color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { icon: <BookOpen className="w-8 h-8 text-blue-500" />, label: 'Levels', value: `${totalCompletedLevels}/100`, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white dark:bg-slate-800/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white dark:bg-slate-800/10 rounded-full blur-2xl" />
        
        <div className="space-y-4 z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold">Hi, Learner! 👋</h1>
          <p className="text-xl text-purple-100">Ready for today's Tamil adventure?</p>
          <div className="inline-block mt-4 px-6 py-2 bg-[#244281] backdrop-blur-md rounded-full font-bold">
            Chapter {currentChapterNum}: {currentChapter?.title}
          </div>
        </div>

        <div className="hidden md:block z-10">
          <Mascot size="lg" state="happy" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 text-center ${stat.color}`}
          >
            {stat.icon}
            <span className="text-3xl font-black">{stat.value}</span>
            <span className="text-sm font-bold uppercase tracking-wide opacity-80">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Badges 🏆</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              whileHover={{ y: -5, scale: 1.05 }}
              className={`glass-panel p-6 flex flex-col items-center text-center gap-3 border-2 transition-all ${badge.isUnlocked ? "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)] bg-amber-50/50" : "border-slate-100 dark:border-slate-700 opacity-60 grayscale"}`}
            >
              <div className="text-5xl drop-shadow-md relative">
                {badge.icon}
                {!badge.isUnlocked && <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center rounded-full"><Lock className="w-6 h-6 text-slate-500" /></div>}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{badge.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Adventure Map (10 Chapters) 🗺️</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter, i) => {
            const isCompleted = currentChapterNum > chapter.num;
            const isCurrent = currentChapterNum === chapter.num;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-3xl border-2 relative overflow-hidden flex items-start gap-4 ${
                  isCompleted ? 'bg-purple-50 border-purple-200' :
                  isCurrent ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-md ring-2 ring-purple-100' :
                  'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg shadow-sm ${
                    isCompleted ? 'bg-purple-500 text-white' :
                    isCurrent ? 'bg-purple-600 text-white animate-pulse' :
                    'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : !isCurrent ? <Lock size={18} /> : chapter.num}
                </div>
                
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${isCurrent || isCompleted ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500'}`}>
                    {chapter.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{chapter.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-4xl bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm w-fit">🤖</div>
          <div>
            <h4 className="font-bold text-purple-800 text-lg">Buddy recommends:</h4>
            <p className="text-purple-600 font-medium">You are on Chapter {currentChapterNum}! Let's master the next level today.</p>
          </div>
          <button 
            onClick={() => navigate('/adventure')}
            className="sm:ml-auto mt-2 sm:mt-0 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors"
          >
            Go to Adventure Map
          </button>
        </div>
      </div>
    </div>
  );
}
