import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  score: number; // 0 - 100
  color?: string;
  delay?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  score,
  color = '#4F46E5',
  delay = 0,
  className = 'mb-1',
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(100, Math.max(0, score)),
      duration: 900,
      delay,
      useNativeDriver: false,
    }).start();
  }, [score, delay]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className={className}>
      <View className="flex-row justify-between items-center mb-0.5">
        <Text className="text-xs font-medium text-slate-700">{label}</Text>
        <Text className="text-xs font-bold" style={{ color }}>{score}</Text>
      </View>
      <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <Animated.View
          className="h-full rounded-full"
          style={{
            width: widthInterpolate,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};
