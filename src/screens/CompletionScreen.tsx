import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { ChallengeResult } from "../types/result";

interface CompletionScreenProps {
  result: ChallengeResult;
  onComeAgain: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  result,
  onComeAgain,
}) => {
  const insets = useSafeAreaInsets();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const badgeSlideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(badgeSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        {/* Animated Celebration Badge */}
        <Animated.View
          style={[
            styles.celebrationCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.checkOuterRing}>
            <View style={styles.checkInnerCircle}>
              <Ionicons
                name="checkmark-done"
                size={44}
                color={colors.textInverse}
              />
            </View>
          </View>
        </Animated.View>

        {/* Headings */}
        <Animated.View
          style={[
            styles.textSection,
            {
              transform: [{ translateY: badgeSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.headerTag}>CHALLENGE COMPLETE</Text>
          <Text style={styles.mainTitle}>Great Work Today!</Text>
          <Text style={styles.subTitle}>
            You've successfully exercised your pronunciation and speaking
            fluency.
          </Text>

          {/* Achievement Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Challenge</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {result.challengeTitle}
              </Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Overall Score</Text>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>
                  {result.overallScore} / 100
                </Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Difficulty</Text>
              <Text style={styles.difficultyValue}>{result.difficulty}</Text>
            </View>
          </View>

          {/* Motivation Box */}
          <View style={styles.motivationBox}>
            <Ionicons
              name="flame"
              size={22}
              color="#EA580C"
              style={{ marginRight: spacing.sm }}
            />
            <Text style={styles.motivationText}>
              Keep practicing consistently and come back tomorrow to keep your
              speaking streak going!
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          title="Return Home"
          onPress={onComeAgain}
          variant="primary"
          size="lg"
          icon={
            <Ionicons
              name="home-outline"
              size={18}
              color={colors.textInverse}
            />
          }
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  celebrationCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  checkOuterRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successLight,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInnerCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  textSection: {
    alignItems: "center",
    width: "100%",
  },
  headerTag: {
    ...typography.badge,
    color: colors.successDark,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  mainTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subTitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  summaryCard: {
    width: "100%",
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
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
    maxWidth: "60%",
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.surfaceSubtle,
    marginVertical: spacing.sm,
  },
  scorePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
  },
  scorePillText: {
    ...typography.caption,
    fontWeight: "800",
    color: colors.primary,
  },
  difficultyValue: {
    ...typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
    textTransform: "capitalize",
  },
  motivationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: spacing.roundMedium,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  motivationText: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 18,
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
