import { StyleSheet, ImageBackground } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from '@/components/ui/image-button';
import { useAppColors } from '@/hooks/use-app-colors';

interface WordQuizCardProps {
  image: any; // require() result
  word: string;
  pronunciation: string;
  score: number;
  maxScore: number;
  onAudioPress?: () => void;
  showPronunciation?: boolean; // Afficher la prononciation ou masquer
  showAudio?: boolean; // Afficher le bouton audio ou masquer
}

/**
 * WordQuizCard Component
 *
 * Carte principale avec image, mot, prononciation et score
 */
export function WordQuizCard({
  image,
  word,
  pronunciation,
  score,
  maxScore,
  onAudioPress,
  showPronunciation = false,
  showAudio = false,
}: WordQuizCardProps) {
  const colors = useAppColors();

  // Générer le masque pour la prononciation (nombre de x = nombre de lettres)
  const maskedPronunciation = 'x'.repeat(pronunciation.length);

  return (
    <ImageBackground source={image} style={styles.container} resizeMode="cover">
      {/* Score Badge */}
      <ThemedView style={[styles.scoreBadge, { backgroundColor: colors.primary }]}>
        <ImageButton
          width={16}
          height={16}
          source={require('@/assets/icons/star.png')}
          handlePress={() => {}}
        />
        <ThemedText style={styles.scoreText}>
          {score}/{maxScore}
        </ThemedText>
      </ThemedView>

      {/* Word Container */}
      <ThemedView style={styles.wordContainer}>
        <ThemedView style={{ backgroundColor: 'transparent' }}>
          <ThemedText type="title" style={styles.word}>
            {word}
          </ThemedText>
          <ThemedText type="title" style={styles.pronunciation}>
            ({showPronunciation ? pronunciation : maskedPronunciation})
          </ThemedText>
        </ThemedView>

        {showAudio && (
          <ImageButton
            width={24}
            height={24}
            source={require('@/assets/icons/audio.png')}
            handlePress={onAudioPress || (() => {})}
          />
        )}
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
    justifyContent: 'flex-end',
  },
  scoreBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  wordContainer: {
    opacity: 0.84,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pronunciation: {
    fontSize: 16,
  },
});
