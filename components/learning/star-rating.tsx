import { StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, { ZoomIn, BounceIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';

interface StarRatingProps {
  stars: number; // 0-3
  maxStars?: number; // default 3
  size?: number; // star size
  animated?: boolean;
  color?: string;
}

/**
 * StarRating Component
 *
 * Displays a star rating with animated appearance.
 * - Stars appear sequentially with haptic feedback
 * - Supports 0-3 stars
 * - Filled stars for earned, empty stars for remaining
 */
export function StarRating({
  stars,
  maxStars = 3,
  size = 48,
  animated = true,
  color = '#FFD700', // Gold
}: StarRatingProps) {
  // Trigger haptic feedback for each star
  useEffect(() => {
    if (animated && stars > 0) {
      // Delay haptic feedback to match animation
      const delays = Array.from({ length: stars }, (_, i) => i * 200 + 400);

      delays.forEach((delay) => {
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, delay);
      });
    }
  }, [stars, animated]);

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        const delay = animated ? index * 200 : 0;

        return (
          <Animated.View
            key={index}
            entering={animated ? BounceIn.delay(delay).duration(500) : undefined}
            style={styles.starContainer}
          >
            <IconSymbol
              name={isFilled ? 'star.fill' : 'star'}
              size={size}
              color={isFilled ? color : '#CCCCCC'}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  starContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
