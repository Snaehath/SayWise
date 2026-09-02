import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { RecordingVisualizer } from '../components/RecordingVisualizer';
import { recordingService } from '../services/recordingService';
import { Challenge } from '../types/challenge';

// types
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
  // hooks
  const insets = useSafeAreaInsets();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // state
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(challenge.prepSeconds || (challenge.type === 'talk' ? 10 : 0));
  const [isPrepping, setIsPrepping] = useState(challenge.type === 'talk');

  // refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const activeUriRef = useRef<string | null>(null);

  // handlers
  const handleStartRecording = async () => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    setIsPrepping(false);
    setIsPreparing(true);
    setPermissionDenied(false);

    try {
      const permission = await recordingService.requestPermission();
      if (!permission) {
        setPermissionDenied(true);
        setIsPreparing(false);
        Alert.alert(
          'Microphone Permission Required',
          'SayWise needs microphone access to record and evaluate your speaking session.'
        );
        return;
      }

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      setIsRecording(true);
      setDurationSec(0);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDurationSec(elapsed);
      }, 1000);
    } catch (error) {
      console.warn('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Unable to start recording. Please try again.');
    } finally {
      setIsPreparing(false);
    }
  };

  // effects
  useEffect(() => {
    if (isPrepping && prepSecondsLeft > 0) {
      prepTimerRef.current = setInterval(() => {
        setPrepSecondsLeft((prev) => {
          if (prev <= 1) {
            if (prepTimerRef.current) clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
            handleStartRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    };
  }, [isPrepping]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      try {
        if (audioRecorder.isRecording) {
          audioRecorder.stop();
        }
      } catch {
        // cleanup
      }
    };
  }, []);

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const uri = audioRecorder.uri;
      activeUriRef.current = uri;

      await audioRecorder.stop();
      setIsRecording(false);

      const finalDuration = Math.max(1, durationSec);

      if (finalDuration < 3) {
        Alert.alert('Speech Too Short', 'Please speak for at least 3 seconds so the coach can evaluate your cadence.');
        return;
      }

      if (uri) {
        onFinishRecording(uri, finalDuration);
      } else {
        Alert.alert('Audio Error', 'Recording not found. Please try again.');
      }
    } catch (error) {
      console.warn('Failed to stop recording:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', 'Unable to finalize recording.');
    }
  };

  const getModalityInfo = () => {
    if (challenge.type === 'read') {
      return {
        badge: 'READ ALOUD',
        instruction: 'Read clearly with natural pauses',
        icon: 'book-outline',
        color: '#4F46E5',
      };
    }
    return {
      badge: 'TALK FREELY',
      instruction: 'Express your thoughts spontaneously',
      icon: 'mic-outline',
      color: '#D97706',
    };
  };

  const modality = getModalityInfo();

  // render
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header
        title={challenge.title}
        onBack={isRecording ? undefined : onBack}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* modality banner */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Ionicons name={modality.icon as unknown as keyof typeof Ionicons.glyphMap} size={14} color={modality.color} />
            <Text className="text-[11px] font-extrabold ml-1.5 uppercase" style={{ color: modality.color }}>
              {modality.badge}
            </Text>
          </View>

          <Text className="text-xs font-semibold text-slate-400">
            ~{challenge.estimatedDurationSec || 45}s target
          </Text>
        </View>

        {/* focus pill */}
        {challenge.focusTarget && (
          <View className="bg-indigo-50/80 rounded-2xl p-3.5 mb-4 border border-indigo-100 flex-row items-center">
            <Ionicons name="sparkles" size={16} color="#4F46E5" />
            <View className="ml-2.5 flex-1">
              <Text className="text-[10px] font-extrabold text-indigo-700 tracking-wider uppercase">Coach Focus Target</Text>
              <Text className="text-xs font-bold text-indigo-950 mt-0.5">{challenge.focusTarget}</Text>
            </View>
          </View>
        )}

        {/* text card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name={modality.icon as unknown as keyof typeof Ionicons.glyphMap} size={18} color="#6366F1" />
            <Text className="text-xs font-extrabold text-indigo-600 tracking-wider uppercase ml-2">
              {modality.instruction}
            </Text>
          </View>

          <Text className="text-xl text-slate-900 leading-9 font-normal">
            {challenge.paragraph || challenge.prompt}
          </Text>

          {challenge.context && (
            <View className="mt-4 pt-3 border-t border-slate-100 flex-row items-start">
              <Ionicons name="information-circle-outline" size={16} color="#64748B" style={{ marginTop: 2 }} />
              <Text className="text-xs text-slate-500 font-medium ml-1.5 flex-1 leading-5">
                {challenge.context}
              </Text>
            </View>
          )}
        </View>

        {/* prep banner */}
        {isPrepping && prepSecondsLeft > 0 && !isRecording && (
          <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1 pr-2">
              <Ionicons name="timer-outline" size={22} color="#D97706" />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-extrabold text-amber-950">Organize your thoughts</Text>
                <Text className="text-[11px] font-semibold text-amber-700 mt-0.5">Recording begins in {prepSecondsLeft}s...</Text>
              </View>
            </View>
            <Pressable
              onPress={handleStartRecording}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              unstable_pressDelay={0}
              className="px-3.5 py-2 rounded-xl bg-amber-600 active:opacity-80"
            >
              <Text className="text-xs font-extrabold text-white">Ready Now</Text>
            </Pressable>
          </View>
        )}

        {/* permission alert */}
        {permissionDenied && (
          <View className="flex-row items-center bg-red-50 p-4 rounded-2xl border border-red-200 mt-2">
            <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-xs text-red-700 flex-1 font-medium">
              Microphone permission is required to record your speaking session.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* recording controls */}
      <View className="bg-white px-5 pt-4 pb-6 border-t border-slate-200 shadow-xl">
        {isRecording ? (
          <View className="w-full">
            <RecordingVisualizer durationSec={durationSec} />
            <Button
              title="Finish Speaking"
              onPress={handleStopRecording}
              variant="danger"
              size="lg"
              icon="stop"
            />
          </View>
        ) : (
          <View className="w-full">
            <Button
              title={isPrepping ? `Start Speaking Now (${prepSecondsLeft}s)` : 'Start Speaking'}
              onPress={handleStartRecording}
              variant="primary"
              size="lg"
              loading={isPreparing}
              icon="mic"
            />
          </View>
        )}
      </View>
    </View>
  );
};
