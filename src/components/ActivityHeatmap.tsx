import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityDay } from '../storage/challengeStorage';

interface ActivityHeatmapProps {
  activityMap: ActivityDay[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activityMap }) => {
  const completedDaysCount = activityMap.filter((a) => a.completed).length;

  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={18} color="#6366F1" />
          <Text className="text-sm font-extrabold text-slate-900">30-Day Activity History</Text>
        </View>
        <View className="bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          <Text className="text-xs font-bold text-indigo-700">{completedDaysCount} / 30 Days</Text>
        </View>
      </View>

      {/* 30-Day Uniform Grid (6 x 5) */}
      <View className="flex-row flex-wrap gap-2 justify-center">
        {activityMap.map((day, idx) => (
          <View
            key={idx}
            className={`w-7 h-7 rounded-xl items-center justify-center ${
              day.completed
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/25 border border-emerald-600'
                : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {day.completed ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
