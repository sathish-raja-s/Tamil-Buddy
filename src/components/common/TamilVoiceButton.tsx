import React, { useState } from 'react';
import { Volume2, Loader2, RotateCcw } from 'lucide-react';
import { TamilVoiceService, VoiceOptions } from '../../services/tamilVoiceService';

interface TamilVoiceButtonProps {
  text: string;
  options?: VoiceOptions;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TamilVoiceButton({ text, options, className = "", label = "கேட்க", size = 'sm' }: TamilVoiceButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'finished' | 'error'>('idle');

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (state === 'loading' || state === 'playing') return;

    setState('loading');
    
    TamilVoiceService.playTamilText(
      text,
      options,
      () => setState('finished'), // onEnd
      () => setState('error') // onError
    );
    
    setTimeout(() => {
      if (state !== 'error') {
        setState('playing');
      }
    }, 500);
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const padding = size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2' : 'px-6 py-3';
  const textClass = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  const baseClasses = `flex items-center justify-center gap-2 ${padding} rounded-full font-bold transition-all shadow-sm ${textClass}`;
  
  const stateClasses = 
    state === 'error' ? 'bg-red-100 text-red-600 border border-red-200' :
    state === 'playing' ? 'bg-purple-100 text-purple-700 border border-purple-200 animate-pulse' :
    state === 'finished' ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' :
    'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 border border-slate-200';

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      {state === 'loading' && <Loader2 size={iconSize} className="animate-spin" />}
      {state === 'playing' && <Volume2 size={iconSize} />}
      {state === 'finished' && <RotateCcw size={iconSize} />}
      {state === 'idle' && <Volume2 size={iconSize} />}
      {state === 'error' && <RotateCcw size={iconSize} />}
      
      <span>
        {state === 'loading' ? 'கேட்கிறது...' :
         state === 'playing' ? 'கேட்கிறது...' :
         state === 'finished' ? 'மீண்டும் கேட்க' :
         state === 'error' ? 'மீண்டும் முயற்சிக்கவும்' :
         label}
      </span>
    </button>
  );
}
