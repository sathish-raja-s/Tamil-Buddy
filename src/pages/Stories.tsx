import { useAchievements } from '../context/AchievementContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, ChevronLeft, ArrowLeft, Volume2, Star, CheckCircle, Heart } from 'lucide-react';
import { TamilVoiceButton } from '../components/common/TamilVoiceButton';
import { STORIES_DATA } from '../data/storyData';
import { useProgress } from '../hooks/useProgress';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';

export function Stories() {
  const { unlockBadge } = useAchievements();

  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { progress, completeStory, toggleFavoriteStory } = useProgress();

  const categories = ['All', ...new Set(STORIES_DATA.map(s => s.category))];
  
  const filteredStories = STORIES_DATA.filter(s => {
    const matchesCat = filter === 'All' || s.category === filter;
    const matchesSearch = s.titleTamil.includes(search) || s.titleEnglish.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const story = STORIES_DATA.find(s => s.id === selectedStory);

  const handleFinish = (storyId: string, xpReward: number) => {
    completeStory(storyId, xpReward);
    triggerGrandCelebration();
  };

  if (story) {
    const isCompleted = progress.completedStories.includes(story.id);
    const isFavorite = progress.favoriteStories.includes(story.id);
    const section = story.content[currentPage];
    
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => { setSelectedStory(null); setCurrentPage(0); }}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> Back to Stories
          </button>
          
          <button 
            onClick={() => toggleFavoriteStory(story.id)}
            className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-12 shadow-sm border-2 border-purple-100 flex flex-col items-center gap-8 text-center relative overflow-hidden">
          {/* Header */}
          <div className="space-y-2 z-10">
            <h1 className="text-3xl md:text-5xl font-tamil font-bold text-purple-600 drop-shadow-sm">{story.titleTamil}</h1>
            <p className="text-xl text-slate-500">{story.titleEnglish}</p>
          </div>
          
          {/* Main Reading Area */}
          <div className="w-full max-w-2xl min-h-[300px] flex flex-col md:flex-row items-center gap-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-inner border-4 border-white"
              >
                {section.imageIcon}
              </motion.div>
            </AnimatePresence>

            <div className="flex-1 flex flex-col justify-center text-left min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className="text-2xl md:text-3xl font-tamil leading-relaxed text-slate-800 dark:text-slate-100">
                    {section.tamilText}
                  </p>
                  <p className="text-lg text-slate-500 italic">
                    {section.englishText}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between w-full max-w-lg mt-8 z-10">
            <button 
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-4 bg-slate-100 rounded-full text-slate-500 disabled:opacity-50 hover:bg-purple-100 hover:text-purple-600 transition-colors shadow-sm"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button className="px-8 py-4 bg-blue-50 text-blue-600 rounded-full font-bold flex items-center gap-3 hover:bg-blue-100 transition-colors shadow-sm text-lg">
              <Volume2 size={28} /> Listen (கேட்க)
            </button>
            
            {currentPage === story.content.length - 1 ? (
              <button 
                onClick={() => handleFinish(story.id, story.xpReward)}
                disabled={isCompleted}
                className={`p-4 rounded-full transition-colors shadow-sm ${isCompleted ? 'bg-green-100 text-green-500' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                <CheckCircle size={32} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentPage(p => Math.min(story.content.length - 1, p + 1))}
                className="p-4 bg-slate-100 rounded-full text-slate-500 hover:bg-purple-100 hover:text-purple-600 transition-colors shadow-sm"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
          
          {/* Progress dots */}
          <div className="w-full flex justify-center mt-4 mb-4 z-10">
            <TamilVoiceButton text={section.tamilText} size="lg" label="கேட்டு கதை கேட்போம்" />
          </div>
          <div className="flex gap-2 mt-4 z-10">
            {story.content.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentPage ? 'bg-purple-600 w-6' : 'bg-purple-200'}`} />
            ))}
          </div>
        </div>

        {/* Vocabulary Section */}
        {currentPage === story.content.length - 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Star className="text-yellow-500" /> New Words (சொற்களஞ்சியம்)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {story.vocabulary.map((v, i) => (
                <div key={v.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="font-tamil font-bold text-2xl text-purple-600">{v.word}</div>
                    <TamilVoiceButton text={v.word} size="sm" label="" />
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">{v.english}</div>
                  <div className="text-slate-400 text-sm italic">{v.pronunciation}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 pb-2">
          தமிழ் கதைகள் உலகம் 📚
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">Explore magical Tamil stories, learn new words, and earn XP!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${filter === c ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <input 
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStories.map((s, i) => {
          const isCompleted = progress.completedStories.includes(s.id);
          const isFavorite = progress.favoriteStories.includes(s.id);
          
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedStory(s.id)}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-300 flex flex-col items-center text-center gap-4 cursor-pointer hover:-translate-y-2 transition-all shadow-sm relative group overflow-hidden"
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 text-green-500">
                  <CheckCircle size={24} fill="currentColor" className="text-white" />
                </div>
              )}
              {isFavorite && (
                <div className="absolute top-4 left-4 text-red-500">
                  <Heart size={24} fill="currentColor" className="text-red-500" />
                </div>
              )}
              
              <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {s.illustration}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-tamil font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{s.titleTamil}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{s.titleEnglish}</p>
              </div>
              
              <div className="flex gap-2 w-full mt-2">
                <div className="flex-1 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-100 dark:border-slate-700">
                  {s.difficulty}
                </div>
                <div className="flex-1 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold border border-yellow-100 flex items-center justify-center gap-1">
                  <Star size={12} fill="currentColor" /> {s.xpReward} XP
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
