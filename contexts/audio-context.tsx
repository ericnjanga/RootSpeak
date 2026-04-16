import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { AudioState, AudioRecording, RecordingState } from '@/types/audio';

interface AudioContextType {
  audioState: AudioState;
  hasPermission: boolean | null;
  isPlaying: boolean;
  currentPlayback: string | null;
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<AudioRecording>;
  playRecording: (uri: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  clearRecording: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioState, setAudioState] = useState<AudioState>({
    state: RecordingState.IDLE,
    recording: null,
    error: null,
    isRecording: false,
    isProcessing: false,
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayback, setCurrentPlayback] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      console.log('🎤 Requesting audio permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (granted) {
        console.log('✅ Audio permissions granted');
        // Configure audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } else {
        console.log('❌ Audio permissions denied');
      }

      return granted;
    } catch (error) {
      console.error('❌ Permission error:', error);
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      // Check permission first
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permission to access microphone was denied');
        }
      } else if (!hasPermission) {
        throw new Error('Permission to access microphone was denied');
      }

      console.log('🎤 Starting recording...');
      setAudioState((prev) => ({
        ...prev,
        state: RecordingState.RECORDING,
        isRecording: true,
        error: null,
      }));

      // Create recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('✅ Recording started');
    } catch (error: any) {
      console.error('❌ Failed to start recording:', error);
      setAudioState((prev) => ({
        ...prev,
        state: RecordingState.ERROR,
        isRecording: false,
        error: error.message || 'Failed to start recording',
      }));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  };

  const stopRecording = async (): Promise<AudioRecording> => {
    try {
      if (!recordingRef.current) {
        throw new Error('No active recording');
      }

      console.log('⏹️ Stopping recording...');
      setAudioState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: true,
        state: RecordingState.PROCESSING,
      }));

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const status = await recordingRef.current.getStatusAsync();

      if (!uri) {
        throw new Error('Recording URI is null');
      }

      const recording: AudioRecording = {
        uri,
        duration: status.durationMillis,
        size: 0, // We could get file size if needed
      };

      setAudioState((prev) => ({
        ...prev,
        recording,
        state: RecordingState.COMPLETED,
        isProcessing: false,
      }));

      recordingRef.current = null;

      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log('✅ Recording stopped:', uri);
      return recording;
    } catch (error: any) {
      console.error('❌ Failed to stop recording:', error);
      setAudioState((prev) => ({
        ...prev,
        state: RecordingState.ERROR,
        isProcessing: false,
        error: error.message || 'Failed to stop recording',
      }));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  };

  const playRecording = async (uri: string): Promise<void> => {
    try {
      console.log('▶️ Playing recording:', uri);

      // Stop any existing playback
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setCurrentPlayback(uri);

      // Set up playback status listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setCurrentPlayback(null);
        }
      });

      console.log('✅ Playing audio');
    } catch (error) {
      console.error('❌ Failed to play recording:', error);
      setIsPlaying(false);
      setCurrentPlayback(null);
      throw error;
    }
  };

  const stopPlayback = async (): Promise<void> => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentPlayback(null);
      console.log('⏹️ Playback stopped');
    } catch (error) {
      console.error('❌ Failed to stop playback:', error);
    }
  };

  const clearRecording = () => {
    setAudioState({
      state: RecordingState.IDLE,
      recording: null,
      error: null,
      isRecording: false,
      isProcessing: false,
    });
    console.log('🧹 Recording cleared');
  };

  const value: AudioContextType = {
    audioState,
    hasPermission,
    isPlaying,
    currentPlayback,
    requestPermission,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    clearRecording,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
