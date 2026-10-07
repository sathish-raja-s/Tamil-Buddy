import { ParticipantEvaluation, ParticipantRole, ValidationSurveyAnswers } from '../types';

const STORAGE_KEY = 'tamil_buddy_evaluations_v2';
const DEMO_TOGGLE_KEY = 'tamil_buddy_evaluations_demo_enabled';

// 3 Realistic benchmark evaluations for demonstration / comparative review
export const DEMO_EVALUATIONS: ParticipantEvaluation[] = [
  {
    id: 'demo-p01',
    participantId: 'Participant P01',
    role: 'Learner',
    createdAt: '2026-09-18T14:30:00.000Z',
    tasksCompleted: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
    totalTimeSec: 420,
    survey: {
      q1_easyToUse: 5,
      q2_engagingActivities: 5,
      q3_letterTracing: 4,
      q4_gamesEnjoyable: 5,
      q5_storiesRhymesUseful: 5,
      q6_aiBuddyHelpful: 4,
      q7_audioClear: 4,
      q8_websiteResponsive: 5,
      q9_learningProgression: 5,
      q10_recommendPlatform: 5,
      likedMost: 'Loved tracing the letters and the cheerful elephant mascot celebrations!',
      shouldImprove: 'More animal pictures for compound letters (உயிர்மெய்).',
      facedTechnicalIssue: false,
      technicalIssueDetails: '',
    },
    scores: {
      usability: 5.0,
      engagement: 5.0,
      aiHelpfulness: 4.0,
      audioQuality: 4.0,
      overallSatisfaction: 4.7,
    },
    isDemo: true,
  },
  {
    id: 'demo-p02',
    participantId: 'Participant P02',
    role: 'Parent',
    createdAt: '2026-09-22T10:15:00.000Z',
    tasksCompleted: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
    totalTimeSec: 510,
    survey: {
      q1_easyToUse: 5,
      q2_engagingActivities: 4,
      q3_letterTracing: 5,
      q4_gamesEnjoyable: 4,
      q5_storiesRhymesUseful: 5,
      q6_aiBuddyHelpful: 5,
      q7_audioClear: 5,
      q8_websiteResponsive: 4,
      q9_learningProgression: 5,
      q10_recommendPlatform: 5,
      likedMost: 'The bilingual story mode with click-to-hear pronunciation helped my 6yo understand instantly.',
      shouldImprove: 'Add option to print letter practice worksheets directly.',
      facedTechnicalIssue: false,
      technicalIssueDetails: '',
    },
    scores: {
      usability: 4.7,
      engagement: 4.3,
      aiHelpfulness: 5.0,
      audioQuality: 5.0,
      overallSatisfaction: 4.7,
    },
    isDemo: true,
  },
  {
    id: 'demo-p03',
    participantId: 'Participant P03',
    role: 'Teacher',
    createdAt: '2026-09-28T16:45:00.000Z',
    tasksCompleted: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
    totalTimeSec: 640,
    survey: {
      q1_easyToUse: 4,
      q2_engagingActivities: 5,
      q3_letterTracing: 5,
      q4_gamesEnjoyable: 5,
      q5_storiesRhymesUseful: 5,
      q6_aiBuddyHelpful: 4,
      q7_audioClear: 4,
      q8_websiteResponsive: 5,
      q9_learningProgression: 5,
      q10_recommendPlatform: 5,
      likedMost: 'Pre-test and post-test analytics accurately demonstrate learning impact.',
      shouldImprove: 'Distinguish between Vallinam and Mellinam consonants in the game levels.',
      facedTechnicalIssue: false,
      technicalIssueDetails: '',
    },
    scores: {
      usability: 4.7,
      engagement: 5.0,
      aiHelpfulness: 4.0,
      audioQuality: 4.0,
      overallSatisfaction: 4.7,
    },
    isDemo: true,
  },
];

class ValidationService {
  private evaluations: ParticipantEvaluation[] = [];
  private demoEnabled = false;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.evaluations = stored ? JSON.parse(stored) : [];

