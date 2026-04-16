import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * RecordButton Component
 *
 * Large circular button for recording audio.
 * - Shows microphone icon when idle
 * - Animates with pulse effect when recording
 * - Shows loading spinner when processing
 */
export function RecordButton({
  isRecording,
  isProcessing,
  onPress,
  disabled = false,
}: RecordButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Pulse animation when recording
  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const buttonColor = isRecording ? '#FF6B6B' : '#0a7ea4';
  const buttonText = isRecording ? 'Arrêter' : 'Enregistrer';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isProcessing}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: buttonColor },
          animatedStyle,
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <>
            <IconSymbol
              name={isRecording ? 'stop.circle.fill' : 'mic.circle.fill'}
              size={64}
              color="#FFFFFF"
            />
            <ThemedText style={styles.buttonText}>
              {buttonText}
            </ThemedText>
          </>
        )}
      </Animated.View>

      {isRecording && (
        <ThemedText style={styles.recordingText}>
          🔴 Enregistrement en cours...
        </ThemedText>
      )}

      {isProcessing && (
        <ThemedText style={styles.processingText}>
          Analyse en cours...
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  recordingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
});
