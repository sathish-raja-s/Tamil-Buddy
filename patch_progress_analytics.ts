import fs from 'fs';

let content = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');

const analyticsInterface = `
  analytics: {
    totalLearningTime: number;
    quizAttempts: number;
    quizCorrect: number;
    weakLetters: Record<string, number>; // letter -> mistake count
    vocabularyPracticed: Record<string, number>; // wordId -> success count
    lastActiveDate: string;
    learningDays: Record<string, number>; // date (YYYY-MM-DD) -> minutes spent
  };
`;

content = content.replace('  badges: string[];', '  badges: string[];\n' + analyticsInterface);

const defaultAnalytics = `
  analytics: {
    totalLearningTime: 0,
    quizAttempts: 0,
    quizCorrect: 0,
    weakLetters: {},
    vocabularyPracticed: {},
    lastActiveDate: new Date().toISOString().split('T')[0],
    learningDays: {}
  }
`;

content = content.replace('  badges: []\n};', '  badges: [],\n' + defaultAnalytics + '\n};');

content = content.replace('const saveProgress = async (newProgress: UserProgress) => {', `
  const recordActivityTime = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    const currentDays = progress.analytics?.learningDays || {};
    const newProgress = {
      ...progress,
      analytics: {
        ...progress.analytics,
        totalLearningTime: (progress.analytics?.totalLearningTime || 0) + minutes,
        lastActiveDate: today,
        learningDays: {
          ...currentDays,
          [today]: (currentDays[today] || 0) + minutes
        }
      }
    };
    saveProgress(newProgress);
  };

  const recordQuizResult = (isCorrect: boolean, letterId?: string) => {
    const newProgress = { ...progress };
    if (!newProgress.analytics) newProgress.analytics = defaultProgress.analytics;
    
    newProgress.analytics = {
      ...newProgress.analytics,
      quizAttempts: (newProgress.analytics.quizAttempts || 0) + 1,
      quizCorrect: (newProgress.analytics.quizCorrect || 0) + (isCorrect ? 1 : 0),
      weakLetters: { ...(newProgress.analytics.weakLetters || {}) }
    };
    
    if (!isCorrect && letterId) {
      newProgress.analytics.weakLetters[letterId] = (newProgress.analytics.weakLetters[letterId] || 0) + 1;
    } else if (isCorrect && letterId && newProgress.analytics.weakLetters[letterId] > 0) {
      newProgress.analytics.weakLetters[letterId] -= 1; // Decrease weakness if correct
    }
    
    saveProgress(newProgress);
  };

  const saveProgress = async (newProgress: UserProgress) => {`);

content = content.replace('resetProgress \n   };', 'resetProgress, recordActivityTime, recordQuizResult \n   };');

fs.writeFileSync('src/hooks/useProgress.ts', content);
