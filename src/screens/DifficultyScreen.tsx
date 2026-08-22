import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { DifficultyCard } from '../components/DifficultyCard';
import { Header } from '../components/Header';
import { MascotMessage } from '../components/MascotMessage';
import { challengeService } from '../services/challengeService';
import { challengeStorage } from '../storage/challengeStorage';
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

  const getDifficultyTip = () => {
    switch (selectedDifficulty) {
      case 'beginner':
        return 'Great choice! Short, crisp sentences perfect for warming up your articulation and pronunciation.';
      case 'intermediate':
        return 'Awesome! Longer conversational sentences designed to train your speaking rhythm and sentence linking.';
      case 'advanced':
        return 'Challenging! Complex expressions and rich vocabulary for native-level fluency and pacing.';
    }
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header onBack={onBack} title="Difficulty Level" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 6, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-3.5">
          <Text className="text-xl font-extrabold text-slate-900 mb-1">Select Today's Level</Text>
          <Text className="text-xs text-slate-500 font-medium">
            Choose the pace that matches your speaking comfort today.
          </Text>
        </View>

        {/* 3 Difficulty Cards */}
        <View className="gap-0.5 mb-3">
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

        {/* Dynamic Coach Mascot Guidance */}
        <MascotMessage
          mood="encouraging"
          title="Coach Tip"
          message={getDifficultyTip()}
          size="sm"
          className="mb-3"
        />

        {/* Training Benefits Banner */}
        <View className="bg-indigo-50/70 rounded-2xl p-3.5 border border-indigo-100/80 flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons name="sparkles" size={18} color="#4F46E5" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-indigo-900 leading-4">
              Daily Habit Building
            </Text>
            <Text className="text-[11px] text-indigo-700 leading-4 mt-0.5">
              Completing any level counts toward your consecutive day speaking streak!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View className="bg-white px-5 pt-3.5 pb-5 border-t border-slate-200 shadow-lg">
        <Button
          title="Continue to Challenge"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};
