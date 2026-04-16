import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  color?: string;
  height?: number;
}

/**
 * ProgressBar Component
 *
 * Displays progress as "X/Y" with animated progress bar.
 * Used to show current word position in session.
 */
export function ProgressBar({
  current,
  total,
  showText = true,
  color = '#0a7ea4',
  height = 8,
}: ProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    progress.value = withTiming(percentage, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      {showText && (
        <ThemedText style={styles.text}>
          Mot {current} / {total}
        </ThemedText>
      )}

      <View style={[styles.barBackground, { height }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: color, height },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  barBackground: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 4,
  },
});
