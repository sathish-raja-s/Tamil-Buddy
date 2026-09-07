import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameActivity } from '../../types';

interface GameEngineProps {
  activity: GameActivity;
  onComplete: (score: number, xp: number) => void;
}

export function GameEngine({ activity, onComplete }: GameEngineProps) {
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  // A very simplified unified game engine that acts like a mini-challenge
  // For production, each game type would have its own complex component.
  
  const target = activity.content.target;
  
  // Generate some dummy options based on game type
  const getOptions = () => {
    let options = [target];
    const letters = ['அ', 'ஆ', 'இ', 'க்', 'ச்', 'ட்', 'க', 'கா', 'கி'];
    const words = ['மரம்', 'பள்ளிக்கூடம்', 'விளையாட்டு', 'அம்மா', 'அப்பா'];
    
    const pool = (activity.type || '').includes('word') ? words : letters;
    
    while (options.length < 4) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (!options.includes(r)) options.push(r);
    }
    
    return options.sort(() => 0.5 - Math.random());
  };

  const [options] = useState(getOptions());
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (gameState === 'won') return;
    
    setSelected(opt);
    
    if (opt === target) {
      setGameState('won');
      setTimeout(() => {
        onComplete(100, activity.xp);
      }, 2000);
    } else {
      // Allow retry
      setTimeout(() => {
        setSelected(null);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-700">{activity.title}</h2>
        <p className="text-slate-500 font-medium">{activity.description}</p>
      </div>

      <div className="glass-panel p-8 w-full flex flex-col items-center gap-8 relative overflow-hidden">
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-green-500/10 z-0" />
        )}
        
        <div className="text-center z-10">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Find this:</div>
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-6xl md:text-8xl font-tamil font-bold text-purple-600 drop-shadow-sm"
          >
            {target}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full z-10">
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const isTarget = opt === target;
            
            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300 shadow-sm";
            if (isSelected) {
              btnClass = isTarget 
                ? "bg-green-100 border-2 border-green-500 text-green-700 shadow-inner" 
                : "bg-red-100 border-2 border-red-400 text-red-700";
            } else if (gameState === 'won' && isTarget) {
               btnClass = "bg-green-100 border-2 border-green-500 text-green-700 shadow-inner";
            } else if (gameState === 'won') {
               btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-300 opacity-50";
            }

            return (
              <button
                key={i}
                disabled={gameState === 'won' || (isSelected && !isTarget)}
                onClick={() => handleSelect(opt)}
                className={`p-6 rounded-2xl text-3xl md:text-5xl font-tamil font-bold transition-all flex items-center justify-center min-h-[120px] ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {gameState === 'won' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
            >
              அருமை! (Awesome!) 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
