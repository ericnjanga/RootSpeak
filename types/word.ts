export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
  difficulty: Difficulty;
  category?: string;
  phonetic?: string;
}

export interface WordCard extends Word {
  lessonId?: string;
  order?: number;
}
