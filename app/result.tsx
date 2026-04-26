import {StyleSheet, ImageBackground} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ImageButton from "@/components/ui/image-button";
import CustomButton from "@/components/ui/custom-button";
import {HeaderSection} from "@/components/quiz/header-section";

/**
 * Result Screen
 *
 * Shows pronunciation evaluation results:
 * - Word card (smaller)
 * - Rating display (Excellent/Bien/Réessayer)
 * - Star rating (0-3 stars)
 * - Score bar
 * - Feedback message
 * - "Continuer" button to go back to Home with next word
 */
export default function ResultScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const maxScore = parseInt(params.maxScore as string) || 3;

  // Calculer le pourcentage
  const percentage = (score / maxScore) * 100;

  // Déterminer le message selon le score
  const getResultMessage = () => {
    if (percentage === 100) {
      return {
        title: "Parfait !",
        description: "Vous avez réussi tous les quiz avec brio !",
      };
    } else if (percentage >= 66) {
      return {
        title: "Félicitations !",
        description: "Vous avez très bien réussi !",
      };
    } else if (percentage >= 33) {
      return {
        title: "Bien joué !",
        description: "Vous êtes sur la bonne voie, continuez !",
      };
    } else {
      return {
        title: "Continuez vos efforts !",
        description: "La pratique rend parfait, réessayez !",
      };
    }
  };

  const resultMessage = getResultMessage();

  const handleRestart = () => {
    console.log('🔄 Redémarrage du jeu');
    router.replace('/');
  };

  return (
      <ImageBackground
          source={require('@/assets/images/result-bg.png')}
          style={styles.container}
          resizeMode="cover"
      >
        <ThemedView style={styles.content}>
          {/* Header en haut */}
          <HeaderSection
              title="Vocabulaire"
              backgroundColor="#fff"
              paddingHorizontal={16}
              userImageUrl="https://www.cedricnampa.com/images/giga.png"
              onUserPress={() => console.log('User avatar pressed')}
          />

          {/* Score view en bas */}
          <ThemedView style={styles.contain}>
            <ThemedText type="title" style={styles.greating}>
              {resultMessage.title}
            </ThemedText>
            <ThemedText style={styles.greatingDesc}>
              {resultMessage.description}
            </ThemedText>

            {/* Score display */}
            <ThemedView style={styles.scoreContainer}>
              <ThemedText style={styles.scoreText}>
                Score: {score}/{maxScore}
              </ThemedText>
              <ThemedText style={styles.percentageText}>
                {percentage.toFixed(0)}%
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.containButton}>
              <CustomButton
                  title="Recommencer le jeu"
                  onPress={handleRestart}
                  variant="primary"
                  fullWidth={true}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  contain: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 36,
    borderRadius: 30,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: -8 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 16,
  },
  greating: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  greatingDesc: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 4,
  },
  scoreContainer: {
    backgroundColor: 'transparent',
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A5DFE',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  social: {
    backgroundColor: '#fff',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  containButton: {
    marginTop: 32,
  },
});
