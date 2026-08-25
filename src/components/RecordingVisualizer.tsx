import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

// props
interface RecordingVisualizerProps {
  durationSec: number;
}

export const RecordingVisualizer: React.FC<RecordingVisualizerProps> = ({
  durationSec,
}) => {
  // animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(1)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0.6)).current;

  // 11 waveform bars
  const barHeights = useRef([
    new Animated.Value(12),
    new Animated.Value(20),
    new Animated.Value(32),
    new Animated.Value(44),
    new Animated.Value(28),
    new Animated.Value(48),
    new Animated.Value(34),
    new Animated.Value(42),
    new Animated.Value(26),
    new Animated.Value(18),
    new Animated.Value(10),
  ]).current;

  // effects
  useEffect(() => {
    // pulse loop
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

    // waveform loop
    const interval = setInterval(() => {
      barHeights.forEach((bar, index) => {
        const weight = Math.sin(((index + 1) / (barHeights.length + 1)) * Math.PI);
        const randomHeight = 8 + Math.random() * (40 * weight + 10);

        Animated.timing(bar, {
          toValue: Math.max(6, Math.min(48, randomHeight)),
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
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
    <View className="items-center justify-center py-4">
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
      <View className="flex-row items-center justify-center h-14 gap-1.5 mt-1.5 px-4">
        {barHeights.map((animHeight, index) => {
          const isCenter = index >= 3 && index <= 7;
          return (
            <Animated.View
              key={index}
              className={`w-1.5 rounded-full ${isCenter ? 'bg-indigo-600' : 'bg-indigo-400'}`}
              style={[{ height: animHeight }]}
            />
          );
        })}
      </View>
    </View>
  );
};
