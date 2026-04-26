import { useColorScheme } from './use-color-scheme';
import { Colors, AppColors } from '@/constants/theme';

/**
 * Hook to get app colors based on current color scheme
 *
 * @example
 * ```tsx
 * const colors = useAppColors();
 *
 * <View style={{ backgroundColor: colors.primary }} />
 * <Text style={{ color: colors.text }} />
 * ```
 */
export function useAppColors() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return {
    // Theme-aware colors (change with dark/light mode)
    ...themeColors,

    // App colors (always the same)
    ...AppColors,
  };
}
