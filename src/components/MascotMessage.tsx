import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

export type MascotMood = 'celebrating' | 'encouraging' | 'listening';

interface MascotMessageProps {
  mood?: MascotMood;
  title?: string;
  message: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const mascotImages = {
  celebrating: require('../../assets/mascot/milo_celebrating.png'),
  encouraging: require('../../assets/mascot/milo_encouraging.png'),
  listening: require('../../assets/mascot/milo_listening.png'),
};

export const MascotMessage: React.FC<MascotMessageProps> = ({
  mood = 'encouraging',
  title,
  message,
  subMessage,
  size = 'md',
  className = '',
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const speechBubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(speechBubbleAnim, {
        toValue: 1,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mood]);

  const handleMascotTap = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getImageSize = () => {
    switch (size) {
      case 'sm':
        return 'w-14 h-14';
      case 'lg':
        return 'w-24 h-24';
      case 'md':
      default:
        return 'w-18 h-18 w-[72px] h-[72px]';
    }
  };

  return (
    <View className={`flex-row items-center gap-3 ${className}`}>
      {/* Interactive Mascot Avatar */}
      <Pressable onPress={handleMascotTap} hitSlop={8}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
          }}
          className={`${getImageSize()} rounded-2xl bg-indigo-50/50 p-1 border border-indigo-100/80 shadow-sm`}
        >
          <Image
            source={mascotImages[mood]}
            className="w-full h-full rounded-xl"
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>

      {/* Dynamic Speech Bubble */}
      <Animated.View
        style={{
          opacity: speechBubbleAnim,
          transform: [
            {
              scale: speechBubbleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        }}
        className="flex-1 bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm relative"
      >
        {/* Triangle Pointer pointing to mascot */}
        <View className="absolute -left-2 top-4 w-3 h-3 bg-white border-l border-b border-slate-200 transform rotate-45" />

        {title && (
          <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-0.5">
            {title}
          </Text>
        )}
        <Text className="text-sm font-semibold text-slate-800 leading-5">
          {message}
        </Text>
        {subMessage && (
          <Text className="text-xs text-slate-500 mt-1 leading-4">
            {subMessage}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};
