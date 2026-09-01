import { Difficulty } from '../types/challenge';
import { ChallengeResult, JourneyStage, PersonalBests, SpeakerProfile } from '../types/result';

// keys
const KEYS = {
  SELECTED_DIFFICULTY: 'saywise.selected_difficulty',
  TODAY_CHALLENGE_ID: 'saywise.today_challenge_id',
  LAST_COMPLETED_DATE: 'saywise.last_completed_date',
  TODAY_RESULT: 'saywise.today_result',
  COMPLETION_HISTORY: 'saywise.completion_history',
  ONBOARDING_SEEN: 'saywise.onboarding_seen',
  PERSONAL_BESTS: 'saywise.personal_bests',
};

// types
interface IMMKVInstance {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  clearAll(): void;
}

const memoryStore = new Map<string, string>();

class SafeStorage {
  private mmkvInstance: IMMKVInstance | null = null;
  private initialized = false;

  private getStorage(): IMMKVInstance | null {
    if (this.initialized) return this.mmkvInstance;
    this.initialized = true;

    try {
      const hasNativeNitro =
        typeof (globalThis as unknown as { NitroModules?: unknown }).NitroModules !== 'undefined' ||
        typeof (global as unknown as { NitroModules?: unknown }).NitroModules !== 'undefined';

      if (hasNativeNitro) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mmkv = require('react-native-mmkv');
        if (mmkv && typeof mmkv.createMMKV === 'function') {
          this.mmkvInstance = mmkv.createMMKV({ id: 'saywise-storage' });
          return this.mmkvInstance;
        }
      }
    } catch {
      // fallback
    }

    this.mmkvInstance = null;
    return null;
  }

  getString(key: string): string | undefined {
    const native = this.getStorage();
    if (native) {
      try {
        return native.getString(key);
      } catch {
        // fallback
      }
    }
    return memoryStore.get(key);
  }

  set(key: string, value: string): void {
    const native = this.getStorage();
    if (native) {
      try {
        native.set(key, value);
        return;
      } catch {
        // fallback
      }
    }
    memoryStore.set(key, value);
  }

  delete(key: string): void {
    const native = this.getStorage();
    if (native) {
      try {
        native.remove(key);
        return;
      } catch {
        // fallback
      }
    }
    memoryStore.delete(key);
  }

  clearAll(): void {
    const native = this.getStorage();
    if (native) {
      try {
        native.clearAll();
        return;
      } catch {
        // fallback
      }
    }
    memoryStore.clear();
  }
}

const storage = new SafeStorage();

