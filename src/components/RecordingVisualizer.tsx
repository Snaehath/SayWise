import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

// types
interface RecordingVisualizerProps {
  durationSec: number;
}

export const RecordingVisualizer: React.FC<RecordingVisualizerProps> = ({
  durationSec,
}) => {
  // refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(1)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0.6)).current;

  const barScales = useRef(
    Array.from({ length: 11 }, () => new Animated.Value(0.4))
  ).current;

  // effects
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(ringScaleAnim, {
            toValue: 1.7,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacityAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(ringScaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacityAnim, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulseLoop.start();

    const interval = setInterval(() => {
      barScales.forEach((bar, index) => {
        const weight = Math.sin(((index + 1) / (barScales.length + 1)) * Math.PI);
        const randomScale = 0.2 + Math.random() * (0.8 * weight + 0.2);

        Animated.timing(bar, {
          toValue: Math.max(0.2, Math.min(1.2, randomScale)),
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, 150);

    return () => {
      pulseLoop.stop();
      clearInterval(interval);
    };
  }, []);

  // helpers
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // render
  return (
    <View className="items-center justify-center py-3 pointer-events-none">
      {/* status tag */}
      <View className="flex-row items-center bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 mb-2">
        <View className="w-4 h-4 items-center justify-center mr-2">
          <Animated.View
            className="absolute w-4 h-4 rounded-full bg-rose-500"
            style={[
              {
                transform: [{ scale: ringScaleAnim }],
                opacity: ringOpacityAnim,
              },
            ]}
          />
          <Animated.View
            className="w-2.5 h-2.5 rounded-full bg-rose-600"
            style={[{ transform: [{ scale: pulseAnim }] }]}
          />
        </View>
        <Text className="text-xs font-extrabold uppercase tracking-wider text-rose-700">Listening to Speech...</Text>
      </View>

      {/* elapsed timer */}
      <Text className="text-3xl font-extrabold text-slate-900 my-1 font-mono tracking-wider">
        {formatTime(durationSec)}
      </Text>

      {/* equalizer bars */}
      <View className="flex-row items-center justify-center h-12 gap-1.5 mt-1 px-4">
        {barScales.map((animScale, index) => {
          const isCenter = index >= 3 && index <= 7;
          return (
            <Animated.View
              key={index}
              className={`w-1.5 h-10 rounded-full ${isCenter ? 'bg-indigo-600' : 'bg-indigo-400'}`}
              style={[{ transform: [{ scaleY: animScale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
};
