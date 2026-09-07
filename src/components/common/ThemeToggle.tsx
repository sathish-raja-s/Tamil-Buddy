import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  variant?: 'icon' | 'labeled';
  className?: string;
  onClick?: () => void;
}

export function ThemeToggle({ variant = 'icon', className, onClick }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    if (onClick) onClick();
  };

  if (variant === 'labeled') {
    return (
      <button 
        onClick={handleClick} 
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-bold transition-colors",
          "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
          className
        )}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick} 
      className={cn(
        "p-2 rounded-full transition-colors",
        "text-slate-500 hover:text-purple-600 hover:bg-white/60 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-slate-700",
        className
      )}
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
