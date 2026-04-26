import { StyleSheet, TextStyle } from 'react-native';

/**
 * Global Text Styles with Inter font
 *
 * Apply these to Text components for consistent typography
 */
export const GlobalTextStyles = StyleSheet.create({
  regular: {
    fontFamily: 'Inter-Regular',
  } as TextStyle,
  medium: {
    fontFamily: 'Inter-Medium',
  } as TextStyle,
  semibold: {
    fontFamily: 'Inter-SemiBold',
  } as TextStyle,
  bold: {
    fontFamily: 'Inter-Bold',
  } as TextStyle,
});

/**
 * Font Family Constants
 *
 * Use these directly in your StyleSheet.create()
 */
export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;
