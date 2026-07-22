// ============================================================
// Quiz System Types
// ============================================================

export type QuestionType =
  | 'multiple-choice'
  | 'code-output'
  | 'complexity-analysis'
  | 'visual-prediction'
  | 'algorithm-trace';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  question: string;
  /** Code snippet (for code-output / algorithm-trace questions) */
  codeSnippet?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  /** Time limit in seconds */
  timeLimit: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizAttempt {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeTaken: number; // seconds
}

export interface QuizSession {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  currentQuestionIndex: number;
  isComplete: boolean;
  startedAt: string;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  timeTaken: number;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  question: QuizQuestion;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeTaken: number;
}
