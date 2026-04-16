import { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppState } from '@/contexts/app-state-context';

/**
 * Splashscreen
 *
 * Initial loading screen that:
 * - Shows RootSpeak logo and branding
 * - Loads initial data (words from JSON)
 * - Auto-navigates to Home screen after loading
 */
export default function SplashScreen() {
  const { state } = useAppState();
  const scale = useSharedValue(1);

  // Logo pulse animation
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Auto-navigate to home when data is loaded
  useEffect(() => {
    if (!state.isLoading && state.sessionWords.length > 0) {
      // Wait a bit for smooth transition
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [state.isLoading, state.sessionWords.length]);

  return (
    <ThemedView style={styles.container}>
      {/* App Name */}
      <ThemedText style={styles.appName}>RootSpeak</ThemedText>
      <ThemedText style={styles.tagline}>
        Maîtrisez votre prononciation
      </ThemedText>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>
          Chargement...
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 48,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
