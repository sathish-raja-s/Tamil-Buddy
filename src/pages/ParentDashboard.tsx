import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, CheckCircle, Target, Brain, BookOpen, Music } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

import { VoiceSelector } from '../components/common/VoiceSelector';

const WEEKLY_DATA = [
  { name: 'Mon', minutes: 15, score: 80 },
  { name: 'Tue', minutes: 25, score: 95 },
  { name: 'Wed', minutes: 20, score: 85 },
  { name: 'Thu', minutes: 30, score: 100 },
  { name: 'Fri', minutes: 45, score: 90 },
  { name: 'Sat', minutes: 60, score: 100 },
  { name: 'Sun', minutes: 0, score: 0 },
];

export function ParentDashboard() {
  const { progress } = useProgress();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Parent / Teacher Dashboard</h1>
        <p className="text-slate-500 mt-2">Monitor learning progress and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<CheckCircle className="text-green-500" />} title="Levels Completed" value={progress.completedLevels.length.toString()} subtitle="Out of 100 levels" />
        <StatCard icon={<BookOpen className="text-purple-500" />} title="Stories Read" value={progress.completedStories.length.toString()} subtitle="Interactive stories" />
        <StatCard icon={<Music className="text-blue-500" />} title="Rhymes & Heritage" value={progress.completedRhymes.length.toString()} subtitle="Songs & Literature" />
        <StatCard icon={<Target className="text-red-500" />} title="Total XP Earned" value={progress.xp.toString()} subtitle="Learning points" />
        <StatCard icon={<Clock className="text-orange-500" />} title="Day Streak" value={`${progress.streak} Days`} subtitle="Consistent learning" />
        <StatCard icon={<Brain className="text-indigo-500" />} title="Vocabulary Exposed" value={(progress.completedStories.length * 3 + progress.completedRhymes.length * 2).toString()} subtitle="Approx. new words" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-6">Learning Time (Minutes)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="minutes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-6">Quiz Scores (%)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={4} dot={{r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VoiceSelector />
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
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
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: { icon: React.ReactNode, title: string, value: string, subtitle: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-2">
        {icon}
      </div>
      <h4 className="text-slate-500 font-medium text-sm">{title}</h4>
      <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
      <div className="text-xs font-medium text-slate-400">{subtitle}</div>
    </div>
  );
}
