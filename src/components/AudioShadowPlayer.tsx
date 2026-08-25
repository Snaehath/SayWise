import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';

// props
interface AudioShadowPlayerProps {
  audioPath: string;
}

export const AudioShadowPlayer: React.FC<AudioShadowPlayerProps> = ({ audioPath }) => {
  // hooks
  const player = useAudioPlayer(audioPath);

  // states
  const [playbackRate, setPlaybackRate] = useState<1.0 | 0.75>(1.0);
  const isPlaying = player?.playing ?? false;

  // handlers
  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1.0 ? 0.75 : 1.0;
    setPlaybackRate(nextRate);
    if (player && typeof player.setPlaybackRate === 'function') {
      player.setPlaybackRate(nextRate);
    }
  };

  // render
  return (
    <View className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        {/* play/pause */}
        <Pressable
          onPress={togglePlay}
          className="w-11 h-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-500/25 active:opacity-90"
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#FFFFFF" />
        </Pressable>
        <View>
          <Text className="text-sm font-extrabold text-slate-900">Your Take Audio</Text>
          <Text className="text-xs text-slate-500 font-medium mt-0.5">
            {isPlaying ? 'Playing back take...' : 'Tap to hear your pronunciation'}
          </Text>
        </View>
      </View>

      {/* rate toggle */}
      <Pressable
        onPress={toggleRate}
        className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 active:opacity-80"
      >
        <Text className="text-xs font-extrabold text-indigo-700">{playbackRate}x Speed</Text>
      </Pressable>
    </View>
  );
};
