import { useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { WordCard } from '@/components/learning/word-card';
import { FeedbackDisplay } from '@/components/learning/feedback-display';
import { StarRating } from '@/components/learning/star-rating';
import { useAppState } from '@/contexts/app-state-context';
import { PronunciationResult } from '@/types/api';
import { Config } from '@/services/api';

/**
 * Result Screen
 *
 * Shows pronunciation evaluation results:
 * - Word card (smaller)
 * - Rating display (Excellent/Bien/Réessayer)
 * - Star rating (0-3 stars)
 * - Score bar
 * - Feedback message
 * - "Continuer" button to go back to Home with next word
 */
export default function ResultScreen() {
  const params = useLocalSearchParams();
  const { state, submitPronunciation, nextWord } = useAppState();

  // Parse result from params
  const result: PronunciationResult | null = params.result
    ? JSON.parse(params.result as string)
    : null;

  const currentWord = state.currentWord;

  // Calculate stars based on score
  const calculateStars = (score: number): number => {
    if (score >= Config.THREE_STARS_THRESHOLD) return 3;
    if (score >= Config.TWO_STARS_THRESHOLD) return 2;
    if (score >= Config.ONE_STAR_THRESHOLD) return 1;
    return 0;
  };

  const stars = result ? calculateStars(result.score) : 0;

  // Submit pronunciation result on mount
  useEffect(() => {
    if (result) {
      submitPronunciation(result);
      console.log('📊 Result submitted to app state');
    }
  }, [result]);

  // Handle continue button
  const handleContinue = () => {
    nextWord();
    router.back();
  };

  // Safety check
  if (!result || !currentWord) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Erreur: Aucun résultat</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Word Card (smaller) */}
        <WordCard
          word={currentWord}
          showTranslation={true}
          imageSize="small"
        />

        {/* Star Rating */}
        <StarRating stars={stars} maxStars={3} size={56} animated={true} />

        {/* Feedback Display */}
        <FeedbackDisplay
          rating={result.rating}
          score={result.score}
          feedback={result.feedback}
          animated={true}
        />

        {/* Continue Button */}
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleContinue}
        >
          <ThemedText style={styles.continueButtonText}>
            Continuer
          </ThemedText>
        </Pressable>

        {/* Optional: Show session progress */}
        <ThemedView style={styles.statsContainer}>
          <ThemedText style={styles.statsText}>
            📊 Session: {state.sessionProgress.correctWords} / {state.sessionProgress.totalWords} mots réussis
          </ThemedText>
          <ThemedText style={styles.statsText}>
            ⭐ Étoiles gagnées: {state.sessionProgress.starsEarned}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    opacity: 0.8,
  },
});
