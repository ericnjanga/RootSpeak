export enum RecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface AudioRecording {
  uri: string;
  duration: number; // milliseconds
  size: number; // bytes
}

export interface AudioState {
  state: RecordingState;
  recording: AudioRecording | null;
  error: string | null;
  isRecording: boolean;
  isProcessing: boolean;
}
