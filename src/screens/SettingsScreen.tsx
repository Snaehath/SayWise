import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ActivityDay, challengeStorage, UserLevelInfo } from '../storage/challengeStorage';
import { Difficulty } from '../types/challenge';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo>(challengeStorage.getLevelInfo());
  const [totalWords, setTotalWords] = useState(challengeStorage.getTotalWordsSpoken());
  const [totalMinutes, setTotalMinutes] = useState(challengeStorage.getTotalMinutesPracticed());
  const [activityMap, setActivityMap] = useState<ActivityDay[]>(challengeStorage.get30DayActivityMap());

  const handleSelectDifficulty = (diff: Difficulty) => {
    if (diff === 'intermediate' && !levelInfo.isIntermediateUnlocked) {
      Alert.alert(
        'Tier Locked 🔒',
        `Intermediate mode unlocks automatically at Level 5. You are currently Level ${levelInfo.level}!`,
        [{ text: 'Got It', style: 'default' }]
      );
      return;
    }

    if (diff === 'advanced' && !levelInfo.isAdvancedUnlocked) {
      Alert.alert(
        'Tier Locked 🔒',
        `Advanced mode unlocks at Level 10. Keep practicing daily to earn XP and level up!`,
        [{ text: 'Got It', style: 'default' }]
      );
      return;
    }

    challengeStorage.setSelectedDifficulty(diff);
    setLevelInfo(challengeStorage.getLevelInfo());
  };

  const handleResetDev = () => {
    Alert.alert(
      'Reset All Progress',
      'This will reset your level back to Level 1, clear completed challenges, streak, and locking state.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            challengeStorage.resetAppProgress();
            setLevelInfo(challengeStorage.getLevelInfo());
            setTotalWords(0);
            setTotalMinutes(0);
            setActivityMap(challengeStorage.get30DayActivityMap());
          },
        },
      ]
    );
  };

  const completedDaysCount = activityMap.filter((a) => a.completed).length;

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header title="Settings & Level" onBack={onBack} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Level Card */}
        <View className="bg-indigo-600 rounded-3xl p-6 shadow-md shadow-indigo-500/25 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs font-bold text-indigo-200 uppercase tracking-wider">SPEAKER STATUS</Text>
              <View className="flex-row items-center gap-2 mt-0.5">
                <Text className="text-2xl font-extrabold text-white">
                  Level {levelInfo.level}
                </Text>
                <Text className="text-sm font-bold text-indigo-200">•</Text>
                <Text className="text-sm font-extrabold text-emerald-300">
                  {levelInfo.totalXP} XP
                </Text>
              </View>
            </View>
            <View className="bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30">
              <Text className="text-xs font-extrabold text-white">{levelInfo.title}</Text>
            </View>
          </View>

          {/* Progress Bar towards Next Level / Unlock */}
          {levelInfo.level < 10 ? (
            <View>
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-xs font-medium text-indigo-100">
                  {levelInfo.nextUnlockName ? `Next Tier (${levelInfo.nextUnlockName}):` : 'To Next Level:'}
                </Text>
                <Text className="text-xs font-extrabold text-white">
                  {levelInfo.totalXP} / {levelInfo.nextLevelXP} XP
                </Text>
              </View>
              <View className="h-2 bg-indigo-900/40 rounded-full overflow-hidden">
                <View
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${levelInfo.levelProgressPercent}%` }}
                />
              </View>
            </View>
          ) : (
            <View className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <Text className="text-xs font-bold text-emerald-300 text-center">
                🏆 All Difficulty Tiers Unlocked!
              </Text>
            </View>
          )}
        </View>

        {/* Difficulty Tier Preferences */}
        <View className="mb-5">
          <Text className="text-lg font-extrabold text-slate-900 mb-1">Difficulty Tiers</Text>
          <Text className="text-xs text-slate-500 font-medium mb-3.5">
            Higher tiers unlock automatically as your level increases.
          </Text>

          {/* 1. Beginner */}
          <Pressable
            onPress={() => handleSelectDifficulty('beginner')}
            className={`rounded-2xl border p-4 mb-3 flex-row items-center justify-between ${
              levelInfo.activeDifficulty === 'beginner'
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center mr-3">
                <Ionicons name="leaf" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-extrabold text-slate-900">Beginner</Text>
                  <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-extrabold text-emerald-800 uppercase">A1 - A2</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 mt-0.5">Short sentences & core pronunciation</Text>
              </View>
            </View>
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                levelInfo.activeDifficulty === 'beginner'
                  ? 'bg-emerald-600 border-emerald-600'
                  : 'border-slate-300'
              }`}
            >
              {levelInfo.activeDifficulty === 'beginner' && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

          {/* 2. Intermediate */}
          <Pressable
            onPress={() => handleSelectDifficulty('intermediate')}
            className={`rounded-2xl border p-4 mb-3 flex-row items-center justify-between ${
              !levelInfo.isIntermediateUnlocked
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : levelInfo.activeDifficulty === 'intermediate'
                ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center mr-3">
                <Ionicons name="flash" size={20} color="#2563EB" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-extrabold text-slate-900">Intermediate</Text>
                  <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-extrabold text-blue-800 uppercase">B1 - B2</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {levelInfo.isIntermediateUnlocked
                    ? 'Conversational rhythm & sentence linking'
                    : '🔒 Unlocks at Level 5'}
                </Text>
              </View>
            </View>
            {levelInfo.isIntermediateUnlocked ? (
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  levelInfo.activeDifficulty === 'intermediate'
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-300'
                }`}
              >
                {levelInfo.activeDifficulty === 'intermediate' && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            ) : (
              <Ionicons name="lock-closed" size={18} color="#94A3B8" />
            )}
          </Pressable>

          {/* 3. Advanced */}
          <Pressable
            onPress={() => handleSelectDifficulty('advanced')}
            className={`rounded-2xl border p-4 mb-3 flex-row items-center justify-between ${
              !levelInfo.isAdvancedUnlocked
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : levelInfo.activeDifficulty === 'advanced'
                ? 'bg-purple-50/70 border-purple-500 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center mr-3">
                <Ionicons name="trophy" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-extrabold text-slate-900">Advanced</Text>
                  <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-extrabold text-purple-800 uppercase">C1 - C2</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {levelInfo.isAdvancedUnlocked
                    ? 'Complex phrasing & native mastery'
                    : '🔒 Unlocks at Level 10'}
                </Text>
              </View>
            </View>
            {levelInfo.isAdvancedUnlocked ? (
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  levelInfo.activeDifficulty === 'advanced'
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-slate-300'
                }`}
              >
                {levelInfo.activeDifficulty === 'advanced' && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            ) : (
              <Ionicons name="lock-closed" size={18} color="#94A3B8" />
            )}
          </Pressable>
        </View>

        {/* 📅 30-Day Vocal Habit Activity Heatmap (GitHub Style) */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={18} color="#6366F1" />
              <Text className="text-sm font-extrabold text-slate-900">30-Day Activity History</Text>
            </View>
            <View className="bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              <Text className="text-xs font-bold text-indigo-700">{completedDaysCount} / 30 Days</Text>
            </View>
          </View>

          {/* 30-Day Uniform Grid (6 x 5) */}
          <View className="flex-row flex-wrap gap-2 justify-center">
            {activityMap.map((day, idx) => (
              <View
                key={idx}
                className={`w-7 h-7 rounded-xl items-center justify-center ${
                  day.completed
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/25 border border-emerald-600'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              >
                {day.completed ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Overall Lifetime Stats */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
          <Text className="text-sm font-extrabold text-slate-900 mb-3">Lifetime Stats</Text>
          <View className="flex-row justify-between items-center py-1">
            <Text className="text-xs text-slate-500 font-semibold">Total Spoken Words</Text>
            <Text className="text-sm font-extrabold text-indigo-600">~{totalWords}</Text>
          </View>
          <View className="h-[1px] bg-slate-100 my-2" />
          <View className="flex-row justify-between items-center py-1">
            <Text className="text-xs text-slate-500 font-semibold">Practice Time</Text>
            <Text className="text-sm font-extrabold text-emerald-600">{totalMinutes} min</Text>
          </View>
          <View className="h-[1px] bg-slate-100 my-2" />
          <View className="flex-row justify-between items-center py-1">
            <Text className="text-xs text-slate-500 font-semibold">Total Days Practiced</Text>
            <Text className="text-sm font-extrabold text-amber-600">🎙️ {levelInfo.totalCompletedDays} Days</Text>
          </View>
        </View>

        {/* Dev Reset Utility */}
        <View className="items-center">
          <Pressable onPress={handleResetDev} className="py-2 px-4 flex-row items-center">
            <Ionicons name="refresh-outline" size={15} color="#94A3B8" style={{ marginRight: 6 }} />
            <Text className="text-xs font-semibold text-slate-400">Reset App Progress (Testing)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
