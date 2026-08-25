import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserLevelInfo } from '../storage/challengeStorage';

interface LevelCardProps {
  levelInfo: UserLevelInfo;
  onPress?: () => void;
  variant?: 'home' | 'settings';
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelInfo,
  onPress,
  variant = 'home',
}) => {
  if (variant === 'settings') {
    return (
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

        {/* Progress Bar towards Next Level / Tier Unlock */}
        {levelInfo.level < 10 ? (
          <View>
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-xs font-medium text-indigo-100">
                {levelInfo.nextUnlockName ? `Next Tier (${levelInfo.nextUnlockName}):` : 'To Next Rank:'}
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
              🏆 Grandmaster Rank • All Tiers Unlocked!
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
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
          {onPress && <Ionicons name="chevron-forward" size={12} color="#4F46E5" />}
        </View>
      </View>

      {/* Progress bar towards next level */}
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
        {onPress && <Ionicons name="chevron-forward" size={12} color="#94A3B8" />}
      </View>
    </Pressable>
  );
};
