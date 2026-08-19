export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Challenge = {
  id: string;
  title: string;
  difficulty: Difficulty;
  paragraph: string;
  estimatedDurationSec?: number;
  focusAreas?: string[];
};
