import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

interface RecordingVisualizerProps {
  durationSec: number;
}

export const RecordingVisualizer: React.FC<RecordingVisualizerProps> = ({
  durationSec,
}) => {
  // Pulse animation for recording dot & ring
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(1)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0.6)).current;

  // Waveform bar heights
  const barHeights = useRef([
    new Animated.Value(12),
    new Animated.Value(24),
    new Animated.Value(36),
    new Animated.Value(18),
    new Animated.Value(28),
    new Animated.Value(42),
    new Animated.Value(20),
    new Animated.Value(30),
    new Animated.Value(14),
  ]).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(ringScaleAnim, {
            toValue: 1.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacityAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
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

    // Waveform random height animations
    const interval = setInterval(() => {
      barHeights.forEach((bar) => {
        const randomHeight = 8 + Math.random() * 38;
        Animated.timing(bar, {
          toValue: randomHeight,
          duration: 180,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });
    }, 200);

    return () => {
      pulseLoop.stop();
      clearInterval(interval);
    };
  }, []);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View className="items-center justify-center py-4">
      {/* Top Status Tag */}
      <View className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-full mb-2">
        <View className="w-4 h-4 items-center justify-center mr-1.5">
          <Animated.View
            className="absolute w-4 h-4 rounded-full bg-red-500"
            style={[
              {
                transform: [{ scale: ringScaleAnim }],
                opacity: ringOpacityAnim,
              },
            ]}
          />
          <Animated.View
            className="w-2 h-2 rounded-full bg-red-500"
            style={[{ transform: [{ scale: pulseAnim }] }]}
          />
        </View>
        <Text className="text-[11px] font-bold uppercase tracking-wider text-red-700">Recording...</Text>
      </View>

      {/* Elapsed Timer Display */}
      <Text className="text-3xl font-bold text-slate-900 my-1 font-mono">{formatTime(durationSec)}</Text>

      {/* Animated Waveform Sound Bars */}
      <View className="flex-row items-center justify-center h-12 gap-1.5 mt-1">
        {barHeights.map((animHeight, index) => (
          <Animated.View
            key={index}
            className="w-1 bg-red-500 rounded-sm"
            style={[{ height: animHeight }]}
          />
        ))}
      </View>
    </View>
  );
};
