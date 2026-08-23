import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { DifficultyCard } from '../components/DifficultyCard';
import { Header } from '../components/Header';
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

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header onBack={onBack} title="Difficulty Level" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <Text className="text-2xl font-extrabold text-slate-900 mb-1">Select Your Level</Text>
          <Text className="text-sm text-slate-500 font-medium">
            Choose your preferred challenge tier for today.
          </Text>
        </View>

        {/* 3 Difficulty Cards */}
        <View className="mb-4">
          <DifficultyCard
            difficulty="beginner"
            title="Beginner"
            tag="A1 - A2"
            description="Short, crisp sentences to warm up and build core articulation."
            selected={selectedDifficulty === 'beginner'}
            onSelect={setSelectedDifficulty}
          />

          <DifficultyCard
            difficulty="intermediate"
            title="Intermediate"
            tag="B1 - B2"
            description="Natural conversational sentences for speaking rhythm & linking."
            selected={selectedDifficulty === 'intermediate'}
            onSelect={setSelectedDifficulty}
          />

          <DifficultyCard
            difficulty="advanced"
            title="Advanced"
            tag="C1 - C2"
            description="Rich expressions and nuanced native phrasing for mastery."
            selected={selectedDifficulty === 'advanced'}
            onSelect={setSelectedDifficulty}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View className="bg-white px-5 pt-3.5 pb-6 border-t border-slate-200 shadow-lg">
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
