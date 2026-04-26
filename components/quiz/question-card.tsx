import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from '@/components/ui/image-button';

interface QuestionCardProps {
  question: string;
  onInfoPress?: () => void;
}

/**
 * QuestionCard Component
 *
 * Affiche une question avec icône info
 */
export function QuestionCard({ question, onInfoPress }: QuestionCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ImageButton
        width={20}
        height={20}
        source={require('@/assets/icons/infos.png')}
        handlePress={onInfoPress || (() => {})}
      />
      <ThemedText style={styles.text}>{question}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 32,
    backgroundColor: '#fff',
    padding: 16,
    gap: 8,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
});
