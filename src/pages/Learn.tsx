import { useAchievements } from '../context/AchievementContext';
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Mic, Pencil, X, ArrowLeft } from 'lucide-react';
import { UYIR_LETTERS, MEI_LETTERS, AYTHAM_LETTER, UYIRMEI_LETTERS } from '../data/mockData';
import { TamilLetter, TracingActivity } from '../types';
import { triggerGrandCelebration, triggerMiniCelebration } from '../lib/confetti';
import { LetterTracingCanvas } from '../components/adventure/LetterTracingCanvas';
import { AudioService } from '../utils/audioService';
import { TamilVoiceButton } from '../components/common/TamilVoiceButton';

type Tab = 'uyir' | 'mei' | 'uyirmei' | 'aytham';

export function Learn() {
  const { unlockBadge } = useAchievements();

  const [activeTab, setActiveTab] = useState<Tab>('uyir');
  const [selectedLetter, setSelectedLetter] = useState<TamilLetter | null>(null);
  
  // For Uyirmei grid, we might want to filter by base Mei letter to make it manageable
  const [selectedMeiBase, setSelectedMeiBase] = useState<string>('க்');
  
  const [isPracticing, setIsPracticing] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<'idle' | 'listening' | 'success' | 'try_again'>('idle');

  const handlePlaySound = (text: string) => {
    triggerGrandCelebration();

    AudioService.playTamilWord(text);
  };

  const handleSpeak = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition && selectedLetter) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setSpeechFeedback('listening');
      
      try {
        recognition.start();

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript.trim();
          console.log("Heard:", speechResult);
          
          setSpeechFeedback('success');
          triggerGrandCelebration();
          
          setTimeout(() => setSpeechFeedback('idle'), 2500);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setSpeechFeedback('try_again');
          setTimeout(() => setSpeechFeedback('idle'), 2500);
        };
        
        recognition.onspeechend = () => {
          recognition.stop();
        };
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setSpeechFeedback('idle');
      }
    } else {
      alert("Speech recognition is not supported in this browser. Try Chrome!");
    }
  };

  const currentLetters = useMemo(() => {
    switch (activeTab) {
      case 'uyir': return UYIR_LETTERS;
      case 'mei': return MEI_LETTERS;
      case 'aytham': return [AYTHAM_LETTER];
      case 'uyirmei': return UYIRMEI_LETTERS.filter(l => l.components?.mei === selectedMeiBase);
      default: return UYIR_LETTERS;
    }
  }, [activeTab, selectedMeiBase]);

  const tabs: { id: Tab, label: string, tamilLabel: string, color: string }[] = [
    { id: 'uyir', label: 'Vowels (12)', tamilLabel: 'உயிரெழுத்துக்கள்', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'mei', label: 'Consonants (18)', tamilLabel: 'மெய்யெழுத்துக்கள்', color: 'bg-green-50 text-green-600 border-green-200' },
    { id: 'uyirmei', label: 'Combined (216)', tamilLabel: 'உயிர்மெய்யெழுத்துக்கள்', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'aytham', label: 'Special (1)', tamilLabel: 'ஆய்த எழுத்து', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  ];

  return (
    <div className="space-y-8 py-6 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Learn Tamil Letters</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">Choose a category and click on a letter to learn!</p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedLetter(null); }}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === tab.id 
                ? `${tab.color} shadow-md scale-105 ring-2 ring-offset-2 ring-current` 
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800/50'
            }`}
          >
            <span className="font-tamil font-bold">{tab.tamilLabel}</span>
            <span className="text-sm font-medium opacity-80">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Uyirmei Sub-navigation (Mei Selector) */}
      {activeTab === 'uyirmei' && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <p className="text-sm font-bold text-slate-500 text-center uppercase tracking-wider">Select a Base Consonant (Mei)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {MEI_LETTERS.map(mei => (
              <button
                key={mei.id}
                onClick={() => setSelectedMeiBase(mei.letter)}
                className={`w-12 h-12 rounded-xl font-tamil font-bold text-lg transition-all ${
                  selectedMeiBase === mei.letter 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                {mei.letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Letter Grid */}
      <motion.div 
        layout
        className={`grid gap-4 ${activeTab === 'uyirmei' ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'}`}
      >
        <AnimatePresence mode="popLayout">
          {currentLetters.map((item, index) => (
            <motion.button
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: Math.min(index * 0.02, 0.3) }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedLetter(item); setIsPracticing(false); setSpeechFeedback('idle'); }}
              className={`aspect-square bg-white dark:bg-slate-800 rounded-3xl border-b-4 shadow-sm transition-all flex flex-col items-center justify-center gap-2 ${
                activeTab === 'uyir' ? 'border-blue-200 hover:border-blue-400 text-blue-600' :
                activeTab === 'mei' ? 'border-green-200 hover:border-green-400 text-green-600' :
                activeTab === 'aytham' ? 'border-orange-200 hover:border-orange-400 text-orange-600' :
                'border-purple-200 hover:border-purple-400 text-purple-600'
              }`}
            >
              <span className="text-4xl sm:text-5xl font-tamil font-bold">{item.letter}</span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">{item.pronunciation}</span>
              
              {activeTab === 'uyirmei' && (
                <div className="absolute top-2 right-2 text-xs font-bold text-slate-300 opacity-50">
                  {item.components?.mei} + {item.components?.uyir}
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedLetter(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl p-6 md:p-8 border-4 border-slate-100 dark:border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors z-10"
              >
                <X size={24} />
              </button>

              {isPracticing ? (
                <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
                  <button 
                    onClick={() => setIsPracticing(false)}
                    className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-200 font-bold mb-4"
                  >
                    <ArrowLeft size={20} /> Back
                  </button>
                  <LetterTracingCanvas 
                    activity={{
                      id: selectedLetter.id,
                      character: selectedLetter.letter,
                      type: selectedLetter.category as any,
                      difficulty: 1,
                      xp: 10
                    }}
                    onComplete={() => {
                      triggerMiniCelebration();
                      setTimeout(() => setIsPracticing(false), 2000);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-inner ${
                    selectedLetter.category === 'uyir' ? 'bg-blue-100 border-blue-200 text-blue-600' :
                    selectedLetter.category === 'mei' ? 'bg-green-100 border-green-200 text-green-600' :
                    selectedLetter.category === 'aytham' ? 'bg-orange-100 border-orange-200 text-orange-600' :
                    'bg-purple-100 border-purple-200 text-purple-600'
                  }`}>
                    <span className="text-7xl font-tamil font-bold">{selectedLetter.letter}</span>
                  </div>
                  
                  {selectedLetter.category === 'uyirmei' && (
                    <div className="flex items-center gap-3 text-2xl font-tamil font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                      <span className="text-green-600">{selectedLetter.components?.mei}</span>
                      <span className="text-slate-300">+</span>
                      <span className="text-blue-600">{selectedLetter.components?.uyir}</span>
                      <span className="text-slate-300">=</span>
                      <span className="text-purple-600">{selectedLetter.letter}</span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-3xl font-tamil font-bold text-slate-800 dark:text-slate-100">{selectedLetter.word}</h3>
                    <p className="text-lg text-slate-500 font-medium">{selectedLetter.englishMeaning}</p>
                  </div>

                  <div className="text-6xl">
                    {selectedLetter.illustration !== '📝' ? selectedLetter.illustration : '✨'}
                  </div>

                  <div className="flex gap-4 w-full flex-col sm:flex-row">
                    <TamilVoiceButton
                      text={selectedLetter.letter + " ... " + selectedLetter.word}
                      className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-colors border-2 border-blue-200 active:scale-95"
                      label="Listen"
                      size="md"
                    />

                    
                    <button 
                      onClick={handleSpeak}
                      disabled={speechFeedback === 'listening'}
                      className={`flex-1 py-4 rounded-2xl font-bold flex flex-col items-center gap-2 transition-all border-2 active:scale-95 ${
                        speechFeedback === 'listening' ? 'bg-pink-500 text-white border-pink-600 animate-pulse' :
                        speechFeedback === 'success' ? 'bg-green-500 text-white border-green-600' :
                        speechFeedback === 'try_again' ? 'bg-orange-500 text-white border-orange-600' :
                        'bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-200'
                      }`}
                    >
                      <Mic size={24} className={speechFeedback === 'listening' ? 'animate-bounce' : ''} />
                      {speechFeedback === 'listening' ? 'Listening...' : 
                       speechFeedback === 'success' ? 'Great!' : 
                       speechFeedback === 'try_again' ? 'Try Again' : 'Speak'}
                    </button>
                    
                    <button 
                      onClick={() => setIsPracticing(true)}
                      className="flex-1 py-4 bg-yellow-50 text-yellow-600 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-yellow-100 transition-colors border-2 border-yellow-200 active:scale-95"
                    >
                      <Pencil size={24} />
                      Practice
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
