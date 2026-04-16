import { PronunciationAPI, Config } from './index';
import { PronunciationRequest, PronunciationResult } from '@/types/api';
import { PronunciationRating } from '@/types/progress';

/**
 * Mock Pronunciation API
 *
 * Simulates Azure Speech API for development and testing.
 * Generates realistic random scores and feedback messages.
 */
export class MockPronunciationAPI implements PronunciationAPI {
  /**
   * Simulate pronunciation evaluation with random but realistic results
   */
  async evaluatePronunciation(request: PronunciationRequest): Promise<PronunciationResult> {
    console.log('🎯 MockAPI: Evaluating pronunciation for:', request.targetWord);

    // Simulate network delay (1-2 seconds)
    await this.simulateDelay(1000, 2000);

    // Generate random score (60-100 for variety)
    const score = this.generateScore();

    // Determine rating based on score
    const rating = this.scoreToRating(score);

    // Calculate component scores
    const accuracy = score + this.randomVariation(-5, 5);
    const completeness = score + this.randomVariation(-3, 3);
    const fluency = score + this.randomVariation(-5, 5);

    // Get appropriate feedback message
    const feedback = this.getFeedbackMessage(rating, request.targetWord);

    const result: PronunciationResult = {
      score: Math.round(score),
      rating,
      accuracy: this.clamp(Math.round(accuracy), 0, 100),
      completeness: this.clamp(Math.round(completeness), 0, 100),
      fluency: this.clamp(Math.round(fluency), 0, 100),
      feedback,
    };

    console.log('✅ MockAPI: Result:', {
      score: result.score,
      rating: result.rating,
      feedback: result.feedback,
    });

    return result;
  }

  /**
   * Mock health check - always returns true
   */
  async checkHealth(): Promise<boolean> {
    return true;
  }

  /**
   * Generate a realistic score (weighted towards higher scores)
   */
  private generateScore(): number {
    // Generate scores with a bias towards better performance
    // 20% chance of 85-100 (excellent)
    // 40% chance of 70-84 (good)
    // 40% chance of 60-69 (try again)

    const rand = Math.random();

    if (rand < 0.2) {
      // Excellent range: 85-100
      return 85 + Math.random() * 15;
    } else if (rand < 0.6) {
      // Good range: 70-84
      return 70 + Math.random() * 14;
    } else {
      // Try again range: 60-69
      return 60 + Math.random() * 9;
    }
  }

  /**
   * Convert score to rating
   */
  private scoreToRating(score: number): PronunciationRating {
    if (score >= Config.EXCELLENT_THRESHOLD) {
      return PronunciationRating.EXCELLENT;
    } else if (score >= Config.GOOD_THRESHOLD) {
      return PronunciationRating.GOOD;
    } else {
      return PronunciationRating.TRY_AGAIN;
    }
  }

  /**
   * Get contextual feedback message based on rating and word
   */
  private getFeedbackMessage(rating: PronunciationRating, word: string): string {
    const messages = {
      [PronunciationRating.EXCELLENT]: [
        `Parfait ! Votre prononciation de "${word}" est excellente ! 🎉`,
        `Bravo ! Vous maîtrisez parfaitement "${word}" ! ⭐`,
        `Superbe ! Continue comme ça ! 🌟`,
        `Excellent travail ! Votre accent est impeccable ! 👏`,
        `Magnifique ! "${word}" est prononcé à la perfection ! 🎯`,
      ],
      [PronunciationRating.GOOD]: [
        `Bien joué ! Quelques petits ajustements et "${word}" sera parfait. 👍`,
        `Bon travail ! Tu es sur la bonne voie avec "${word}". 💪`,
        `C'est bien ! Continue à t'entraîner sur "${word}". 😊`,
        `Pas mal ! Encore un petit effort sur "${word}". ✨`,
        `Bien ! Tu progresses sur "${word}". Continue ! 🚀`,
      ],
      [PronunciationRating.TRY_AGAIN]: [
        `Pas mal ! Réessaye "${word}" en articulant bien. 💡`,
        `Presque ! Écoute bien et recommence "${word}". 🎧`,
        `Essaye encore "${word}" ! Tu vas y arriver. 💪`,
        `Continue ! Prends ton temps pour prononcer "${word}". ⏱️`,
        `N'abandonne pas ! "${word}" demande un peu plus de pratique. 🌱`,
      ],
    };

    const options = messages[rating];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Simulate network delay
   */
  private async simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generate random variation for component scores
   */
  private randomVariation(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Clamp value between min and max
   */
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
