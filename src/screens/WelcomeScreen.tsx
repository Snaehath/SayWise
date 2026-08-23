import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage } from '../storage/challengeStorage';
import { ChallengeResult } from '../types/result';

interface WelcomeScreenProps {
  onStartChallenge: () => void;
  onViewCompletedResult?: (result: ChallengeResult) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartChallenge,
  onViewCompletedResult,
}) => {
  const insets = useSafeAreaInsets();
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<ChallengeResult | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const loadState = () => {
    const completed = challengeStorage.isCompletedToday();
    const result = challengeStorage.getTodayResult();
    const streak = challengeStorage.getStreakCount();
    const hasSeen = challengeStorage.hasSeenOnboarding();
    const history = challengeStorage.getHistory();
    const words = challengeStorage.getTotalWordsSpoken();
    const minutes = challengeStorage.getTotalMinutesPracticed();

    setIsCompletedToday(completed);
    setTodayResult(result);
    setStreakCount(streak);
    setIsNewUser(!hasSeen && history.length === 0);
    setTotalWords(words);
    setTotalMinutes(minutes);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleStart = () => {
    challengeStorage.setOnboardingSeen();
    onStartChallenge();
  };

  const handleResetDev = () => {
    Alert.alert(
      'Reset Daily Progress',
      "This will clear today's completion state, streak, and onboarding state for testing.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            challengeStorage.resetAppProgress();
            loadState();
          },
        },
      ]
    );
  };

  const selectedDiff = challengeStorage.getSelectedDifficulty() || 'beginner';

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Brand & Animated Fire Streak Pill */}
        <View className="flex-row items-center justify-between mb-5 mt-1">
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-500/25 mr-3">
              <Ionicons name="mic" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-2xl font-extrabold text-slate-900 leading-7">SayWise</Text>
              <Text className="text-xs font-semibold text-slate-500">Daily Speaking Practice</Text>
            </View>
          </View>

          {/* Clean Streak Pill */}
          <View
            className={`flex-row items-center px-3.5 py-1.5 rounded-full border shadow-sm ${
              streakCount > 0
                ? 'bg-amber-50 border-amber-200'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Ionicons
              name="flame"
              size={18}
              color={streakCount > 0 ? '#EA580C' : '#94A3B8'}
              style={{ marginRight: 5 }}
            />
            <Text
              className={`text-base font-extrabold ${
                streakCount > 0 ? 'text-amber-700' : 'text-slate-500'
              }`}
            >
              {streakCount}
            </Text>
          </View>
        </View>

        {/* 1. NEW USER ONBOARDING HERO CARD */}
        {isNewUser && (
          <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-5">
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
              /* Completed Today State */
              <View className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-300 mb-5 shadow-sm">
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
                  Great job keeping your {streakCount} day streak alive! Come back tomorrow for your next speaking challenge.
                </Text>

                {/* Growth Metric Stats Row */}
                <View className="flex-row items-center gap-3 bg-white/80 rounded-2xl p-3.5 mb-4 border border-emerald-200">
                  <View className="flex-1 items-center border-r border-slate-100 pr-2">
                    <Text className="text-xs text-slate-500 font-semibold">Words Spoken</Text>
                    <Text className="text-base font-extrabold text-indigo-600">~{totalWords}</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-slate-500 font-semibold">Minutes Practiced</Text>
                    <Text className="text-base font-extrabold text-emerald-600">{totalMinutes} min</Text>
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
                    title="Try Again"
                    onPress={handleStart}
                    variant="primary"
                    size="md"
                    icon={<Ionicons name="refresh" size={17} color="#FFFFFF" />}
                    className="flex-1"
                  />
                </View>
              </View>
            ) : (
              /* Ready for Daily Challenge (Clean & Direct) */
              <View className="bg-white rounded-3xl p-6 border-2 border-indigo-600 shadow-md shadow-indigo-500/10 mb-5">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                    <Text className="text-xs font-bold tracking-wider text-emerald-700">TODAY'S CHALLENGE</Text>
                  </View>
                  <View className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    <Text className="text-xs font-bold text-slate-600 capitalize">{selectedDiff}</Text>
                  </View>
                </View>

                <Text className="text-2xl font-extrabold text-slate-900 leading-8 mb-2">
                  {streakCount > 0
                    ? `Keep your ${streakCount} day streak active!`
                    : 'Ready for today’s speaking practice?'}
                </Text>

                <Text className="text-sm text-slate-600 mb-6 leading-5">
                  Take 2 minutes to read your daily paragraph aloud and calibrate your pronunciation with instant AI feedback.
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
        <View className="bg-white rounded-2xl py-3.5 px-4 border border-slate-200 shadow-sm my-2 items-center justify-center">
          <Text className="text-sm text-slate-600 italic leading-5 text-center font-medium">
            {isCompletedToday
              ? '"Consistency is the mother of mastery. You showed up today — rest well and come back stronger tomorrow!"'
              : '"Clear speech begins with small daily habits. Just two focused minutes today builds natural confidence."'}
          </Text>
        </View>

        {/* Dev Reset Utility */}
        <View className="items-center mt-2">
          <Pressable onPress={handleResetDev} hitSlop={10} className="flex-row items-center py-2 px-3">
            <Ionicons name="refresh-outline" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
            <Text className="text-xs text-slate-400">Reset Progress (Dev Utility)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
