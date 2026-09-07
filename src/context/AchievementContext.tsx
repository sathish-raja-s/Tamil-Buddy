import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { triggerGrandCelebration } from '../lib/confetti';

import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';


export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'உயிர் தொடக்கம் (Uyir Starter)', icon: '🌟', description: 'Complete a basic lesson.', isUnlocked: false },
  { id: 'b2', name: 'மெய் மாஸ்டர் (Mei Master)', icon: '🔤', description: 'Complete a letter tracing minigame.', isUnlocked: false },
  { id: 'b3', name: 'கதை நாயகன் (Story Hero)', icon: '📖', description: 'Read a Tamil story.', isUnlocked: false },
  { id: 'b4', name: 'இலக்கியத் தேடல் (Literature Hunt)', icon: '🔍', description: 'Play the Literature Match game.', isUnlocked: false },
  { id: 'b5', name: 'ஓவியர் (Artist)', icon: '🎨', description: 'Use the Writing Pad.', isUnlocked: false },
];

interface AchievementContextType {
  badges: Badge[];
  unlockBadge: (id: string) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within an AchievementProvider');
  return context;
};

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(ALL_BADGES);
  const [unlockedNow, setUnlockedNow] = useState<Badge | null>(null);

  useEffect(() => {
    if (!user) {
      // Local load
      const saved = localStorage.getItem('tamil_achievements');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBadges(badges => badges.map(b => ({
            ...b,
            isUnlocked: parsed[b.id]?.isUnlocked || false,
            unlockedAt: parsed[b.id]?.unlockedAt
          })));
        } catch(e) {}
      }
      return;
    }

    // Firebase load
    const docRef = doc(db, 'users', user.uid, 'data', 'achievements');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.badges) {
          setBadges(badges => badges.map(b => ({
            ...b,
            isUnlocked: data.badges[b.id]?.isUnlocked || false,
            unlockedAt: data.badges[b.id]?.unlockedAt
          })));
        }
      }
    }, (error) => console.error("Achievements sync error", error));

    return () => unsub();
  }, [user]);

  const unlockBadge = async (id: string) => {
    const badge = badges.find(b => b.id === id);
    if (!badge || badge.isUnlocked) return;

    const newBadge = { ...badge, isUnlocked: true, unlockedAt: Date.now() };
    const newBadges = badges.map(b => b.id === id ? newBadge : b);
    setBadges(newBadges);

    const saveState = newBadges.reduce((acc, b) => ({ ...acc, [b.id]: { isUnlocked: b.isUnlocked, unlockedAt: b.unlockedAt } }), {});
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'data', 'achievements'), {
          userId: user.uid,
          badges: saveState,
          updatedAt: new Date()
        }, { merge: true });
      } catch (e) {
        console.error("Failed to save achievement", e);
      }
    } else {
      localStorage.setItem('tamil_achievements', JSON.stringify(saveState));
    }
    
    setUnlockedNow(newBadge);
    audio.playSuccess();
    triggerGrandCelebration();
    setTimeout(() => setUnlockedNow(null), 5000);
  };

  return (
    <AchievementContext.Provider value={{ badges, unlockBadge }}>
      {children}
      <AnimatePresence>
        {unlockedNow && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-400 to-amber-600 p-1 rounded-3xl shadow-2xl"
          >
            <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-[1.3rem] flex items-center gap-4 border border-white/20">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(251,191,36,0.5),transparent)]"
                />
                <span className="relative z-10">{unlockedNow.icon}</span>
              </div>
              <div>
                <p className="text-amber-600 font-bold uppercase tracking-wider text-sm flex items-center gap-1">
                  <span className="animate-pulse">✨</span> Achievement Unlocked!
                </p>
                <h3 className="text-xl font-bold text-slate-800">{unlockedNow.name}</h3>
                <p className="text-slate-600 text-sm font-medium">{unlockedNow.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
};
