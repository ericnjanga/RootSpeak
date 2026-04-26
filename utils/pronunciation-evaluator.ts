import { PronunciationQuality } from '@/components/quiz/question-card-result';

/**
 * Évalue la qualité de prononciation de manière aléatoire
 *
 * Logique:
 * - Génère un nombre aléatoire entre 0 et 999 (max 3 chiffres)
 * - Si multiple de 3 → approximatif (good)
 * - Sinon si pair → bon (excellent)
 * - Sinon → mauvais (bad)
 *
 * @returns La qualité de prononciation
 */
export function evaluatePronunciationRandomly(): PronunciationQuality {
  // Génère un nombre aléatoire entre 0 et 999
  const randomNumber = Math.floor(Math.random() * 1000);

  console.log('🎲 Nombre aléatoire généré:', randomNumber);

  // Si multiple de 3 → approximatif
  if (randomNumber % 3 === 0) {
    console.log('✅ Résultat: Approximatif (multiple de 3)');
    return 'good';
  }

  // Si pair → bon
  if (randomNumber % 2 === 0) {
    console.log('✅ Résultat: Excellent (pair)');
    return 'excellent';
  }

  // Sinon → mauvais
  console.log('❌ Résultat: Mauvais (impair et non multiple de 3)');
  return 'bad';
}
