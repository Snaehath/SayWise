import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { analysisService } from '../services/analysisService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Challenge } from '../types/challenge';
import { AnalysisResult } from '../types/result';

interface AnalysisScreenProps {
  challenge: Challenge;
  audioPath: string;
  durationSec: number;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onCancel: () => void;
}

const ROTATING_MESSAGES = [
  'Analyzing your reading...',
  'Checking pronunciation & articulation...',
  'Looking at your pacing and pauses...',
  'Evaluating overall speaking flow...',
  'Preparing your personalized feedback...',
];

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  challenge,
  audioPath,
  durationSec,
  onAnalysisSuccess,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Animations
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseRingAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spin loop
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // Pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingAnim, {
          toValue: 1.3,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Message rotation
    const messageInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 1800);

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
      clearInterval(messageInterval);
    };
  }, []);

  const runAnalysis = async () => {
    setHasError(false);
    setIsRetrying(true);

    try {
      const result = await analysisService.analyzeRecording(audioPath, challenge, durationSec);
      onAnalysisSuccess(result);
    } catch (err) {
      console.warn('Speech analysis failed:', err);
      setHasError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Animated Scanner Graphic */}
        <View style={styles.graphicContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseRingAnim }],
              },
            ]}
          />
          <View style={styles.iconCircle}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="sparkles" size={36} color={colors.primary} />
            </Animated.View>
          </View>
        </View>

        {/* Message and Status */}
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorHeading}>Analysis Failed</Text>
            <Text style={styles.errorDescription}>
              We couldn't analyze your recording. Please try again.
            </Text>
            <View style={styles.errorActions}>
              <Button
                title="Retry Analysis"
                onPress={runAnalysis}
                variant="primary"
                loading={isRetrying}
                style={{ marginBottom: spacing.sm, width: '100%' }}
              />
              <Button
                title="Cancel & Re-record"
                onPress={onCancel}
                variant="ghost"
                style={{ width: '100%' }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Animated.Text style={[styles.rotatingMessage, { opacity: fadeAnim }]}>
              {ROTATING_MESSAGES[currentMessageIndex]}
            </Animated.Text>

            <Text style={styles.challengeContext}>
              Evaluating reading for "{challenge.title}"
            </Text>

            <View style={styles.indicatorRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.indicatorText}>Processing audio stream...</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  graphicContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
  },
  rotatingMessage: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    minHeight: 56,
    marginBottom: spacing.xs,
  },
  challengeContext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.roundPill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  indicatorText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorHeading: {
    ...typography.h2,
    color: colors.recording,
    marginBottom: spacing.xs,
  },
  errorDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorActions: {
    width: '100%',
  },
});
