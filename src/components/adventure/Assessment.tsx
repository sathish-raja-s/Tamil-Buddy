import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { Target, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioService } from '../../utils/audioService';

interface AssessmentProps {
  type: 'pre-test' | 'post-test';
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function Assessment({ type, title, questions, onComplete }: AssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = questions[currentIndex];

  const handleSelect = (id: string, isCorrect: boolean) => {
    if (selectedOption) return; // Prevent multiple clicks
    
    setSelectedOption(id);
    
    if (isCorrect) {
      setScore(s => s + 1);
      AudioService.playSoundEffect('success');
    } else {
      AudioService.playSoundEffect('error');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border-2 border-indigo-100 max-w-xl mx-auto text-center space-y-6 animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {type === 'pre-test' ? 'Baseline Assessment Complete' : 'Final Assessment Complete'}
        </h2>
        <p className="text-lg text-slate-500">
          You scored <span className="font-bold text-indigo-600">{score} / {questions.length}</span> ({percentage}%)
        </p>
        <button
          onClick={() => onComplete(percentage)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4"
        >
          {type === 'pre-test' ? 'Start Learning' : 'Finish Module'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg max-w-2xl mx-auto border border-slate-100">
      <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-400">
        <span className="uppercase tracking-wider">{type === 'pre-test' ? 'Pre-Test' : 'Post-Test'}: {title}</span>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map(opt => {
          const isSelected = selectedOption === opt.id;
          let btnClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 bg-white";
          
          if (selectedOption) {
            if (opt.isCorrect) btnClass = "border-green-500 bg-green-50 text-green-700";
            else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-700";
            else btnClass = "border-slate-200 opacity-50 bg-slate-50";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.isCorrect)}
              disabled={!!selectedOption}
              className={`p-4 text-left rounded-xl border-2 transition-all font-medium text-lg flex items-center justify-between ${btnClass}`}
            >
              <span>{opt.text}</span>
              {selectedOption && opt.isCorrect && <CheckCircle className="text-green-500" />}
              {isSelected && !opt.isCorrect && <XCircle className="text-red-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
