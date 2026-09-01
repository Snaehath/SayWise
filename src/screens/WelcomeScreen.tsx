import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeService } from '../services/challengeService';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge, PracticeMode } from '../types/challenge';
import { ChallengeResult, SpeakerProfile } from '../types/result';

// types
interface WelcomeScreenProps {
  onStartChallenge: (challenge?: Challenge) => void;
  onOpenProfile: () => void;
  onViewCompletedResult?: (result: ChallengeResult) => void;
}

// countdown
const MidnightCountdown: React.FC = React.memo(() => {
  // state
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diffMs = midnight.getTime() - now.getTime();
    return {
      hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diffMs / (1000 * 60)) % 60),
      seconds: Math.floor((diffMs / 1000) % 60),
    };
  });

  // effects
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      setTimeLeft({
        hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffMs / (1000 * 60)) % 60),
        seconds: Math.floor((diffMs / 1000) % 60),
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // render
  return (
    <Text className="text-[11px] font-medium text-slate-400">
      Next challenge in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </Text>
  );
});

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartChallenge,
  onOpenProfile,
  onViewCompletedResult,
}) => {
  // hooks
  const insets = useSafeAreaInsets();

  // state
  const [activeMode, setActiveMode] = useState<PracticeMode>('read');
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<ChallengeResult | null>(null);
  const [profile, setProfile] = useState<SpeakerProfile>(() => challengeStorage.getSpeakerProfile());
  const [readChallenge, setReadChallenge] = useState<Challenge>(() => challengeService.getTodayChallenge(undefined, 'read'));
  const [talkChallenge, setTalkChallenge] = useState<Challenge>(() => challengeService.getTodayChallenge(undefined, 'talk'));

  // helpers
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning ☀️';
    if (hour < 18) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
  };

  const loadState = () => {
    setIsCompletedToday(challengeStorage.isCompletedToday());
    setTodayResult(challengeStorage.getTodayResult());
    setProfile(challengeStorage.getSpeakerProfile());
    setReadChallenge(challengeService.getTodayChallenge(undefined, 'read'));
    setTalkChallenge(challengeService.getTodayChallenge(undefined, 'talk'));
  };

  const activeChallenge = activeMode === 'read' ? readChallenge : talkChallenge;

  // handlers
  const handleStart = () => {
    challengeStorage.setOnboardingSeen();
    onStartChallenge(activeChallenge);
  };

  // effects
  useEffect(() => {
    loadState();
  }, []);

  // render
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-xs font-semibold text-slate-500">{getGreeting()}</Text>
            <Text className="text-2xl font-black text-slate-900 mt-0.5">SayWise</Text>
          </View>

          <Pressable
            onPress={onOpenProfile}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            unstable_pressDelay={0}
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 flex-row items-center shadow-sm shadow-slate-100 active:opacity-75"
          >
            <Ionicons name="person-circle-outline" size={18} color="#4F46E5" />
            <Text className="text-xs font-bold text-slate-700 ml-1.5">Profile</Text>
          </Pressable>
        </View>

        {/* practice card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
              TODAY'S PRACTICE • 2 MIN
            </Text>
            <Text className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {activeMode === 'read' ? '1 min Reading' : '1 min Speaking'}
            </Text>
          </View>

          {/* mode tabs */}
          <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-5">
            <Pressable
              onPress={() => setActiveMode('read')}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              unstable_pressDelay={0}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center active:opacity-80 ${
                activeMode === 'read' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Ionicons
                name="book-outline"
                size={16}
                color={activeMode === 'read' ? '#4F46E5' : '#64748B'}
              />
              <Text
                className={`text-xs font-extrabold ml-1.5 ${
                  activeMode === 'read' ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                Read Mode
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveMode('talk')}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              unstable_pressDelay={0}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center active:opacity-80 ${
                activeMode === 'talk' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Ionicons
                name="mic-outline"
                size={16}
                color={activeMode === 'talk' ? '#D97706' : '#64748B'}
              />
              <Text
                className={`text-xs font-extrabold ml-1.5 ${
                  activeMode === 'talk' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                Talk Mode
              </Text>
            </Pressable>
          </View>

          {/* topic */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
              {activeMode === 'read' ? 'READ' : 'TALK'}
            </Text>
            <Text className="text-xl font-black text-slate-900 leading-7">
              "{activeChallenge.title}"
            </Text>
          </View>

          {/* rationale */}
          <View className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="sparkles" size={14} color="#4F46E5" />
              <Text className="text-xs font-extrabold text-indigo-700 ml-1.5 uppercase tracking-wide">
                Chosen for you
              </Text>
            </View>
            <Text className="text-xs text-slate-600 leading-5">
              {activeChallenge.whyChosen || activeChallenge.focusTarget || 'Calibrated to build steady speaking cadence and clear articulation.'}
            </Text>
          </View>

          {/* action */}
          {isCompletedToday ? (
            <View className="space-y-3">
              <View className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-800 ml-2">Today's Session Completed</Text>
                </View>
                <Text className="text-xs font-bold text-emerald-700">
                  {todayResult?.overallScore ? `${todayResult.overallScore}/100` : 'Done'}
                </Text>
              </View>

              {todayResult && onViewCompletedResult && (
                <Button
                  title="Review Today's Take"
                  onPress={() => onViewCompletedResult(todayResult)}
                  variant="outline"
                  icon="sparkles"
                  size="md"
                />
              )}

              <View className="items-center mt-2">
                <MidnightCountdown />
              </View>
            </View>
          ) : (
            <Button
              title={activeMode === 'read' ? 'Start Reading (1 min)' : 'Start Talking (1 min)'}
              onPress={handleStart}
              variant="primary"
              icon={activeMode === 'read' ? 'book-outline' : 'mic'}
              size="lg"
            />
          )}
        </View>

        {/* progress snapshot */}
        <Pressable
          onPress={onOpenProfile}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm active:opacity-90"
        >
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">YOUR SPEAKING</Text>
            <View className="flex-row items-baseline">
              <Text className="text-xl font-black text-slate-900">{profile.overallScore}</Text>
              <Text className="text-xs font-bold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>

          {/* metrics */}
          <View className="space-y-2 mb-3">
            <ProgressMetricRow label="Fluency" score={profile.fluencyScore} />
            <ProgressMetricRow label="Clarity" score={profile.clarityScore} />
            <ProgressMetricRow label="Pacing" score={profile.pacingScore} />
            <ProgressMetricRow label="Expression" score={profile.expressionScore} />
          </View>

          {/* footnote */}
          <View className="pt-3 border-t border-slate-100 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-emerald-700">{profile.growthSummary}</Text>
            <View className="flex-row items-center">
              <Text className="text-xs font-bold text-indigo-600 mr-1">View Profile</Text>
              <Ionicons name="chevron-forward" size={12} color="#4F46E5" />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

// types
interface ProgressMetricRowProps {
  label: string;
  score: number;
}

const ProgressMetricRow: React.FC<ProgressMetricRowProps> = ({ label, score }) => {
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
