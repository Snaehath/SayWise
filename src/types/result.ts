import { Difficulty } from './challenge';

export type WordStatus = 'perfect' | 'good' | 'needs_work';

export interface WordAnalysis {
  word: string;
  ipa: string; // e.g. "/ˌæk.jɚ.ə.si/"
  status: WordStatus; // perfect = green, good = amber, needs_work = coral
  tip?: string; // concise mouth/articulation guidance
}

export type AnalysisResult = {
  overallScore: number;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  pacingScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  words?: WordAnalysis[];
  wpm?: number;
  phonemesMastered?: string[];
  phonemesToPractice?: string[];
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
  words?: WordAnalysis[];
  wpm?: number;
  phonemesMastered?: string[];
  phonemesToPractice?: string[];
};
