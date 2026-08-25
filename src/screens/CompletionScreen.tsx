import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage, UserLevelInfo } from '../storage/challengeStorage';
import { ChallengeResult } from '../types/result';

// props
interface CompletionScreenProps {
  result: ChallengeResult;
  onComeAgain: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ result, onComeAgain }) => {
  // hooks
  const insets = useSafeAreaInsets();

  // animations
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rankPopAnim = useRef(new Animated.Value(0.8)).current;

  // states
  const [totalWords, setTotalWords] = useState(0);
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo>(challengeStorage.getLevelInfo());

  // effects
  useEffect(() => {
    setTotalWords(challengeStorage.getTotalWordsSpoken());
    setLevelInfo(challengeStorage.getLevelInfo());

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(rankPopAnim, {
        toValue: 1,
        delay: 200,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // helpers
  const isHighAccuracy = result.overallScore >= 85;
  const earnedXP = 100 + (isHighAccuracy ? 25 : 0);

  // render
  return (
    <View
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6 justify-center items-center">
        {/* trophy celebration */}
        <Animated.View
          className="items-center justify-center mb-4"
          style={[
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View className="w-24 h-24 rounded-full bg-emerald-50 items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-emerald-200">
            <Ionicons name="trophy" size={48} color="#059669" />
          </View>
        </Animated.View>

        {/* rank pill */}
        <Animated.View
          style={{ transform: [{ scale: rankPopAnim }] }}
          className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200 shadow-sm mb-3"
        >
          <Ionicons name="sparkles" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
          <Text className="text-sm font-extrabold text-indigo-900">
            {levelInfo.title} • Level {levelInfo.level}
          </Text>
        </Animated.View>

        <Text className="text-2xl font-extrabold text-slate-900 text-center mb-1">
          Fantastic Effort! 🎉
        </Text>
        <Text className="text-sm text-slate-600 text-center mb-5 px-3 leading-5">
          You showed up for your vocal practice today. Muscle memory is growing!
        </Text>

        {/* summary card */}
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
            <Text className="text-sm font-medium text-slate-500">XP Earned</Text>
            <View className="flex-row items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Ionicons name="sparkles" size={13} color="#059669" />
              <Text className="text-sm font-extrabold text-emerald-700">
                +{earnedXP} XP
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-slate-100 my-2.5" />

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm font-medium text-slate-500">Total Practice Days</Text>
            <Text className="text-base font-extrabold text-slate-800">
              {levelInfo.totalCompletedDays} Days
            </Text>
          </View>
        </View>
      </View>

      {/* return cta */}
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
