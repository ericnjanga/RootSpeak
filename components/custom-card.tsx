import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

type CustomCardProps = {
  title: string;
  description: string;
  icon?: string;
  onPress?: () => void;
};

export function CustomCard({ title, description, icon, onPress }: CustomCardProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    flex: 1,
  },
  description: {
    opacity: 0.7,
  },
});
