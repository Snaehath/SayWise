import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { WaveformDisplay } from './WaveformDisplay';

interface AudioShadowPlayerProps {
  audioPath: string;
  durationSec?: number;
}

export const AudioShadowPlayer: React.FC<AudioShadowPlayerProps> = ({
  audioPath,
  durationSec = 48,
}) => {
  const player = useAudioPlayer(audioPath);
  const isPlaying = player?.playing ?? false;

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const timeString = `${mins}:${String(secs).padStart(2, '0')}`;

  return (
    <TouchableOpacity
      onPress={togglePlay}
      activeOpacity={0.8}
      className="bg-white rounded-full px-4 py-3 border border-slate-200/90 shadow-sm flex-row items-center justify-between my-3 w-full"
    >
      {/* Play Icon and Label */}
      <View className="flex-row items-center">
        <View className="w-7 h-7 rounded-full bg-indigo-50 items-center justify-center mr-2">
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={13}
            color="#4F46E5"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </View>
        <Text className="text-xs font-bold text-slate-800">
          Listen to your take
        </Text>
      </View>

      {/* Mini Waveform Display */}
      <View className="px-2">
        <WaveformDisplay
          animated={isPlaying}
          height={16}
          barCount={11}
          color="#6366F1"
        />
      </View>

      {/* Duration */}
      <Text className="text-xs font-semibold text-slate-400 font-mono">
        {timeString}
      </Text>
    </TouchableOpacity>
  );
};
