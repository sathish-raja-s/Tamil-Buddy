import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { TracingActivity } from '../../types';
import { audio } from '../../lib/audio';

interface LetterTracingCanvasProps {
  activity: TracingActivity;
  onComplete: (score: number, xp: number) => void;
  key?: string | number;
}

export function LetterTracingCanvas({ activity, onComplete }: LetterTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [distance, setDistance] = useState(0);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isWatching, setIsWatching] = useState(false);

  
  const handleWatch = () => {
    if (isWatching) return;
    setIsWatching(true);
    clearCanvas();
    audio.playSparkle();
    setTimeout(() => {
      setIsWatching(false);
    }, 3500);
  };

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (showScore || isWatching) return;
    setIsDrawing(true);
    setStrokes(s => s + 1);
    const { x, y } = getPoint(e);
    setLastPoint({ x, y });
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || showScore || isWatching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getPoint(e);

    if (lastPoint) {
      const dist = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
      setDistance(d => d + dist);
    }
    setLastPoint({ x, y });

    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#8B5CF6';
            
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      setStrokes(0);
      setDistance(0);
      setLastPoint(null);
      setShowScore(false);
    }
  };

  const handleFinish = () => {
    let score = 50;
    
    // Very simple heuristic based on distance drawn
    if (distance > 500) {
      score = 90 + Math.floor(Math.random() * 10); // 90-99
    } else if (distance > 200) {
      score = 75 + Math.floor(Math.random() * 15); // 75-89
    } else if (distance > 50) {
      score = 60 + Math.floor(Math.random() * 15); // 60-74
    }

    // Penalize excessive scribbling
    if (strokes > 10) {
      score = Math.max(50, score - (strokes * 2));
    }

    // Give perfect 100 for very thorough tracing
    if (distance > 800 && strokes <= 5) {
      score = 100;
    }

    if (score >= 80) audio.playSuccess();
    else audio.playSparkle();

    setFinalScore(score);
    setShowScore(true);
  };


  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">Trace carefully! ✏️</h2>
        <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {activity.type} • Level {activity.difficulty}
        </div>
      </div>
            
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-white dark:bg-slate-900 rounded-3xl border-4 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden touch-none shadow-inner flex items-center justify-center">
                
        {/* Simple Text Guide */}
        {/* Trace Image */}
        {!imageError ? (
          <img 
            src={`/assets/letters/${encodeURIComponent(activity.character)}.png`}
            alt={`Trace ${activity.character}`}
            className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 pointer-events-none select-none dark:invert"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <text 
              x="50%" y="50%" 
              dominantBaseline="middle" textAnchor="middle" 
              fontSize={activity.character.length > 2 ? "120" : "280"}
              className="font-tamil font-bold"
              fill="transparent"
              stroke="#cbd5e1"
              strokeWidth="6"
              strokeDasharray="15 15"
              strokeLinecap="round"
            >
              {activity.character}
            </text>
          </svg>
        )}
                
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      
        
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

        {/* Score Overlay */}
        <AnimatePresence>
        {showScore && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 mb-4 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md">
                <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <motion.path 
                  className={finalScore >= 80 ? 'text-green-500' : finalScore >= 60 ? 'text-yellow-500' : 'text-orange-500'} 
                  strokeDasharray={`${finalScore}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${finalScore}, 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <text x="18" y="21" fill="currentColor" fontSize="8" textAnchor="middle" fontWeight="bold" className="text-slate-700 dark:text-slate-100">{finalScore}%</text>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {finalScore >= 90 ? 'அருமை! (Awesome!) 🎉' : finalScore >= 75 ? 'மிக நன்று! (Great!) 🌟' : 'நன்றாக எழுதுகிறாய்! (Good!) 👍'}
            </h3>
            
            <button 
              onClick={() => onComplete(finalScore, activity.xp)}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors w-full"
            >
              Continue 🚀
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

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
    </div>
  );
}
