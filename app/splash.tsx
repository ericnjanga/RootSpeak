import { StyleSheet, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from "@/components/themed-view";
import ImageButton from "@/components/ui/image-button";
import CustomButton from "@/components/ui/custom-button";
import {router} from "expo-router";

export default function SplashScreen() {
  const loginButton = () => {
    router.replace('/');
  }

  return (
    <ImageBackground
      source={require('@/assets/images/splash-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* App Name */}
      <ThemedView style={styles.contain}>
        <ThemedText type="title" style={styles.welcome}>Bienvenue.</ThemedText>
        <ThemedText style={styles.welcomeDesc}>
          Commencez par créer votre compte.
        </ThemedText>
        <ThemedView style={styles.social}>
          <ImageButton source={require('@/assets/icons/google.png')} handlePress={() => {}}/>
          <ImageButton source={require('@/assets/icons/apple.png')} handlePress={() => {}}/>
          <ImageButton source={require('@/assets/icons/facebook.png')} handlePress={() => {}}/>
        </ThemedView>
        <ThemedView style={styles.containButton}>
          <CustomButton
              title="Connexion / Inscription"
              onPress={loginButton}
              variant="primary"
              fullWidth={true}
          />
        </ThemedView>
      </ThemedView>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  contain: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: -8 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 16,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  welcomeDesc: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 8,
    color: '#747474',
  },
  social: {
    backgroundColor: '#fff',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  containButton: {
    marginTop: 20,
  },
});
