import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleProp, ViewStyle } from 'react-native';

interface WaveformDisplayProps {
  animated?: boolean;
  barCount?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  animated = false,
  barCount = 17,
  height = 36,
  color,
  style,
}) => {
  // Pre-configured static heights to create a natural audio soundwave shape
  const staticWeights = [
    0.3, 0.45, 0.35, 0.6, 0.85, 0.7, 1.0, 0.75, 0.9, 0.65, 0.95, 0.8, 0.5, 0.7, 0.4, 0.55, 0.3,
  ];

  // Colors matching the design: alternates indigo, violet, and teal accents
  const colors = [
    '#6366F1', '#4F46E5', '#818CF8', '#0D9488', '#4F46E5',
    '#6366F1', '#14B8A6', '#4F46E5', '#6366F1', '#4338CA',
    '#0D9488', '#4F46E5', '#6366F1', '#818CF8', '#14B8A6',
    '#4F46E5', '#6366F1',
  ];

  const animScales = useRef(
    Array.from({ length: barCount }, (_, i) => new Animated.Value(staticWeights[i % staticWeights.length]))
  ).current;

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      animScales.forEach((bar, index) => {
        const base = staticWeights[index % staticWeights.length];
        const randomVariation = (Math.random() - 0.5) * 0.6;
        const target = Math.max(0.2, Math.min(1.0, base + randomVariation));

        Animated.timing(bar, {
          toValue: target,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, 130);

    return () => clearInterval(interval);
  }, [animated]);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          gap: 4,
        },
        style,
      ]}
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const barColor = color || colors[index % colors.length];
        const staticH = height * (staticWeights[index % staticWeights.length] || 0.5);

        if (animated) {
          return (
            <Animated.View
              key={index}
              style={{
                width: 3.5,
                height,
                backgroundColor: barColor,
                borderRadius: 2,
                transform: [{ scaleY: animScales[index] }],
              }}
            />
          );
        }

        return (
          <View
            key={index}
            style={{
              width: 3.5,
              height: Math.max(6, staticH),
              backgroundColor: barColor,
              borderRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
};
