import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// types
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode | keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  style,
  textStyle,
}) => {
  // helpers
  const getVariantClass = (): string => {
    if (disabled) return 'bg-slate-200';
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 active:bg-indigo-700 shadow-md shadow-indigo-500/25';
      case 'secondary':
        return 'bg-indigo-50 border border-indigo-100 active:bg-indigo-100';
      case 'danger':
        return 'bg-red-500 active:bg-red-600 shadow-md shadow-red-500/25';
      case 'outline':
        return 'bg-transparent border-[1.5px] border-indigo-600 active:bg-indigo-50';
      case 'ghost':
        return 'bg-transparent active:bg-slate-100';
    }
  };

  const getSizeClass = (): string => {
    switch (size) {
      case 'sm':
      case 'small':
        return 'py-2.5 px-4';
      case 'md':
      case 'medium':
        return 'py-3.5 px-5';
      case 'lg':
      case 'large':
      default:
        return 'py-4 px-6';
    }
  };

  const getTextClass = (): string => {
    if (disabled) return 'text-slate-400';
    switch (variant) {
      case 'primary':
      case 'danger':
        return 'text-white font-bold';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return 'text-indigo-600 font-bold';
    }
  };

  const getTextSizeClass = (): string => {
    switch (size) {
      case 'sm':
      case 'small':
        return 'text-sm font-semibold';
      case 'md':
      case 'medium':
        return 'text-sm font-bold';
      case 'lg':
      case 'large':
      default:
        return 'text-base font-extrabold';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      const iconColor = variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4F46E5';
      const iconSize = size === 'sm' || size === 'small' ? 16 : 20;
      return <Ionicons name={icon as unknown as keyof typeof Ionicons.glyphMap} size={iconSize} color={iconColor} />;
    }
    return icon;
  };

  // render
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      unstable_pressDelay={0}
      style={style}
      className={`w-full flex-row items-center justify-center rounded-2xl active:opacity-85 ${getVariantClass()} ${getSizeClass()} ${className}`.trim()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4F46E5'}
        />
      ) : (
        <View className="flex-row items-center justify-center pointer-events-none">
          {icon && iconPosition === 'left' && <View className="mr-2">{renderIcon()}</View>}
          <Text className={`${getTextClass()} ${getTextSizeClass()}`} style={textStyle}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View className="ml-2">{renderIcon()}</View>}
        </View>
      )}
    </Pressable>
  );
};
