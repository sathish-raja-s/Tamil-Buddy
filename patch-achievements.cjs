const fs = require('fs');
let code = fs.readFileSync('src/context/AchievementContext.tsx', 'utf-8');

const importsToAdd = `
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
`;

code = code.replace(
  "import { triggerGrandCelebration } from '../lib/confetti';",
  "import { triggerGrandCelebration } from '../lib/confetti';\n" + importsToAdd
);

const newProviderLogic = `
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
`;

code = code.replace(
  /export const AchievementProvider: React\.FC<\{ children: React\.ReactNode \}> = \(\{ children \}\) => \{[\s\S]*?const unlockBadge = \(id: string\) => \{[\s\S]*?return newBadges;\n    \}\);\n  \};/,
  newProviderLogic.trim()
);

fs.writeFileSync('src/context/AchievementContext.tsx', code);
