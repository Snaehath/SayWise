import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

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
    <View style={styles.container}>
      {/* Top Status Tag */}
      <View style={styles.statusRow}>
        <View style={styles.dotContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: ringScaleAnim }],
                opacity: ringOpacityAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.recordingDot,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
        </View>
        <Text style={styles.statusText}>Recording...</Text>
      </View>

      {/* Elapsed Timer Display */}
      <Text style={styles.timerText}>{formatTime(durationSec)}</Text>

      {/* Animated Waveform Sound Bars */}
      <View style={styles.waveformContainer}>
        {barHeights.map((animHeight, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height: animHeight,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.recordingLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.roundPill,
    marginBottom: spacing.sm,
  },
  dotContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.recording,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.recording,
  },
  statusText: {
    ...typography.badge,
    fontSize: 11,
    color: colors.recordingDark,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    gap: 5,
    marginTop: spacing.xs,
  },
  waveBar: {
    width: 4,
    backgroundColor: colors.recording,
    borderRadius: 2,
  },
});
