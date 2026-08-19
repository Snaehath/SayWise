import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Difficulty } from '../types/challenge';

interface DifficultyCardProps {
  difficulty: Difficulty;
  title: string;
  description: string;
  tag: string;
  selected: boolean;
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  title,
  description,
  tag,
  selected,
  onSelect,
}) => {
  const getTheme = () => {
    switch (difficulty) {
      case 'beginner':
        return {
          color: colors.beginner,
          bg: colors.beginnerBg,
          icon: 'leaf-outline' as const,
        };
      case 'intermediate':
        return {
          color: colors.intermediate,
          bg: colors.intermediateBg,
          icon: 'flame-outline' as const,
        };
      case 'advanced':
        return {
          color: colors.advanced,
          bg: colors.advancedBg,
          icon: 'trophy-outline' as const,
        };
    }
  };

  const theme = getTheme();

  return (
    <Pressable
      onPress={() => onSelect(difficulty)}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
          <Ionicons name={theme.icon} size={24} color={theme.color} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.tagBadge, { backgroundColor: theme.bg }]}>
              <Text style={[styles.tagText, { color: theme.color }]}>{tag}</Text>
            </View>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={[styles.checkCircle, selected && styles.checkCircleSelected]}>
          {selected && <Ionicons name="checkmark" size={16} color={colors.textInverse} />}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.cardBorderActive,
    backgroundColor: '#FAF5FF',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.h3,
    fontSize: 17,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.roundPill,
  },
  tagText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
