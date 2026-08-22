import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { analysisService } from '../services/analysisService';
import { Challenge } from '../types/challenge';
import { AnalysisResult } from '../types/result';

interface AnalysisScreenProps {
  challenge: Challenge;
  audioPath: string;
  durationSec: number;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onCancel: () => void;
}

const ROTATING_MESSAGES = [
  'Milo is tuning in to your voice...',
  'Evaluating pronunciation clarity...',
  'Measuring natural speaking rhythm...',
  'Checking syllable accuracy & pacing...',
  'Polishing your speech feedback...',
];

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  challenge,
  audioPath,
  durationSec,
  onAnalysisSuccess,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Animations
  const pulseRingAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const mascotFloatAnim = useRef(new Animated.Value(0)).current;

  // Pulse & float animation
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingAnim, {
          toValue: 1.25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(mascotFloatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    floatLoop.start();

    return () => {
      pulseLoop.stop();
      floatLoop.stop();
    };
  }, []);

  // Rotate messages every 1.8s
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Run real Gemini audio analysis
  const runAnalysis = async () => {
    setHasError(false);
    setIsRetrying(true);

    try {
      const result = await analysisService.analyzeRecording(audioPath, challenge, durationSec);
      onAnalysisSuccess(result);
    } catch (err) {
      console.warn('Speech analysis failure:', err);
      setHasError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <View
      className="flex-1 bg-slate-50 justify-center items-center"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="w-full px-8 items-center">
        {/* Animated Listening Mascot Graphic */}
        <View className="w-44 h-44 items-center justify-center mb-6">
          <Animated.View
            className="absolute w-36 h-36 rounded-full bg-indigo-100/70"
            style={[
              {
                transform: [{ scale: pulseRingAnim }],
              },
            ]}
          />
          <Animated.View
            style={{
              transform: [{ translateY: mascotFloatAnim }],
            }}
            className="w-32 h-32 rounded-full bg-white border-2 border-indigo-100 p-1 items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden"
          >
            <Image
              source={require('../../assets/mascot/milo_listening.png')}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* Message and Status */}
        {hasError ? (
          <View className="items-center w-full">
            <Text className="text-xl font-bold text-red-600 mb-1">Analysis Notice</Text>
            <Text className="text-sm text-slate-500 text-center mb-6">
              We couldn't reach the evaluation server. Please try again.
            </Text>
            <View className="w-full gap-2">
              <Button
                title="Retry Analysis"
                onPress={runAnalysis}
                variant="primary"
                loading={isRetrying}
              />
              <Button
                title="Cancel & Re-record"
                onPress={onCancel}
                variant="ghost"
              />
            </View>
          </View>
        ) : (
          <View className="items-center w-full">
            <Animated.Text className="text-2xl font-extrabold text-slate-900 text-center min-h-[64px] mb-2 leading-8" style={{ opacity: fadeAnim }}>
              {ROTATING_MESSAGES[currentMessageIndex]}
            </Animated.Text>

            <Text className="text-sm text-slate-600 text-center mb-6 font-medium">
              Evaluating reading for "{challenge.title}"
            </Text>

            <View className="flex-row items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text className="text-sm font-semibold text-slate-700">Live AI Speech Calibrating...</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
