import { challenges, NanoQwenChallengeEngine } from '../data/challenges';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge, Difficulty } from '../types/challenge';

/**
 * Deterministic hash based on date string to select daily challenge
 */
function getDayOfYearIndex(difficultyChallengesCount: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % difficultyChallengesCount;
}

export const challengeService = {
  /**
   * Get all challenges for a given difficulty
   */
  getChallengesByDifficulty(difficulty: Difficulty): Challenge[] {
    return challenges.filter((c) => c.difficulty === difficulty);
  },

  /**
   * Get a challenge by ID
   */
  getChallengeById(id: string): Challenge | undefined {
    return challenges.find((c) => c.id === id);
  },

  /**
   * Generate a fresh, on-the-fly challenge dynamically
   */
  generateNewChallenge(difficulty: Difficulty): Challenge {
    return NanoQwenChallengeEngine.generateChallenge(difficulty);
  },

  /**
   * Get today's challenge for the given difficulty
   */
  getTodayChallenge(difficulty: Difficulty): Challenge {
    const pool = this.getChallengesByDifficulty(difficulty);

    // Check if we have an active today's challenge ID already stored
    const storedId = challengeStorage.getTodayChallengeId();
    if (storedId) {
      const stored = pool.find((c) => c.id === storedId);
      if (stored) return stored;
    }

    if (pool.length === 0) {
      const generated = NanoQwenChallengeEngine.generateChallenge(difficulty);
      challengeStorage.setTodayChallengeId(generated.id);
      return generated;
    }

    // Deterministic selection based on day of year from dynamic manifold
    const index = getDayOfYearIndex(pool.length);
    const selected = pool[index] ?? pool[0];

    // Store it for today
    challengeStorage.setTodayChallengeId(selected.id);
    return selected;
  },
};
