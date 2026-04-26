import { Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

/**
 * CustomButton Component
 *
 * A customizable button with theme colors and styles.
 * Supports primary, secondary, and outline variants.
 */
export default function CustomButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  fullWidth = false,
}: CustomButtonProps) {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        ...buttonStyles,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText style={textStyles}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    width: '100%',
  },
  // Primary variant (default app color)
  primaryButton: {
    backgroundColor: '#0A5DFE',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Secondary variant
  secondaryButton: {
    backgroundColor: '#F5F5F5',
  },
  secondaryText: {
    color: '#0A5DFE',
    fontSize: 16,
    fontWeight: '600',
  },
  // Outline variant
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0A5DFE',
  },
  outlineText: {
    color: '#0A5DFE',
    fontSize: 16,
    fontWeight: '600',
  },
  // Disabled state
  disabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: '#666666',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
