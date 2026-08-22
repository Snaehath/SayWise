import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
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
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const badgeSlideAnim = useRef(new Animated.Value(25)).current;
  const streakPopAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(badgeSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(350),
        Animated.spring(streakPopAnim, {
          toValue: 1.05,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(streakPopAnim, {
          toValue: 1,
          friction: 6,
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
        {/* Animated Milo Mascot Celebration */}
        <Animated.View
          className="items-center justify-center mb-4"
          style={[
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View className="w-36 h-36 rounded-full bg-indigo-50/70 p-2 items-center justify-center shadow-lg shadow-indigo-500/15 border-2 border-indigo-100">
            <Image
              source={require('../../assets/mascot/milo_celebrating.png')}
              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Headings & Celebration */}
        <Animated.View
          className="items-center w-full"
          style={[
            {
              transform: [{ translateY: badgeSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Streak Boost Pill */}
          <Animated.View
            style={{ transform: [{ scale: streakPopAnim }] }}
            className="flex-row items-center bg-amber-50 px-4 py-1.5 rounded-full border border-amber-300 shadow-sm mb-2"
          >
            <Ionicons name="flame" size={18} color="#EA580C" style={{ marginRight: 6 }} />
            <Text className="text-sm font-extrabold text-amber-800">
              {streakCount} Day Streak Active!
            </Text>
          </Animated.View>

          <Text className="text-2xl font-extrabold text-slate-900 text-center mb-1">
            Fantastic Effort! 🎉
          </Text>
          <Text className="text-sm text-slate-600 text-center mb-4 px-3 leading-5">
            You showed up for your vocal fitness. Your muscle memory is growing!
          </Text>

          {/* Achievement Summary Card */}
          <View className="w-full bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-3">
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Challenge</Text>
              <Text className="text-sm font-bold text-slate-900 max-w-[60%]" numberOfLines={1}>
                {result.challengeTitle}
              </Text>
            </View>

            <View className="h-[1px] bg-slate-100 my-2" />

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Overall Score</Text>
              <View className="bg-indigo-50 px-3 py-0.5 rounded-full">
                <Text className="text-sm font-extrabold text-indigo-600">
                  {result.overallScore} / 100
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-slate-100 my-2" />

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Total Words Spoken</Text>
              <Text className="text-sm font-extrabold text-emerald-600">~{totalWords} words</Text>
            </View>
          </View>

          {/* Emotional Motivation Box */}
          <View className="flex-row items-center bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100">
            <Ionicons
              name="sparkles"
              size={20}
              color="#4F46E5"
              style={{ marginRight: 8 }}
            />
            <Text className="text-xs text-indigo-900 flex-1 leading-5 font-medium">
              "Every single practice session rewires your brain for smoother, faster English speech."
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-xl">
        <Button
          title="Return Home"
          onPress={onComeAgain}
          variant="primary"
          size="lg"
          icon={
            <Ionicons
              name="home-outline"
              size={18}
              color="#FFFFFF"
            />
          }
        />
      </View>
    </View>
  );
};
