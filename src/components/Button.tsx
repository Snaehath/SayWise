import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
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
  const animatedScale = React.useRef(new Animated.Value(1)).current;
  const isFlex1 = className.includes('flex-1');

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const getVariantClass = (): string => {
    if (disabled) {
      return 'bg-slate-200';
    }
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 active:bg-indigo-700 shadow-md shadow-indigo-500/25';
      case 'secondary':
        return 'bg-indigo-50 border border-indigo-100 active:bg-indigo-100';
      case 'danger':
        return 'bg-red-500 active:bg-red-600 shadow-md shadow-red-500/25';
      case 'outline':
        return 'bg-transparent border-[1.5px] border-indigo-600';
      case 'ghost':
        return 'bg-transparent';
    }
  };

  const getSizeClass = (): string => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3.5';
      case 'md':
        return 'py-3 px-4';
      case 'lg':
      default:
        return 'py-3.5 px-5';
    }
  };

  const getTextClass = (): string => {
    if (disabled) {
      return 'text-slate-400';
    }
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
        return 'text-sm font-semibold';
      case 'md':
        return 'text-sm font-bold';
      case 'lg':
      default:
        return 'text-base font-bold';
    }
  };

  return (
    <Animated.View
      className={isFlex1 ? 'flex-1' : ''}
      style={[{ transform: [{ scale: animatedScale }] }, style]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        className={`w-full flex-row items-center justify-center rounded-2xl ${getVariantClass()} ${getSizeClass()} ${className.replace('flex-1', '').trim()}`}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4F46E5'}
          />
        ) : (
          <View className="flex-row items-center justify-center">
            {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
            <Text className={`${getTextClass()} ${getTextSizeClass()}`} style={textStyle}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};
