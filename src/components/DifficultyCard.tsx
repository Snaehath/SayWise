import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getTheme = () => {
    switch (difficulty) {
      case 'beginner':
        return {
          iconColor: '#10B981',
          bgClass: 'bg-emerald-50',
          borderClass: selected ? 'border-emerald-500' : 'border-emerald-100',
          textClass: 'text-emerald-700',
          icon: 'leaf' as const,
        };
      case 'intermediate':
        return {
          iconColor: '#3B82F6',
          bgClass: 'bg-blue-50',
          borderClass: selected ? 'border-blue-500' : 'border-blue-100',
          textClass: 'text-blue-700',
          icon: 'flash' as const,
        };
      case 'advanced':
        return {
          iconColor: '#8B5CF6',
          bgClass: 'bg-purple-50',
          borderClass: selected ? 'border-purple-500' : 'border-purple-100',
          textClass: 'text-purple-700',
          icon: 'trophy' as const,
        };
    }
  };

  const theme = getTheme();

  // Pop animation on select
  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onSelect(difficulty)}
        className={`rounded-3xl border-2 p-4 mb-3.5 shadow-sm transition-all ${
          selected
            ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/10'
            : 'border-slate-200 bg-white'
        }`}
      >
        <View className="flex-row items-center">
          {/* Crisp Clean Vector Emblem */}
          <View
            className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl items-center justify-center mr-3.5 ${theme.bgClass} border ${theme.borderClass}`}
          >
            <Ionicons name={theme.icon} size={26} color={theme.iconColor} />
          </View>

          <View className="flex-1 pr-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-lg font-extrabold text-slate-900 mr-2">{title}</Text>
              <View className={`px-2.5 py-0.5 rounded-full ${theme.bgClass}`}>
                <Text className={`text-[10px] font-extrabold uppercase tracking-wider ${theme.textClass}`}>{tag}</Text>
              </View>
            </View>
            <Text className="text-xs text-slate-600 leading-4">{description}</Text>
          </View>

          {/* Selection Radio Circle */}
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
            }`}
          >
            {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};
