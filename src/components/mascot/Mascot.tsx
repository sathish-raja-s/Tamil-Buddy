import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface MascotProps {
  state?: 'happy' | 'thinking' | 'speaking' | 'celebrating' | 'idle';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Mascot({ state = 'idle', className, size = 'md' }: MascotProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 scale-75',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const getAnimation = () => {
    switch (state) {
      case 'happy':
      case 'celebrating':
        return {
          y: [0, -20, 0],
          rotateX: [10, -5, 10],
          rotateY: [-20, 20, -20],
          rotateZ: [-5, 5, -5],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'thinking':
        return {
          y: [0, -5, 0],
          rotateX: [-15, -20, -15],
          rotateY: [-25, -35, -25],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'speaking':
        return {
          y: [0, -5, 0],
          rotateY: [-15, 15, -15],
          rotateX: [0, 5, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'idle':
      default:
        return {
          y: [0, -10, 0],
          rotateX: [-5, 5, -5],
          rotateY: [-10, 10, -10],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
    }
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center", sizeClasses[size], className)} 
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={getAnimation()}
        className="w-full h-full relative flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Layer 1: Back shadow/glow */}
        <div 
          className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Layer 2: Main Body/Head */}
        <div 
          className="absolute inset-0 bg-white rounded-3xl border-4 border-purple-200 shadow-xl"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Chest Letter */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-purple-600 font-tamil font-bold text-2xl opacity-60">
            அ
          </div>
        </div>

        {/* Ears (Attached to Body) */}
        <div className="absolute top-1/2 -left-4 w-6 h-12 bg-indigo-400 rounded-l-full -translate-y-1/2 border-2 border-indigo-500 border-r-0 shadow-lg" style={{ transform: 'translateZ(-5px)' }} />
        <div className="absolute top-1/2 -right-4 w-6 h-12 bg-indigo-400 rounded-r-full -translate-y-1/2 border-2 border-indigo-500 border-l-0 shadow-lg" style={{ transform: 'translateZ(-5px)' }} />

        {/* Antenna */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ transform: 'translateZ(10px)' }}>
          <div className={cn("w-4 h-4 rounded-full shadow-lg", state === 'speaking' || state === 'thinking' ? "bg-yellow-400 animate-pulse shadow-yellow-400/50" : "bg-purple-500 shadow-purple-500/50")} />
          <div className="w-1.5 h-6 bg-slate-300" />
        </div>

        {/* Layer 3: Face Plate Screen */}
        <div 
          className="absolute w-[85%] h-[70%] bg-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-4 border-slate-700 shadow-2xl"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Eyes */}
          <div className="flex gap-6 items-center justify-center w-full -mt-4" style={{ transform: 'translateZ(30px)' }}>
            {/* Left Eye */}
            <motion.div 
              className="w-8 h-12 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] relative"
              animate={(state === 'happy' || state === 'celebrating') ? { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 1.5, repeatDelay: 0.5 } } : {}}
            >
              {state === 'thinking' && <div className="absolute top-0 right-0 w-5 h-5 bg-slate-900 rounded-full translate-x-1 -translate-y-1" />}
            </motion.div>
            
            {/* Right Eye */}
            <motion.div 
              className="w-8 h-12 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] relative"
              animate={(state === 'happy' || state === 'celebrating') ? { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 1.5, repeatDelay: 0.5 } } : {}}
            >
              {state === 'thinking' && <div className="absolute top-0 left-0 w-5 h-5 bg-slate-900 rounded-full -translate-x-1 -translate-y-1" />}
            </motion.div>
          </div>

          {/* Mouth */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ transform: 'translateZ(30px)' }}>
            {state === 'speaking' ? (
              <div className="flex gap-1.5 items-center justify-center">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    className="w-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    animate={{ height: [6, 16, 6] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            ) : state === 'happy' || state === 'celebrating' ? (
              <div className="w-8 h-4 border-b-4 border-cyan-400 rounded-b-full shadow-[0_4px_8px_rgba(34,211,238,0.5)]" />
            ) : state === 'thinking' ? (
              <div className="w-5 h-5 border-4 border-cyan-400 rounded-full opacity-60" />
            ) : (
              <div className="w-8 h-1.5 bg-cyan-400/70 rounded-full" />
            )}
          </div>
        </div>

        {/* Floating Confetti if celebrating */}
        {(state === 'celebrating' || state === 'happy') && (
          <>
            <motion.div className="absolute -top-10 -left-10 text-3xl" animate={{ y: [0, -20, 0], rotateZ: [0, 180, 360], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ transform: 'translateZ(40px)' }}>✨</motion.div>
            <motion.div className="absolute top-1/2 -right-12 text-3xl" animate={{ y: [0, -20, 0], rotateZ: [0, -180, -360], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} style={{ transform: 'translateZ(50px)' }}>🎉</motion.div>
            <motion.div className="absolute -bottom-8 left-0 text-3xl" animate={{ y: [0, -20, 0], rotateZ: [0, 90, 180], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} style={{ transform: 'translateZ(60px)' }}>🌟</motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
