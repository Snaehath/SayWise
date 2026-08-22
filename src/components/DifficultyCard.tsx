import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          iconColor: '#10B981',
          bgClass: 'bg-emerald-50',
          textClass: 'text-emerald-700',
          icon: 'leaf-outline' as const,
        };
      case 'intermediate':
        return {
          iconColor: '#3B82F6',
          bgClass: 'bg-blue-50',
          textClass: 'text-blue-700',
          icon: 'flame-outline' as const,
        };
      case 'advanced':
        return {
          iconColor: '#8B5CF6',
          bgClass: 'bg-purple-50',
          textClass: 'text-purple-700',
          icon: 'trophy-outline' as const,
        };
    }
  };

  const theme = getTheme();

  return (
    <Pressable
      onPress={() => onSelect(difficulty)}
      className={`rounded-2xl border-2 p-4 mb-4 shadow-sm active:scale-[0.985] ${
        selected
          ? 'border-indigo-600 bg-indigo-50/40 shadow-md shadow-indigo-500/10'
          : 'border-slate-200 bg-white'
      }`}
    >
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${theme.bgClass}`}>
          <Ionicons name={theme.icon} size={22} color={theme.iconColor} />
        </View>

        <View className="flex-1 pr-2">
          <View className="flex-row items-center mb-1">
            <Text className="text-[17px] font-bold text-slate-900 mr-2">{title}</Text>
            <View className={`px-2 py-0.5 rounded-full ${theme.bgClass}`}>
              <Text className={`text-[10px] font-bold uppercase tracking-wider ${theme.textClass}`}>{tag}</Text>
            </View>
          </View>
          <Text className="text-xs text-slate-500 leading-4">{description}</Text>
        </View>

        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
          }`}
        >
          {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
      </View>
    </Pressable>
  );
};
