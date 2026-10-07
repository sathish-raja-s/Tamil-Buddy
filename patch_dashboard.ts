import fs from 'fs';

let content = fs.readFileSync('src/pages/ParentDashboard.tsx', 'utf8');

// Replace the hardcoded WEEKLY_DATA with a dynamic one inside the component
content = content.replace(
`const WEEKLY_DATA = [
  { name: 'Mon', minutes: 15, score: 80 },
  { name: 'Tue', minutes: 25, score: 95 },
  { name: 'Wed', minutes: 20, score: 85 },
  { name: 'Thu', minutes: 30, score: 100 },
  { name: 'Fri', minutes: 45, score: 90 },
  { name: 'Sat', minutes: 60, score: 100 },
  { name: 'Sun', minutes: 0, score: 0 },
];

export function ParentDashboard() {
  const { progress } = useProgress();`,
`export function ParentDashboard() {
  const { progress } = useProgress();

  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const today = new Date();
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      data.push({
        name: dayName,
        minutes: progress.analytics?.learningDays?.[dateStr] || 0,
        score: progress.analytics?.quizAttempts ? Math.round((progress.analytics.quizCorrect / progress.analytics.quizAttempts) * 100) : 0
      });
    }
    return data;
  };

  const WEEKLY_DATA = getWeeklyData();
  
  const getWeakLetters = () => {
    if (!progress.analytics?.weakLetters) return [];
    return Object.entries(progress.analytics.weakLetters)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  };
  
  const weakLetters = getWeakLetters();
  
  const quizAccuracy = progress.analytics?.quizAttempts ? Math.round((progress.analytics.quizCorrect / progress.analytics.quizAttempts) * 100) : 0;
`
);

// We need to update the strength and weakness area lists too.
content = content.replace(
`<div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Strength Areas 💪</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-xl">
              <span className="font-medium">Vocabulary Matching</span>
              <span className="font-bold">98% Accuracy</span>
            </li>
            <li className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-xl">
              <span className="font-medium">Letter Recognition (அ - ஔ)</span>
              <span className="font-bold">95% Accuracy</span>
            </li>
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Suggested Improvements 🎯</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-xl">
              <span className="font-medium">Pronunciation: 'ழ' sound</span>
              <button className="text-sm font-bold underline">Assign Practice</button>
            </li>
            <li className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-xl">
              <span className="font-medium">Sentence Formation</span>
              <button className="text-sm font-bold underline">Assign Practice</button>
            </li>
          </ul>
        </div>`,
`<div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Strength Areas 💪</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-xl">
              <span className="font-medium">Overall Quiz Accuracy</span>
              <span className="font-bold">{quizAccuracy}%</span>
            </li>
            <li className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-xl">
              <span className="font-medium">Learning Consistency</span>
              <span className="font-bold">{progress.streak} Day Streak</span>
            </li>
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Suggested Improvements 🎯</h3>
          <ul className="space-y-3">
            {weakLetters.length > 0 ? weakLetters.map(letter => (
              <li key={letter} className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-xl">
                <span className="font-medium">Struggling with '{letter}'</span>
                <span className="text-sm font-bold text-orange-600">Needs Practice</span>
              </li>
            )) : (
              <li className="flex items-center justify-between p-3 bg-slate-50 text-slate-700 rounded-xl">
                <span className="font-medium">No major weak areas detected yet!</span>
              </li>
            )}
          </ul>
        </div>`
);

fs.writeFileSync('src/pages/ParentDashboard.tsx', content);
