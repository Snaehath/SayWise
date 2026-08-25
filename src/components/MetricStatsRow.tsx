import React from 'react';
import { Text, View } from 'react-native';

interface MetricStatsRowProps {
  wordsSpoken: number;
  practiceMinutes: number;
  totalDays: number;
  containerClass?: string;
}

export const MetricStatsRow: React.FC<MetricStatsRowProps> = ({
  wordsSpoken,
  practiceMinutes,
  totalDays,
  containerClass = 'bg-white/80 rounded-2xl p-3.5 mb-4 border border-emerald-200',
}) => {
  return (
    <View className={`flex-row items-center gap-3 ${containerClass}`}>
      <View className="flex-1 items-center border-r border-slate-100 pr-2">
        <Text className="text-xs text-slate-500 font-semibold">Words Spoken</Text>
        <Text className="text-base font-extrabold text-indigo-600">~{wordsSpoken}</Text>
      </View>
      <View className="flex-1 items-center border-r border-slate-100 pr-2">
        <Text className="text-xs text-slate-500 font-semibold">Practice Time</Text>
        <Text className="text-base font-extrabold text-emerald-600">{practiceMinutes} min</Text>
      </View>
      <View className="flex-1 items-center">
        <Text className="text-xs text-slate-500 font-semibold">Total Days</Text>
        <Text className="text-base font-extrabold text-amber-600">{totalDays}</Text>
      </View>
    </View>
  );
};
