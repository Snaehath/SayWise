import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { challengeStorage } from '../storage/challengeStorage';
import { SpeakerProfile } from '../types/result';

// types
interface JourneyScreenProps {
  onBack: () => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({ onBack }) => {
  // hooks
  const insets = useSafeAreaInsets();

  // state
  const [profile, setProfile] = useState<SpeakerProfile>(() => challengeStorage.getSpeakerProfile());
  const journey = challengeStorage.getSpeakingJourney();

  // handlers
  const handleResetData = () => {
    Alert.alert(
      'Reset Speaking History',
      'This will clear your completed sessions and personal bests.',
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

  // render
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header title="Your Speaking Profile" onBack={onBack} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* overall card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <View>
              <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
                OVERALL PROFILE
              </Text>
              <Text className="text-sm font-extrabold text-slate-700 mt-0.5">
                {profile.growthSummary}
              </Text>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-black text-slate-900">{profile.overallScore}</Text>
              <Text className="text-xs font-bold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>

          {/* metrics */}
          <View className="space-y-2 mb-3">
            <MetricRow label="Fluency" score={profile.fluencyScore} />
            <MetricRow label="Clarity" score={profile.clarityScore} />
            <MetricRow label="Pacing" score={profile.pacingScore} />
            <MetricRow label="Expression" score={profile.expressionScore} />
          </View>
        </View>

        {/* focus target */}
        <View className="bg-indigo-50 rounded-3xl p-5 border border-indigo-100 mb-4">
          <View className="flex-row items-center mb-1.5">
            <Ionicons name="compass-outline" size={18} color="#4F46E5" />
            <Text className="text-xs font-extrabold text-indigo-700 uppercase tracking-wide ml-2">
              YOU'RE WORKING TOWARD
            </Text>
          </View>
          <Text className="text-base font-black text-indigo-950">
            {profile.currentFocus.targetText}
          </Text>
          <Text className="text-xs text-indigo-600 font-medium mt-1">
            Challenges adapt automatically to strengthen this skill.
          </Text>
        </View>

        {/* progression */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-4">
            SPEAKING PROGRESSION
          </Text>

          <View className="pl-2">
            {journey.stages.map((stage, idx) => {
              const isLast = idx === journey.stages.length - 1;
              return (
                <View key={stage.id} className="flex-row items-start">
                  <View className="items-center mr-3.5">
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                        stage.isCompleted
                          ? 'bg-emerald-500 border-emerald-500'
                          : stage.isCurrent
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {stage.isCompleted ? (
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      ) : stage.isCurrent ? (
                        <View className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </View>
                    {!isLast && (
                      <View
                        className={`w-0.5 h-6 my-1 ${
                          stage.isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </View>

                  <View className="pt-0.5 pb-3 flex-1">
                    <Text
                      className={`text-sm font-bold ${
                        stage.isCompleted
                          ? 'text-slate-900'
                          : stage.isCurrent
                          ? 'text-indigo-600 font-extrabold'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* week */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
              PRACTICE THIS WEEK
            </Text>
            <Text className="text-xs font-bold text-slate-700">
              {profile.sessionsThisWeek} sessions
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-2 py-2 bg-slate-50 rounded-2xl">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const active = profile.weekDots[index];
              return (
                <View key={index} className="items-center">
                  <Text className="text-[10px] font-bold text-slate-400 mb-1">{day}</Text>
                  <View
                    className={`w-3.5 h-3.5 rounded-full ${
                      active ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* personal records */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
          <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3">
            PERSONAL BESTS
          </Text>

          <View className="flex-row gap-2">
            <View className="flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase">Fluency</Text>
              <Text className="text-lg font-black text-slate-900 mt-0.5">
                {profile.personalBests.highestFluency || 84}
              </Text>
            </View>
            <View className="flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase">Clarity</Text>
              <Text className="text-lg font-black text-slate-900 mt-0.5">
                {profile.personalBests.highestClarity || 88}
              </Text>
            </View>
            <View className="flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase">Overall</Text>
              <Text className="text-lg font-black text-slate-900 mt-0.5">
                {profile.personalBests.highestOverall || 86}
              </Text>
            </View>
          </View>
        </View>

        {/* reset */}
        <Pressable
          onPress={handleResetData}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          unstable_pressDelay={0}
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 items-center active:opacity-75"
        >
          <Text className="text-xs font-bold text-rose-700">Reset Speaking History</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

// types
interface MetricRowProps {
  label: string;
  score: number;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, score }) => {
  return (
    <View className="flex-row items-center justify-between my-1">
      <Text className="text-xs font-bold text-slate-600 w-24">{label}</Text>
      <View className="flex-1 h-2 bg-slate-100 rounded-full mx-3 overflow-hidden">
        <View
          className="h-full bg-slate-800 rounded-full"
          style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
        />
      </View>
      <Text className="text-xs font-bold text-slate-800 w-8 text-right">{score}</Text>
    </View>
  );
};
