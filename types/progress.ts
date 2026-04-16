export enum PronunciationRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  TRY_AGAIN = 'try_again',
}

export interface WordProgress {
  wordId: string;
  attempts: number;
  lastAttempt: Date;
  bestScore: number;
  bestRating: PronunciationRating;
  completed: boolean;
  stars: number; // 0-3
}

export interface UserProgress {
  totalWords: number;
  completedWords: number;
  totalStars: number;
  maxStars: number;
  currentStreak: number;
  wordProgress: Record<string, WordProgress>;
  lastUpdated: Date;
}

export interface SessionProgress {
  correctWords: number;
  totalWords: number;
  starsEarned: number;
  averageScore: number;
}
