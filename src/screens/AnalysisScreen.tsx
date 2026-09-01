import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { analysisService } from '../services/analysisService';
import { Challenge } from '../types/challenge';
import { AnalysisResult } from '../types/result';

// types
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

  // state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // refs
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
    pulseLoop.start();

    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounceAnim, {
          toValue: -8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    bounceLoop.start();

    return () => {
      pulseLoop.stop();
      bounceLoop.stop();
    };
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 2400);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const performAnalysis = async () => {
      try {
        setHasError(false);
        const result = await analysisService.analyzeRecording(
          audioPath,
          challenge,
          durationSec
        );

        if (isMounted && result) {
          onAnalysisSuccess(result);
        }
      } catch (err) {
        console.warn('Speech analysis failed:', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
    };
  }, [isRetrying]);

  // handlers
  const handleRetry = () => {
    setIsRetrying((prev) => !prev);
  };

  // render
  return (
    <View
      className="flex-1 bg-slate-50 justify-between items-center px-6"
      style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }}
    >
      <View />

      {/* center card */}
      <View className="items-center justify-center w-full max-w-sm">
        {/* animated orb */}
        <View className="items-center justify-center mb-8 relative w-36 h-36">
          <Animated.View
            className="absolute w-36 h-36 rounded-full bg-indigo-100/60"
            style={[{ transform: [{ scale: pulseRingAnim }] }]}
          />
          <View className="w-28 h-28 rounded-full bg-indigo-50 items-center justify-center border-2 border-indigo-200 shadow-md shadow-indigo-500/15">
            {hasError ? (
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            ) : (
              <Animated.View style={{ transform: [{ translateY: iconBounceAnim }] }}>
                <Ionicons name="sparkles" size={44} color="#4F46E5" />
              </Animated.View>
            )}
          </View>
        </View>

        {/* status title */}
        <Text className="text-2xl font-black text-slate-900 text-center mb-2">
          {hasError ? 'Analysis Paused' : 'Evaluating Speech'}
        </Text>

        {/* rotating prompt */}
        {hasError ? (
          <Text className="text-sm text-slate-500 text-center leading-5 px-4 mb-6">
            Unable to connect to the speech evaluation service. Please check your network or try again.
          </Text>
        ) : (
          <Animated.View style={[{ opacity: fadeAnim }]} className="h-12 items-center justify-center">
            <Text className="text-sm font-semibold text-indigo-600 text-center px-4">
              {ROTATING_MESSAGES[currentMessageIndex]}
            </Text>
          </Animated.View>
        )}

        {/* loading spinner */}
        {!hasError && (
          <View className="flex-row items-center gap-2 mt-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text className="text-xs font-bold text-slate-600">Gemini 2.5 Flash Audio Engine</Text>
          </View>
        )}
      </View>

      {/* action footer */}
      <View className="w-full">
        {hasError ? (
          <View className="space-y-3 w-full">
            <Button
              title="Try Again"
              onPress={handleRetry}
              variant="primary"
              size="lg"
              icon="refresh"
            />
            <Button
              title="Back to Challenge"
              onPress={onCancel}
              variant="ghost"
              size="md"
            />
          </View>
        ) : (
          <View className="items-center py-2">
            <Text className="text-xs text-slate-400 font-medium">SayWise • Instant Speech Calibration</Text>
          </View>
        )}
      </View>
    </View>
  );
};
