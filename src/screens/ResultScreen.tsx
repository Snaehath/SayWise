import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioShadowPlayer } from '../components/AudioShadowPlayer';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ScoreCard } from '../components/ScoreCard';
import { WordPhoneticModal } from '../components/WordPhoneticModal';
import { recordingService } from '../services/recordingService';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge } from '../types/challenge';
import { AnalysisResult, ChallengeResult, WordAnalysis } from '../types/result';

// props
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

  // states
  const [isSaving, setIsSaving] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null);

  // handlers
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
      words: result.words,
      wpm: result.wpm,
      phonemesMastered: result.phonemesMastered,
      phonemesToPractice: result.phonemesToPractice,
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

  // helpers
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
  const topStrength = result.strengths?.[0] || 'Clear vowel articulation';
  const topImprovement = result.improvements?.[0] || 'Keep a steady speaking rhythm';

  const words = result.words && result.words.length > 0
    ? result.words
    : challenge.paragraph.split(/\s+/).map((w) => ({
        word: w.replace(/[^\w'-]/g, ''),
        ipa: `/${w.toLowerCase()}/`,
        status: 'perfect' as const,
        tip: 'Clear pronunciation',
      }));

  // render
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* header */}
      <Header
        title="Your Result"
        onBack={onBackToHome}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 6, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* challenge title badge */}
        <View className="flex-row items-center justify-between bg-white rounded-3xl px-5 py-3.5 border border-slate-200 shadow-sm mb-3.5">
          <View className="flex-1 pr-2">
            <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">CHALLENGE</Text>
            <Text className="text-lg font-extrabold text-slate-900 mt-0.5" numberOfLines={1}>
              {challenge.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className={`px-3 py-1 rounded-full ${difficultyTheme.bgClass}`}>
              <Text className={`text-xs font-bold uppercase ${difficultyTheme.textClass}`}>
                {difficultyTheme.label}
              </Text>
            </View>
            <View className="flex-row items-center bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <Ionicons name="sparkles" size={13} color="#4F46E5" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-indigo-600">AI Verified</Text>
            </View>
          </View>
        </View>

        {/* score ring & metric bars */}
        <ScoreCard
          overallScore={result.overallScore}
          pronunciationScore={result.pronunciationScore}
          accuracyScore={result.accuracyScore}
          fluencyScore={result.fluencyScore}
          pacingScore={result.pacingScore}
        />

        {/* audio player */}
        <View className="mb-3.5">
          <AudioShadowPlayer audioPath={audioPath} />
        </View>

        {/* word heatmap card */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-3.5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="finger-print-outline" size={18} color="#6366F1" />
              <Text className="text-sm font-extrabold text-slate-900">Word-by-Word Articulation</Text>
            </View>
            <Text className="text-[11px] font-bold text-slate-400">Tap word for IPA</Text>
          </View>

          {/* word chips */}
          <View className="flex-row flex-wrap gap-1.5 leading-7">
            {words.map((item, index) => {
              let chipBg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
              if (item.status === 'needs_work') {
                chipBg = 'bg-rose-50 border-rose-200 text-rose-900';
              } else if (item.status === 'good') {
                chipBg = 'bg-amber-50 border-amber-200 text-amber-900';
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedWord(item)}
                  className={`px-2.5 py-1 rounded-xl border ${chipBg} active:opacity-75`}
                >
                  <Text className="text-sm font-bold">{item.word}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* legend */}
          <View className="flex-row items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100">
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-slate-600">Crisp (85+)</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <Text className="text-xs font-semibold text-slate-600">Review</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <Text className="text-xs font-semibold text-slate-600">Needs Work</Text>
            </View>
          </View>
        </View>

        {/* coaching notes */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-2 gap-3.5">
          <Text className="text-sm font-semibold text-slate-800 leading-6" numberOfLines={4}>
            "{result.feedback}"
          </Text>

          {/* top strength */}
          <View className="flex-row items-start bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200">
            <Ionicons name="checkmark-circle" size={20} color="#059669" style={{ marginRight: 8, marginTop: 1 }} />
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Top Strength</Text>
              <Text className="text-[13px] font-bold text-emerald-950 mt-0.5 leading-5" numberOfLines={2}>
                {topStrength}
              </Text>
            </View>
          </View>

          {/* key focus */}
          <View className="flex-row items-start bg-blue-50/90 p-3.5 rounded-2xl border border-blue-200">
            <Ionicons name="arrow-up-circle" size={20} color="#2563EB" style={{ marginRight: 8, marginTop: 1 }} />
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Key Focus</Text>
              <Text className="text-[13px] font-bold text-blue-950 mt-0.5 leading-5" numberOfLines={2}>
                {topImprovement}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* phonetic modal */}
      <WordPhoneticModal
        wordData={selectedWord}
        visible={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />

      {/* complete cta */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-lg">
        <Button
          title="Complete Challenge"
          onPress={handleCompleteChallenge}
          variant="primary"
          size="lg"
          loading={isSaving}
          icon={<Ionicons name="checkmark-done" size={22} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};
