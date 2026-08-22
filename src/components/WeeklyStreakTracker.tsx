import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayStreakItem } from '../storage/challengeStorage';

interface WeeklyStreakTrackerProps {
  streakCount: number;
  weekDays: DayStreakItem[];
  className?: string;
}

export const WeeklyStreakTracker: React.FC<WeeklyStreakTrackerProps> = ({
  streakCount,
  weekDays,
  className = '',
}) => {
  return (
    <View className={`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm ${className}`}>
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={16} color="#4F46E5" />
          <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            This Week's Momentum
          </Text>
        </View>
        <View className="flex-row items-center bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Ionicons name="flame" size={13} color="#EA580C" style={{ marginRight: 3 }} />
          <Text className="text-xs font-extrabold text-amber-700">
            {streakCount} {streakCount === 1 ? 'Day' : 'Days'} Streak
          </Text>
        </View>
      </View>

      {/* 7-Day Matrix Row */}
      <View className="flex-row justify-between items-center px-1">
        {weekDays.map((item, index) => {
          const isDone = item.completed;
          const isCurrent = item.isToday;

          return (
            <View key={index} className="items-center">
              {/* Day Circle / Icon */}
              <View
                className={`w-9 h-9 rounded-full items-center justify-center mb-1.5 transition-all ${
                  isDone
                    ? 'bg-amber-500 shadow-sm shadow-amber-500/30'
                    : isCurrent
                    ? 'bg-indigo-50 border-2 border-indigo-600'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              >
                {isDone ? (
                  <Ionicons name="flame" size={18} color="#FFFFFF" />
                ) : isCurrent ? (
                  <Ionicons name="mic" size={15} color="#4F46E5" />
                ) : (
                  <Text className="text-xs font-bold text-slate-400">
                    {item.shortLabel}
                  </Text>
                )}
              </View>

              {/* Day Label Below */}
              <Text
                className={`text-[11px] font-bold ${
                  isCurrent
                    ? 'text-indigo-600'
                    : isDone
                    ? 'text-amber-700'
                    : 'text-slate-400'
                }`}
              >
                {item.dayName}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
