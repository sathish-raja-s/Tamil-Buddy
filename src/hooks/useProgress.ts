import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface UserProgress {
  xp: number;
  streak: number;
  completedLevels: number[];
  completedQuestions: Record<string, number>;
  completedStories: string[];
  completedRhymes: string[];
  favoriteStories: string[];
  favoriteRhymes: string[];
  badges: string[];
}

const defaultProgress: UserProgress = {
  xp: 0,
  streak: 1,
  completedLevels: [],
  completedQuestions: {},
  completedStories: [],
  completedRhymes: [],
  favoriteStories: [],
  favoriteRhymes: [],
  badges: []
};

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);

  // Sync from DB
  useEffect(() => {
    if (!user) {
      // Load local if no user
      try {
        const saved = localStorage.getItem('tamil_buddy_progress');
        if (saved) {
          setProgress({ ...defaultProgress, ...JSON.parse(saved) });
        }
      } catch (e) {}
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'data', 'progress');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgress({
          ...defaultProgress,
          ...data
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Progress sync error', error);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // Sync to DB/Local
  const saveProgress = async (newProgress: UserProgress) => {
    setProgress(newProgress);
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid, 'data', 'progress');
        await setDoc(docRef, { ...newProgress, userId: user.uid, updatedAt: new Date() }, { merge: true });
      } catch (e) {
        console.error("Failed to save progress to DB", e);
      }
    } else {
      localStorage.setItem('tamil_buddy_progress', JSON.stringify(newProgress));
    }
  };

  const addXP = (amount: number) => {
    saveProgress({ ...progress, xp: progress.xp + amount });
  };
    
  const completeQuestion = (qId: string, stars: number, xpReward: number) => {
    const currentStars = progress.completedQuestions?.[qId] || 0;
    if (stars > currentStars) {
      const newQ = { ...(progress.completedQuestions || {}), [qId]: stars };
      saveProgress({ ...progress, completedQuestions: newQ, xp: progress.xp + xpReward });
    }
  };

  const completeLevel = (level: number) => {
    if (progress.completedLevels?.includes(level)) return;
    saveProgress({ ...progress, completedLevels: [...(progress.completedLevels || []), level], xp: progress.xp + 50 });
  };

  const completeStory = (storyId: string, xpReward: number) => {
    if (progress.completedStories?.includes(storyId)) return;
    saveProgress({ ...progress, completedStories: [...(progress.completedStories || []), storyId], xp: progress.xp + xpReward });
  };

  const completeRhyme = (rhymeId: string, xpReward: number) => {
    if (progress.completedRhymes?.includes(rhymeId)) return;
    saveProgress({ ...progress, completedRhymes: [...(progress.completedRhymes || []), rhymeId], xp: progress.xp + xpReward });
  };

  const toggleFavoriteStory = (storyId: string) => {
    const isFav = progress.favoriteStories?.includes(storyId);
    saveProgress({
      ...progress,
      favoriteStories: isFav 
        ? (progress.favoriteStories || []).filter(id => id !== storyId)
        : [...(progress.favoriteStories || []), storyId]
    });
  };

  const toggleFavoriteRhyme = (rhymeId: string) => {
    const isFav = progress.favoriteRhymes?.includes(rhymeId);
    saveProgress({
      ...progress,
      favoriteRhymes: isFav 
        ? (progress.favoriteRhymes || []).filter(id => id !== rhymeId)
        : [...(progress.favoriteRhymes || []), rhymeId]
    });
  };

  const resetProgress = async () => {
    if (confirm('Are you sure you want to reset your Tamil learning progress?')) {
      await saveProgress(defaultProgress);
    }
  };

  return { 
    progress, 
    loading,
    addXP, 
    completeQuestion, 
    completeLevel, 
    completeStory,
    completeRhyme,
    toggleFavoriteStory,
    toggleFavoriteRhyme,
    resetProgress 
  };
}
