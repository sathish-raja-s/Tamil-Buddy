import React, { useState } from 'react';
import { Mascot } from '../components/mascot/Mascot';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { AudioService } from '../utils/audioService';
import { aiService, ChatMessage } from '../services/aiService';
import { useProgress } from '../hooks/useProgress';

const ClickableText = ({ text, isTamil }: { text: string; isTamil: boolean }) => {
  return (
    <p className={cn('font-medium text-lg leading-relaxed', isTamil && 'font-tamil')}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          onClick={() => (isTamil ? AudioService.playTamilWord(word) : AudioService.playEnglishWord(word))}
          className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors rounded px-0.5"
          title="Click to hear"
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
};

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'வணக்கம்! நான் தமிழ் Buddy. இன்று நாம் என்ன கற்கலாம்?', sender: 'buddy' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const { progress } = useProgress();

  const weakLetters = Object.entries(progress.analytics?.weakLetters || {})
    .filter(([_, count]) => (count as number) > 0)
    .map(([l]) => l)
    .join(', ');

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    AudioService.playSoundEffect('pop');

    const userText = input.trim();
    const newUserMsg: ChatMessage = { id: Date.now().toString(), text: userText, sender: 'user' };
    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);
    setSlowNotice(false);

    try {
      const response = await aiService.sendMessage(
        userText,
        messages,
        weakLetters,
        () => setSlowNotice(true)
      );

      setSlowNotice(false);
      setIsTyping(false);
      AudioService.playSoundEffect('success');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'buddy',
        },
      ]);

      // Auto-play buddy response using AudioService
      AudioService.playTamilWord(response.text);
    } catch {
      setSlowNotice(false);
      setIsTyping(false);
      const fallbackText = aiService.getLocalFallback(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: fallbackText,
          sender: 'buddy',
        },
      ]);
      AudioService.playTamilWord(fallbackText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto glass-panel p-4 overflow-hidden relative">
      <div className="flex items-center gap-4 border-b border-purple-100 pb-4 mb-4">
        <Mascot size="sm" state={isTyping ? 'thinking' : 'happy'} />
        <div>
          <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Ask Tamil Buddy 🤖</h2>
          <p className="text-sm text-slate-500">Your AI learning companion (Click any word to hear it!)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                'max-w-[80%] rounded-2xl p-4 shadow-sm relative group',
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white self-end rounded-tr-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 self-start rounded-tl-sm'
              )}
            >
              {msg.sender === 'buddy' && (
                <button
                  onClick={() => AudioService.playTamilWord(msg.text)}
                  className="absolute -right-10 top-2 p-2 text-slate-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Play full message"
                >
                  <Volume2 size={20} />
                </button>
              )}
              <ClickableText text={msg.text} isTamil={msg.sender === 'buddy'} />
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 self-start rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[80%]"
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" />
                </div>
                {slowNotice && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                    Buddy is taking a little longer than usual…
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-100 flex gap-2">
        <button
          onClick={() => AudioService.playSoundEffect('click')}
          className="p-4 bg-slate-100 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-200 transition-colors"
          title="Speech input"
        >
          <Mic size={24} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something in Tamil or English..."
          className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-400 transition-colors text-lg"
        />
        <button
          onClick={handleSend}
          disabled={isTyping}
          className="p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
