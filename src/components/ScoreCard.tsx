import React from 'react';
import { Text, View } from 'react-native';
import { ProgressBar } from './ProgressBar';

// props
interface ScoreCardProps {
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  pronunciationScore,
  accuracyScore,
  fluencyScore,
  pacingScore,
}) => {
  // helpers
  const getGradeInfo = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Excellent!',
        color: '#10B981',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderColor: '#10B981',
      };
    }
    if (score >= 80) {
      return {
        label: 'Great job!',
        color: '#4F46E5',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-700',
        borderColor: '#4F46E5',
      };
    }
    if (score >= 70) {
      return {
        label: 'Good effort!',
        color: '#3B82F6',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        borderColor: '#3B82F6',
      };
    }
    return {
      label: 'Keep practicing!',
      color: '#F59E0B',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderColor: '#F59E0B',
    };
  };

  const grade = getGradeInfo(overallScore);

  // render
  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-3">
      <View className="flex-row items-center justify-between">
        {/* score ring */}
        <View className="items-center justify-center pr-4 border-r border-slate-100 min-w-[112px]">
          <View
            className="w-22 h-22 w-[88px] h-[88px] rounded-full border-4 items-center justify-center bg-white shadow-sm mb-2"
            style={{ borderColor: grade.borderColor }}
          >
            <Text className="text-4xl font-extrabold leading-10" style={{ color: grade.color }}>
              {overallScore}
            </Text>
            <Text className="text-xs font-bold text-slate-400 -mt-0.5">/ 100</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${grade.bgClass}`}>
            <Text className={`text-xs font-extrabold uppercase tracking-wide ${grade.textClass}`}>
              {grade.label}
            </Text>
          </View>
        </View>

        {/* metric progress bars */}
        <View className="flex-1 pl-4 gap-1">
          <ProgressBar
            label="Pronunciation"
            score={pronunciationScore}
            color="#6366F1"
            delay={100}
          />
          <ProgressBar
            label="Accuracy"
            score={accuracyScore}
            color="#10B981"
            delay={200}
          />
          <ProgressBar
            label="Fluency"
            score={fluencyScore}
            color="#3B82F6"
            delay={300}
          />
          <ProgressBar
            label="Pacing"
            score={pacingScore}
            color="#F59E0B"
            delay={400}
          />
        </View>
      </View>
    </View>
  );
};
