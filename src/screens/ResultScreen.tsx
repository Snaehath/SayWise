import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { MascotMessage } from '../components/MascotMessage';
import { ScoreCard } from '../components/ScoreCard';
import { recordingService } from '../services/recordingService';
import { challengeStorage } from '../storage/challengeStorage';
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

    try {
      challengeStorage.saveChallengeResult(challengeResult);
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

  const getDifficultyTheme = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return { bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', label: 'Beginner' };
      case 'intermediate':
        return { bgClass: 'bg-blue-50', textClass: 'text-blue-700', label: 'Intermediate' };
      case 'advanced':
        return { bgClass: 'bg-purple-50', textClass: 'text-purple-700', label: 'Advanced' };
    }
  };

  const difficultyTheme = getDifficultyTheme();

  const getEmotionalHeadline = (score: number) => {
    if (score >= 90) return { title: 'Outstanding Speech! 🌟', mood: 'celebrating' as const };
    if (score >= 80) return { title: 'Impressive Cadence! 🚀', mood: 'celebrating' as const };
    if (score >= 70) return { title: 'Great Rhythm & Flow! 👏', mood: 'encouraging' as const };
    return { title: 'Solid Practice Session! 💪', mood: 'encouraging' as const };
  };

  const headline = getEmotionalHeadline(result.overallScore);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header
        title="Your Result"
        onBack={onBackToHome}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge & AI Header Row */}
        <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-2.5 border border-slate-200 shadow-sm mb-3">
          <View className="flex-1 pr-2">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CHALLENGE</Text>
            <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
              {challenge.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className={`px-2.5 py-1 rounded-full ${difficultyTheme.bgClass}`}>
              <Text className={`text-xs font-bold uppercase ${difficultyTheme.textClass}`}>
                {difficultyTheme.label}
              </Text>
            </View>
            <View className="flex-row items-center bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              <Ionicons name="sparkles" size={12} color="#4F46E5" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-indigo-600">AI Verified</Text>
            </View>
          </View>
        </View>

        {/* Mascot Emotional Reaction */}
        <MascotMessage
          mood={headline.mood}
          title={headline.title}
          message={
            result.overallScore >= 85
              ? `You spoke with great confidence! Your natural flow is shining through.`
              : `Nice work exercising your vocal chords! Daily consistency is your secret weapon.`
          }
          size="sm"
          className="mb-3"
        />

        {/* Compact Score Dashboard Card */}
        <ScoreCard
          overallScore={result.overallScore}
          pronunciationScore={result.pronunciationScore}
          accuracyScore={result.accuracyScore}
          fluencyScore={result.fluencyScore}
          pacingScore={result.pacingScore}
        />

        {/* AI Coaching Feedback Card */}
        <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="chatbubbles-outline" size={20} color="#4F46E5" />
            <Text className="text-base font-bold text-slate-900">Coach Feedback</Text>
          </View>
          <Text className="text-sm text-slate-800 leading-6 mb-3">{result.feedback}</Text>

          {/* Strengths & Improvements */}
          <View className="gap-3 pt-3 border-t border-slate-100">
            {result.strengths && result.strengths.length > 0 && (
              <View>
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Key Strengths
                </Text>
                {result.strengths.map((item, index) => (
                  <View key={index} className="flex-row items-start gap-2 mb-1.5">
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                    <Text className="text-sm text-slate-700 flex-1 leading-5">{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.improvements && result.improvements.length > 0 && (
              <View>
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Areas for Improvement
                </Text>
                {result.improvements.map((item, index) => (
                  <View key={index} className="flex-row items-start gap-2 mb-1.5">
                    <Ionicons name="arrow-up-circle" size={16} color="#3B82F6" style={{ marginTop: 2 }} />
                    <Text className="text-sm text-slate-700 flex-1 leading-5">{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Complete CTA */}
      <View className="bg-white px-4 pt-3 pb-5 border-t border-slate-200 shadow-lg">
        <Button
          title="Complete Challenge"
          onPress={handleCompleteChallenge}
          variant="primary"
          size="lg"
          loading={isSaving}
          icon={<Ionicons name="checkmark-done" size={20} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};
