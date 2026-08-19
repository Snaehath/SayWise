import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ProgressBarProps {
  label: string;
  score: number; // 0 - 100
  color?: string;
  delay?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  score,
  color = colors.primary,
  delay = 0,
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
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{score}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolate,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  score: {
    ...typography.body,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: spacing.roundPill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: spacing.roundPill,
  },
});
