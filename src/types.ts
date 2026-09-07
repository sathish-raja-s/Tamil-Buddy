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
