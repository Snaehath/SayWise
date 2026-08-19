import { Difficulty } from './challenge';

export type AnalysisResult = {
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

export type ChallengeResult = {
  challengeId: string;
  challengeTitle: string;
  difficulty: Difficulty;
  completedAt: string; // ISO string
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
  feedback: string;
};
