import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { analysisService } from '../services/analysisService';
import { Challenge } from '../types/challenge';
import { AnalysisResult } from '../types/result';

// props
interface AnalysisScreenProps {
  challenge: Challenge;
  audioPath: string;
  durationSec: number;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onCancel: () => void;
}

const ROTATING_MESSAGES = [
  'Tuning in to your speech cadence...',
  'Evaluating pronunciation clarity...',
  'Measuring natural speaking rhythm...',
  'Checking syllable accuracy & pacing...',
  'Calibrating your speaking feedback...',
];

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  challenge,
  audioPath,
  durationSec,
  onAnalysisSuccess,
  onCancel,
}) => {
  // hooks
  const insets = useSafeAreaInsets();

  // states
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // animations
  const pulseRingAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const iconBounceAnim = useRef(new Animated.Value(0)).current;

  // effects
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingAnim, {
          toValue: 1.25,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounceAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounceAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    bounceLoop.start();

    return () => {
      pulseLoop.stop();
      bounceLoop.stop();
    };
  }, []);

  // rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // handlers
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

  // render
  return (
    <View
      className="flex-1 bg-slate-50 justify-center items-center"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="w-full px-8 items-center">
        {/* orb visualizer */}
        <View className="w-48 h-48 items-center justify-center mb-6">
          <Animated.View
            className="absolute w-40 h-40 rounded-full bg-indigo-200/50"
            style={[
              {
                transform: [{ scale: pulseRingAnim }],
              },
            ]}
          />
          <Animated.View
            style={{
              transform: [{ translateY: iconBounceAnim }],
            }}
            className="w-32 h-32 rounded-full bg-white border-2 border-indigo-200 items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center shadow-md shadow-indigo-500/30">
              <Ionicons name="mic" size={40} color="#FFFFFF" />
            </View>
          </Animated.View>
        </View>

        {/* status messages */}
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
