import { StyleSheet, Pressable, ActivityIndicator, Image } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from '@/components/ui/image-button';
import { useAppColors } from '@/hooks/use-app-colors';

interface QuizActionsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onRecordStart?: () => void;
  onRecordStop?: () => void;
  recordButtonText?: string;
  isRecording?: boolean;
  isProcessing?: boolean;
  hasAnalyzed?: boolean; // Si l'analyse est terminée
  hasPrevious?: boolean; // Si le bouton previous est disponible
  hasNext?: boolean; // Si le bouton next est disponible
}

/**
 * QuizActions Component
 *
 * Boutons de navigation et d'enregistrement (← 🎤 →)
 */
export function QuizActions({
  onPrevious,
  onNext,
  onRecordStart,
  onRecordStop,
  recordButtonText = 'Appuyez et parler',
  isRecording = false,
  isProcessing = false,
  hasAnalyzed = false,
  hasPrevious = true,
  hasNext = true,
}: QuizActionsProps) {
  const colors = useAppColors();

  // Animation pulse pour le bouton pendant l'enregistrement
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      // Démarre l'animation pulse
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1, // Infini
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      // Arrête l'animation
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      pulseScale.value = withTiming(1, { duration: 200 });
      pulseOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Texte du bouton selon l'état
  const getButtonText = () => {
    if (isProcessing) return 'Analyse en cours...';
    if (isRecording) return 'Enregistrement...';
    if (hasAnalyzed) return 'Cliquez pou réessayer';
    return recordButtonText;
  };

  // Désactiver navigation pendant recording/processing
  const isNavigationDisabled = isRecording || isProcessing;

  return (
    <ThemedView style={styles.container}>
      {/* Arrow Left */}
      <Pressable
        style={({ pressed }) => [
          styles.arrowButton,
          {
            opacity: !hasPrevious || isNavigationDisabled ? 0.3 : pressed ? 0.6 : 1,
            transform: [{ scale: pressed && hasPrevious && !isNavigationDisabled ? 0.95 : 1 }],
          },
        ]}
        onPress={onPrevious || (() => {})}
        disabled={!hasPrevious || isNavigationDisabled}
      >
        <Image
          source={require('@/assets/icons/arrow_left.png')}
          style={{ width: 11, height: 20 }}
          resizeMode="contain"
        />
      </Pressable>

      {/* Primary Button (Mic) - Press and Hold (ou simple clic si hasAnalyzed) */}
      <Animated.View style={[styles.micButtonWrapper, animatedStyle]}>
        <Pressable
          style={[
            styles.micButton,
            {
              backgroundColor: isRecording
                ? '#FF4444'
                : isProcessing
                ? '#FFA500'
                : colors.primary,
            },
          ]}
          onPressIn={() => {
            if (!isProcessing) {
              if (hasAnalyzed) {
                // Mode réessayer: simple clic
                onRecordStart?.();
              } else {
                // Mode normal: press and hold
                onRecordStart?.();
              }
            }
          }}
          onPressOut={() => {
            // En mode réessayer, ne pas appeler onRecordStop
            if (isRecording && !hasAnalyzed) {
              onRecordStop?.();
            }
          }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ImageButton
              width={20}
              height={20}
              source={require('@/assets/icons/mic.png')}
              handlePress={() => {}}
            />
          )}
          <ThemedText style={styles.micButtonText}>{getButtonText()}</ThemedText>
        </Pressable>
      </Animated.View>

      {/* Arrow Right */}
      <Pressable
        style={({ pressed }) => [
          styles.arrowButton,
          {
            opacity: !hasNext || isNavigationDisabled ? 0.3 : pressed ? 0.6 : 1,
            transform: [{ scale: pressed && hasNext && !isNavigationDisabled ? 0.95 : 1 }],
          },
        ]}
        onPress={onNext || (() => {})}
        disabled={!hasNext || isNavigationDisabled}
      >
        <Image
          source={require('@/assets/icons/arrow_right.png')}
          style={{ width: 11, height: 20 }}
          resizeMode="contain"
        />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
    backgroundColor: '#EAE9F2',
  },
  arrowButton: {
    width: 57,
    height: 48,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  micButtonWrapper: {
    flex: 1,
  },
  micButton: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  micButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
