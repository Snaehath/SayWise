import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface MascotProps {
  size?: number;
  variant?: 'default' | 'listening' | 'celebrating' | 'avatar';
  style?: StyleProp<ViewStyle>;
}

export const Mascot: React.FC<MascotProps> = ({
  size = 140,
  variant = 'default',
  style,
}) => {
  const isAvatar = variant === 'avatar';
  // For avatar, frame closely on Pip's expressive head & headphones
  const viewBox = isAvatar ? '40 20 240 240' : '0 0 320 320';

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        isAvatar && {
          borderRadius: size / 2,
          backgroundColor: '#EDE9FE',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox={viewBox}>
        <Defs>
          {/* Character Body Gradient */}
          <LinearGradient id="mascotBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#7B6BF5" />
            <Stop offset="65%" stopColor="#5B4DDF" />
            <Stop offset="100%" stopColor="#4938CB" />
          </LinearGradient>

          {/* Crest Gradient */}
          <LinearGradient id="mascotCrestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#9E91FC" />
            <Stop offset="100%" stopColor="#6453F0" />
          </LinearGradient>

          {/* Tummy Gradient */}
          <LinearGradient id="mascotTummyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#EBE7FD" />
          </LinearGradient>

          {/* Beak & Feet */}
          <LinearGradient id="mascotBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFB323" />
            <Stop offset="100%" stopColor="#FA8C16" />
          </LinearGradient>

          {/* Wings */}
          <LinearGradient id="mascotWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6E5DF0" />
            <Stop offset="100%" stopColor="#4432C2" />
          </LinearGradient>
        </Defs>

        {/* Ambient Sound Waves (Listening or default mode) */}
        {!isAvatar && (
          <G opacity={variant === 'listening' ? 0.9 : 0.4}>
            <Circle
              cx="160"
              cy="175"
              r="135"
              stroke="#7B6BF5"
              strokeWidth={3}
              strokeDasharray="8 12"
              fill="none"
              opacity={0.3}
            />
            <Circle
              cx="160"
              cy="175"
              r="115"
              stroke="#5B4DDF"
              strokeWidth={2}
              strokeDasharray="4 8"
              fill="none"
              opacity={0.4}
            />
          </G>
        )}

        {/* Floating Sparks / Notes */}
        {!isAvatar && (
          <G>
            <G transform="translate(36, 110) rotate(-14)">
              <Ellipse cx="14" cy="20" rx="7" ry="5.5" fill="#34D399" />
              <Rect x="18" y="4" width="3" height="17" rx="1.5" fill="#34D399" />
              <Path d="M21 4 C28 5 32 10 32 12 C30 11 25 8 21 8 Z" fill="#34D399" />
            </G>
            <G transform="translate(258, 100)">
              <Path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="#FBBF24" />
            </G>
            <Circle cx="275" cy="140" r="3.5" fill="#34D399" />
            <Circle cx="48" cy="165" r="3" fill="#FBBF24" />
            {variant === 'celebrating' && (
              <>
                <G transform="translate(40, 50)">
                  <Path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="#F43F5E" />
                </G>
                <G transform="translate(240, 45)">
                  <Path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="#6366F1" />
                </G>
                <Circle cx="80" cy="40" r="4" fill="#38BDF8" />
                <Circle cx="225" cy="35" r="4.5" fill="#FBBF24" />
              </>
            )}
          </G>
        )}

        {/* Feet */}
        {!isAvatar && (
          <G id="feet">
            <Path d="M126 264 C126 274 122 284 116 288 C110 292 100 292 98 286 C96 280 102 274 104 268 Z" fill="#FA8C16" />
            <Ellipse cx="114" cy="285" rx="14" ry="7" fill="url(#mascotBeakGrad)" />
            <Ellipse cx="128" cy="284" rx="11" ry="6.5" fill="url(#mascotBeakGrad)" />
            <Ellipse cx="102" cy="284" rx="10" ry="6" fill="url(#mascotBeakGrad)" />

            <Path d="M194 264 C194 274 198 284 204 288 C210 292 220 292 222 286 C224 280 218 274 216 268 Z" fill="#FA8C16" />
            <Ellipse cx="206" cy="285" rx="14" ry="7" fill="url(#mascotBeakGrad)" />
            <Ellipse cx="192" cy="284" rx="11" ry="6.5" fill="url(#mascotBeakGrad)" />
            <Ellipse cx="218" cy="284" rx="10" ry="6" fill="url(#mascotBeakGrad)" />
          </G>
        )}

        {/* Main Character Body */}
        <Path
          d="M160 55 C225 55 252 105 252 178 C252 238 222 270 160 270 C98 270 68 238 68 178 C68 105 95 55 160 55 Z"
          fill="url(#mascotBodyGrad)"
        />

        {/* Head Crest */}
        <Path d="M160 56 C155 35 144 26 138 28 C131 31 138 48 148 55 Z" fill="url(#mascotCrestGrad)" />
        <Path d="M160 55 C162 28 172 18 180 20 C187 23 182 44 170 54 Z" fill="#9E91FC" />
        <Path d="M160 54 C158 36 160 28 165 29 C170 31 168 45 163 54 Z" fill="#7B6BF5" />

        {/* Tummy */}
        <Path
          d="M160 148 C198 148 218 175 218 216 C218 252 196 265 160 265 C124 265 102 252 102 216 C102 175 122 148 160 148 Z"
          fill="url(#mascotTummyGrad)"
        />

        {/* Sound Wave Pattern on Chest */}
        <G opacity={0.9}>
          <Rect x="136" y="212" width="6" height="14" rx="3" fill="#5B4DDF" />
          <Rect x="148" y="202" width="6" height="26" rx="3" fill="#34D399" />
          <Rect x="160" y="196" width="6" height="34" rx="3" fill="#5B4DDF" />
          <Rect x="172" y="202" width="6" height="26" rx="3" fill="#34D399" />
          <Rect x="184" y="212" width="6" height="14" rx="3" fill="#5B4DDF" />
        </G>

        {/* Headphones Band */}
        <Path
          d="M72 140 C66 95 105 60 160 60 C215 60 254 95 248 140"
          fill="none"
          stroke="#2DD4BF"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <Path
          d="M78 135 C74 98 108 67 160 67 C212 67 246 98 242 135"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* Left Ear Cup */}
        <G transform="translate(60, 126)">
          <Rect x="0" y="0" width="16" height="32" rx="8" fill="#0F766E" />
          <Rect x="4" y="2" width="14" height="28" rx="7" fill="#14B8A6" />
          <Circle cx="11" cy="16" r="4" fill="#5EEAD4" />
        </G>

        {/* Right Ear Cup with Boom Microphone */}
        <G transform="translate(244, 126)">
          <Rect x="0" y="0" width="16" height="32" rx="8" fill="#0F766E" />
          <Rect x="-2" y="2" width="14" height="28" rx="7" fill="#14B8A6" />
          <Circle cx="5" cy="16" r="4" fill="#5EEAD4" />

          {/* Microphone Boom Arm */}
          <Path
            d="M4 24 C-4 38 -20 48 -46 44"
            fill="none"
            stroke="#0F766E"
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <Path
            d="M4 24 C-4 38 -20 48 -46 44"
            fill="none"
            stroke="#14B8A6"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Rect x="-56" y="38" width="14" height="10" rx="5" fill="#1F2937" />
          <Circle cx="-50" cy="43" r="2.5" fill="#34D399" />
        </G>

        {/* Eyes */}
        <G id="eyes">
          <Ellipse cx="124" cy="120" rx="26" ry="29" fill="#FFFFFF" />
          <Ellipse cx="128" cy="121" rx="17" ry="19" fill="#1E1656" />
          <Ellipse cx="134" cy="114" rx="7.5" ry="9" fill="#FFFFFF" />
          <Circle cx="123" cy="128" r="3.5" fill="#FFFFFF" />
          <Path d="M117 126 C120 133 128 136 136 133" stroke="#6366F1" strokeWidth={2.5} strokeLinecap="round" fill="none" />

          <Ellipse cx="196" cy="120" rx="26" ry="29" fill="#FFFFFF" />
          <Ellipse cx="192" cy="121" rx="17" ry="19" fill="#1E1656" />
          <Ellipse cx="198" cy="114" rx="7.5" ry="9" fill="#FFFFFF" />
          <Circle cx="187" cy="128" r="3.5" fill="#FFFFFF" />
          <Path d="M181 126 C184 133 192 136 200 133" stroke="#6366F1" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </G>

        {/* Blush Cheeks */}
        <Ellipse cx="94" cy="144" rx="12" ry="7" fill="#F472B6" opacity={0.55} />
        <Ellipse cx="226" cy="144" rx="12" ry="7" fill="#F472B6" opacity={0.55} />

        {/* Beak */}
        <G id="beak">
          <Path d="M142 138 C142 138 160 162 178 138 Z" fill="#D97706" />
          <Path
            d="M138 134 C145 125 175 125 182 134 C186 142 172 152 160 155 C148 152 134 142 138 134 Z"
            fill="url(#mascotBeakGrad)"
          />
          <Path d="M146 132 C154 128 166 128 174 132" stroke="#FEF08A" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <Path d="M147 145 C153 158 167 158 173 145" fill="#BE185D" />
          <Path d="M152 153 C156 150 164 150 168 153" fill="#F472B6" />
        </G>

        {/* Left Wing (Waving) */}
        {!isAvatar && (
          <G transform="translate(42, 145) rotate(-18)">
            <Path
              d="M30 15 C15 25 2 45 6 68 C10 85 28 88 40 76 C52 64 55 40 46 22 C42 14 36 10 30 15 Z"
              fill="url(#mascotWingGrad)"
            />
            <Path d="M12 55 C16 68 28 72 36 64" stroke="#8B5CF6" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </G>
        )}

        {/* Right Wing */}
        {!isAvatar && (
          <G transform="translate(225, 160) rotate(12)">
            <Path
              d="M16 10 C32 20 42 42 38 65 C34 82 18 85 8 72 C-2 58 2 34 10 16 C12 11 14 8 16 10 Z"
              fill="url(#mascotWingGrad)"
            />
            <Path d="M28 50 C24 64 14 66 8 58" stroke="#8B5CF6" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </G>
        )}
      </Svg>
    </View>
  );
};
