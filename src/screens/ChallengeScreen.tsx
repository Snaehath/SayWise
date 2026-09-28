import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mascot } from '../components/Mascot';
import { WaveformDisplay } from '../components/WaveformDisplay';
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

  const isRead = challenge.type === 'read';
  const initialPrep = !isRead ? (challenge.prepSeconds || 10) : 0;

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(initialPrep);
  const [isPrepping, setIsPrepping] = useState(initialPrep > 0);

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
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Clean Minimal Apple Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <TouchableOpacity
          onPress={handleCancelSession}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-xs"
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text className="text-base font-extrabold text-slate-900 tracking-tight">
          {isRead ? 'Reading Practice' : 'Speaking Practice'}
        </Text>

        <TouchableOpacity
          onPress={showHelp}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-xs"
        >
          <Ionicons name="help-circle-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Apple-grade Passage / Prompt Card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 26,
            padding: 22,
            borderWidth: 1.5,
            borderColor: isRecording ? '#C7D2FE' : '#F1F5F9',
            shadowColor: isRecording ? '#4F46E5' : '#312E81',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isRecording ? 0.08 : 0.04,
            shadowRadius: 16,
            elevation: 3,
            marginBottom: 16,
          }}
        >
          {/* Card Title Row with subtle Duration badge */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-black text-slate-900 tracking-tight leading-snug flex-1 mr-2">
              {challenge.title}
            </Text>
            <View className="flex-row items-center bg-slate-100/90 px-2.5 py-1 rounded-full">
              <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-slate-500">~1 min</Text>
            </View>
          </View>

          {/* Passage or Prompt Text with Apple Books typography */}
          {isRead ? (
            <Text
              style={{
                fontSize: 17,
                lineHeight: 28,
                color: '#0F172A',
                letterSpacing: -0.2,
                fontWeight: '400',
              }}
            >
              "{challenge.paragraph || challenge.prompt}"
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 26,
                color: '#334155',
                fontWeight: '400',
              }}
            >
              {challenge.context || challenge.prompt || 'Gather your thoughts. When ready, speak naturally until you finish.'}
            </Text>
          )}
        </View>

        {/* Prep Countdown Card (Speak Mode Only) */}
        {isPrepping && prepSecondsLeft > 0 && !isRecording && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: 14,
              borderWidth: 1,
              borderColor: '#EEF2F6',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-2.5">
                <Ionicons name="timer-outline" size={18} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-900">Prepare thoughts</Text>
                <Text className="text-xs font-semibold text-indigo-600 mt-0.5">
                  Starting in {prepSecondsLeft}s...
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleStartRecording}
              activeOpacity={0.85}
              className="px-3.5 py-1.5 rounded-full bg-indigo-600"
            >
              <Text className="text-xs font-bold text-white">Ready</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live Acoustic Stage when Recording */}
        {isRecording && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: '#F1F5F9',
              shadowColor: '#4338CA',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            {/* Live Timer & Target Row */}
            <View className="flex-row items-center gap-2 mb-2">
              <View className="flex-row items-center bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-full">
                <View className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                <Text className="text-xs font-extrabold text-rose-950 font-mono tracking-wider">
                  {formatTimer(durationSec)}
                </Text>
              </View>
              <View className="bg-slate-100/90 px-2.5 py-1 rounded-full">
                <Text className="text-[11px] font-semibold text-slate-500">Target ~1 min</Text>
              </View>
            </View>

            {/* Mascot listening + Acoustic Soundwave in compact inline row */}
            <View className="flex-row items-center justify-center w-full py-1">
              <View className="mr-3">
                <Mascot size={54} variant="listening" />
              </View>
              <View className="flex-1 items-center">
                <WaveformDisplay animated={true} height={28} barCount={19} color="#4F46E5" />
              </View>
            </View>
          </View>
        )}

        {permissionDenied && (
          <View className="flex-row items-center bg-rose-50 p-3.5 rounded-2xl border border-rose-200 mb-3">
            <Ionicons name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-xs text-rose-700 flex-1 font-medium">
              Microphone permission is required to evaluate your speaking session.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FIXED Bottom Sticky Action Bar (Zero Scrolling Required!) */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 8, 20),
          backgroundColor: '#F8FAFC',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
        }}
      >
        {isRecording ? (
          <TouchableOpacity
            onPress={handleStopRecording}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#4F46E5',
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#4F46E5',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.28,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white text-[15px] font-bold tracking-wide">
              Finish ✓
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStartRecording}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#4F46E5',
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#4F46E5',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Ionicons
              name={isRead ? 'book-outline' : 'mic'}
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[15px] font-bold tracking-wide">
              {isRead ? 'Start reading' : 'Start speaking'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleCancelSession}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-full py-2.5 items-center mt-0.5"
        >
          <Text className="text-xs font-semibold text-slate-400">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
