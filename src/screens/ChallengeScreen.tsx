import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { RecordingVisualizer } from '../components/RecordingVisualizer';
import { recordingService } from '../services/recordingService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Challenge } from '../types/challenge';

interface ChallengeScreenProps {
  challenge: Challenge;
  onBack: () => void;
  onFinishRecording: (audioPath: string, durationSec: number) => void;
}

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({
  challenge,
  onBack,
  onFinishRecording,
}) => {
  const insets = useSafeAreaInsets();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const activeUriRef = useRef<string | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      try {
        if (audioRecorder.isRecording) {
          audioRecorder.stop();
        }
      } catch {
        // Safe disposal
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setIsPreparing(true);
    setPermissionDenied(false);

    try {
      const permission = await recordingService.requestPermission();
      if (!permission) {
        setPermissionDenied(true);
        setIsPreparing(false);
        Alert.alert(
          'Microphone Permission Required',
          'SayWise needs microphone access to record and analyze your speaking practice. Please grant microphone permission to continue.'
        );
        return;
      }

      // Prepare and start recording
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      setIsRecording(true);
      setDurationSec(0);
      startTimeRef.current = Date.now();

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDurationSec(elapsed);
      }, 1000);
    } catch (error) {
      console.warn('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Unable to start recording. Please check microphone settings and try again.');
    } finally {
      setIsPreparing(false);
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await audioRecorder.stop();
      setIsRecording(false);

      const totalDuration = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
      const recordedUri = audioRecorder.uri || `temp_rec_${Date.now()}.m4a`;
      activeUriRef.current = recordedUri;

      // Guard: very short recording
      if (totalDuration < 2) {
        Alert.alert(
          'Recording Too Short',
          'Please read the full paragraph aloud so we can accurately evaluate your pronunciation and pacing.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                recordingService.deleteTemporaryAudio(recordedUri);
                setDurationSec(0);
              },
            },
          ]
        );
        return;
      }

      onFinishRecording(recordedUri, totalDuration);
    } catch (error) {
      console.warn('Failed to stop recording:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', 'Failed to complete audio recording. Please try again.');
    }
  };

  const handleBackPress = () => {
    if (isRecording) {
      Alert.alert(
        'Stop Recording?',
        'Navigating away will discard your current recording.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard & Go Back',
            style: 'destructive',
            onPress: async () => {
              if (timerRef.current) clearInterval(timerRef.current);
              try {
                await audioRecorder.stop();
                if (audioRecorder.uri) {
                  await recordingService.deleteTemporaryAudio(audioRecorder.uri);
                }
              } catch {
                // Ignore
              }
              onBack();
            },
          },
        ]
      );
    } else {
      onBack();
    }
  };

  const getDifficultyBadge = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return { label: 'Beginner', bg: colors.beginnerBg, text: colors.beginner };
      case 'intermediate':
        return { label: 'Intermediate', bg: colors.intermediateBg, text: colors.intermediate };
      case 'advanced':
        return { label: 'Advanced', bg: colors.advancedBg, text: colors.advanced };
    }
  };

  const badge = getDifficultyBadge();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header */}
      <Header
        onBack={handleBackPress}
        title="Speaking Challenge"
        rightElement={
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge Header Info */}
        <View style={styles.titleSection}>
          <Text style={styles.challengeId}>Challenge #{challenge.id.replace(/[^0-9]/g, '') || '001'}</Text>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>

          {challenge.focusAreas && (
            <View style={styles.focusPillsRow}>
              {challenge.focusAreas.map((area, index) => (
                <View key={index} style={styles.focusPill}>
                  <Ionicons name="sparkles-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.focusPillText}>{area}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Focus Paragraph Card */}
        <View style={styles.paragraphCard}>
          <View style={styles.paragraphHeader}>
            <Ionicons name="volume-medium-outline" size={18} color={colors.textMuted} />
            <Text style={styles.readAloudLabel}>READ ALOUD CLEARLY</Text>
          </View>
          <Text style={styles.paragraphText}>{challenge.paragraph}</Text>
        </View>

        {/* Tips Box */}
        <View style={styles.tipsBox}>
          <Ionicons name="bulb-outline" size={18} color={colors.warning} style={{ marginRight: spacing.sm }} />
          <Text style={styles.tipsText}>
            Speak at a natural conversational tempo. Emphasize keywords and pause naturally at punctuation.
          </Text>
        </View>

        {/* Permission Denied Warning */}
        {permissionDenied && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.recording} style={{ marginRight: spacing.sm }} />
            <Text style={styles.errorText}>
              Microphone permission is required to complete this speaking challenge.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Recording Section */}
      <View style={styles.bottomRecordingSection}>
        {isRecording ? (
          <View style={styles.activeRecordingBox}>
            <RecordingVisualizer durationSec={durationSec} />
            <Button
              title="Stop Reading"
              onPress={handleStopRecording}
              variant="danger"
              size="lg"
              icon={<Ionicons name="stop" size={18} color={colors.textInverse} />}
              style={styles.stopButton}
            />
          </View>
        ) : (
          <View style={styles.startRecordingBox}>
            <Button
              title="Start Reading"
              onPress={handleStartRecording}
              variant="primary"
              size="lg"
              loading={isPreparing}
              icon={<Ionicons name="mic" size={22} color={colors.textInverse} />}
            />
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
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  challengeId: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  challengeTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: spacing.xs,
  },
  focusPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.roundPill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  focusPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  paragraphCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.roundLarge,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: spacing.md,
  },
  paragraphHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 6,
  },
  readAloudLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  paragraphText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    lineHeight: 30,
    letterSpacing: 0.1,
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: spacing.roundMedium,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginTop: spacing.xs,
  },
  tipsText: {
    ...typography.bodySmall,
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.recordingLight,
    padding: spacing.md,
    borderRadius: spacing.roundMedium,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.recordingDark,
    flex: 1,
    fontWeight: '500',
  },
  bottomRecordingSection: {
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
  startRecordingBox: {
    width: '100%',
  },
  activeRecordingBox: {
    width: '100%',
  },
  stopButton: {
    marginTop: spacing.xs,
  },
});
