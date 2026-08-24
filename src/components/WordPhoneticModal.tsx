import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordAnalysis } from '../types/result';

interface WordPhoneticModalProps {
  wordData: WordAnalysis | null;
  visible: boolean;
  onClose: () => void;
}

export const WordPhoneticModal: React.FC<WordPhoneticModalProps> = ({
  wordData,
  visible,
  onClose,
}) => {
  if (!wordData) return null;

  const getStatusBadge = () => {
    switch (wordData.status) {
      case 'perfect':
        return {
          label: 'Perfect Articulation',
          bgClass: 'bg-emerald-50',
          borderClass: 'border-emerald-200',
          textClass: 'text-emerald-700',
          icon: 'checkmark-circle' as const,
          color: '#10B981',
        };
      case 'good':
        return {
          label: 'Good / Review',
          bgClass: 'bg-amber-50',
          borderClass: 'border-amber-200',
          textClass: 'text-amber-700',
          icon: 'alert-circle' as const,
          color: '#F59E0B',
        };
      case 'needs_work':
        return {
          label: 'Needs Practice',
          bgClass: 'bg-rose-50',
          borderClass: 'border-rose-200',
          textClass: 'text-rose-700',
          icon: 'close-circle' as const,
          color: '#F43F5E',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-slate-900/60 justify-end items-center px-4 pb-8"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl"
        >
          {/* Header row with close button */}
          <View className="flex-row items-center justify-between mb-4">
            <View className={`flex-row items-center px-3 py-1 rounded-full border ${badge.bgClass} ${badge.borderClass}`}>
              <Ionicons name={badge.icon} size={15} color={badge.color} style={{ marginRight: 5 }} />
              <Text className={`text-xs font-extrabold uppercase tracking-wide ${badge.textClass}`}>
                {badge.label}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Word Title & IPA Phonetic Breakdown */}
          <View className="mb-4">
            <Text className="text-3xl font-extrabold text-slate-900 mb-1">
              {wordData.word}
            </Text>
            <View className="bg-indigo-50 self-start px-3 py-1 rounded-xl border border-indigo-100">
              <Text className="text-base font-bold text-indigo-700 font-mono tracking-wider">
                {wordData.ipa || `/${wordData.word.toLowerCase()}/`}
              </Text>
            </View>
          </View>

          {/* Articulation & Tongue Position Tip */}
          <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <Ionicons name="sparkles" size={16} color="#6366F1" />
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Coach Articulation Tip
              </Text>
            </View>
            <Text className="text-sm text-slate-800 leading-5 font-medium">
              {wordData.tip || `Emphasize clear vowel resonance when pronouncing "${wordData.word}".`}
            </Text>
          </View>

          {/* Dismiss Button */}
          <Pressable
            onPress={onClose}
            className="w-full bg-slate-900 py-3.5 rounded-2xl items-center justify-center active:opacity-90"
          >
            <Text className="text-base font-bold text-white">Got It</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
