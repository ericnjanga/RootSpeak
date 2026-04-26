import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

/**
 * Hook to load custom fonts
 *
 * Loads Inter font family and keeps splash screen visible until fonts are loaded
 */
export function useLoadFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
        });

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        // Continue anyway even if fonts fail to load
        setFontsLoaded(true);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
