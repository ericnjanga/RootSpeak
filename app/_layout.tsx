import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AudioProvider } from '@/contexts/audio-context';
import { AppStateProvider } from '@/contexts/app-state-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AudioProvider>
        <AppStateProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="splash"
          >
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="result" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </AppStateProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
