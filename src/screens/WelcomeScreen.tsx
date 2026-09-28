import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mascot } from "../components/Mascot";
import { WaveformDisplay } from "../components/WaveformDisplay";
import { challengeService } from "../services/challengeService";
import { challengeStorage } from "../storage/challengeStorage";
import { Challenge, PracticeMode } from "../types/challenge";
import { ChallengeResult, SpeakerProfile } from "../types/result";

interface WelcomeScreenProps {
  onStartChallenge: (challenge?: Challenge) => void;
  onOpenProfile: () => void;
  onViewCompletedResult?: (result: ChallengeResult) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartChallenge,
  onOpenProfile,
  onViewCompletedResult,
}) => {
  const insets = useSafeAreaInsets();

  // Primary mode is 'read' (Read Aloud) by default!
  const [activeMode, setActiveMode] = useState<PracticeMode>("read");
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<ChallengeResult | null>(null);
  const [profile, setProfile] = useState<SpeakerProfile>(() =>
    challengeStorage.getSpeakerProfile(),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  };

  const loadState = () => {
    setIsCompletedToday(challengeStorage.isCompletedToday());
    setTodayResult(challengeStorage.getTodayResult());
    setProfile(challengeStorage.getSpeakerProfile());
  };

  useEffect(() => {
    loadState();
  }, []);

  const activeChallenge = useMemo<Challenge>(() => {
    return challengeService.getTodayChallenge(undefined, activeMode);
  }, [activeMode]);

  const handleStart = () => {
    onStartChallenge(activeChallenge);
  };

  // Real habit and practice stats - no hardcoded numbers!
  const sessionsThisWeek = profile.sessionsThisWeek || 0;
  const habitText =
    sessionsThisWeek === 0
      ? "0 practices this week · Start your daily habit"
      : `${sessionsThisWeek} practice${sessionsThisWeek === 1 ? "" : "s"} this week · Habit on track`;

  // Focus metrics
  const isCalibrated = profile.isCalibrated;
  const pacingScore = isCalibrated ? profile.pacingScore : 72;
  const focusTitle =
    profile.currentFocus.targetText.replace("Focus: ", "") || "Natural pacing";

  const challengeGuidance =
    activeMode === "read"
      ? activeChallenge.focusTarget ||
        "Read at a steady, natural pace. Focus on deliberate pauses."
      : activeChallenge.context ||
        "Speak continuously until the timer stops. Express ideas naturally.";

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Top Header: Logo on left, Mascot avatar on right */}
      <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
        {/* Logo and Brand Name */}
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-indigo-600/10 items-center justify-center mr-2.5">
            <View className="flex-row items-center gap-0.5">
              <View className="w-1 h-3 rounded-full bg-indigo-600" />
              <View className="w-1 h-4 rounded-full bg-indigo-600" />
              <View className="w-1 h-2 rounded-full bg-indigo-600" />
            </View>
          </View>
          <Text className="text-xl font-black text-indigo-900 tracking-tight">
            SayWise
          </Text>
        </View>

        {/* Mascot Avatar: Direct gateway to Profile page */}
        <TouchableOpacity
          onPress={onOpenProfile}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-10 h-10 rounded-full border-2 border-indigo-200 shadow-xs bg-indigo-50/50 items-center justify-center overflow-hidden"
        >
          <Mascot size={36} variant="avatar" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 20, 36),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View className="mb-3">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">
            {getGreeting()}
          </Text>
          <Text className="text-sm font-medium text-slate-400 mt-0.5">
            Ready for today's minute?
          </Text>
        </View>

        {/* Streak / Habit Pill (Accurate real sessions) */}
        <View className="self-start flex-row items-center bg-orange-50/90 border border-orange-200/80 px-3.5 py-1.5 rounded-full mb-4">
          <Text className="text-xs mr-1.5">
            {sessionsThisWeek > 0 ? "🔥" : "🌱"}
          </Text>
          <Text className="text-xs font-bold text-orange-950">{habitText}</Text>
        </View>

        {/* Apple-style iOS Segmented Control */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#E2E8F0",
            padding: 3,
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveMode("read")}
            activeOpacity={0.85}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 13,
              backgroundColor:
                activeMode === "read" ? "#FFFFFF" : "transparent",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: activeMode === "read" ? "#0F172A" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeMode === "read" ? 0.08 : 0,
              shadowRadius: 2,
              elevation: activeMode === "read" ? 2 : 0,
            }}
          >
            <Ionicons
              name="book-outline"
              size={15}
              color={activeMode === "read" ? "#4F46E5" : "#64748B"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: activeMode === "read" ? "700" : "600",
                color: activeMode === "read" ? "#1E1B4B" : "#64748B",
              }}
            >
              Read Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveMode("talk")}
            activeOpacity={0.85}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 13,
              backgroundColor:
                activeMode === "talk" ? "#FFFFFF" : "transparent",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: activeMode === "talk" ? "#0F172A" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeMode === "talk" ? 0.08 : 0,
              shadowRadius: 2,
              elevation: activeMode === "talk" ? 2 : 0,
            }}
          >
            <Ionicons
              name="mic-outline"
              size={15}
              color={activeMode === "talk" ? "#4F46E5" : "#64748B"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: activeMode === "talk" ? "700" : "600",
                color: activeMode === "talk" ? "#1E1B4B" : "#64748B",
              }}
            >
              Speak Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Apple-grade Challenge Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            padding: 24,
            borderWidth: 1,
            borderColor: "#F1F5F9",
            shadowColor: "#4338CA",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.06,
            shadowRadius: 18,
            elevation: 3,
            marginBottom: 18,
          }}
        >
          {/* Card Header Row: Badge & Duration */}
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="bg-indigo-50/80 border border-indigo-100/90 px-3 py-1 rounded-full flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-2" />
              <Text className="text-[10px] font-black text-indigo-700 tracking-widest uppercase">
                {activeMode === "read" ? "TODAY'S READING" : "TODAY'S PRACTICE"}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={13}
                color="#94A3B8"
                style={{ marginRight: 4 }}
              />
              <Text className="text-xs font-semibold text-slate-400">
                ~1 min
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-[21px] font-black text-slate-900 tracking-tight leading-snug mb-1.5">
            {activeChallenge.title}
          </Text>

          {/* Editorial Guidance Subtitle (Concise 1-line guidance, not the whole passage) */}
          <Text className="text-[13px] font-medium text-slate-500 leading-5 mb-5">
            {challengeGuidance}
          </Text>

          {/* Waveform Acoustic Preview Pod (Apple Voice Memos style) */}
          <View
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "#F1F5F9",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <WaveformDisplay height={32} barCount={23} />
          </View>

          {/* Primary Action Button (Apple HIG pill with soft ambient glow) */}
          <TouchableOpacity
            onPress={handleStart}
            activeOpacity={0.88}
            style={{
              backgroundColor: "#4F46E5",
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 9999,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#4F46E5",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[15px] font-bold tracking-wide">
              {activeMode === "read" ? "Start reading" : "Start speaking"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Section: Once calibrated, shows "Your focus". Before calibration, shows "Baseline Calibration" card */}
        {isCalibrated ? (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 26,
              padding: 20,
              borderWidth: 1,
              borderColor: "#F1F5F9",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
              marginBottom: 16,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-sm font-black text-slate-900">
                  Your focus
                </Text>
                <Text className="text-xs font-semibold text-slate-400 mt-0.5">
                  {focusTitle}
                </Text>
              </View>
              <View className="bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <Text className="text-xs font-black text-emerald-700">
                  {pacingScore}
                </Text>
              </View>
            </View>

            {/* Progress Bar with smooth gray track and emerald fill */}
            <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
              <View
                className="bg-emerald-500 h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(10, pacingScore))}%`,
                }}
              />
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[11px] font-semibold text-slate-500">
                Calm & deliberate
              </Text>
              <Text className="text-[11px] font-semibold text-slate-400">
                Target: 75+
              </Text>
            </View>

            {/* Tip with sparkle */}
            <View className="flex-row items-start pt-3 border-t border-slate-100">
              <Ionicons
                name="sparkles"
                size={14}
                color="#059669"
                style={{ marginTop: 2, marginRight: 6 }}
              />
              <Text className="text-xs font-medium text-slate-600 flex-1 leading-4">
                Today's challenge is chosen to help you improve your pacing.
              </Text>
            </View>
          </View>
        ) : (
          /* Day 1 Baseline Calibration Card (Fills bottom area purposefully!) */
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 26,
              padding: 20,
              borderWidth: 1,
              borderColor: "#F1F5F9",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
              marginBottom: 16,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full bg-indigo-50 items-center justify-center mr-2.5">
                  <Ionicons name="shield-checkmark" size={15} color="#4F46E5" />
                </View>
                <Text className="text-sm font-black text-slate-900">
                  Baseline Calibration
                </Text>
              </View>
              <View className="bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
                <Text className="text-xs font-black text-indigo-700">
                  Day 1
                </Text>
              </View>
            </View>

            <Text className="text-xs text-slate-500 leading-relaxed mt-0.5 mb-3">
              Complete your first 1-minute read to calibrate your voice and
              unlock your personal insights:
            </Text>

            <View className="pt-2 border-t border-slate-100 gap-2.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-6 h-6 rounded-full bg-emerald-50 items-center justify-center mr-2.5">
                    <Ionicons
                      name="speedometer-outline"
                      size={13}
                      color="#059669"
                    />
                  </View>
                  <Text className="text-xs font-bold text-slate-700">
                    Cadence & deliberate pauses
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-400">
                  Target 75+
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-6 h-6 rounded-full bg-indigo-50 items-center justify-center mr-2.5">
                    <Ionicons name="mic-outline" size={13} color="#6366F1" />
                  </View>
                  <Text className="text-xs font-bold text-slate-700">
                    Pronunciation & articulation
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-400">
                  Scored
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-6 h-6 rounded-full bg-amber-50 items-center justify-center mr-2.5">
                    <Ionicons
                      name="compass-outline"
                      size={13}
                      color="#D97706"
                    />
                  </View>
                  <Text className="text-xs font-bold text-slate-700">
                    Personalized tomorrow focus
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-400">
                  Unlocks
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* If completed today, review card */}
        {isCompletedToday && todayResult && (
          <TouchableOpacity
            onPress={() =>
              onViewCompletedResult && onViewCompletedResult(todayResult)
            }
            activeOpacity={0.8}
            className="bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between shadow-sm mb-2"
          >
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-900">
                  Today's Practice Completed!
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Score: {todayResult.overallScore}/100 · Tap to review
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
