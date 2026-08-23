import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage } from '../storage/challengeStorage';
import { ChallengeResult } from '../types/result';

interface CompletionScreenProps {
  result: ChallengeResult;
  onComeAgain: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  result,
  onComeAgain,
}) => {
  const insets = useSafeAreaInsets();
  const streakCount = challengeStorage.getStreakCount();
  const totalWords = challengeStorage.getTotalWordsSpoken();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const streakPopAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(streakPopAnim, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6 justify-center items-center">
        {/* Animated Trophy Celebration Icon */}
        <Animated.View
          className="items-center justify-center mb-5"
          style={[
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View className="w-28 h-28 rounded-full bg-emerald-50 items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-emerald-200">
            <Ionicons name="trophy" size={54} color="#059669" />
          </View>
        </Animated.View>

        {/* Streak Boost Pill */}
        <Animated.View
          style={{ transform: [{ scale: streakPopAnim }] }}
          className="flex-row items-center bg-amber-50 px-4 py-2 rounded-full border border-amber-300 shadow-sm mb-3"
        >
          <Ionicons name="flame" size={22} color="#EA580C" style={{ marginRight: 6 }} />
          <Text className="text-base font-extrabold text-amber-800">
            {streakCount} Day Streak Active!
          </Text>
        </Animated.View>

        <Text className="text-2xl font-extrabold text-slate-900 text-center mb-1">
          Fantastic Effort! 🎉
        </Text>
        <Text className="text-sm text-slate-600 text-center mb-5 px-3 leading-5">
          You showed up for your vocal practice today. Muscle memory is growing!
        </Text>

        {/* Achievement Summary Card */}
        <View className="w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm font-medium text-slate-500">Challenge</Text>
            <Text className="text-base font-bold text-slate-900 max-w-[60%]" numberOfLines={1}>
              {result.challengeTitle}
            </Text>
          </View>

          <View className="h-[1px] bg-slate-100 my-2.5" />

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm font-medium text-slate-500">Overall Score</Text>
            <View className="bg-indigo-50 px-3 py-1 rounded-full">
              <Text className="text-base font-extrabold text-indigo-600">
                {result.overallScore} / 100
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-slate-100 my-2.5" />

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm font-medium text-slate-500">Total Words Spoken</Text>
            <Text className="text-base font-extrabold text-emerald-600">~{totalWords} words</Text>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-xl">
        <Button
          title="Return Home"
          onPress={onComeAgain}
          variant="primary"
          size="lg"
          icon={<Ionicons name="home-outline" size={20} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};
