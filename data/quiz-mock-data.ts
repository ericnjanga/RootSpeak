/**
 * Mock Quiz Data
 *
 * Données de simulation pour tester l'interface
 * En attendant l'intégration avec l'API
 */

export interface QuizWord {
  id: string;
  image: any; // require() result
  word: string;
  pronunciation: string; // Traduction en français
}

export const quizMockData: QuizWord[] = [
  {
    id: 'quiz_1',
    image: require('@/assets/quiz/water.jpg'),
    word: 'Water',
    pronunciation: 'L\'eau',
  },
  {
    id: 'quiz_2',
    image: require('@/assets/quiz/panther.jpg'),
    word: 'Panther',
    pronunciation: 'La panthère',
  },
  {
    id: 'quiz_3',
    image: require('@/assets/quiz/doctor.jpg'),
    word: 'Doctor',
    pronunciation: 'Le médecin',
  },
];
