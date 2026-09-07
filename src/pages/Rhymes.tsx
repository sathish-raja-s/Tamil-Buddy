import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Star, CheckCircle, Heart, ArrowLeft, Music } from 'lucide-react';
import { AudioService } from '../utils/audioService';
import { TamilVoiceButton } from '../components/common/TamilVoiceButton';
import { RHYMES_DATA } from '../data/rhymeData';
import { useProgress } from '../hooks/useProgress';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';

export function Rhymes() {
  const [selectedRhyme, setSelectedRhyme] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
    const { progress, completeRhyme, toggleFavoriteRhyme } = useProgress();

  const categories = ['All', ...new Set(RHYMES_DATA.map(r => r.category))];
  
  const filteredRhymes = RHYMES_DATA.filter(r => {
    const matchesCat = filter === 'All' || r.category === filter;
    const matchesSearch = r.titleTamil.includes(search) || r.titleEnglish.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const rhyme = RHYMES_DATA.find(r => r.id === selectedRhyme);

  useEffect(() => {
    if (isPlaying && rhyme) {
      AudioService.playTamilSequence(rhyme.lyrics.map(l => l.tamilText), () => {
        setIsPlaying(false);
      });
    } else {
      AudioService.stop();
    }
    return () => AudioService.stop();
  }, [isPlaying, rhyme]);

  const handleFinish = (rhymeId: string, xpReward: number) => {
    completeRhyme(rhymeId, xpReward);
    triggerGrandCelebration();
  };

  if (rhyme) {
    const isCompleted = progress.completedRhymes.includes(rhyme.id);
    const isFavorite = progress.favoriteRhymes.includes(rhyme.id);
    
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => { setSelectedRhyme(null); setIsPlaying(false); }}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> Back to Rhymes
          </button>
          
          <button 
            onClick={() => toggleFavoriteRhyme(rhyme.id)}
            className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center gap-8 text-center relative overflow-hidden text-white">
          {/* Floating musical notes */}
          <div className="absolute top-10 left-10 text-white/20 text-6xl animate-bounce"><Music /></div>
          <div className="absolute bottom-10 right-10 text-white/20 text-6xl animate-pulse"><Music /></div>
          
          {/* Header */}
          <div className="space-y-2 z-10">
            <h1 className="text-3xl md:text-5xl font-tamil font-bold drop-shadow-md">{rhyme.titleTamil}</h1>
            <p className="text-xl text-blue-100">{rhyme.titleEnglish}</p>
          </div>
          
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-slate-800/20 rounded-full flex items-center justify-center text-7xl md:text-8xl shadow-inner border-4 border-white/30 backdrop-blur-sm z-10">
            {rhyme.illustration}
          </div>

          {/* Karaoke Lyrics Area */}
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800/10 p-6 md:p-8 rounded-2xl backdrop-blur-md z-10 min-h-[200px] flex flex-col justify-center">
            <div className="space-y-6">
              {rhyme.lyrics.map((line, idx) => (
                <div key={line.id} className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-70'}`}>
                  <p className="text-2xl md:text-3xl font-tamil font-bold">{line.tamilText}</p>
                  <p className="text-blue-100 italic mt-1">{line.englishText}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Audio Player Controls */}
          <div className="flex items-center justify-center gap-6 w-full max-w-md z-10">
            <button className="p-4 bg-white dark:bg-slate-800/10 rounded-full text-white hover:bg-white dark:bg-slate-800/20 transition-colors">
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-6 bg-white dark:bg-slate-800 text-blue-600 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            
            <button className="p-4 bg-white dark:bg-slate-800/10 rounded-full text-white hover:bg-white dark:bg-slate-800/20 transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
          
          {/* Progress Bar Mock */}
          <div className="w-full max-w-md h-2 bg-white dark:bg-slate-800/20 rounded-full overflow-hidden z-10">
            <div className={`h-full bg-white dark:bg-slate-800 transition-all duration-1000 ease-linear ${isPlaying ? 'w-3/4' : 'w-0'}`} />
          </div>

          <div className="z-10 mt-4">
             <button 
                onClick={() => handleFinish(rhyme.id, rhyme.xpReward)}
                disabled={isCompleted}
                className={`px-8 py-4 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2 ${isCompleted ? 'bg-green-400 text-white cursor-default' : 'bg-green-500 text-white hover:bg-green-400'}`}
              >
                <CheckCircle size={24} /> {isCompleted ? 'Completed' : 'Finish Rhyme & Earn XP'}
              </button>
          </div>
        </div>

        {/* Vocabulary Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Star className="text-yellow-500" /> New Words (சொற்களஞ்சியம்)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rhyme.vocabulary.map((v, i) => (
              <div key={v.id} className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col gap-1 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="font-tamil font-bold text-2xl text-blue-600">{v.word}</div>
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

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 pb-2">
          பாடிப் பாடி தமிழ் கற்போம் 🎵
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">Sing along with interactive Tamil rhymes and earn XP!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${filter === c ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <input 
          type="text"
          placeholder="Search rhymes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRhymes.map((r, i) => {
          const isCompleted = progress.completedRhymes.includes(r.id);
          const isFavorite = progress.favoriteRhymes.includes(r.id);
          
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRhyme(r.id)}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-300 flex flex-col items-center text-center gap-4 cursor-pointer hover:-translate-y-2 transition-all shadow-sm relative group overflow-hidden"
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
              
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-inner">
                {r.illustration}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-tamil font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{r.titleTamil}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{r.titleEnglish}</p>
              </div>
              
              <div className="flex gap-2 w-full mt-2">
                <div className="flex-1 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-100 dark:border-slate-700">
                  {r.difficulty}
                </div>
                <div className="flex-1 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold border border-yellow-100 flex items-center justify-center gap-1">
                  <Star size={12} fill="currentColor" /> {r.xpReward} XP
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
