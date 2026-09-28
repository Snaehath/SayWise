import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mascot } from '../components/Mascot';
import { WaveformDisplay } from '../components/WaveformDisplay';
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
  const insets = useSafeAreaInsets();

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const pulseRingAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingAnim, {
          toValue: 1.15,
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

    return () => {
      pulseLoop.stop();
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

  const handleRetry = () => {
    setIsRetrying((prev) => !prev);
  };

  return (
    <View
      className="flex-1 bg-slate-50 justify-between items-center px-6"
      style={{ paddingTop: insets.top + 30, paddingBottom: insets.bottom + 24 }}
    >
      <View />

      {/* Center card */}
      <View className="items-center justify-center w-full max-w-sm">
        {/* Mascot with subtle pulsing background */}
        <View className="items-center justify-center mb-6 relative w-36 h-36">
          <Animated.View
            className="absolute w-36 h-36 rounded-full bg-indigo-100/60"
            style={[{ transform: [{ scale: pulseRingAnim }] }]}
          />
          <View className="w-28 h-28 rounded-full bg-indigo-50 items-center justify-center border border-indigo-200 shadow-sm">
            {hasError ? (
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            ) : (
              <Mascot size={80} variant="listening" />
            )}
          </View>
        </View>

        {/* Status title */}
        <Text className="text-2xl font-black text-slate-900 text-center mb-2">
          {hasError ? 'Analysis Paused' : 'Evaluating Speech'}
        </Text>

        {/* Rotating prompt message */}
        {hasError ? (
          <Text className="text-sm text-slate-500 text-center leading-5 px-4 mb-6">
            Unable to connect to the speech evaluation service. Please check your network or try again.
          </Text>
        ) : (
          <Animated.View style={[{ opacity: fadeAnim }]} className="h-10 items-center justify-center">
            <Text className="text-sm font-semibold text-indigo-600 text-center px-4">
              {ROTATING_MESSAGES[currentMessageIndex]}
            </Text>
          </Animated.View>
        )}

        {/* Mini waveform while evaluating */}
        {!hasError && (
          <View className="mt-4 items-center">
            <WaveformDisplay animated={true} height={20} barCount={13} />
          </View>
        )}
      </View>

      {/* Action footer */}
      <View className="w-full">
        {hasError ? (
          <View className="w-full">
            <TouchableOpacity
              onPress={handleRetry}
              activeOpacity={0.85}
              className="w-full bg-indigo-600 py-4 rounded-full items-center justify-center flex-row shadow-lg shadow-indigo-200 mb-2"
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text className="text-white text-base font-bold">Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.7}
              className="w-full py-3 items-center"
            >
              <Text className="text-xs font-semibold text-slate-400">Back to Challenge</Text>
            </TouchableOpacity>
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
