// types
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ChallengeType = 'read' | 'talk' | 'opinion' | 'explain' | 'describe';

export type PracticeMode = 'read' | 'talk';

export interface ChallengeRecipe {
  topic: string;
  type: ChallengeType;
  prompt: string;
  context?: string;
  focusTarget: string;
  whyChosen?: string;
  prepSeconds?: number;
  speakingSeconds?: number;
  difficulty: Difficulty;
  targets?: string[];
}

export type Challenge = {
  id: string;
  title: string;
  type: ChallengeType;
  difficulty: Difficulty;
  paragraph: string;
  prompt?: string;
  context?: string;
  focusTarget?: string;
  whyChosen?: string;
  prepSeconds?: number;
  estimatedDurationSec?: number;
  focusAreas?: string[];
};
