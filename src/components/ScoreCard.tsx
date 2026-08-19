import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ProgressBar } from './ProgressBar';

interface ScoreCardProps {
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  pronunciationScore,
  accuracyScore,
  fluencyScore,
  pacingScore,
}) => {
  const getGradeInfo = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Excellent!',
        color: colors.success,
        bg: colors.successLight,
      };
    }
    if (score >= 80) {
      return {
        label: 'Great job!',
        color: colors.primary,
        bg: colors.primaryLight,
      };
    }
    if (score >= 70) {
      return {
        label: 'Good effort!',
        color: colors.intermediate,
        bg: colors.intermediateBg,
      };
    }
    return {
      label: 'Keep practicing!',
      color: colors.warning,
      bg: colors.warningLight,
    };
  };

  const grade = getGradeInfo(overallScore);

  return (
    <View style={styles.card}>
      {/* Overall Score Circle & Header */}
      <View style={styles.overallHeader}>
        <View style={[styles.scoreBadgeCircle, { borderColor: grade.color }]}>
          <Text style={[styles.overallScoreNumber, { color: grade.color }]}>
            {overallScore}
          </Text>
          <Text style={styles.scoreScale}>/ 100</Text>
        </View>
        <View style={[styles.gradeTag, { backgroundColor: grade.bg }]}>
          <Text style={[styles.gradeTagText, { color: grade.color }]}>
            {grade.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Metrics Breakdown */}
      <View style={styles.metricsContainer}>
        <ProgressBar
          label="Pronunciation"
          score={pronunciationScore}
          color="#6366F1"
          delay={100}
        />
        <ProgressBar
          label="Accuracy"
          score={accuracyScore}
          color="#10B981"
          delay={200}
        />
        <ProgressBar
          label="Fluency"
          score={fluencyScore}
          color="#3B82F6"
          delay={300}
        />
        <ProgressBar
          label="Pacing"
          score={pacingScore}
          color="#F59E0B"
          delay={400}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: spacing.lg,
  },
  overallHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  scoreBadgeCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.md,
  },
  overallScoreNumber: {
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 42,
  },
  scoreScale: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: -2,
  },
  gradeTag: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: spacing.roundPill,
  },
  gradeTagText: {
    ...typography.badge,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: spacing.lg,
  },
  metricsContainer: {
    width: '100%',
  },
});
