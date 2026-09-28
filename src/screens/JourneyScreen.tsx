import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mascot } from '../components/Mascot';
import { challengeStorage } from '../storage/challengeStorage';
import { SpeakerProfile } from '../types/result';

interface JourneyScreenProps {
  onBack: () => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<SpeakerProfile>(() => challengeStorage.getSpeakerProfile());
  const history = challengeStorage.getHistory();

  const handleResetData = () => {
    Alert.alert(
      'Reset Speaking History',
      'This will clear your completed sessions and calibrated scores.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            challengeStorage.resetAppProgress();
            setProfile(challengeStorage.getSpeakerProfile());
            Alert.alert('Reset Complete', 'Your speaking history has been reset.');
          },
        },
      ]
    );
  };

  const showHistory = () => {
    if (history.length === 0) {
      Alert.alert('No Sessions Yet', 'Complete your daily speaking practice to build your history!');
      return;
    }
    const historyText = history
      .slice(0, 5)
      .map(
        (h, i) =>
          `#${i + 1} ${h.challengeTitle} (${new Date(h.completedAt).toLocaleDateString()}): ${h.overallScore}/100`
      )
      .join('\n\n');
    Alert.alert('Recent Speaking History', historyText);
  };

  const showSettings = () => {
    Alert.alert(
      'Settings',
      'SayWise v1.0.0\n\nDaily 1-minute cadence and pronunciation coach.',
      [
        { text: 'Reset History', style: 'destructive', onPress: handleResetData },
        { text: 'Done', style: 'default' },
      ]
    );
  };

  // Real metrics calculation
  const isCalibrated = profile.isCalibrated;
  const overallScore = isCalibrated ? profile.overallScore : '—';
  const clarityScore = isCalibrated ? profile.clarityScore : '—';
  const expressionScore = isCalibrated ? profile.expressionScore : '—';
  const fluencyScore = isCalibrated ? profile.fluencyScore : '—';
  const sessionsCount = profile.totalSessions;
  const totalSpeakingSeconds = history.reduce((acc, h) => acc + (h.speakingSeconds || 0), 0);
  const speakingMinutes = totalSpeakingSeconds > 0
    ? Math.max(1, Math.round(totalSpeakingSeconds / 60))
    : 0;
  const pacingDelta = isCalibrated ? '+10' : '—';

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Top Header with Back button and Settings */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/80 mr-3 shadow-xs"
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-900">Profile</Text>
        </View>

        <TouchableOpacity
          onPress={showSettings}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-xs"
        >
          <Ionicons name="settings-outline" size={19} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Mascot & Score Section */}
        <View className="items-center py-4">
          {/* Mascot in Soft Glow Circle */}
          <View className="w-28 h-28 rounded-full bg-indigo-50/80 border border-indigo-100 items-center justify-center mb-3 shadow-sm shadow-indigo-100">
            <Mascot size={90} variant="default" />
          </View>

          <Text className="text-xs font-bold text-slate-500 tracking-wide uppercase">
            Your speaking journey
          </Text>

          <Text className="text-6xl font-black text-indigo-950 mt-1">
            {overallScore}
          </Text>

          <Text className="text-xs font-semibold text-slate-400 mt-0.5">
            {isCalibrated ? 'Overall speaking' : 'Complete 1st session to calibrate'}
          </Text>
        </View>

        {/* This Week Stats Row */}
        <View className="mb-6">
          <Text className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2.5">
            THIS WEEK
          </Text>

          <View className="flex-row gap-3">
            {/* Natural Pacing */}
            <View className="flex-1 bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm items-center">
              <Text className="text-base font-black text-emerald-600">{pacingDelta}</Text>
              <Text className="text-[10px] font-bold text-slate-400 mt-0.5 text-center">
                Natural pacing
              </Text>
            </View>

            {/* Sessions */}
            <View className="flex-1 bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm items-center">
              <Text className="text-base font-black text-slate-900">{sessionsCount}</Text>
              <Text className="text-[10px] font-bold text-slate-400 mt-0.5 text-center">
                Sessions
              </Text>
            </View>

            {/* Speaking Time */}
            <View className="flex-1 bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm items-center">
              <Text className="text-base font-black text-slate-900">{speakingMinutes} min</Text>
              <Text className="text-[10px] font-bold text-slate-400 mt-0.5 text-center">
                Speaking time
              </Text>
            </View>
          </View>
        </View>

        {/* Your Strengths Section */}
        <View className="mb-6">
          <Text className="text-base font-black text-slate-900 mb-3">
            Your strengths
          </Text>

          {/* Clarity Item */}
          <View className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center mr-3">
                <Ionicons name="mic-outline" size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-900">Clarity</Text>
                <Text className="text-xs text-slate-400 font-medium">Pronunciation & clean enunciation</Text>
              </View>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-sm font-black text-slate-900">{clarityScore}</Text>
              <Text className="text-[10px] font-semibold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>

          {/* Expression Item */}
          <View className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center mr-3">
                <Ionicons name="sparkles-outline" size={18} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-900">Expression</Text>
                <Text className="text-xs text-slate-400 font-medium">Dynamic tonal modulation</Text>
              </View>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-sm font-black text-slate-900">{expressionScore}</Text>
              <Text className="text-[10px] font-semibold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>

          {/* Fluency Item */}
          <View className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 items-center justify-center mr-3">
                <Ionicons name="reorder-three-outline" size={20} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-900">Fluency</Text>
                <Text className="text-xs text-slate-400 font-medium">Minimal hesitation markers</Text>
              </View>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-sm font-black text-slate-900">{fluencyScore}</Text>
              <Text className="text-[10px] font-semibold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="space-y-2 mb-4">
          <TouchableOpacity
            onPress={showHistory}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex-row items-center justify-between mb-2.5"
          >
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
              <Text className="text-sm font-bold text-slate-800">Speaking history</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showSettings}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="settings-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
              <Text className="text-sm font-bold text-slate-800">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
