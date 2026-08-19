import { Challenge, Difficulty } from './challenge';
import { AnalysisResult, ChallengeResult } from './result';

export type ScreenName =
  | 'Welcome'
  | 'Difficulty'
  | 'Challenge'
  | 'Analysis'
  | 'Result'
  | 'Completion';

export type NavigationParams = {
  Welcome: undefined;
  Difficulty: undefined;
  Challenge: { difficulty: Difficulty; challenge?: Challenge };
  Analysis: { challenge: Challenge; audioPath: string; durationSec: number };
  Result: { challenge: Challenge; audioPath: string; result: AnalysisResult };
  Completion: { result: ChallengeResult };
};
