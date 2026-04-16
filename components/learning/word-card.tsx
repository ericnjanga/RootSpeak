import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Word } from '@/types/word';

interface WordCardProps {
  word: Word;
  showTranslation?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
  onImagePress?: () => void;
}

/**
 * WordCard Component
 *
 * Displays a word with its image and optional translation.
 * Used in both Home screen (large) and Result screen (small).
 */
export function WordCard({
  word,
  showTranslation = true,
  imageSize = 'large',
  onImagePress,
}: WordCardProps) {
  const imageSizeStyle = {
    small: styles.imageSmall,
    medium: styles.imageMedium,
    large: styles.imageLarge,
  }[imageSize];

  return (
    <ThemedView style={styles.container}>
      {/* Word Image */}
      <View style={[styles.imageContainer, imageSizeStyle]}>
        <Image
          source={require('@/assets/images/react-logo.png')} // Placeholder for now
          style={styles.image}
          contentFit="contain"
          transition={300}
          onLoadStart={() => console.log('Loading image...')}
          onLoadEnd={() => console.log('Image loaded')}
        />
      </View>

      {/* Word Text */}
      <ThemedText type="title" style={styles.wordText}>
        {word.word}
      </ThemedText>

      {/* Translation */}
      {showTranslation && (
        <ThemedText style={styles.translationText}>
          {word.translation}
        </ThemedText>
      )}

      {/* Phonetic (optional) */}
      {word.phonetic && (
        <ThemedText style={styles.phoneticText}>
          {word.phonetic}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageSmall: {
    width: 120,
    height: 120,
  },
  imageMedium: {
    width: 200,
    height: 200,
  },
  imageLarge: {
    width: 280,
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  translationText: {
    fontSize: 24,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneticText: {
    fontSize: 16,
    opacity: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
