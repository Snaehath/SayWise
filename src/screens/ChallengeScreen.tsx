import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { RecordingVisualizer } from '../components/RecordingVisualizer';
import { recordingService } from '../services/recordingService';
import { Challenge } from '../types/challenge';

interface ChallengeScreenProps {
  challenge: Challenge;
  onBack: () => void;
  onFinishRecording: (audioPath: string, durationSec: number) => void;
}

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({
  challenge,
  onBack,
  onFinishRecording,
}) => {
  const insets = useSafeAreaInsets();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const activeUriRef = useRef<string | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      try {
        if (audioRecorder.isRecording) {
          audioRecorder.stop();
        }
      } catch {
        // Safe disposal
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setIsPreparing(true);
    setPermissionDenied(false);

    try {
      const permission = await recordingService.requestPermission();
      if (!permission) {
        setPermissionDenied(true);
        setIsPreparing(false);
        Alert.alert(
          'Microphone Permission Required',
          'SayWise needs microphone access to record and analyze your speaking practice. Please grant microphone permission to continue.'
        );
        return;
      }

      // Prepare and start recording
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      setIsRecording(true);
      setDurationSec(0);
      startTimeRef.current = Date.now();

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDurationSec(elapsed);
      }, 1000);
    } catch (error) {
      console.warn('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Unable to start recording. Please check microphone settings and try again.');
    } finally {
      setIsPreparing(false);
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await audioRecorder.stop();
      setIsRecording(false);

      const totalDuration = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
      const recordedUri = audioRecorder.uri || `temp_rec_${Date.now()}.m4a`;
      activeUriRef.current = recordedUri;

      // Guard: very short recording
      if (totalDuration < 2) {
        Alert.alert(
          'Recording Too Short',
          'Please read the full paragraph aloud so we can accurately evaluate your pronunciation and pacing.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                recordingService.deleteTemporaryAudio(recordedUri);
                setDurationSec(0);
              },
            },
          ]
        );
        return;
      }

      onFinishRecording(recordedUri, totalDuration);
    } catch (error) {
      console.warn('Failed to stop recording:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', 'Failed to complete audio recording. Please try again.');
    }
  };

  const handleBackPress = () => {
    if (isRecording) {
      Alert.alert(
        'Stop Recording?',
        'Navigating away will discard your current recording.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard & Go Back',
            style: 'destructive',
            onPress: async () => {
              if (timerRef.current) clearInterval(timerRef.current);
              try {
                await audioRecorder.stop();
                if (audioRecorder.uri) {
                  await recordingService.deleteTemporaryAudio(audioRecorder.uri);
                }
              } catch {
                // Ignore
              }
              onBack();
            },
          },
        ]
      );
    } else {
      onBack();
    }
  };

  const getDifficultyBadge = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return { label: 'Beginner', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700' };
      case 'intermediate':
        return { label: 'Intermediate', bgClass: 'bg-blue-50', textClass: 'text-blue-700' };
      case 'advanced':
        return { label: 'Advanced', bgClass: 'bg-purple-50', textClass: 'text-purple-700' };
    }
  };

  const badge = getDifficultyBadge();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Top Header */}
      <Header
        onBack={handleBackPress}
        title="Speaking Challenge"
        rightElement={
          <View className={`px-2.5 py-1 rounded-full ${badge.bgClass}`}>
            <Text className={`text-xs font-bold uppercase tracking-wider ${badge.textClass}`}>{badge.label}</Text>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge Header Info */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1">
            DAILY CHALLENGE
          </Text>
          <Text className="text-2xl font-extrabold text-slate-900 leading-8 mb-1">{challenge.title}</Text>

          {challenge.focusAreas && (
            <View className="flex-row flex-wrap gap-1.5 mt-1">
              {challenge.focusAreas.map((area, index) => (
                <View key={index} className="flex-row items-center bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <Ionicons name="sparkles-outline" size={12} color="#4F46E5" style={{ marginRight: 4 }} />
                  <Text className="text-[11px] text-slate-600 font-medium">{area}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Focus Paragraph Card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm my-3">
          <View className="flex-row items-center gap-2 mb-3.5">
            <Ionicons name="volume-medium-outline" size={18} color="#6366F1" />
            <Text className="text-xs font-extrabold text-indigo-600 tracking-wider uppercase">READ ALOUD CLEARLY</Text>
          </View>
          <Text className="text-xl text-slate-900 leading-9 font-normal">{challenge.paragraph}</Text>
        </View>

        {/* Permission Denied Warning */}
        {permissionDenied && (
          <View className="flex-row items-center bg-red-50 p-4 rounded-2xl border border-red-200 mt-3">
            <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-xs text-red-700 flex-1 font-medium">
              Microphone permission is required to complete this speaking challenge.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Recording Section */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-xl">
        {isRecording ? (
          <View className="w-full">
            <RecordingVisualizer durationSec={durationSec} />
            <Button
              title="Stop Reading"
              onPress={handleStopRecording}
              variant="danger"
              size="lg"
              icon={<Ionicons name="stop" size={18} color="#FFFFFF" />}
              className="mt-1"
            />
          </View>
        ) : (
          <View className="w-full">
            <Button
              title="Start Reading"
              onPress={handleStartRecording}
              variant="primary"
              size="lg"
              loading={isPreparing}
              icon={<Ionicons name="mic" size={22} color="#FFFFFF" />}
            />
          </View>
        )}
      </View>
    </View>
  );
};
