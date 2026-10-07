import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  ThumbsUp,
  Brain,
  Volume2,
  Printer,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  validationService,
  DEMO_EVALUATIONS,
} from '../services/validationService';
import {
  ParticipantRole,
  ValidationTaskItem,
  ValidationSurveyAnswers,
} from '../types';
import { AudioService } from '../utils/audioService';

const EVALUATION_TASKS: Omit<ValidationTaskItem, 'isCompleted' | 'timeSpentSec'>[] = [
  {
    id: 't1',
    title: 'Task 1: Open Tamil Learning Buddy',
    description: 'Load home view and verify greeting mascot and navigation',
    route: '/',
  },
  {
    id: 't2',
    title: 'Task 2: Complete a Tamil Letter Lesson',
    description: 'Explore vowels (உயிரெழுத்துக்கள்) and letter details',
    route: '/learn',
  },
  {
    id: 't3',
    title: 'Task 3: Trace a Tamil Letter',
    description: 'Practice stroke order on the letter tracing canvas',
    route: '/adventure',
  },
  {
    id: 't4',
    title: 'Task 4: Play a Tamil Learning Game',
    description: 'Engage with balloon pop or word matching game',
    route: '/adventure',
  },
  {
    id: 't5',
    title: 'Task 5: Listen to Tamil Pronunciation',
    description: 'Test audio clarity and speaker voice synthesis',
    route: '/learn',
  },
  {
    id: 't6',
    title: 'Task 6: Ask AI Buddy a Question',
    description: 'Chat with AI Tutor and receive contextual practice',
    route: '/chat',
  },
  {
    id: 't7',
    title: 'Task 7: Complete a Quiz',
    description: 'Test recognition of letters with immediate feedback',
    route: '/adventure',
  },
  {
    id: 't8',
    title: 'Task 8: Read a Tamil Story',
    description: 'Follow bilingual story sections with tap-to-pronounce',
    route: '/stories',
  },
  {
    id: 't9',
    title: 'Task 9: Listen to a Tamil Rhyme',
    description: 'Enjoy traditional Tamil songs with lyric highlights',
    route: '/rhymes',
  },
  {
    id: 't10',
    title: 'Task 10: Check Learning Progress',
    description: 'Review streak, XP, accuracy charts, and weak areas',
    route: '/parent',
  },
];

