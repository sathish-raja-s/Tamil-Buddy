const fs = require('fs');

const code = `
import React, { useRef, useState, useEffect } from 'react';
import { Trash2, PenTool, Eraser, Palette, Undo, Redo } from 'lucide-react';

const COLORS = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
const BRUSH_SIZES = [4, 8, 12, 16, 24];

export function WritingPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  
  // Undo/Redo State
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas and save first blank state
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = canvas?.parentElement;
      if (canvas && parent) {
        const ctx = canvas.getContext('2d');
        let imgData;
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          try {
            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          } catch (e) {}
        }
        
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        if (ctx) {
          if (imgData) {
            ctx.putImageData(imgData, 0, 0);
          } else {
             // Fill with white or keep transparent. Let's keep transparent as default.
          }
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    };

    setTimeout(() => {
      resizeCanvas();
      saveState(); // Save initial blank state
    }, 100);
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setHistory(prev => {
      // If we are not at the end of history and we draw a new stroke, discard the "future" history
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(data);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(history[prevStep], 0, 0);
          setHistoryStep(prevStep);
        }
      }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(history[nextStep], 0, 0);
          setHistoryStep(nextStep);
        }
      }
    }
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
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
    setIsDrawing(true);
    const coords = getCoordinates(e);
    if (coords && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = isEraser ? '#ffffff' : color;
        ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (coords && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = isEraser ? '#ffffff' : color;
        ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
      // Save state after completing a stroke
      saveState();
    }
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }
  };

  return (
    <div className="w-full max-w-[1600px] px-2 md:px-6 mx-auto h-[calc(100vh-120px)] min-h-[600px] flex flex-col gap-4 pb-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Writing Pad ✍️</h1>
        <p className="text-slate-500">A rough pad to practice Tamil letters or just draw!</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex-wrap">
        
        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEraser(false)}
            className={\`p-3 rounded-xl flex items-center gap-2 font-bold transition-all \${!isEraser ? 'bg-purple-100 text-purple-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}\`}
          >
            <PenTool size={20} /> Draw
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={\`p-3 rounded-xl flex items-center gap-2 font-bold transition-all \${isEraser ? 'bg-pink-100 text-pink-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}\`}
          >
            <Eraser size={20} /> Eraser
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <Palette size={20} className="text-slate-400 ml-2" />
          <div className="w-px h-6 bg-slate-200 mx-2" />
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={\`w-8 h-8 rounded-full transition-transform \${color === c && !isEraser ? 'scale-125 shadow-md ring-2 ring-purple-300 ring-offset-2' : 'hover:scale-110'}\`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-400">Size:</span>
          <div className="flex items-center gap-1">
            {BRUSH_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={\`w-10 h-10 rounded-xl flex items-center justify-center transition-all \${brushSize === size ? 'bg-purple-100 border-purple-300' : 'bg-slate-50 border-transparent hover:bg-slate-100'} border\`}
              >
                <div 
                  className={\`rounded-full \${isEraser && brushSize === size ? 'bg-pink-400' : brushSize === size ? 'bg-purple-600' : 'bg-slate-400'}\`} 
                  style={{ width: size, height: size }} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-1" />

          <button
            onClick={clearPad}
            className="p-3 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-100 transition-colors"
          >
            <Trash2 size={20} /> Clear
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 w-full relative bg-white rounded-3xl shadow-inner border-4 border-slate-200 overflow-hidden touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/WritingPad.tsx', code);