// helpers
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const challengeStorage = {
  getSpeakerProfile(): SpeakerProfile {
    const history = challengeStorage.getHistory();
    const totalSessions = history.length;
    const personalBests = challengeStorage.getPersonalBests();

    if (totalSessions === 0) {
      return {
        overallScore: 75,
        clarityScore: 78,
        fluencyScore: 72,
        pacingScore: 70,
        expressionScore: 74,
        growthSummary: '↗ Ready for your first session',
        biggestImprovement: { name: 'Fluency', delta: '+8%' },
        totalSessions: 0,
        sessionsThisWeek: 0,
        weekDots: [false, false, false, false, false, false, false],
        currentFocus: {
          title: 'Natural Pacing',
          targetText: 'Natural pacing 70 → 80',
        },
        personalBests,
      };
    }

    const recent = history.slice(0, 5);
    const avgOverall = Math.round(recent.reduce((acc, h) => acc + h.overallScore, 0) / recent.length);
    const avgClarity = Math.round(
      recent.reduce((acc, h) => acc + (h.accuracyScore + h.pronunciationScore) / 2, 0) / recent.length
    );
    const avgFluency = Math.round(recent.reduce((acc, h) => acc + h.fluencyScore, 0) / recent.length);
    const avgPacing = Math.round(recent.reduce((acc, h) => acc + h.pacingScore, 0) / recent.length);
    const avgExpression = Math.round(
      recent.reduce((acc, h) => acc + (h.expressionScore || h.pronunciationScore), 0) / recent.length
    );

    const now = new Date();
    const weekDots: boolean[] = [];
    let sessionsThisWeek = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const practicedOnDay = history.some((h) => h.completedAt && h.completedAt.startsWith(dateStr));
      weekDots.push(practicedOnDay);
      if (practicedOnDay) sessionsThisWeek++;
    }

    let biggestImprovement = { name: 'Fluency', delta: '+8%' };
    let growthSummary = '↗ Getting better at fluency';

    if (history.length >= 2) {
      const latest = history[0];
      const prev = history[1];
      const pacingDiff = latest.pacingScore - prev.pacingScore;
      const fluencyDiff = latest.fluencyScore - prev.fluencyScore;

      if (pacingDiff >= fluencyDiff && pacingDiff > 0) {
        biggestImprovement = { name: 'Pacing', delta: `+${Math.min(25, Math.round((pacingDiff / Math.max(1, prev.pacingScore)) * 100) || 11)}%` };
        growthSummary = '↗ Getting better at pacing';
      } else if (fluencyDiff > 0) {
        biggestImprovement = { name: 'Fluency', delta: `+${Math.min(25, Math.round((fluencyDiff / Math.max(1, prev.fluencyScore)) * 100) || 12)}%` };
        growthSummary = '↗ Getting better at fluency';
      } else {
        growthSummary = '→ Steady consistent flow';
      }
    }

    let focusTitle = 'Natural Pacing';
    let targetText = `Natural pacing ${avgPacing} → 80`;
    if (avgPacing >= 80 && avgExpression < 80) {
      focusTitle = 'Vocal Expression';
      targetText = `Vocal expression ${avgExpression} → 85`;
    } else if (avgPacing >= 80 && avgFluency < 85) {
      focusTitle = 'Spontaneous Fluency';
      targetText = `Spontaneous fluency ${avgFluency} → 90`;
    }

    return {
      overallScore: avgOverall,
      clarityScore: avgClarity,
      fluencyScore: avgFluency,
      pacingScore: avgPacing,
      expressionScore: avgExpression,
      growthSummary,
      biggestImprovement,
      totalSessions,
      sessionsThisWeek,
      weekDots,
      currentFocus: {
        title: focusTitle,
        targetText,
      },
      personalBests,
    };
  },

  getSpeakingJourney(): { stages: JourneyStage[]; currentMilestoneText: string } {
    const history = challengeStorage.getHistory();
    const sessions = history.length;
    const profile = challengeStorage.getSpeakerProfile();

    const stages: JourneyStage[] = [
      { id: '1', title: 'Started', isCompleted: sessions >= 1, isCurrent: sessions === 0 },
      { id: '2', title: 'Finding your voice', isCompleted: sessions >= 3, isCurrent: sessions >= 1 && sessions < 3 },
      { id: '3', title: 'Speaking more naturally', isCompleted: sessions >= 7, isCurrent: sessions >= 3 && sessions < 7 },
      { id: '4', title: 'Expressing ideas clearly', isCompleted: sessions >= 15, isCurrent: sessions >= 7 && sessions < 15 },
      { id: '5', title: 'Confident speaker', isCompleted: sessions >= 30, isCurrent: sessions >= 15 },
    ];

    return {
      stages,
      currentMilestoneText: profile.currentFocus.targetText,
    };
  },

  getPersonalBests(): PersonalBests {
    const raw = storage.getString(KEYS.PERSONAL_BESTS);
    if (raw) {
      try {
        return JSON.parse(raw) as PersonalBests;
      } catch {
        // ignore
      }
    }
    return {
      highestOverall: 0,
      highestFluency: 0,
      highestClarity: 0,
      highestPacing: 0,
      highestWpm: 0,
      longestStreakDays: 0,
    };
  },

  savePersonalBests(bests: PersonalBests): void {
    storage.set(KEYS.PERSONAL_BESTS, JSON.stringify(bests));
  },

  checkPersonalBest(result: ChallengeResult): string | null {
    const bests = challengeStorage.getPersonalBests();
    const currentClarity = Math.round((result.accuracyScore + result.pronunciationScore) / 2);

    let alert: string | null = null;
    let updated = false;

    if (result.overallScore > bests.highestOverall && result.overallScore >= 80) {
      alert = `🏆 New Personal Best: ${result.overallScore} Overall Score!`;
      bests.highestOverall = result.overallScore;
      updated = true;
    } else if (result.fluencyScore > bests.highestFluency && result.fluencyScore >= 80) {
      alert = `⚡ New Personal Best: Fluency ${result.fluencyScore}!`;
      bests.highestFluency = result.fluencyScore;
      updated = true;
    } else if (currentClarity > bests.highestClarity && currentClarity >= 82) {
      alert = `🎯 New Personal Best: Clarity ${currentClarity}!`;
      bests.highestClarity = currentClarity;
      updated = true;
    } else if (result.pacingScore > bests.highestPacing && result.pacingScore >= 80) {
      alert = `⏱️ New Personal Best: Pacing ${result.pacingScore}!`;
      bests.highestPacing = result.pacingScore;
      updated = true;
    }

    if (updated) {
      challengeStorage.savePersonalBests(bests);
    }
    return alert;
  },

  getRecentTopics(): string[] {
    const history = challengeStorage.getHistory();
    const topics: string[] = [];
    history.slice(0, 10).forEach((h) => {
      if (h.challengeTitle && !topics.includes(h.challengeTitle)) {
        topics.push(h.challengeTitle);
      }
    });
    return topics;
  },

  getSelectedDifficulty(): Difficulty {
    const saved = storage.getString(KEYS.SELECTED_DIFFICULTY);
    if (saved === 'advanced' || saved === 'intermediate' || saved === 'beginner') {
      return saved as Difficulty;
    }
    const profile = challengeStorage.getSpeakerProfile();
    return profile.overallScore >= 85 ? 'advanced' : profile.overallScore >= 75 ? 'intermediate' : 'beginner';
  },

  setSelectedDifficulty(difficulty: Difficulty): void {
    storage.set(KEYS.SELECTED_DIFFICULTY, difficulty);
  },

  getTodayChallengeId(): string | null {
    return storage.getString(KEYS.TODAY_CHALLENGE_ID) ?? null;
  },

  setTodayChallengeId(id: string): void {
    storage.set(KEYS.TODAY_CHALLENGE_ID, id);
  },

  getLastCompletedDate(): string | null {
    return storage.getString(KEYS.LAST_COMPLETED_DATE) ?? null;
  },

  isCompletedToday(): boolean {
    const lastDate = storage.getString(KEYS.LAST_COMPLETED_DATE);
    const today = getTodayDateString();
    return lastDate === today;
  },

  getTodayResult(): ChallengeResult | null {
    const raw = storage.getString(KEYS.TODAY_RESULT);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ChallengeResult;
    } catch {
      return null;
    }
  },

  saveChallengeResult(result: ChallengeResult): {
    personalBestAlert: string | null;
  } {
    const today = getTodayDateString();
    const existingHistory = challengeStorage.getHistory();

    const personalBestAlert = challengeStorage.checkPersonalBest(result);
    if (personalBestAlert) {
      result.personalBestAlert = personalBestAlert;
    }

    storage.set(KEYS.LAST_COMPLETED_DATE, today);
    storage.set(KEYS.TODAY_RESULT, JSON.stringify(result));
    storage.set(KEYS.ONBOARDING_SEEN, 'true');

    const updatedHistory = [result, ...existingHistory.filter((h) => h.completedAt !== result.completedAt)];
    storage.set(KEYS.COMPLETION_HISTORY, JSON.stringify(updatedHistory));

    return { personalBestAlert };
  },

  getHistory(): ChallengeResult[] {
    const raw = storage.getString(KEYS.COMPLETION_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ChallengeResult[];
    } catch {
      return [];
    }
  },

  hasSeenOnboarding(): boolean {
    return storage.getString(KEYS.ONBOARDING_SEEN) === 'true';
  },

  setOnboardingSeen(): void {
    storage.set(KEYS.ONBOARDING_SEEN, 'true');
  },

  resetAppProgress(): void {
    storage.delete(KEYS.LAST_COMPLETED_DATE);
    storage.delete(KEYS.TODAY_RESULT);
    storage.delete(KEYS.TODAY_CHALLENGE_ID);
    storage.delete(KEYS.SELECTED_DIFFICULTY);
    storage.delete(KEYS.COMPLETION_HISTORY);
    storage.delete(KEYS.ONBOARDING_SEEN);
    storage.delete(KEYS.PERSONAL_BESTS);
  },
};