      const demoPref = localStorage.getItem(DEMO_TOGGLE_KEY);
      this.demoEnabled = demoPref ? JSON.parse(demoPref) : false;
    } catch {
      this.evaluations = [];
      this.demoEnabled = false;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.evaluations));
    } catch {
      // Storage error
    }
  }

  public isDemoEnabled(): boolean {
    return this.demoEnabled;
  }

  public setDemoEnabled(val: boolean) {
    this.demoEnabled = val;
    try {
      localStorage.setItem(DEMO_TOGGLE_KEY, JSON.stringify(val));
    } catch {}
  }

  public getNextParticipantId(): string {
    const total = this.evaluations.length + 1;
    return `Participant P${String(total).padStart(2, '0')}`;
  }

  public getEvaluations(): ParticipantEvaluation[] {
    if (this.demoEnabled) {
      // Combine user evaluations + demo evaluations without duplication
      const nonDemo = this.evaluations.filter((e) => !e.isDemo);
      return [...nonDemo, ...DEMO_EVALUATIONS];
    }
    return this.evaluations.filter((e) => !e.isDemo);
  }

  public addEvaluation(
    participantId: string,
    role: ParticipantRole,
    tasksCompleted: string[],
    totalTimeSec: number,
    survey: ValidationSurveyAnswers
  ): ParticipantEvaluation {
    // Calculate aggregate scores
    const usability = parseFloat(
      ((survey.q1_easyToUse + survey.q8_websiteResponsive + survey.q9_learningProgression) / 3).toFixed(1)
    );
    const engagement = parseFloat(
      ((survey.q2_engagingActivities + survey.q4_gamesEnjoyable + survey.q5_storiesRhymesUseful) / 3).toFixed(1)
    );
    const aiHelpfulness = parseFloat(survey.q6_aiBuddyHelpful.toFixed(1));
    const audioQuality = parseFloat(survey.q7_audioClear.toFixed(1));
    const allQuestions = [
      survey.q1_easyToUse,
      survey.q2_engagingActivities,
      survey.q3_letterTracing,
      survey.q4_gamesEnjoyable,
      survey.q5_storiesRhymesUseful,
      survey.q6_aiBuddyHelpful,
      survey.q7_audioClear,
      survey.q8_websiteResponsive,
      survey.q9_learningProgression,
      survey.q10_recommendPlatform,
    ];
    const overallSatisfaction = parseFloat(
      (allQuestions.reduce((a, b) => a + b, 0) / allQuestions.length).toFixed(1)
    );

    const record: ParticipantEvaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      participantId,
      role,
      createdAt: new Date().toISOString(),
      tasksCompleted,
      totalTimeSec,
      survey,
      scores: {
        usability,
        engagement,
        aiHelpfulness,
        audioQuality,
        overallSatisfaction,
      },
      isDemo: false,
    };

    this.evaluations.push(record);
    this.persist();
    return record;
  }

  public getAggregates() {
    const list = this.getEvaluations();
    if (list.length === 0) {
      return null;
    }

    const count = list.length;
    const avgUsability = parseFloat(
      (list.reduce((acc, curr) => acc + curr.scores.usability, 0) / count).toFixed(1)
    );
    const avgEngagement = parseFloat(
      (list.reduce((acc, curr) => acc + curr.scores.engagement, 0) / count).toFixed(1)
    );
    const avgAI = parseFloat(
      (list.reduce((acc, curr) => acc + curr.scores.aiHelpfulness, 0) / count).toFixed(1)
    );
    const avgAudio = parseFloat(
      (list.reduce((acc, curr) => acc + curr.scores.audioQuality, 0) / count).toFixed(1)
    );
    const avgOverall = parseFloat(
      (list.reduce((acc, curr) => acc + curr.scores.overallSatisfaction, 0) / count).toFixed(1)
    );
    const avgTimeSec = Math.round(
      list.reduce((acc, curr) => acc + (curr.totalTimeSec || 0), 0) / count
    );

    // Calculate total task success rate (out of 10 tasks)
    const totalPossibleTasks = count * 10;
    const completedTasksCount = list.reduce(
      (acc, curr) => acc + (curr.tasksCompleted?.length || 0),
      0
    );
    const taskSuccessRate = Math.round((completedTasksCount / totalPossibleTasks) * 100);

    const issueCount = list.filter((e) => e.survey.facedTechnicalIssue).length;

    return {
      participantCount: count,
      avgUsability,
      avgEngagement,
      avgAI,
      avgAudio,
      avgOverall,
      avgTimeSec,
      taskSuccessRate,
      issueCount,
      isDemoIncluded: this.demoEnabled,
    };
  }

  public clearEvaluations() {
    this.evaluations = [];
    this.persist();
  }
}

export const validationService = new ValidationService();
