import { useAudio } from '@/contexts/audio-context';
import { RecordingState } from '@/types/audio';

/**
 * useAudioRecorder Hook
 *
 * Simplified hook for audio recording functionality.
 * Wraps the AudioContext for easier use in components.
 *
 * @example
 * ```tsx
 * const { startRecording, stopRecording, isRecording, isProcessing } = useAudioRecorder();
 *
 * // Start recording
 * await startRecording();
 *
 * // Stop and get recording
 * const recording = await stopRecording();
 * ```
 */
export function useAudioRecorder() {
  const {
    audioState,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudio();

  const isIdle = audioState.state === RecordingState.IDLE;
  const isRecording = audioState.isRecording;
  const isProcessing = audioState.isProcessing;
  const hasError = audioState.state === RecordingState.ERROR;
  const recording = audioState.recording;
  const error = audioState.error;

  return {
    // State
    isIdle,
    isRecording,
    isProcessing,
    hasError,
    recording,
    error,
    hasPermission,

    // Actions
    requestPermission,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
