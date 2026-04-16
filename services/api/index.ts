import { PronunciationRequest, PronunciationResult } from '@/types/api';

/**
 * Pronunciation API Interface
 *
 * Defines the contract for pronunciation evaluation services.
 * Can be implemented by MockAPI (for development) or AzureAPI (for production).
 */
export interface PronunciationAPI {
  /**
   * Evaluate pronunciation from audio recording
   */
  evaluatePronunciation(request: PronunciationRequest): Promise<PronunciationResult>;

  /**
   * Check if API is available/healthy
   */
  checkHealth(): Promise<boolean>;
}

/**
 * API Configuration
 */
export const Config = {
  // Use mock API in development or if no Azure key is configured
  USE_MOCK_API: __DEV__ || !process.env.AZURE_API_KEY,

  // Azure Speech API configuration (for future use)
  AZURE_API_KEY: process.env.AZURE_API_KEY,
  AZURE_REGION: process.env.AZURE_REGION || 'eastus',
  AZURE_LANGUAGE: 'en-US',

  // Scoring thresholds
  EXCELLENT_THRESHOLD: 85,
  GOOD_THRESHOLD: 70,

  // Star thresholds
  THREE_STARS_THRESHOLD: 90,
  TWO_STARS_THRESHOLD: 80,
  ONE_STAR_THRESHOLD: 70,

  // Audio settings
  MAX_RECORDING_DURATION: 5000, // 5 seconds
  AUTO_STOP_RECORDING: true,
};

/**
 * Get the appropriate API implementation
 */
export async function getPronunciationAPI(): Promise<PronunciationAPI> {
  if (Config.USE_MOCK_API) {
    // Dynamic import for better code splitting
    const { MockPronunciationAPI } = await import('./mock-api');
    return new MockPronunciationAPI();
  } else {
    // Future: Azure API implementation
    const { AzurePronunciationAPI } = await import('./azure-api');
    return new AzurePronunciationAPI();
  }
}
