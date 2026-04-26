import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from '@/components/ui/image-button';
import { useAppColors } from '@/hooks/use-app-colors';

export type PronunciationQuality = 'excellent' | 'good' | 'bad';

interface QuestionCardResultProps {
  quality: PronunciationQuality;
}

/**
 * QuestionCardResult Component
 *
 * Affiche le résultat après l'analyse de prononciation
 */
export function QuestionCardResult({ quality }: QuestionCardResultProps) {
  const colors = useAppColors();

  // Configuration selon la qualité
  const config = {
    excellent: {
      backgroundColor: colors.success,
      textColor: colors.white,
      title: 'Superbe',
      description: "Vous l'avez très bien dit",
    },
    good: {
      backgroundColor: colors.warning,
      textColor: colors.black,
      title: 'Bon boulot!',
      description: 'Bien dit, mais vous pouvez faire mieux',
    },
    bad: {
      backgroundColor: colors.danger,
      textColor: colors.white,
      title: 'Oh non!',
      description: 'Essayons encore',
    },
  }[quality];

  return (
    <ThemedView style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <ImageButton
        width={20}
        height={20}
        source={require('@/assets/icons/check.png')}
        tintColor={config.textColor}
        handlePress={() => {}}
      />
      <ThemedView style={styles.textContainer}>
        <ThemedText style={[styles.title, { color: config.textColor }]}>
          {config.title}
        </ThemedText>
        <ThemedText style={[styles.description, { color: config.textColor }]}>
          {config.description}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 32,
    padding: 16,
    gap: 8,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
});
