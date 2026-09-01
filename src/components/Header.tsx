import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// types
interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
}) => {
  // render
  return (
    <View className="h-[52px] flex-row items-center justify-between px-4">
      <View className="w-12 items-start justify-center">
        {onBack && (
          <Pressable
            onPress={onBack}
            unstable_pressDelay={0}
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-slate-200 active:opacity-75 shadow-sm"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </Pressable>
        )}
      </View>

      <View className="flex-1 items-center justify-center">
        {title && (
          <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View className="min-w-[48px] items-end justify-center">
        {rightElement}
      </View>
    </View>
  );
};
