import { SayWiseChallengeEngine } from '../data/challenges';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge, Difficulty, PracticeMode } from '../types/challenge';

// helpers
function getDayOfYearIndex(arrayLength: number): number {
  if (arrayLength <= 0) return 0;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return (dayOfYear + now.getFullYear()) % arrayLength;
}

export const challengeService = {
  getTodayChallenge(difficulty?: Difficulty, mode: PracticeMode = 'read'): Challenge {
    const diff = difficulty || challengeStorage.getSelectedDifficulty();

    if (mode === 'read') {
      const readPool = SayWiseChallengeEngine.getReadRecipes().filter((r) => r.difficulty === diff);
      const pool = readPool.length > 0 ? readPool : SayWiseChallengeEngine.getReadRecipes();
      const index = getDayOfYearIndex(pool.length);
      const chosen = pool[index];

      return {
        id: `daily_read_${chosen.topic.replace(/\s+/g, '_').toLowerCase()}`,
        title: chosen.topic,
        type: 'read',
        difficulty: chosen.difficulty,
        paragraph: chosen.prompt,
        prompt: chosen.prompt,
        context: chosen.context,
        focusTarget: chosen.focusTarget,
        whyChosen: chosen.whyChosen,
        prepSeconds: chosen.prepSeconds || 5,
        estimatedDurationSec: chosen.speakingSeconds || 35,
        focusAreas: chosen.targets,
      };
    }

    const talkPool = SayWiseChallengeEngine.getTalkRecipes().filter((r) => r.difficulty === diff);
    const pool = talkPool.length > 0 ? talkPool : SayWiseChallengeEngine.getTalkRecipes();
    const index = getDayOfYearIndex(pool.length);
    const chosen = pool[index];

    return {
      id: `daily_talk_${chosen.topic.replace(/\s+/g, '_').toLowerCase()}`,
      title: chosen.topic,
      type: 'talk',
      difficulty: chosen.difficulty,
      paragraph: chosen.prompt,
      prompt: chosen.prompt,
      context: chosen.context,
      focusTarget: chosen.focusTarget,
      whyChosen: chosen.whyChosen,
      prepSeconds: chosen.prepSeconds || 10,
      estimatedDurationSec: chosen.speakingSeconds || 45,
      focusAreas: chosen.targets,
    };
  },
};
