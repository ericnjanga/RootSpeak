import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Word } from '@/types/word';
import { UserProgress, SessionProgress, PronunciationRating } from '@/types/progress';
import { PronunciationResult } from '@/types/api';
import wordsData from '@/data/words.json';

// State interface
interface AppState {
  currentWord: Word | null;
  currentWordIndex: number;
  sessionWords: Word[];
  sessionProgress: SessionProgress;
  userProgress: UserProgress;
  isLoading: boolean;
}

// Action types
type AppStateAction =
  | { type: 'LOAD_WORDS'; payload: Word[] }
  | { type: 'SET_CURRENT_WORD'; payload: { word: Word; index: number } }
  | { type: 'NEXT_WORD' }
  | { type: 'PREVIOUS_WORD' }
  | { type: 'SUBMIT_PRONUNCIATION'; payload: PronunciationResult }
  | { type: 'LOAD_USER_PROGRESS'; payload: UserProgress }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AppState = {
  currentWord: null,
  currentWordIndex: 0,
  sessionWords: [],
  sessionProgress: {
    correctWords: 0,
    totalWords: 0,
    starsEarned: 0,
    averageScore: 0,
  },
  userProgress: {
    totalWords: 0,
    completedWords: 0,
    totalStars: 0,
    maxStars: 0,
    currentStreak: 0,
    wordProgress: {},
    lastUpdated: new Date(),
  },
  isLoading: true,
};

// Reducer
function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case 'LOAD_WORDS':
      return {
        ...state,
        sessionWords: action.payload,
        currentWord: action.payload[0] || null,
        currentWordIndex: 0,
        isLoading: false,
      };

    case 'SET_CURRENT_WORD':
      return {
        ...state,
        currentWord: action.payload.word,
        currentWordIndex: action.payload.index,
      };

    case 'NEXT_WORD':
      const nextIndex = state.currentWordIndex + 1;
      if (nextIndex < state.sessionWords.length) {
        return {
          ...state,
          currentWordIndex: nextIndex,
          currentWord: state.sessionWords[nextIndex],
        };
      }
      // Loop back to first word
      return {
        ...state,
        currentWordIndex: 0,
        currentWord: state.sessionWords[0],
      };

    case 'PREVIOUS_WORD':
      const prevIndex = state.currentWordIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentWordIndex: prevIndex,
          currentWord: state.sessionWords[prevIndex],
        };
      }
      return state;

    case 'SUBMIT_PRONUNCIATION': {
      const result = action.payload;
      const currentWord = state.currentWord;

      if (!currentWord) return state;

      // Calculate stars based on score
      const stars =
        result.score >= 90 ? 3 :
        result.score >= 80 ? 2 :
        result.score >= 70 ? 1 : 0;

      // Update session progress
      const newSessionProgress = {
        correctWords: state.sessionProgress.correctWords + (stars > 0 ? 1 : 0),
        totalWords: state.sessionProgress.totalWords + 1,
        starsEarned: state.sessionProgress.starsEarned + stars,
        averageScore:
          (state.sessionProgress.averageScore * state.sessionProgress.totalWords + result.score) /
          (state.sessionProgress.totalWords + 1),
      };

      // Update word progress
      const existingWordProgress = state.userProgress.wordProgress[currentWord.id];
      const newWordProgress = {
        wordId: currentWord.id,
        attempts: (existingWordProgress?.attempts || 0) + 1,
        lastAttempt: new Date(),
        bestScore: Math.max(existingWordProgress?.bestScore || 0, result.score),
        bestRating: result.rating,
        completed: result.rating === PronunciationRating.EXCELLENT,
        stars: Math.max(existingWordProgress?.stars || 0, stars),
      };

      // Update user progress
      const updatedWordProgress = {
        ...state.userProgress.wordProgress,
        [currentWord.id]: newWordProgress,
      };

      const completedWords = Object.values(updatedWordProgress).filter(
        (wp) => wp.completed
      ).length;

      const totalStars = Object.values(updatedWordProgress).reduce(
        (sum, wp) => sum + wp.stars,
        0
      );

      const newUserProgress = {
        ...state.userProgress,
        totalWords: state.sessionWords.length,
        completedWords,
        totalStars,
        maxStars: state.sessionWords.length * 3,
        wordProgress: updatedWordProgress,
        lastUpdated: new Date(),
      };

      return {
        ...state,
        sessionProgress: newSessionProgress,
        userProgress: newUserProgress,
      };
    }

    case 'LOAD_USER_PROGRESS':
      return {
        ...state,
        userProgress: action.payload,
      };

    case 'RESET_SESSION':
      return {
        ...state,
        sessionProgress: initialState.sessionProgress,
        currentWordIndex: 0,
        currentWord: state.sessionWords[0] || null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Context
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
  loadWords: () => void;
  nextWord: () => void;
  previousWord: () => void;
  submitPronunciation: (result: PronunciationResult) => void;
  resetSession: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // Load words on mount
  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = () => {
    try {
      const words = wordsData.words as Word[];
      dispatch({ type: 'LOAD_WORDS', payload: words });
      console.log('✅ Loaded words:', words.length);
    } catch (error) {
      console.error('❌ Error loading words:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const nextWord = () => {
    dispatch({ type: 'NEXT_WORD' });
  };

  const previousWord = () => {
    dispatch({ type: 'PREVIOUS_WORD' });
  };

  const submitPronunciation = (result: PronunciationResult) => {
    dispatch({ type: 'SUBMIT_PRONUNCIATION', payload: result });
    console.log('✅ Pronunciation submitted:', result);
  };

  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  const value: AppStateContextType = {
    state,
    dispatch,
    loadWords,
    nextWord,
    previousWord,
    submitPronunciation,
    resetSession,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// Hook
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
