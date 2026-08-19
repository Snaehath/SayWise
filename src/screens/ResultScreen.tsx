import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ScoreCard } from '../components/ScoreCard';
import { recordingService } from '../services/recordingService';
import { challengeStorage } from '../storage/challengeStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Challenge } from '../types/challenge';
import { AnalysisResult, ChallengeResult } from '../types/result';

interface ResultScreenProps {
  challenge: Challenge;
  audioPath: string;
  result: AnalysisResult;
  onComplete: (savedResult: ChallengeResult) => void;
  onBackToHome?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  challenge,
  audioPath,
  result,
  onComplete,
  onBackToHome,
}) => {
  const insets = useSafeAreaInsets();
  const [isSaving, setIsSaving] = useState(false);

  const handleCompleteChallenge = async () => {
    setIsSaving(true);

    try {
      const challengeResult: ChallengeResult = {
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        difficulty: challenge.difficulty,
        completedAt: new Date().toISOString(),
        overallScore: result.overallScore,
        pronunciationScore: result.pronunciationScore,
        accuracyScore: result.accuracyScore,
        fluencyScore: result.fluencyScore,
        pacingScore: result.pacingScore,
        feedback: result.feedback,
      };

      // 1. Save structured result in MMKV
      challengeStorage.saveChallengeResult(challengeResult);

      // 2. Safely delete temporary audio file from cache
      await recordingService.deleteTemporaryAudio(audioPath);

      // 3. Move to Completion Screen
      onComplete(challengeResult);
    } catch (err) {
      console.warn('Error completing challenge:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getDifficultyTheme = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return { bg: colors.beginnerBg, text: colors.beginner, label: 'Beginner' };
      case 'intermediate':
        return { bg: colors.intermediateBg, text: colors.intermediate, label: 'Intermediate' };
      case 'advanced':
        return { bg: colors.advancedBg, text: colors.advanced, label: 'Advanced' };
    }
  };

  const difficultyTheme = getDifficultyTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header
        title="Your Result"
        onBack={onBackToHome}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Card with Breakdown */}
        <ScoreCard
          overallScore={result.overallScore}
          pronunciationScore={result.pronunciationScore}
          accuracyScore={result.accuracyScore}
          fluencyScore={result.fluencyScore}
          pacingScore={result.pacingScore}
        />

        {/* AI Coaching Feedback */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Speaking Feedback</Text>
          </View>
          <Text style={styles.feedbackText}>{result.feedback}</Text>

          {/* Strengths */}
          {result.strengths && result.strengths.length > 0 && (
            <View style={styles.bulletSection}>
              <Text style={styles.subheading}>Key Strengths</Text>
              {result.strengths.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginTop: 2 }} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Improvements */}
          {result.improvements && result.improvements.length > 0 && (
            <View style={styles.bulletSection}>
              <Text style={styles.subheading}>Areas for Improvement</Text>
              {result.improvements.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Ionicons name="arrow-up-circle" size={16} color={colors.intermediate} style={{ marginTop: 2 }} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Challenge Summary Meta */}
        <View style={styles.metaCard}>
          <View style={styles.metaLeft}>
            <Text style={styles.metaLabel}>CHALLENGE</Text>
            <Text style={styles.metaTitle}>{challenge.title}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: difficultyTheme.bg }]}>
            <Text style={[styles.diffBadgeText, { color: difficultyTheme.text }]}>
              {difficultyTheme.label}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Complete CTA */}
      <View style={styles.bottomBar}>
        <Button
          title="Complete Challenge"
          onPress={handleCompleteChallenge}
          variant="primary"
          size="lg"
          loading={isSaving}
          icon={<Ionicons name="checkmark-done" size={20} color={colors.textInverse} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  feedbackText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  bulletSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
  },
  subheading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: spacing.roundMedium,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  metaLeft: {
    flex: 1,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
  },
  diffBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bottomBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
});
