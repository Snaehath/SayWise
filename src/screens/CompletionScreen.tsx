import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage } from '../storage/challengeStorage';
import { ChallengeResult } from '../types/result';

// types
interface CompletionScreenProps {
  result: ChallengeResult;
  onComeAgain: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ result, onComeAgain }) => {
  // hooks
  const insets = useSafeAreaInsets();
  const profile = challengeStorage.getSpeakerProfile();

  // refs
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // effects
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // render
  return (
    <View
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6 justify-center items-center">
        {/* celebration badge */}
        <Animated.View
          className="items-center justify-center mb-5"
          style={[
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View className="w-20 h-20 rounded-3xl bg-indigo-600 items-center justify-center shadow-xl shadow-indigo-500/25 border-2 border-indigo-100">
            <Ionicons name="sparkles" size={38} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* headline */}
        <Text className="text-2xl font-black text-slate-900 text-center mb-2">
          Daily Speak Complete! ✨
        </Text>
        <Text className="text-sm text-slate-600 text-center mb-6 px-4 leading-6">
          Nice work. Tomorrow's practice will automatically focus on {profile.currentFocus.title.toLowerCase()}.
        </Text>

        {/* summary card */}
        <View className="w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
          <View className="flex-row items-center justify-between py-1.5">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Topic</Text>
            <Text className="text-sm font-extrabold text-slate-900 max-w-[65%]" numberOfLines={1}>
              {result.challengeTitle}
            </Text>
          </View>

          <View className="h-[1px] bg-slate-100 my-2" />

          <View className="flex-row items-center justify-between py-1.5">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</Text>
            <Text className="text-sm font-black text-slate-900">
              {result.overallScore} / 100
            </Text>
          </View>

          <View className="h-[1px] bg-slate-100 my-2" />

          <View className="flex-row items-center justify-between py-1.5">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Week</Text>
            <Text className="text-xs font-extrabold text-indigo-600">
              {profile.sessionsThisWeek} {profile.sessionsThisWeek === 1 ? 'session' : 'sessions'} completed
            </Text>
          </View>
        </View>

        {/* footnote */}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#94A3B8" />
          <Text className="text-xs font-medium text-slate-400 ml-1.5">
            Next challenge unlocks at midnight
          </Text>
        </View>
      </View>

      {/* action */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-xl">
        <Button
          title="Back to Home"
          onPress={onComeAgain}
          variant="primary"
          size="lg"
          icon="home-outline"
        />
      </View>
    </View>
  );
};
