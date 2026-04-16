import { PronunciationRating } from './progress';

export interface PronunciationResult {
  score: number; // 0-100
  rating: PronunciationRating;
  accuracy: number; // 0-100
  completeness: number; // 0-100
  fluency: number; // 0-100
  feedback: string;
  phonemes?: PhonemeScore[];
}

export interface PhonemeScore {
  phoneme: string;
  score: number;
  accuracy: number;
}

export interface PronunciationRequest {
  audioUri: string;
  wordId: string;
  targetWord: string;
  language?: string; // e.g., "en-US"
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
