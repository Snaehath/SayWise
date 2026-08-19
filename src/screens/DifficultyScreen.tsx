import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { DifficultyCard } from '../components/DifficultyCard';
import { Header } from '../components/Header';
import { challengeService } from '../services/challengeService';
import { challengeStorage } from '../storage/challengeStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Challenge, Difficulty } from '../types/challenge';

interface DifficultyScreenProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: Difficulty, challenge: Challenge) => void;
}

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  onBack,
  onSelectDifficulty,
}) => {
  const insets = useSafeAreaInsets();
  const initialDifficulty = challengeStorage.getSelectedDifficulty() || 'beginner';
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialDifficulty);

  const handleContinue = () => {
    challengeStorage.setSelectedDifficulty(selectedDifficulty);
    const challenge = challengeService.getTodayChallenge(selectedDifficulty);
    onSelectDifficulty(selectedDifficulty, challenge);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header onBack={onBack} title="Difficulty Level" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Select Today's Challenge Level</Text>
          <Text style={styles.subtitle}>
            Choose the difficulty that matches your speaking goals today.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <DifficultyCard
            difficulty="beginner"
            title="Beginner"
            tag="A1 - A2"
            description="Short sentences and common vocabulary. Perfect for warming up and building core pronunciation."
            selected={selectedDifficulty === 'beginner'}
            onSelect={setSelectedDifficulty}
          />

          <DifficultyCard
            difficulty="intermediate"
            title="Intermediate"
            tag="B1 - B2"
            description="Longer sentences and more natural conversational English. Focuses on sentence linking and rhythm."
            selected={selectedDifficulty === 'intermediate'}
            onSelect={setSelectedDifficulty}
          />

          <DifficultyCard
            difficulty="advanced"
            title="Advanced"
            tag="C1 - C2"
            description="Complex sentences, challenging vocabulary, and natural speaking patterns for mastery."
            selected={selectedDifficulty === 'advanced'}
            onSelect={setSelectedDifficulty}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="lg"
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
  headerSection: {
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cardsContainer: {
    marginTop: spacing.sm,
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
