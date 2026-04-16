import { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { WordCard } from '@/components/learning/word-card';
import { RecordButton } from '@/components/learning/record-button';
import { ProgressBar } from '@/components/learning/progress-bar';
import { useAppState } from '@/contexts/app-state-context';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { getPronunciationAPI } from '@/services/api';
import { PronunciationResult } from '@/types/api';

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
  const { state } = useAppState();
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    recording,
  } = useAudioRecorder();

  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentWord = state.currentWord;
  const currentIndex = state.currentWordIndex;
  const totalWords = state.sessionWords.length;

  // Handle record button press
  const handleRecordPress = async () => {
    try {
      if (isRecording) {
        // Stop recording
        const audioRecording = await stopRecording();
        console.log('📝 Recording stopped:', audioRecording.uri);

        // Evaluate pronunciation
        await evaluatePronunciation(audioRecording.uri);
      } else {
        // Start recording
        await startRecording();
        console.log('🎤 Recording started');
      }
    } catch (error: any) {
      console.error('❌ Recording error:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'enregistrer. Vérifiez les permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  // Evaluate pronunciation using API
  const evaluatePronunciation = async (audioUri: string) => {
    if (!currentWord) {
      console.error('❌ No current word');
      return;
    }

    try {
      setIsEvaluating(true);
      console.log('🔍 Evaluating pronunciation...');

      // Get API instance
      const api = await getPronunciationAPI();

      // Call API
      const result = await api.evaluatePronunciation({
        audioUri,
        wordId: currentWord.id,
        targetWord: currentWord.word,
      });

      console.log('✅ Evaluation result:', result);

      // Navigate to Result screen with result
      router.push({
        pathname: '/result',
        params: {
          result: JSON.stringify(result),
        },
      });
    } catch (error: any) {
      console.error('❌ Evaluation error:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'évaluer votre prononciation. Réessayez.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // Show loading state
  if (state.isLoading || !currentWord) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          {/* Loading is handled by Splashscreen */}
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <ProgressBar
          current={currentIndex + 1}
          total={totalWords}
          showText={true}
        />

        {/* Word Card */}
        <WordCard
          word={currentWord}
          showTranslation={true}
          imageSize="large"
        />

        {/* Record Button */}
        <ThemedView style={styles.recordContainer}>
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing || isEvaluating}
            onPress={handleRecordPress}
          />
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
