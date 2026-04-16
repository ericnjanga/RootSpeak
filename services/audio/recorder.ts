import { Audio } from 'expo-av';
import { AudioRecording } from '@/types/audio';

/**
 * AudioRecorder Service
 * Pure service class for audio recording operations
 */
export class AudioRecorder {
  private recording: Audio.Recording | null = null;

  /**
   * Request microphone permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  /**
   * Check if permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Create recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return the audio file info
   */
  async stopRecording(): Promise<AudioRecording> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      if (!uri) {
        throw new Error('Recording URI is null');
      }

      const audioRecording: AudioRecording = {
        uri,
        duration: status.durationMillis,
        size: 0, // Could be calculated from file system if needed
      };

      this.recording = null;

      return audioRecording;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * Cancel ongoing recording
   */
  async cancelRecording(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Failed to cancel recording:', error);
      }
      this.recording = null;
    }
  }

  /**
   * Get recording status
   */
  async getStatus(): Promise<Audio.RecordingStatus | null> {
    if (!this.recording) {
      return null;
    }

    try {
      return await this.recording.getStatusAsync();
    } catch (error) {
      console.error('Failed to get recording status:', error);
      return null;
    }
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording !== null;
  }
}

// Singleton instance
export const audioRecorder = new AudioRecorder();
