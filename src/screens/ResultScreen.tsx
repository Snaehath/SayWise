import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mascot } from '../components/Mascot';
import { AudioShadowPlayer } from '../components/AudioShadowPlayer';
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

  const handleFinish = async () => {
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
      speakingSeconds: result.speakingSeconds || 48,
    };

    try {
      challengeStorage.saveChallengeResult(challengeResult);
    } catch (storageErr) {
      console.warn('Storage save warning:', storageErr);
    }

    try {
      if (audioPath) {
        await recordingService.deleteTemporaryAudio(audioPath);
      }
    } catch (audioErr) {
      console.warn('Audio delete warning:', audioErr);
    }

    setIsSaving(false);
    onComplete(challengeResult);
  };

  const handlePracticeAgain = () => {
    if (onBackToHome) {
      onBackToHome();
    }
  };

  // Formatted date
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateFormatted = `Today, ${timeFormatted}`;

  const headline = result.headline || 'Clear and natural.';
  const feedbackQuote = result.feedback || '"Your ideas were easy to follow."';
  const oneThingTitle = result.tomorrowFocus || 'Slow down before longer sentences.';
  const oneThingTip = 'Try a slightly longer pause between thoughts.';
  const spokenDuration = result.speakingSeconds || 48;

  // Breakdown scores
  const clarityScore = Math.round((result.accuracyScore + result.pronunciationScore) / 2) || 88;
  const fluencyScore = result.fluencyScore || 84;
  const pacingScore = result.pacingScore || 72;
  const expressionScore = result.expressionScore || 86;

  const metrics = [
    { label: 'Clarity', score: clarityScore },
    { label: 'Fluency', score: fluencyScore },
    { label: 'Pacing', score: pacingScore },
    { label: 'Expression', score: expressionScore },
  ];

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-3 pb-2 border-b border-slate-100">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center mr-2.5">
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-sm font-black text-slate-900">Session Complete</Text>
            <Text className="text-[11px] font-semibold text-slate-400">{dateFormatted}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onBackToHome || handleFinish}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot Celebration & Hero Score */}
        <View className="items-center py-2">
          <Mascot size={120} variant="celebrating" />

          {/* Big Score */}
          <View className="flex-row items-baseline mt-1">
            <Text className="text-4xl font-black text-indigo-900">
              {result.overallScore}
            </Text>
            <Text className="text-base font-bold text-slate-400 ml-1">/100</Text>
          </View>

          {/* Headline */}
          <Text className="text-xl font-black text-slate-900 mt-1 text-center">
            {headline}
          </Text>

          {/* Subtitle quote */}
          <Text className="text-xs font-medium text-slate-500 italic mt-0.5 text-center px-4">
            {feedbackQuote}
          </Text>

          {/* Audio take player pill */}
          {audioPath ? (
            <AudioShadowPlayer audioPath={audioPath} durationSec={spokenDuration} />
          ) : null}
        </View>

        {/* ONE THING Card */}
        <View className="bg-indigo-700 rounded-[26px] p-5 shadow-sm mb-4">
          <View className="self-start flex-row items-center bg-indigo-800/80 px-2.5 py-1 rounded-full mb-3">
            <View className="w-1.5 h-1.5 rounded-full bg-indigo-300 mr-1.5" />
            <Text className="text-[10px] font-black text-indigo-200 tracking-wider">
              ONE THING
            </Text>
          </View>

          <Text className="text-lg font-black text-white leading-snug">
            {oneThingTitle}
          </Text>

          <Text className="text-xs font-medium text-indigo-200 mt-1">
            {oneThingTip}
          </Text>
        </View>

        {/* YOUR SPEAKING Metric Breakdown */}
        <View className="bg-white rounded-[26px] p-5 border border-slate-200/80 shadow-sm mb-5">
          <Text className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-4">
            YOUR SPEAKING
          </Text>

          <View className="gap-3.5">
            {metrics.map((metric) => (
              <View key={metric.label}>
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-xs font-bold text-slate-700">{metric.label}</Text>
                  <Text className="text-xs font-extrabold text-slate-800">{metric.score}</Text>
                </View>
                <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-slate-700 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, metric.score))}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions Row */}
        <View className="flex-row gap-3 pt-2">
          <TouchableOpacity
            onPress={handlePracticeAgain}
            activeOpacity={0.8}
            className="flex-1 bg-white border border-slate-300 py-4 rounded-full items-center justify-center flex-row shadow-sm"
          >
            <Ionicons name="refresh" size={16} color="#334155" style={{ marginRight: 6 }} />
            <Text className="text-sm font-bold text-slate-800">
              Practice again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFinish}
            activeOpacity={0.85}
            className="flex-1 bg-indigo-600 py-4 rounded-full items-center justify-center flex-row shadow-lg shadow-indigo-200"
          >
            <Text className="text-sm font-bold text-white">
              Done ✓
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
