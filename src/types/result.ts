import { ChallengeType, Difficulty } from './challenge';

// types
export interface MetricDelta {
  score: number;
  direction: 'up' | 'steady' | 'down';
  deltaPercent: number;
}

export type AnalysisResult = {
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
  expressionScore?: number;
  headline?: string;
  biggestImprovement?: {
    name: string;
    delta: string;
  };
  tomorrowFocus?: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  wpm?: number;
  speakingSeconds?: number;
  personalBestAlert?: string | null;
  phonemesMastered?: string[];
  phonemesToPractice?: string[];
};

export type ChallengeResult = {
  challengeId: string;
  challengeTitle: string;
  challengeType?: ChallengeType;
  difficulty: Difficulty;
  completedAt: string;
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
  expressionScore?: number;
  headline?: string;
  tomorrowFocus?: string;
  feedback: string;
  wpm?: number;
  speakingSeconds?: number;
  personalBestAlert?: string | null;
  phonemesMastered?: string[];
  phonemesToPractice?: string[];
};

export interface PersonalBests {
  highestOverall: number;
  highestFluency: number;
  highestClarity: number;
  highestPacing: number;
  highestWpm: number;
  longestStreakDays: number;
}

export interface SpeakerProfile {
  overallScore: number;
  clarityScore: number;
  fluencyScore: number;
  pacingScore: number;
  expressionScore: number;
  growthSummary: string;
  biggestImprovement: {
    name: string;
    delta: string;
  };
  totalSessions: number;
  sessionsThisWeek: number;
  weekDots: boolean[];
  currentFocus: {
    title: string;
    targetText: string;
  };
  personalBests: PersonalBests;
}

export interface JourneyStage {
  id: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
