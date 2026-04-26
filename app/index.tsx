import { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { HeaderSection } from '@/components/quiz/header-section';
import { QuestionCard } from '@/components/quiz/question-card';
import { QuestionCardResult, PronunciationQuality } from '@/components/quiz/question-card-result';
import { WordQuizCard } from '@/components/quiz/word-quiz-card';
import { QuizActions } from '@/components/quiz/quiz-actions';
import { quizMockData } from '@/data/quiz-mock-data';
import { evaluatePronunciationRandomly } from '@/utils/pronunciation-evaluator';

/**
 * Home Screen
 *
 * Main learning interface where users:
 * 1. See a word card (image + word + translation)
 * 2. Record themselves pronouncing the word
 * 3. Get evaluated by the API
 * 4. Navigate to Result screen
 */
export default function HomeScreen() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isRecordingSimulation, setIsRecordingSimulation] = useState(false);
  const [isProcessingSimulation, setIsProcessingSimulation] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [pronunciationQuality, setPronunciationQuality] = useState<PronunciationQuality | null>(null);

  // Timer pour auto-stop après 3 secondes
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scores pour chaque quiz (0 ou 1 par quiz)
  const [quizScores, setQuizScores] = useState<number[]>(
    new Array(quizMockData.length).fill(0)
  );

  const currentQuiz = quizMockData[currentQuizIndex];
  const totalQuizzes = quizMockData.length;

  // Déterminer si previous/next sont disponibles
  const hasPrevious = currentQuizIndex > 0;
  const hasNext = true; // Toujours actif (même au dernier quiz pour aller vers Result)

  // Score total
  const totalScore = quizScores.reduce((sum, score) => sum + score, 0);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      resetAnalysisState();
      console.log('⬅️ Previous quiz:', currentQuizIndex - 1);
    }
  };

  const handleNext = () => {
    // Si on est au dernier quiz, naviguer vers la page result
    if (currentQuizIndex === totalQuizzes - 1) {
      console.log('🎉 Quiz terminé - Navigation vers Result');
      console.log(`📊 Score final: ${totalScore}/${totalQuizzes}`);
      router.push({
        pathname: '/result',
        params: {
          score: totalScore.toString(),
          maxScore: totalQuizzes.toString(),
        },
      });
    } else {
      // Sinon, passer au quiz suivant
      setCurrentQuizIndex(currentQuizIndex + 1);
      resetAnalysisState();
      console.log('➡️ Next quiz:', currentQuizIndex + 1);
    }
  };

  // Reset analysis state (pour re-enregistrer ou changer de quiz)
  const resetAnalysisState = () => {
    // Nettoyer le timer s'il existe
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setHasAnalyzed(false);
    setPronunciationQuality(null);
    setIsRecordingSimulation(false);
    setIsProcessingSimulation(false);
  };

  // Mettre à jour le score pour le quiz actuel selon la qualité
  const updateQuizScore = (quality: PronunciationQuality) => {
    const newScores = [...quizScores];

    // Si la prononciation est bonne (excellent ou good), on donne 1 point
    // Si la prononciation est mauvaise (bad), on donne 0 point
    if (quality === 'excellent' || quality === 'good') {
      newScores[currentQuizIndex] = 1;
      console.log(`✅ Score +1 pour quiz ${currentQuizIndex + 1} (${quality})`);
    } else {
      newScores[currentQuizIndex] = 0;
      console.log(`❌ Score 0 pour quiz ${currentQuizIndex + 1} (${quality})`);
    }

    setQuizScores(newScores);
  };

  // Simulation: Start recording when button is pressed
  const handleRecordStart = () => {
    // Si déjà analysé, on reset pour permettre un nouvel enregistrement
    if (hasAnalyzed) {
      resetAnalysisState();
      console.log('🔄 Reset for new recording');
      return;
    }

    console.log('🎤 Recording started (simulation)');
    setIsRecordingSimulation(true);

    // Auto-stop après 5 secondes
    recordingTimerRef.current = setTimeout(() => {
      console.log('⏱️ 5 secondes écoulées - Auto-stop recording');
      handleRecordStop();
    }, 3000);
  };

  // Simulation: Stop recording and start processing
  const handleRecordStop = async () => {
    console.log('⏹️ Recording stopped (simulation)');

    // Nettoyer le timer s'il existe
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsRecordingSimulation(false);
    setIsProcessingSimulation(true);

    // Simulate API call with 2 second delay
    setTimeout(() => {
      console.log('✅ Processing complete (simulation)');

      // Évaluer la prononciation de manière aléatoire
      const quality = evaluatePronunciationRandomly();
      setPronunciationQuality(quality);

      // Mettre à jour le score pour ce quiz
      updateQuizScore(quality);

      setIsProcessingSimulation(false);
      setHasAnalyzed(true);

      console.log('🎯 Qualité de prononciation:', quality);
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <HeaderSection
        title="Vocabulaire"
        userImageUrl="https://www.cedricnampa.com/images/giga.png"
        onUserPress={() => console.log('User avatar pressed')}
      />

      {/* Afficher QuestionCard ou QuestionCardResult selon l'état */}
      {hasAnalyzed && pronunciationQuality ? (
        <QuestionCardResult quality={pronunciationQuality} />
      ) : (
        <QuestionCard
          question="Quelle est la nom qui s'affiche dans l'image ci-dessous?"
          onInfoPress={() => console.log('Info pressed')}
        />
      )}

      <WordQuizCard
        image={currentQuiz.image}
        word={currentQuiz.word}
        pronunciation={currentQuiz.pronunciation}
        score={totalScore}
        maxScore={totalQuizzes}
        showPronunciation={hasAnalyzed}
        showAudio={hasAnalyzed}
        onAudioPress={() => console.log('Audio pressed')}
      />

      <QuizActions
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRecordStart={handleRecordStart}
        onRecordStop={handleRecordStop}
        isRecording={isRecordingSimulation}
        isProcessing={isProcessingSimulation}
        hasAnalyzed={hasAnalyzed}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        recordButtonText="Appuyez et parler"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#EAE9F2',
  },
});
