import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { challengeStorage } from '../storage/challengeStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ChallengeResult } from '../types/result';

interface WelcomeScreenProps {
  onStartChallenge: () => void;
  onViewCompletedResult?: (result: ChallengeResult) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartChallenge,
  onViewCompletedResult,
}) => {
  const insets = useSafeAreaInsets();
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<ChallengeResult | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const loadState = () => {
    const completed = challengeStorage.isCompletedToday();
    const result = challengeStorage.getTodayResult();
    const streak = challengeStorage.getStreakCount();
    const hasSeen = challengeStorage.hasSeenOnboarding();
    const history = challengeStorage.getHistory();

    setIsCompletedToday(completed);
    setTodayResult(result);
    setStreakCount(streak);
    setIsNewUser(!hasSeen && history.length === 0);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleStart = () => {
    challengeStorage.setOnboardingSeen();
    onStartChallenge();
  };

  const handleResetDev = () => {
    Alert.alert(
      'Reset Daily Progress',
      'This will clear today\'s completion state, streak, and onboarding state for testing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            challengeStorage.resetAppProgress();
            loadState();
          },
        },
      ]
    );
  };

  const selectedDiff = challengeStorage.getSelectedDifficulty() || 'beginner';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Brand & Streak Badge */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="mic" size={20} color={colors.textInverse} />
            </View>
            <View>
              <Text style={styles.brandTitle}>SayWise</Text>
              <Text style={styles.brandSubtitle}>English Speaking</Text>
            </View>
          </View>

          {/* Day Streak Count Badge */}
          <View
            style={[
              styles.streakBadge,
              streakCount > 0 ? styles.streakBadgeActive : styles.streakBadgeZero,
            ]}
          >
            <Ionicons
              name={streakCount > 0 ? 'flame' : 'flash-outline'}
              size={16}
              color={streakCount > 0 ? '#EA580C' : colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.streakText,
                { color: streakCount > 0 ? '#C2410C' : colors.primary },
              ]}
            >
              {streakCount > 0 ? `${streakCount} Day Streak` : '0 Day Streak'}
            </Text>
          </View>
        </View>

        {/* 1. NEW USER ONBOARDING HERO CARD */}
        {(isNewUser || showHowItWorks) && (
          <View style={styles.heroCard}>
            <View style={styles.heroTagRow}>
              <View style={styles.heroTag}>
                <Ionicons name="sparkles" size={13} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.heroTagText}>Daily Speaking Practice</Text>
              </View>
              {showHowItWorks && (
                <Pressable onPress={() => setShowHowItWorks(false)} hitSlop={10}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
                </Pressable>
              )}
            </View>

            <Text style={styles.heroHeading}>Speak with Confidence</Text>
            <Text style={styles.heroSubtitle}>
              Practice spoken English in just 2 minutes a day with instant AI feedback.
            </Text>

            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <View style={[styles.stepIconCircle, { backgroundColor: colors.beginnerBg }]}>
                  <Ionicons name="book-outline" size={16} color={colors.beginner} />
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={styles.stepTitle}>Read Aloud</Text>
                  <Text style={styles.stepDesc}>Curated daily paragraphs</Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.stepIconCircle, { backgroundColor: colors.intermediateBg }]}>
                  <Ionicons name="mic-outline" size={16} color={colors.intermediate} />
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={styles.stepTitle}>Voice Record</Text>
                  <Text style={styles.stepDesc}>Live speech capture & analysis</Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.stepIconCircle, { backgroundColor: colors.advancedBg }]}>
                  <Ionicons name="analytics-outline" size={16} color={colors.advanced} />
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={styles.stepTitle}>Instant Feedback</Text>
                  <Text style={styles.stepDesc}>Pronunciation, fluency & pacing scores</Text>
                </View>
              </View>
            </View>

            {isNewUser && (
              <Button
                title="Start Your First Challenge"
                onPress={handleStart}
                variant="primary"
                size="lg"
                icon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
                style={{ marginTop: spacing.md }}
              />
            )}
          </View>
        )}

        {/* 2. RETURNING USER STREAMLINED DIRECT FLOW */}
        {!isNewUser && (
          <>
            {isCompletedToday && todayResult ? (
              /* Completed Today State */
              <View style={styles.completedCard}>
                <View style={styles.completedHeader}>
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.completedStatusTitle}>Today's Goal Complete</Text>
                  </View>
                  <View style={styles.scoreTag}>
                    <Text style={styles.scoreTagText}>{todayResult.overallScore} / 100</Text>
                  </View>
                </View>
                <Text style={styles.completedChallengeName}>
                  "{todayResult.challengeTitle}"
                </Text>
                <Text style={styles.completedNotice}>
                  Great job keeping your {streakCount} day streak alive! Come back tomorrow for your next speaking challenge.
                </Text>

                <View style={styles.completedActions}>
                  {onViewCompletedResult && (
                    <Button
                      title="View Result"
                      onPress={() => onViewCompletedResult(todayResult)}
                      variant="secondary"
                      size="md"
                      icon={<Ionicons name="stats-chart-outline" size={16} color={colors.primary} />}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                  )}
                  <Button
                    title="Try Again"
                    onPress={handleStart}
                    variant="primary"
                    size="md"
                    icon={<Ionicons name="refresh" size={16} color={colors.textInverse} />}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              /* Ready for Daily Challenge (Direct, Low Friction) */
              <View style={styles.directChallengeCard}>
                <View style={styles.directHeaderRow}>
                  <View style={styles.readyTag}>
                    <View style={styles.readyDot} />
                    <Text style={styles.readyTagText}>TODAY'S CHALLENGE</Text>
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>{selectedDiff}</Text>
                  </View>
                </View>

                <Text style={styles.directHeading}>
                  {streakCount > 0
                    ? `Keep your ${streakCount} day streak active!`
                    : 'Ready for today’s speaking practice?'}
                </Text>

                <Text style={styles.directSubtext}>
                  Take 2 minutes to read your daily paragraph aloud and calibrate your pronunciation.
                </Text>

                <Button
                  title="Start Today's Challenge"
                  onPress={handleStart}
                  variant="primary"
                  size="lg"
                  icon={<Ionicons name="play" size={18} color={colors.textInverse} />}
                />
              </View>
            )}

            {/* Quick How It Works Info Toggle */}
            {!showHowItWorks && (
              <Pressable
                onPress={() => setShowHowItWorks(true)}
                style={styles.howItWorksButton}
                hitSlop={8}
              >
                <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={styles.howItWorksText}>How daily challenges work</Text>
              </Pressable>
            )}
          </>
        )}

        {/* Motivational Slogan Section (Italic text only) */}
        <View style={styles.sloganCard}>
          <Text style={styles.sloganText}>
            {isCompletedToday
              ? '"Consistency is the mother of mastery. You showed up today — rest well and come back stronger tomorrow!"'
              : '"Clear speech begins with small daily habits. Just two focused minutes today builds natural confidence."'}
          </Text>
        </View>

        {/* Dev Reset Utility */}
        <View style={styles.footerContainer}>
          <Pressable onPress={handleResetDev} hitSlop={10} style={styles.resetButton}>
            <Ionicons name="refresh-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={styles.resetButtonText}>Reset Progress & Onboarding (Dev Utility)</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingBottom: spacing.xl,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginRight: spacing.sm,
  },
  brandTitle: {
    ...typography.h2,
    fontSize: 20,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.roundPill,
    borderWidth: 1,
  },
  streakBadgeActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  streakBadgeZero: {
    backgroundColor: colors.primaryLight,
    borderColor: '#E0E7FF',
  },
  streakText: {
    ...typography.caption,
    fontWeight: '800',
    fontSize: 12,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  heroTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
  },
  heroTagText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  heroHeading: {
    ...typography.h1,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  stepsContainer: {
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: spacing.roundMedium,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  stepDesc: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  directChallengeCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: spacing.md,
  },
  directHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  readyTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  readyTagText: {
    ...typography.badge,
    fontSize: 11,
    color: colors.successDark,
  },
  levelPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: spacing.roundPill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  levelPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'capitalize',
    fontSize: 11,
  },
  directHeading: {
    ...typography.h2,
    fontSize: 21,
    lineHeight: 27,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  directSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  completedCard: {
    backgroundColor: colors.successLight,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.md,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  checkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedStatusTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.successDark,
  },
  scoreTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
    borderWidth: 1,
    borderColor: colors.success,
  },
  scoreTagText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.successDark,
  },
  completedChallengeName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  completedNotice: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  completedActions: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  howItWorksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  howItWorksText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sloganCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sloganText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  resetButtonText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
