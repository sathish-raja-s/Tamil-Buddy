const fs = require('fs');

// 1. Revert Progress.tsx
let progressCode = fs.readFileSync('src/pages/Progress.tsx', 'utf-8');
const heatMapStart = '      <div className="glass-panel p-8">\n        <div className="flex flex-col md:flex-row gap-8">';
const heatMapEnd = '        </div>\n      </div>\n\n      <div className="glass-panel p-8 mt-6">';

const startIndex = progressCode.indexOf(heatMapStart);
if (startIndex !== -1) {
  const endIndex = progressCode.indexOf('<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Adventure Map (10 Chapters) 🗺️</h2>');
  
  // We need to replace everything from heatMapStart up to the start of the adventure map, with just '<div className="glass-panel p-8">'
  if (endIndex !== -1) {
    const toReplace = progressCode.substring(startIndex, endIndex);
    progressCode = progressCode.replace(toReplace, '      <div className="glass-panel p-8">\n        ');
    fs.writeFileSync('src/pages/Progress.tsx', progressCode);
  }
}

// 2. Revert LetterTracingCanvas.tsx
const originalCanvasCode = `import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { TracingActivity } from '../../types';

interface LetterTracingCanvasProps {
  activity: TracingActivity;
  onComplete: (score: number, xp: number) => void;
  key?: string | number;
}

export function LetterTracingCanvas({ activity, onComplete }: LetterTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setStrokes(s => s + 1);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
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
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

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
    }
  };

  const handleFinish = () => {
    let score = 50;
    if (strokes > 0) score = 95; 
    onComplete(score, activity.xp);
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
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <text 
            x="50%" y="50%" 
            dominantBaseline="middle" textAnchor="middle" 
            fontSize={activity.character.length > 2 ? "120" : "280"}
            className="font-tamil font-bold"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeDasharray="10 10"
          >
            {activity.character}
          </text>
        </svg>
                
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
      </div>
            
      <div className="flex gap-4 w-full">
        <button 
          onClick={clearCanvas}
          className="flex-1 py-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800 rounded-xl font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
        >
          🗑️ Clear
        </button>
        <button 
          onClick={handleFinish}
          disabled={strokes === 0}
          className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md disabled:opacity-50"
        >
          ✅ Finish Tracing
        </button>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/adventure/LetterTracingCanvas.tsx', originalCanvasCode);

