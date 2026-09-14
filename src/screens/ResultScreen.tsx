import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioShadowPlayer } from '../components/AudioShadowPlayer';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { MetricProgressBar } from '../components/MetricProgressBar';
import { recordingService } from '../services/recordingService';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge } from '../types/challenge';
import { AnalysisResult, ChallengeResult } from '../types/result';

// types
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
  // hooks
  const insets = useSafeAreaInsets();

  // state
  const [isSaving, setIsSaving] = useState(false);

  // handlers
  const handleCompleteChallenge = async () => {
    setIsSaving(true);

    const challengeResult: ChallengeResult = {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      challengeType: challenge.type,
      difficulty: challenge.difficulty,
      completedAt: new Date().toISOString(),
      overallScore: result.overallScore,
      pronunciationScore: result.pronunciationScore,
      accuracyScore: result.accuracyScore,
      fluencyScore: result.fluencyScore,
      pacingScore: result.pacingScore,
      expressionScore: result.expressionScore,
      headline: result.headline,
      tomorrowFocus: result.tomorrowFocus,
      feedback: result.feedback,
      wpm: result.wpm,
      speakingSeconds: result.speakingSeconds || 45,
    };

    try {
      const savedInfo = challengeStorage.saveChallengeResult(challengeResult);
      if (savedInfo.personalBestAlert) {
        challengeResult.personalBestAlert = savedInfo.personalBestAlert;
      }
    } catch (storageErr) {
      console.warn('Storage save warning:', storageErr);
    }

    try {
      await recordingService.deleteTemporaryAudio(audioPath);
    } catch (audioErr) {
      console.warn('Audio delete warning:', audioErr);
    }

    setIsSaving(false);
    onComplete(challengeResult);
  };

  const headline = result.headline || 'Clear pronunciation, but bring more life to your voice.';
  const tomorrowFocus = result.tomorrowFocus || 'Vary your pitch and intonation in your next session.';
  const spokenDuration = result.speakingSeconds || 45;

  // genuine session-to-session deltas
  const history = challengeStorage.getHistory();
  const previousSession = history.find((h) => h.completedAt !== (result as ChallengeResult).completedAt) || history[0];
  const hasPrevious = history.length > 0 && previousSession && previousSession.completedAt !== (result as ChallengeResult).completedAt;

  const prevClarity = hasPrevious ? Math.round((previousSession.accuracyScore + previousSession.pronunciationScore) / 2) : null;
  const prevFluency = hasPrevious ? previousSession.fluencyScore : null;
  const prevPacing = hasPrevious ? previousSession.pacingScore : null;
  const prevExpression = hasPrevious ? (previousSession.expressionScore || 70) : null;

  const currentClarity = Math.round((result.accuracyScore + result.pronunciationScore) / 2);
  const currentExpression = result.expressionScore || 65;

  const formatDelta = (curr: number, prev: number | null): { text: string; color: string } => {
    if (prev === null) {
      return { text: '—', color: 'text-slate-400' };
    }
    const diff = curr - prev;
    if (diff > 0) return { text: `+${diff}`, color: 'text-emerald-600' };
    if (diff < 0) return { text: `${diff}`, color: 'text-rose-500' };
    return { text: '0', color: 'text-slate-400' };
  };

  // render
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header
        title="Session Insights"
        onBack={onBackToHome}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* pb alert */}
        {result.personalBestAlert && (
          <View className="bg-amber-500 rounded-2xl p-3.5 mb-4 shadow-sm shadow-amber-500/30 flex-row items-center">
            <Ionicons name="trophy" size={20} color="#FFFFFF" />
            <Text className="text-sm font-extrabold text-white ml-2 flex-1">
              {result.personalBestAlert}
            </Text>
          </View>
        )}

        {/* 1. OVERALL SCORE & HEADLINE (EMOTIONAL PAYOFF) */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
              YOU SPOKE FOR {spokenDuration} SECONDS
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-black text-slate-900">{result.overallScore}</Text>
              <Text className="text-xs font-bold text-slate-400 ml-0.5">/100</Text>
            </View>
          </View>

          {/* headline */}
          <Text className="text-xl font-black text-slate-900 leading-7">
            "{headline}"
          </Text>
        </View>

        {/* 2. 🎯 YOUR FOCUS (ACTIONABLE COACHING STAR) */}
        <View className="bg-indigo-50/90 rounded-3xl p-5 border border-indigo-100 shadow-sm mb-4">
          <View className="flex-row items-center mb-2.5">
            <Ionicons name="sparkles" size={16} color="#4F46E5" />
            <Text className="text-xs font-black text-indigo-700 tracking-wider uppercase ml-1.5">
              🎯 YOUR FOCUS
            </Text>
          </View>

          <Text className="text-[11px] font-bold text-indigo-500 uppercase tracking-wide mb-1">
            One thing to work on:
          </Text>
          <Text className="text-base font-black text-indigo-950 leading-6">
            {tomorrowFocus}
          </Text>

          {result.feedback ? (
            <Text className="text-xs text-indigo-800/90 font-medium leading-4.5 mt-2.5 pt-2.5 border-t border-indigo-200/60">
              {result.feedback}
            </Text>
          ) : null}
        </View>

        {/* 3. 4 CORE METRICS */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <Text className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3 pb-2 border-b border-slate-100">
            YOUR SPEAKING METRICS
          </Text>

          <View className="space-y-2">
            <MetricProgressBar label="Fluency" score={result.fluencyScore} delta={formatDelta(result.fluencyScore, prevFluency)} />
            <MetricProgressBar label="Clarity" score={currentClarity} delta={formatDelta(currentClarity, prevClarity)} />
            <MetricProgressBar label="Pacing" score={result.pacingScore} delta={formatDelta(result.pacingScore, prevPacing)} />
            <MetricProgressBar label="Expression" score={currentExpression} delta={formatDelta(currentExpression, prevExpression)} />
          </View>
        </View>

        {/* 4. AUDIO SHADOW REPLAY */}
        <View className="mb-4">
          <AudioShadowPlayer audioPath={audioPath} />
        </View>
      </ScrollView>

      {/* 5. ACTION: DONE FOR TODAY */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-lg">
        <Button
          title="Done for Today"
          onPress={handleCompleteChallenge}
          variant="primary"
          size="lg"
          loading={isSaving}
          icon="checkmark-done"
        />
      </View>
    </View>
  );
};