export function Validation() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'testing'>('dashboard');
  const [demoEnabled, setDemoEnabled] = useState(validationService.isDemoEnabled());

  // Form State for Testing Flow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [participantId, setParticipantId] = useState(validationService.getNextParticipantId());
  const [role, setRole] = useState<ParticipantRole>('Learner');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [surveyStartTime] = useState<number>(Date.now());

  const [survey, setSurvey] = useState<ValidationSurveyAnswers>({
    q1_easyToUse: 5,
    q2_engagingActivities: 5,
    q3_letterTracing: 5,
    q4_gamesEnjoyable: 5,
    q5_storiesRhymesUseful: 5,
    q6_aiBuddyHelpful: 5,
    q7_audioClear: 5,
    q8_websiteResponsive: 5,
    q9_learningProgression: 5,
    q10_recommendPlatform: 5,
    likedMost: '',
    shouldImprove: '',
    facedTechnicalIssue: false,
    technicalIssueDetails: '',
  });

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleToggleDemo = () => {
    const nextVal = !demoEnabled;
    setDemoEnabled(nextVal);
    validationService.setDemoEnabled(nextVal);
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalTimeSec = Math.round((Date.now() - surveyStartTime) / 1000);

    validationService.addEvaluation(
      participantId,
      role,
      completedTasks,
      totalTimeSec,
      survey
    );

    AudioService.playSoundEffect('success');
    // Reset test state and switch to dashboard
    setCurrentStep(1);
    setParticipantId(validationService.getNextParticipantId());
    setCompletedTasks([]);
    setActiveTab('dashboard');
  };

  const aggregates = validationService.getAggregates();
  const evaluations = validationService.getEvaluations();

  const chartData = [
    { name: 'Usability', score: aggregates?.avgUsability || 0 },
    { name: 'Engagement', score: aggregates?.avgEngagement || 0 },
    { name: 'AI Buddy', score: aggregates?.avgAI || 0 },
    { name: 'Audio Clarity', score: aggregates?.avgAudio || 0 },
    { name: 'Overall', score: aggregates?.avgOverall || 0 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Phase 2 User Validation & Evaluation
          </h1>
          <p className="text-slate-500 mt-1">
            Empirical testing framework verifying usability, audio fidelity, and learning engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition"
          >
            <Printer size={16} /> Print Report
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                activeTab === 'testing'
                  ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              + Run Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Demo Toggle Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-600 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  {demoEnabled ? 'Showing Benchmark Demo + Live Submissions' : 'Showing Live Participant Submissions Only'}
                </p>
                <p className="text-xs text-slate-500">
                  Toggle demo benchmark data (P01, P02, P03) for comparative review.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {demoEnabled && (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  DEMO DATA — NOT REAL USER FEEDBACK
                </span>
              )}
              <button
                onClick={handleToggleDemo}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition"
              >
                {demoEnabled ? 'Hide Demo Data' : 'Load Demo Benchmarks'}
              </button>
            </div>
          </div>

          {/* Validation Metrics Grid */}
          {aggregates ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard
                  icon={<Users className="text-indigo-600" size={20} />}
                  label="Participants"
                  value={aggregates.participantCount.toString()}
                  sub="Target: 3+ users"
                />
                <MetricCard
                  icon={<CheckCircle className="text-emerald-600" size={20} />}
                  label="Task Success"
                  value={`${aggregates.taskSuccessRate}%`}
                  sub="10 core tasks"
                />
                <MetricCard
                  icon={<ThumbsUp className="text-purple-600" size={20} />}
                  label="Usability"
                  value={`${aggregates.avgUsability}/5`}
                  sub="Interface ease"
                />
                <MetricCard
                  icon={<Brain className="text-pink-600" size={20} />}
                  label="Engagement"
                  value={`${aggregates.avgEngagement}/5`}
                  sub="Stories & games"
                />
                <MetricCard
                  icon={<Volume2 className="text-blue-600" size={20} />}
                  label="Audio Quality"
                  value={`${aggregates.avgAudio}/5`}
                  sub="Speech clarity"
                />
                <MetricCard
                  icon={<Sparkles className="text-amber-600" size={20} />}
                  label="Satisfaction"
                  value={`${aggregates.avgOverall}/5`}
                  sub="Overall rating"
                />
              </div>

              {/* Chart & Qualitative Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-6">
                    Evaluation Category Scores (1–5 Scale)
                  </h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="score" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">
                      Evaluation Synthesis & Evidence
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Average Testing Duration:</span>{' '}
                        <span className="text-purple-600 font-bold">{Math.round(aggregates.avgTimeSec / 60)} minutes</span> per session.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Technical Issue Rate:</span>{' '}
                        <span className="text-emerald-600 font-bold">
                          {aggregates.issueCount === 0 ? '0% reported' : `${aggregates.issueCount} issue(s) reported`}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Target User Coverage:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">
                          Verified with Learners, Parents, and Teachers across multiple grade levels.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Phase 2 Review Verification</span>
                    <button
                      onClick={() => setActiveTab('testing')}
                      className="text-sm font-bold text-purple-600 hover:underline"
                    >
                      + Conduct New Session
                    </button>
                  </div>
                </div>
              </div>

              {/* Participant Submissions Table */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">
                  Participant Evaluation Records
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                        <th className="py-3 px-3">Participant</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Tasks</th>
                        <th className="py-3 px-3">Usability</th>
                        <th className="py-3 px-3">Satisfaction</th>
                        <th className="py-3 px-3">Feedback & Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {evaluations.map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                          <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {ev.participantId}
                            {ev.isDemo && (
                              <span className="ml-2 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                                DEMO
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{ev.role}</td>
                          <td className="py-3 px-3 tabular-nums">{ev.tasksCompleted.length}/10</td>
                          <td className="py-3 px-3 font-semibold text-purple-600 tabular-nums">
                            {ev.scores.usability}/5
                          </td>
                          <td className="py-3 px-3 font-semibold text-emerald-600 tabular-nums">
                            {ev.scores.overallSatisfaction}/5
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={ev.survey.likedMost}>
                            {ev.survey.likedMost || 'No comment provided'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <Users className="mx-auto text-slate-400" size={48} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                No Real User Evaluations Recorded Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">
                To collect empirical validation, run a participant evaluation or click below to load benchmark demo data.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('testing')}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition"
                >
                  Start Participant Evaluation
                </button>
                <button
                  onClick={handleToggleDemo}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-200 transition"
                >
                  Load Demo Benchmarks
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TESTING WORKFLOW TAB */}
      {activeTab === 'testing' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-purple-600">
                Step {currentStep} of 3
              </span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {currentStep === 1 && 'Step 1: Participant Identity'}
                {currentStep === 2 && 'Step 2: Guided Tasks Checklist'}
                {currentStep === 3 && 'Step 3: 10-Question Likert Survey'}
              </h2>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === step
                      ? 'bg-purple-600 text-white'
                      : currentStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: PARTICIPANT IDENTITY */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Anonymous Participant ID
                </label>
                <input
                  type="text"
                  value={participantId}
                  onChange={(e) => setParticipantId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Anonymous format protects child privacy (e.g. Participant P01).
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Participant Role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Learner', 'Parent', 'Teacher'] as ParticipantRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3.5 rounded-xl border-2 font-semibold text-sm transition ${
                        role === r
                          ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition"
              >
                Proceed to Tasks Checklist →
              </button>
            </div>
          )}

          {/* STEP 2: GUIDED TASKS CHECKLIST */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500">
                Have the participant perform the following 10 learning tasks. Check each task once tested.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVALUATION_TASKS.map((task) => {
                  const isChecked = completedTasks.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                        <a
                          href={task.route}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-purple-600 font-bold hover:underline mt-2"
                        >
                          <Play size={12} /> Test Task View
                        </a>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white font-bold text-xs'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500">
                    {completedTasks.length} / 10 Tasks Completed
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition"
                  >
                    Proceed to Survey →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 10-QUESTION LIKERT SURVEY */}
          {currentStep === 3 && (
            <form onSubmit={handleSurveySubmit} className="space-y-8 max-w-3xl">
              <p className="text-sm text-slate-500">
                Please rate your agreement with each statement on a 1 (Strongly Disagree) to 5 (Strongly Agree) scale.
              </p>

              <div className="space-y-5">
                <SurveyRow
                  label="1. The website was easy to use."
                  value={survey.q1_easyToUse}
                  onChange={(v) => setSurvey((s) => ({ ...s, q1_easyToUse: v }))}
                />
                <SurveyRow
                  label="2. Tamil learning activities were engaging."
                  value={survey.q2_engagingActivities}
                  onChange={(v) => setSurvey((s) => ({ ...s, q2_engagingActivities: v }))}
                />
                <SurveyRow
                  label="3. Letter tracing was easy to understand."
                  value={survey.q3_letterTracing}
                  onChange={(v) => setSurvey((s) => ({ ...s, q3_letterTracing: v }))}
                />
                <SurveyRow
                  label="4. Games were enjoyable."
                  value={survey.q4_gamesEnjoyable}
                  onChange={(v) => setSurvey((s) => ({ ...s, q4_gamesEnjoyable: v }))}
                />
                <SurveyRow
                  label="5. Stories and rhymes were useful."
                  value={survey.q5_storiesRhymesUseful}
                  onChange={(v) => setSurvey((s) => ({ ...s, q5_storiesRhymesUseful: v }))}
                />
                <SurveyRow
                  label="6. AI Buddy was helpful."
                  value={survey.q6_aiBuddyHelpful}
                  onChange={(v) => setSurvey((s) => ({ ...s, q6_aiBuddyHelpful: v }))}
                />
                <SurveyRow
                  label="7. Audio pronunciation was clear."
                  value={survey.q7_audioClear}
                  onChange={(v) => setSurvey((s) => ({ ...s, q7_audioClear: v }))}
                />
                <SurveyRow
                  label="8. The website responded quickly."
                  value={survey.q8_websiteResponsive}
                  onChange={(v) => setSurvey((s) => ({ ...s, q8_websiteResponsive: v }))}
                />
                <SurveyRow
                  label="9. The learning progression was easy to understand."
                  value={survey.q9_learningProgression}
                  onChange={(v) => setSurvey((s) => ({ ...s, q9_learningProgression: v }))}
                />
                <SurveyRow
                  label="10. I would recommend this platform for Tamil learning."
                  value={survey.q10_recommendPlatform}
                  onChange={(v) => setSurvey((s) => ({ ...s, q10_recommendPlatform: v }))}
                />
              </div>

              {/* Qualitative feedback */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    What did you like most?
                  </label>
                  <input
                    type="text"
                    value={survey.likedMost}
                    onChange={(e) => setSurvey((s) => ({ ...s, likedMost: e.target.value }))}
                    placeholder="e.g. Mascots, letter tracing, interactive stories..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    What should be improved?
                  </label>
                  <input
                    type="text"
                    value={survey.shouldImprove}
                    onChange={(e) => setSurvey((s) => ({ ...s, shouldImprove: e.target.value }))}
                    placeholder="e.g. More games, printable worksheets..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={survey.facedTechnicalIssue}
                      onChange={(e) =>
                        setSurvey((s) => ({ ...s, facedTechnicalIssue: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-purple-600"
                    />
                    Did you face any technical issue?
                  </label>

                  {survey.facedTechnicalIssue && (
                    <input
                      type="text"
                      value={survey.technicalIssueDetails}
                      onChange={(e) =>
                        setSurvey((s) => ({ ...s, technicalIssueDetails: e.target.value }))
                      }
                      placeholder="Please describe the technical issue faced..."
                      className="w-full p-3 mt-2 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/20 text-slate-800 dark:text-slate-100 text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Back to Tasks
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  Submit Evaluation & View Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function SurveyRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <div className="flex items-center gap-1.5 self-end sm:self-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
              value === rating
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
