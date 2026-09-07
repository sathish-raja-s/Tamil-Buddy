import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, BookOpen, Volume2, Star, CheckCircle, Heart, ArrowLeft, Search } from 'lucide-react';
import { AudioService } from '../utils/audioService';
import { TamilVoiceButton } from '../components/common/TamilVoiceButton';
import { HERITAGE_DATA, HeritageCategory, HeritageItem } from '../data/heritageData';
import { useProgress } from '../hooks/useProgress';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';

export function Heritage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<HeritageCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  
  // Reuse progress system for heritage (map to completedRhymes/favorites for now, or ideally new state)
  const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress();

  const categories = ['All', ...new Set(HERITAGE_DATA.map(h => h.category))] as (HeritageCategory | 'All')[];
  
  const filteredItems = HERITAGE_DATA.filter(h => {
    const matchesCat = filter === 'All' || h.category === filter;
    const matchesSearch = h.titleTamil.includes(search) || 
                          h.titleEnglish.toLowerCase().includes(search.toLowerCase()) || 
                          h.author.includes(search);
    return matchesCat && matchesSearch;
  });

  const item = HERITAGE_DATA.find(h => h.id === selectedItem);

  useEffect(() => {
    if (isPlaying && item) {
      AudioService.playTamilSequence(item.lyrics.map(l => l.tamilText), () => {
        setIsPlaying(false);
      });
    } else {
      AudioService.stop();
    }
    return () => AudioService.stop();
  }, [isPlaying, item]);

  const handleFinish = (itemId: string, xpReward: number) => {
    completeRhyme(itemId, xpReward); // Using completeRhyme temporarily for heritage progress
    triggerGrandCelebration();
  };

  const categoryIcons: Record<string, string> = {
    'Bharathiyar': '🎵',
    'Thirukkural': '💡',
    'Aathichudi': '🌸',
    'Sangam': '🌿',
    'Proverbs': '💬',
    'Avvaiyar': '👵',
    'Bharathidasan': '🎶'
  };

  if (item) {
    const isCompleted = progress.completedRhymes.includes(item.id);
    const isFavorite = progress.favoriteRhymes.includes(item.id);
    
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => { setSelectedItem(null); setIsPlaying(false); }}
            className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> Back to Heritage
          </button>
          
          <button 
            onClick={() => toggleFavoriteRhyme(item.id)}
            className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center gap-8 text-center relative overflow-hidden text-white">
          <div className="space-y-2 z-10">
            <h1 className="text-3xl md:text-5xl font-tamil font-bold drop-shadow-md">{item.titleTamil}</h1>
            <p className="text-xl text-amber-100">{item.author}</p>
          </div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-800/20 rounded-full flex items-center justify-center text-6xl md:text-7xl shadow-inner border-4 border-white/30 backdrop-blur-sm z-10">
            {item.illustration}
          </div>

          <div className="w-full max-w-2xl bg-white dark:bg-slate-800/10 p-6 md:p-8 rounded-2xl backdrop-blur-md z-10 min-h-[150px] flex flex-col justify-center">
            <div className="space-y-6">
              {item.lyrics.map((line) => (
                <div key={line.id} className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-80'}`}>
                  <p className="text-2xl md:text-3xl font-tamil font-bold">{line.tamilText}</p>
                  <p className="text-amber-100 italic mt-1">{line.englishText}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 w-full max-w-md z-10">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-6 bg-white dark:bg-slate-800 text-orange-600 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
          </div>
          
          <div className="z-10 mt-4">
             <button 
                onClick={() => handleFinish(item.id, item.xpReward)}
                disabled={isCompleted}
                className={`px-8 py-4 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2 ${isCompleted ? 'bg-green-400 text-white cursor-default' : 'bg-green-500 text-white hover:bg-green-400'}`}
              >
                <CheckCircle size={24} /> {isCompleted ? 'Learned' : `Finish & Earn ${item.xpReward} XP`}
              </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="font-bold text-2xl mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="text-amber-500" /> எளிய பொருள் (Simple Meaning)
            </h3>
            <p className="text-lg font-tamil text-slate-700 dark:text-slate-200 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100">{item.simpleMeaning}</p>
            <p className="text-md text-slate-500 mt-2 italic">{item.englishMeaning}</p>
          </div>

          {item.lifeLesson && (
            <div>
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Star className="text-yellow-500" /> வாழ்க்கைப் பாடம் (Life Lesson)
              </h3>
              <p className="text-lg text-orange-700 font-medium">{item.lifeLesson}</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Volume2 className="text-blue-500" /> இன்று கற்போம் (Vocabulary)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.vocabulary.map((v) => (
              <div key={v.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-1 hover:border-amber-200 transition-colors cursor-pointer" onClick={() => AudioService.playTamilWord(v.word)}>
                <div className="flex justify-between items-start">
                  <div className="font-tamil font-bold text-2xl text-amber-600">{v.word}</div>
                  <TamilVoiceButton text={v.word} size="sm" label="" />
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{v.english}</div>
                <div className="text-slate-400 text-sm italic">{v.pronunciation}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const dailyItem = HERITAGE_DATA[new Date().getDay() % HERITAGE_DATA.length];

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 pb-2">
          தமிழ் மரபு 🏛️
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">Discover Tamil Heritage, Literature, and Classical Works</p>
      </div>

      {/* Daily Feature */}
      {!search && filter === 'All' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 md:p-8 rounded-3xl border border-yellow-200 shadow-sm flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItem(dailyItem.id)}>
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-5xl shadow-sm shrink-0">
            🌞
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest">இன்றைய தமிழ் (Today's Feature)</h2>
            <h3 className="text-2xl font-tamil font-bold text-slate-800 dark:text-slate-100">{dailyItem.titleTamil}</h3>
            <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{dailyItem.simpleMeaning}</p>
          </div>
          <button className="bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors shrink-0">
            Learn Now 🚀
          </button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${filter === c ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              {categoryIcons[c] || ''} {c}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text"
            placeholder="Search literature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((h, i) => {
          const isCompleted = progress.completedRhymes.includes(h.id);
          const isFavorite = progress.favoriteRhymes.includes(h.id);
          
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedItem(h.id)}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-amber-300 flex flex-col items-center text-center gap-4 cursor-pointer hover:-translate-y-2 transition-all shadow-sm relative group overflow-hidden"
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
              
              <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-inner">
                {h.illustration}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-tamil font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{h.titleTamil}</h3>
                <p className="text-sm text-amber-600 font-medium">{categoryIcons[h.category]} {h.category}</p>
              </div>
              
              <div className="flex gap-2 w-full mt-2">
                <div className="flex-1 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-100 dark:border-slate-700">
                  Lvl {h.level}
                </div>
                <div className="flex-1 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold border border-yellow-100 flex items-center justify-center gap-1">
                  <Star size={12} fill="currentColor" /> {h.xpReward} XP
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
