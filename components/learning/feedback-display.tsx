import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PronunciationRating } from '@/types/progress';
import Animated, {
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface FeedbackDisplayProps {
  rating: PronunciationRating;
  score: number;
  feedback: string;
  animated?: boolean;
}

/**
 * FeedbackDisplay Component
 *
 * Displays pronunciation feedback with color-coded rating.
 * - Excellent: Green (#4CAF50)
 * - Bien: Orange (#FF9800)
 * - Réessayer: Red (#F44336)
 */
export function FeedbackDisplay({
  rating,
  score,
  feedback,
  animated = true,
}: FeedbackDisplayProps) {
  // Get rating-specific styles
  const ratingConfig = getRatingConfig(rating);

  return (
    <ThemedView style={styles.container}>
      {/* Rating Badge */}
      <Animated.View
        entering={animated ? ZoomIn.duration(500).springify() : undefined}
        style={[styles.ratingBadge, { backgroundColor: ratingConfig.color }]}
      >
        <ThemedText style={styles.emoji}>{ratingConfig.emoji}</ThemedText>
        <ThemedText style={styles.ratingText}>
          {ratingConfig.label}
        </ThemedText>
      </Animated.View>

      {/* Score Bar */}
      <Animated.View
        entering={animated ? FadeInDown.delay(200).duration(500) : undefined}
        style={styles.scoreContainer}
      >
        <ThemedText style={styles.scoreLabel}>Score</ThemedText>
        <View style={styles.scoreBarBackground}>
          <Animated.View
            entering={animated ? FadeInDown.delay(400).duration(800) : undefined}
            style={[
              styles.scoreBarFill,
              {
                width: `${score}%`,
                backgroundColor: ratingConfig.color,
              },
            ]}
          />
        </View>
        <ThemedText style={styles.scoreText}>{score}/100</ThemedText>
      </Animated.View>

      {/* Feedback Message */}
      <Animated.View
        entering={animated ? FadeInDown.delay(600).duration(500) : undefined}
        style={styles.feedbackContainer}
      >
        <ThemedText style={styles.feedbackText}>{feedback}</ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

/**
 * Get rating-specific configuration
 */
function getRatingConfig(rating: PronunciationRating) {
  switch (rating) {
    case PronunciationRating.EXCELLENT:
      return {
        label: 'Excellent !',
        emoji: '🎉',
        color: '#4CAF50', // Green
      };
    case PronunciationRating.GOOD:
      return {
        label: 'Bien !',
        emoji: '👍',
        color: '#FF9800', // Orange
      };
    case PronunciationRating.TRY_AGAIN:
      return {
        label: 'Réessayer',
        emoji: '💪',
        color: '#F44336', // Red
      };
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  ratingBadge: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  scoreBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
});
