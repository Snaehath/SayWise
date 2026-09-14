import React from 'react';
import { Text, View } from 'react-native';

// types
interface MetricProgressBarProps {
  label: string;
  score: number;
  isCalibrated?: boolean;
  delta?: { text: string; color: string };
  barColor?: string;
}

export const MetricProgressBar: React.FC<MetricProgressBarProps> = ({
  label,
  score,
  isCalibrated = true,
  delta,
  barColor = 'bg-slate-800',
}) => {
  // render
  return (
    <View className="flex-row items-center justify-between my-1">
      <Text className="text-xs font-bold text-slate-600 w-24">{label}</Text>
      <View className="flex-1 h-2 bg-slate-100 rounded-full mx-3 overflow-hidden">
        <View
          className={`h-full ${barColor} rounded-full`}
          style={{ width: isCalibrated ? `${Math.min(100, Math.max(10, score))}%` : '0%' }}
        />
      </View>
      <View className="flex-row items-center justify-end w-14">
        <Text className="text-xs font-black text-slate-900 mr-1">
          {isCalibrated ? score : '—'}
        </Text>
        {delta && (
          <Text className={`text-xs font-black ${delta.color}`}>{delta.text}</Text>
        )}
      </View>
    </View>
  );
};
