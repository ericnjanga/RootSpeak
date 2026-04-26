import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from '@/components/ui/image-button';

interface HeaderSectionProps {
  title: string;
  backgroundColor?: string;
  paddingHorizontal?: number;
  userImageUrl?: string;
  onUserPress?: () => void;
}

/**
 * HeaderSection Component
 *
 * Header avec titre et image utilisateur
 */
export function HeaderSection({ title, userImageUrl, onUserPress, backgroundColor = '#EAE9F2', paddingHorizontal = 0 }: HeaderSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 4, backgroundColor: backgroundColor, paddingHorizontal: paddingHorizontal }]}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      {userImageUrl && (
        <ImageButton
          buttonStyle={styles.userImage}
          source={{ uri: userImageUrl }}
          handlePress={onUserPress || (() => {})}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userImage: {
    borderRadius: 13,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
