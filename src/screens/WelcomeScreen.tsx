import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage, UserLevelInfo } from '../storage/challengeStorage';
import { ChallengeResult } from '../types/result';

interface WelcomeScreenProps {
  onStartChallenge: () => void;
  onOpenSettings: () => void;
  onViewCompletedResult?: (result: ChallengeResult) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartChallenge,
  onOpenSettings,
  onViewCompletedResult,
}) => {
  const insets = useSafeAreaInsets();
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<ChallengeResult | null>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo>(challengeStorage.getLevelInfo());

  const loadState = () => {
    const completed = challengeStorage.isCompletedToday();
    const result = challengeStorage.getTodayResult();
    const hasSeen = challengeStorage.hasSeenOnboarding();
    const history = challengeStorage.getHistory();
    const words = challengeStorage.getTotalWordsSpoken();
    const minutes = challengeStorage.getTotalMinutesPracticed();
    const lvl = challengeStorage.getLevelInfo();

    setIsCompletedToday(completed);
    setTodayResult(result);
    setIsNewUser(!hasSeen && history.length === 0);
    setTotalWords(words);
    setTotalMinutes(minutes);
    setLevelInfo(lvl);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleStart = () => {
    challengeStorage.setOnboardingSeen();
    onStartChallenge();
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Brand, Permanent XP Pill & Settings Gear Button */}
        <View className="flex-row items-center justify-between mb-4 mt-1">
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-500/25 mr-3">
              <Ionicons name="mic" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-2xl font-extrabold text-slate-900 leading-7">SayWise</Text>
              <Text className="text-xs font-semibold text-slate-500">Daily Speaking Practice</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Permanent XP / Practice Pill (Zero Anxiety) */}
            <View className="flex-row items-center px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 shadow-sm">
              <Ionicons name="sparkles" size={15} color="#4F46E5" style={{ marginRight: 4 }} />
              <Text className="text-sm font-extrabold text-indigo-700">
                {levelInfo.totalXP} XP
              </Text>
            </View>

            {/* Settings Gear Button */}
            <Pressable
              onPress={onOpenSettings}
              hitSlop={10}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm active:bg-slate-100"
            >
              <Ionicons name="settings-outline" size={20} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* 🎮 Permanent Level & XP Progress Card (Boot.dev-Style) */}
        <Pressable
          onPress={onOpenSettings}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4 active:bg-slate-50"
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center border border-indigo-100">
                <Ionicons name="trophy" size={20} color="#4F46E5" />
              </View>
              <View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-base font-extrabold text-slate-900">Level {levelInfo.level}</Text>
                  <Text className="text-xs font-bold text-slate-400">•</Text>
                  <Text className="text-xs font-bold text-indigo-600">{levelInfo.totalXP} XP</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">{levelInfo.title}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <Text className="text-xs font-bold text-indigo-700 capitalize">{levelInfo.activeDifficulty}</Text>
              <Ionicons name="chevron-forward" size={12} color="#4F46E5" />
            </View>
          </View>

          {/* Progress bar towards next level (Never Resets) */}
          {levelInfo.level < 10 && (
            <View className="mt-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-semibold text-slate-500">
                  {levelInfo.nextUnlockName ? `Next Tier (${levelInfo.nextUnlockName}):` : 'To Next Rank:'}
                </Text>
                <Text className="text-xs font-extrabold text-indigo-600">
                  {levelInfo.totalXP} / {levelInfo.nextLevelXP} XP
                </Text>
              </View>
              <View className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${levelInfo.levelProgressPercent}%` }}
                />
              </View>
            </View>
          )}

          {/* Habit Encouragement Tag */}
          <View className="bg-slate-50 rounded-xl px-3 py-1.5 flex-row items-center justify-between border border-slate-200">
            {levelInfo.level === 1 ? (
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="rocket" size={14} color="#6366F1" />
                <Text className="text-[11px] font-bold text-indigo-700">First Challenge 2x Boost (Instant Level 2!)</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="shield-checkmark" size={14} color="#059669" />
                <Text className="text-[11px] font-bold text-emerald-700">
                  {levelInfo.totalCompletedDays} Practice Days Completed • Progress is Permanent
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={12} color="#94A3B8" />
          </View>
        </Pressable>

        {/* 1. NEW USER ONBOARDING HERO CARD */}
        {isNewUser && (
          <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-4">
            <View className="flex-row items-center bg-indigo-50 px-3 py-1 rounded-full self-start mb-3">
              <Ionicons name="sparkles" size={13} color="#4F46E5" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-indigo-600">Daily Speaking Habit</Text>
            </View>

            <Text className="text-2xl font-extrabold text-slate-900 leading-8 mb-2">
              Speak with Confidence
            </Text>
            <Text className="text-sm text-slate-600 leading-5 mb-5">
              Practice spoken English in just 2 minutes a day with instant AI feedback.
            </Text>

            <View className="gap-3 mb-5">
              <View className="flex-row items-center bg-slate-50 py-3.5 px-4 rounded-2xl border border-slate-200">
                <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3.5">
                  <Ionicons name="book" size={20} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900 leading-5">Read Aloud</Text>
                  <Text className="text-xs text-slate-500 mt-0.5">Curated daily paragraphs</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-slate-50 py-3.5 px-4 rounded-2xl border border-slate-200">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3.5">
                  <Ionicons name="mic" size={20} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900 leading-5">Voice Record</Text>
                  <Text className="text-xs text-slate-500 mt-0.5">Live speech capture & analysis</Text>
                </View>
              </View>
            </View>

            <Button
              title="Start First Challenge"
              onPress={handleStart}
              variant="primary"
              size="lg"
              icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
            />
          </View>
        )}

        {/* 2. RETURNING USER DIRECT FLOW */}
        {!isNewUser && (
          <>
            {isCompletedToday && todayResult ? (
              /* Completed Today State (Closure & Satisfaction) */
              <View className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-300 mb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-2.5">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                    <Text className="text-lg font-bold text-emerald-900">Today's Goal Complete</Text>
                  </View>
                  <View className="bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
                    <Text className="text-xs font-extrabold text-emerald-800">{todayResult.overallScore} / 100</Text>
                  </View>
                </View>
                <Text className="text-xl font-extrabold text-slate-900 my-1.5">
                  "{todayResult.challengeTitle}"
                </Text>
                <Text className="text-sm text-slate-700 mb-4 leading-5">
                  Outstanding effort! Your vocal muscle memory is strengthening every session. Rest well and come back tomorrow for fresh calibration.
                </Text>

                {/* Growth Metric Stats Row */}
                <View className="flex-row items-center gap-3 bg-white/80 rounded-2xl p-3.5 mb-4 border border-emerald-200">
                  <View className="flex-1 items-center border-r border-slate-100 pr-2">
                    <Text className="text-xs text-slate-500 font-semibold">Words Spoken</Text>
                    <Text className="text-base font-extrabold text-indigo-600">~{totalWords}</Text>
                  </View>
                  <View className="flex-1 items-center border-r border-slate-100 pr-2">
                    <Text className="text-xs text-slate-500 font-semibold">Practice Time</Text>
                    <Text className="text-base font-extrabold text-emerald-600">{totalMinutes} min</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-slate-500 font-semibold">Total Days</Text>
                    <Text className="text-base font-extrabold text-amber-600">{levelInfo.totalCompletedDays}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  {onViewCompletedResult && (
                    <Button
                      title="View Result"
                      onPress={() => onViewCompletedResult(todayResult)}
                      variant="secondary"
                      size="md"
                      icon={<Ionicons name="stats-chart-outline" size={17} color="#4F46E5" />}
                      className="flex-1"
                    />
                  )}
                  <Button
                    title="Practice Again"
                    onPress={handleStart}
                    variant="primary"
                    size="md"
                    icon={<Ionicons name="refresh" size={17} color="#FFFFFF" />}
                    className="flex-1"
                  />
                </View>
              </View>
            ) : (
              /* Ready for Daily Challenge (1-Tap Direct Launch) */
              <View className="bg-white rounded-3xl p-6 border-2 border-indigo-600 shadow-md shadow-indigo-500/10 mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                    <Text className="text-xs font-bold tracking-wider text-emerald-700">TODAY'S CALIBRATION</Text>
                  </View>
                  <View className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    <Text className="text-xs font-bold text-indigo-700 capitalize">{levelInfo.activeDifficulty}</Text>
                  </View>
                </View>

                <Text className="text-2xl font-extrabold text-slate-900 leading-8 mb-2">
                  Ready for today’s speaking practice?
                </Text>

                <Text className="text-sm text-slate-600 mb-6 leading-5">
                  Take 2 focused minutes to read today’s paragraph aloud and calibrate your rhythm with instant AI evaluation.
                </Text>

                <Button
                  title="Start Today's Challenge"
                  onPress={handleStart}
                  variant="primary"
                  size="lg"
                  icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
                />
              </View>
            )}
          </>
        )}

        {/* Motivational Slogan Section */}
        <View className="bg-white rounded-2xl py-4 px-4 border border-slate-200 shadow-sm my-1 items-center justify-center">
          <Text className="text-sm text-slate-600 italic leading-5 text-center font-medium">
            {isCompletedToday
              ? '"Progress in spoken clarity is cumulative. Every session permanently sharpens your tone and confidence."'
              : '"Clear speech begins with small daily habits. Just two focused minutes today builds natural confidence."'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
