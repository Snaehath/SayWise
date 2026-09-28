import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mascot } from '../components/Mascot';
import { WaveformDisplay } from '../components/WaveformDisplay';
import { challengeService } from '../services/challengeService';
import { recordingService } from '../services/recordingService';
import { Challenge, PracticeMode } from '../types/challenge';

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

  // Challenge and mode state (allows switching between Read and Speak directly!)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenge);
  const isRead = currentChallenge.type === 'read';

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(
    currentChallenge.prepSeconds || (isRead ? 0 : 10)
  );
  const [isPrepping, setIsPrepping] = useState(!isRead);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const activeUriRef = useRef<string | null>(null);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const handleToggleMode = (newMode: PracticeMode) => {
    if (isRecording) return;
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    const newChallenge = challengeService.getTodayChallenge(undefined, newMode);
    setCurrentChallenge(newChallenge);
    setIsPrepping(newMode === 'talk');
    setPrepSecondsLeft(newMode === 'talk' ? 10 : 0);
  };

  const handleStartRecording = async () => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    setIsPrepping(false);
    setPermissionDenied(false);

    try {
      const permission = await recordingService.requestPermission();
      if (!permission) {
        setPermissionDenied(true);
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
    }
  };

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
        Alert.alert(
          'Speech Too Short',
          'Please speak for at least 3 seconds so the coach can evaluate your cadence.'
        );
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

  const handleCancelSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    try {
      if (audioRecorder.isRecording) {
        audioRecorder.stop();
      }
    } catch {
      // ignore
    }
    onBack();
  };

  const showHelp = () => {
    Alert.alert(
      isRead ? 'Reading Practice Guide' : 'Spontaneous Speech Guide',
      isRead
        ? 'Read the passage out loud at a comfortable, natural pace. Focus on deliberate pauses between ideas.'
        : 'Take a few moments to gather your thoughts. When the recording begins, share your experience freely and clearly.'
    );
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Header with Breadcrumb Stepper */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={handleCancelSession}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/60"
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        {/* Stepper indicator: Think > Read/Speak > Coach */}
        <View className="flex-row items-center">
          <Text className="text-xs font-semibold text-slate-400">Think</Text>
          <Text className="text-xs text-slate-300 mx-2">›</Text>
          <TouchableOpacity
            disabled={isRecording}
            onPress={() => handleToggleMode(isRead ? 'talk' : 'read')}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            className="flex-row items-center bg-indigo-50 px-2 py-0.5 rounded-md"
          >
            <Text className="text-xs font-bold text-indigo-600">
              {isRead ? 'Read' : 'Speak'}
            </Text>
            {!isRecording && (
              <Ionicons name="swap-horizontal" size={12} color="#4F46E5" style={{ marginLeft: 3 }} />
            )}
          </TouchableOpacity>
          <Text className="text-xs text-slate-300 mx-2">›</Text>
          <Text className="text-xs font-semibold text-slate-400">Coach</Text>
        </View>

        <TouchableOpacity
          onPress={showHelp}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/60"
        >
          <Ionicons name="help-circle-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge & Mode Switch Toggle */}
        <View className="flex-row items-center justify-between mb-3">
          {isRead ? (
            <View className="flex-row items-center bg-emerald-50/90 border border-emerald-200/80 px-3 py-1 rounded-full">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-[11px] font-black text-emerald-800 tracking-wider">
                YOUR PASSAGE · CADENCE & ARTICULATION
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-2" />
              <Text className="text-[11px] font-black text-indigo-700 tracking-wider">
                YOUR PROMPT
              </Text>
            </View>
          )}

          {/* Quick Mode Switcher button (when not recording) */}
          {!isRecording && (
            <TouchableOpacity
              onPress={() => handleToggleMode(isRead ? 'talk' : 'read')}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 flex-row items-center shadow-xs"
            >
              <Ionicons
                name={isRead ? 'mic-outline' : 'book-outline'}
                size={12}
                color="#64748B"
                style={{ marginRight: 4 }}
              />
              <Text className="text-[11px] font-bold text-slate-600">
                {isRead ? 'Switch to Speak' : 'Switch to Read'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Card */}
        <View className="bg-white rounded-[26px] p-6 border border-slate-200/80 shadow-sm shadow-slate-100 mb-5">
          {/* Card Title Row */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-black text-slate-900 flex-1 mr-2">
              {currentChallenge.title}
            </Text>
            {isRead && (
              <Ionicons name="volume-medium-outline" size={20} color="#6366F1" />
            )}
          </View>

          {/* Passage or Prompt Text */}
          {isRead ? (
            <Text className="text-base text-slate-800 leading-7 font-normal">
              "{currentChallenge.paragraph || currentChallenge.prompt}"
            </Text>
          ) : (
            <Text className="text-sm text-slate-500 leading-relaxed font-normal">
              {currentChallenge.context || currentChallenge.prompt || 'Think for 10 seconds. When you are ready, speak continuously until the timer stops.'}
            </Text>
          )}

          {/* Prompt instruction footer box */}
          {isRead ? (
            <View className="mt-4 pt-3 border-t border-slate-100 flex-row items-start">
              <Ionicons name="sparkles" size={15} color="#4F46E5" style={{ marginTop: 2, marginRight: 8 }} />
              <Text className="text-xs text-slate-500 flex-1 leading-5">
                Read at a steady, natural pace. The coach is listening to rhythm, clarity, and breath control.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Prep Banner if counting down */}
        {isPrepping && prepSecondsLeft > 0 && !isRecording && (
          <View className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1 pr-2">
              <Ionicons name="timer-outline" size={22} color="#4F46E5" />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-bold text-indigo-950">Think & organize</Text>
                <Text className="text-[11px] font-semibold text-indigo-700 mt-0.5">
                  Speaking starts in {prepSecondsLeft}s...
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleStartRecording}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 active:opacity-80"
            >
              <Text className="text-xs font-bold text-white">Ready now</Text>
            </Pressable>
          </View>
        )}

        {/* Active Listening / Recording Mascot Zone */}
        {isRecording ? (
          <View className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-sm items-center mb-5">
            {/* Live Timer Row */}
            <View className="w-full flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 animate-pulse" />
                <Text className="text-base font-extrabold text-slate-900 font-mono tracking-wider">
                  {formatTimer(durationSec)}
                </Text>
              </View>

              <View className="bg-slate-100 px-3 py-1 rounded-full">
                <Text className="text-[11px] font-bold text-slate-600">
                  {isRead ? 'Reading aloud...' : 'Keep speaking...'}
                </Text>
              </View>
            </View>

            {/* Mascot Center Stage */}
            <View className="my-2">
              <Mascot size={130} variant="listening" />
            </View>

            {/* Dynamic Sound Waveform beneath mascot */}
            <View className="py-2 w-full items-center">
              <WaveformDisplay animated={true} height={32} barCount={23} />
            </View>

            {/* Listening status text */}
            <View className="flex-row items-center mt-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <Ionicons name="ear-outline" size={15} color="#6366F1" style={{ marginRight: 6 }} />
              <Text className="text-xs font-medium text-slate-600">
                {isRead
                  ? 'Listening closely · Tracking cadence, pauses & clarity'
                  : 'Listening closely · Finding one thing to help you improve'}
              </Text>
            </View>
          </View>
        ) : !isPrepping ? (
          /* Ready to start speaking prompt card */
          <View className="bg-white rounded-[26px] p-6 border border-slate-200/80 shadow-sm items-center mb-5">
            <Mascot size={110} variant="default" />
            <Text className="text-sm font-bold text-slate-800 mt-2">
              Coach Pip is ready
            </Text>
            <Text className="text-xs text-slate-400 text-center mt-0.5 px-4">
              Tap start below and speak naturally when ready.
            </Text>
          </View>
        ) : null}

        {permissionDenied && (
          <View className="flex-row items-center bg-rose-50 p-4 rounded-2xl border border-rose-200 mt-2 mb-4">
            <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-xs text-rose-700 flex-1 font-medium">
              Microphone permission is required to evaluate your speaking session.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full mt-2">
          {isRecording ? (
            <TouchableOpacity
              onPress={handleStopRecording}
              activeOpacity={0.85}
              className="w-full bg-indigo-600 py-4 rounded-full items-center justify-center shadow-lg shadow-indigo-200"
            >
              <Text className="text-white text-base font-bold">
                Finish ✓
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStartRecording}
              activeOpacity={0.85}
              className="w-full bg-indigo-600 py-4 rounded-full items-center justify-center shadow-lg shadow-indigo-200"
            >
              <Text className="text-white text-base font-bold">
                {isRead ? 'Start reading aloud' : 'Start speaking'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleCancelSession}
            activeOpacity={0.7}
            className="w-full py-3 items-center mt-2"
          >
            <Text className="text-xs font-semibold text-slate-400">
              Cancel session
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
