import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { LevelCard } from '../components/LevelCard';
import { MetricStatsRow } from '../components/MetricStatsRow';
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
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

    // Live ticking countdown to next midnight challenge drop
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
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
            {/* Permanent XP Pill (Zero Anxiety) */}
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
        <LevelCard
          levelInfo={levelInfo}
          onPress={onOpenSettings}
          variant="home"
        />

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
              /* Completed Today State (Closure, Countdown & Satisfaction) */
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
                <Text className="text-sm text-slate-700 mb-3.5 leading-5">
                  Outstanding effort! Your vocal muscle memory is strengthening every session. Rest well and come back tomorrow for fresh calibration.
                </Text>

                {/* Live Countdown Timer to Tomorrow's Challenge */}
                <View className="flex-row items-center justify-between bg-emerald-100/70 px-4 py-2.5 rounded-2xl border border-emerald-200 mb-3.5">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="timer-outline" size={18} color="#047857" />
                    <Text className="text-xs font-bold text-emerald-900">Next Daily Challenge In</Text>
                  </View>
                  <Text className="text-xs font-extrabold text-emerald-950">
                    {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                  </Text>
                </View>

                {/* Growth Metric Stats Row (Reusable) */}
                <MetricStatsRow
                  wordsSpoken={totalWords}
                  practiceMinutes={totalMinutes}
                  totalDays={levelInfo.totalCompletedDays}
                />

                {/* Dedicated Action Button: View Today's Result & Analysis */}
                {onViewCompletedResult && (
                  <Button
                    title="View Today's Result & Audio"
                    onPress={() => onViewCompletedResult(todayResult)}
                    variant="primary"
                    size="lg"
                    icon={<Ionicons name="stats-chart-outline" size={18} color="#FFFFFF" />}
                  />
                )}
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
