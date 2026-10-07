export interface UserState {
  level: number;
  xp: number;
  streak: number;
  badges: Badge[];
  completedLessons: string[];
  learnedLetters: string[]; // Store learned letter IDs
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned?: string;
}

export type LetterCategory = 'uyir' | 'mei' | 'aytham' | 'uyirmei';
export type MeiGroup = 'vallinam' | 'mellinam' | 'idaiyinam' | null;

export interface TamilLetter {
  id: string;
  letter: string;
  category: LetterCategory;
  meiGroup?: MeiGroup;
  word: string;
  englishMeaning: string;
  pronunciation: string;
  illustration: string;
  components?: { mei: string, uyir: string }; // For uyirmei: e.g. க் + அ
}

export type QuizDifficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Advanced' | 'Mastery';

export interface QuizQuestion {
  id: string;
  type: 'learn' | 'practice' | 'challenge';
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  hint: string;
  xp: number;
}

export interface GameActivity {
  id: string;
  type: 'letter_tap' | 'memory' | 'balloon_pop' | 'letter_hunt' | 'word_match' | 'uyirmei_builder' | 'word_builder' | 'sentence_builder' | 'listen_choose' | 'missing_letter';
  title: string;
  description: string;
  difficulty: number;
  xp: number;
  content: any; // We'll type this specifically based on the game type
}

export interface TracingActivity {
  id: string;
  character: string;
  type: "uyir" | "mei" | "uyirmei" | "word" | "sentence";
  difficulty: number;
  xp: number;
}

export interface TamilLevel {
  level: number;
  chapter: number;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  games: GameActivity[];
  tracing: TracingActivity[];
  questions: QuizQuestion[];
}

export interface VocabularyWord {
  id: string;
  word: string;
  english: string;
  pronunciation: string;
}

export interface StoryQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'sequence';
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface StorySection {
  id: string;
  tamilText: string;
  englishText: string;
  imageIcon: string;
}

export interface TamilStory {
  id: string;
  titleTamil: string;
  titleEnglish: string;
  category: string;
  level: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  content: StorySection[];
  vocabulary: VocabularyWord[];
  questions: StoryQuestion[];
  moral?: string;
  xpReward: number;
  illustration: string;
}

export interface RhymeLine {
  id: string;
  tamilText: string;
  englishText: string;
}

export interface TamilRhyme {
  id: string;
  titleTamil: string;
  titleEnglish: string;
  category: string;
  level: number;
  difficulty: "easy" | "medium" | "hard";
  lyrics: RhymeLine[];
  vocabulary: VocabularyWord[];
  xpReward: number;
  illustration: string;
}

// --- ANALYTICS & ADAPTIVE LEARNING ---
export interface LearnerAnalytics {
  userId: string;
  level: number;
  xp: number;
  streak: number;
  vocabularyAccuracy: number;
  readingAccuracy: number;
  pronunciationAccuracy: number;
  writingAccuracy: number;
  quizAccuracy: number;
  lessonsCompleted: number;
  totalLearningTime: number; // in seconds
  weakLetters: string[];
  weakWords: string[];
  strongTopics: string[];
  lastActiveAt: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  topic: string;
  type: 'pre-test' | 'post-test';
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  weaknessesIdentified: string[];
}

export interface LearningImpact {
  topic: string;
  preTestScore: number;
  postTestScore: number;
  improvementPercentage: number;
  dateCompleted: string;
}

export interface UserFeedback {
  id: string;
  date: string;
  learnerType: string;
  ageGroup: string;
  moduleTested: string;
  usabilityScore: number;
  engagementScore: number;
  usefulnessScore: number;
  satisfactionScore: number;
  suggestions: string;
  comments: string;
}

// --- PHASE 2 FORMAL USER VALIDATION ---
export type ParticipantRole = 'Learner' | 'Parent' | 'Teacher';

export interface ValidationTaskItem {
  id: string;
  title: string;
  description: string;
  route: string;
  isCompleted: boolean;
  timeSpentSec: number;
}

export interface ValidationSurveyAnswers {
  q1_easyToUse: number;            // 1. The website was easy to use.
  q2_engagingActivities: number;    // 2. Tamil learning activities were engaging.
  q3_letterTracing: number;         // 3. Letter tracing was easy to understand.
  q4_gamesEnjoyable: number;        // 4. Games were enjoyable.
  q5_storiesRhymesUseful: number;   // 5. Stories and rhymes were useful.
  q6_aiBuddyHelpful: number;        // 6. AI Buddy was helpful.
  q7_audioClear: number;            // 7. Audio pronunciation was clear.
  q8_websiteResponsive: number;     // 8. The website responded quickly.
  q9_learningProgression: number;   // 9. The learning progression was easy to understand.
  q10_recommendPlatform: number;    // 10. I would recommend this platform for Tamil learning.
  likedMost: string;
  shouldImprove: string;
  facedTechnicalIssue: boolean;
  technicalIssueDetails: string;
}

export interface ParticipantEvaluation {
  id: string;
  participantId: string; // e.g. "P01", "P02", "P03"
  role: ParticipantRole;
  createdAt: string;
  tasksCompleted: string[]; // task IDs
  totalTimeSec: number;
  survey: ValidationSurveyAnswers;
  scores: {
    usability: number;
    engagement: number;
    aiHelpfulness: number;
    audioQuality: number;
    overallSatisfaction: number;
  };
  isDemo?: boolean;
}

