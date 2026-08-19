import { Difficulty } from '../types/challenge';
import { ChallengeResult } from '../types/result';

// Key definitions
const KEYS = {
  SELECTED_DIFFICULTY: 'saywise.selected_difficulty',
  TODAY_CHALLENGE_ID: 'saywise.today_challenge_id',
  LAST_COMPLETED_DATE: 'saywise.last_completed_date',
  TODAY_RESULT: 'saywise.today_result',
  COMPLETION_HISTORY: 'saywise.completion_history',
  ONBOARDING_SEEN: 'saywise.onboarding_seen',
};

interface IMMKVInstance {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  clearAll(): void;
}

// In-memory persistent map for environments without native NitroModules (e.g. Expo Go)
const memoryStore = new Map<string, string>();

class SafeStorage {
  private mmkvInstance: IMMKVInstance | null = null;
  private initialized = false;

  private getStorage(): IMMKVInstance | null {
    if (this.initialized) {
      return this.mmkvInstance;
    }
    this.initialized = true;

    try {
      // Check if native NitroModules exists on global before attempting to load MMKV.
      // This strictly prevents the "Failed to get NitroModules" runtime error in Expo Go.
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
      // Fallback
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
        // Fallback to memory
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
        // Fallback to memory
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
        // Fallback to memory
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
        // Fallback to memory
      }
    }
    memoryStore.clear();
  }
}

const storage = new SafeStorage();

/**
 * Get current date string formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const challengeStorage = {
  /**
   * Selected Difficulty
   */
  getSelectedDifficulty(): Difficulty | null {
    const val = storage.getString(KEYS.SELECTED_DIFFICULTY);
    if (val === 'beginner' || val === 'intermediate' || val === 'advanced') {
      return val;
    }
    return null;
  },

  setSelectedDifficulty(difficulty: Difficulty): void {
    storage.set(KEYS.SELECTED_DIFFICULTY, difficulty);
  },

  /**
   * Today's Challenge ID
   */
  getTodayChallengeId(): string | null {
    return storage.getString(KEYS.TODAY_CHALLENGE_ID) ?? null;
  },

  setTodayChallengeId(id: string): void {
    storage.set(KEYS.TODAY_CHALLENGE_ID, id);
  },

  /**
   * Last Completed Date (YYYY-MM-DD)
   */
  getLastCompletedDate(): string | null {
    return storage.getString(KEYS.LAST_COMPLETED_DATE) ?? null;
  },

  /**
   * Checks if user has already completed a challenge today
   */
  isCompletedToday(): boolean {
    const lastDate = storage.getString(KEYS.LAST_COMPLETED_DATE);
    const today = getTodayDateString();
    return lastDate === today;
  },

  /**
   * Today's saved result
   */
  getTodayResult(): ChallengeResult | null {
    const raw = storage.getString(KEYS.TODAY_RESULT);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ChallengeResult;
    } catch {
      return null;
    }
  },

  /**
   * Save challenge result and record completion for today
   */
  saveChallengeResult(result: ChallengeResult): void {
    const today = getTodayDateString();
    storage.set(KEYS.LAST_COMPLETED_DATE, today);
    storage.set(KEYS.TODAY_RESULT, JSON.stringify(result));
    storage.set(KEYS.ONBOARDING_SEEN, 'true');

    // Append to history
    const existingHistory = challengeStorage.getHistory();
    const updatedHistory = [result, ...existingHistory.filter((h) => h.completedAt !== result.completedAt)];
    storage.set(KEYS.COMPLETION_HISTORY, JSON.stringify(updatedHistory));
  },

  /**
   * Get all completion history
   */
  getHistory(): ChallengeResult[] {
    const raw = storage.getString(KEYS.COMPLETION_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ChallengeResult[];
    } catch {
      return [];
    }
  },

  /**
   * Check if onboarding flow has been seen/completed
   */
  hasSeenOnboarding(): boolean {
    const history = challengeStorage.getHistory();
    if (history.length > 0) return true;
    return storage.getString(KEYS.ONBOARDING_SEEN) === 'true';
  },

  setOnboardingSeen(): void {
    storage.set(KEYS.ONBOARDING_SEEN, 'true');
  },

  /**
   * Calculate consecutive day streak count
   */
  getStreakCount(): number {
    const history = challengeStorage.getHistory();
    if (history.length === 0) return 0;

    const dateSet = new Set<string>();
    history.forEach((h) => {
      if (h.completedAt) {
        const dateStr = h.completedAt.split('T')[0];
        dateSet.add(dateStr);
      }
    });

    const sortedDates = Array.from(dateSet).sort().reverse();
    if (sortedDates.length === 0) return 0;

    const today = getTodayDateString();
    const now = new Date();
    const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

    const mostRecent = sortedDates[0];
    if (mostRecent !== today && mostRecent !== yesterdayStr) {
      return 0; // Streak broken
    }

    let streak = 0;
    let expectedDate = new Date(mostRecent);

    for (const dateStr of sortedDates) {
      const parts = dateStr.split('-').map(Number);
      const curDate = new Date(parts[0], parts[1] - 1, parts[2]);

      const diffTime = expectedDate.getTime() - curDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) {
        streak++;
        expectedDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  /**
   * Reset all progress (dev/testing utility)
   */
  resetAppProgress(): void {
    storage.delete(KEYS.LAST_COMPLETED_DATE);
    storage.delete(KEYS.TODAY_RESULT);
    storage.delete(KEYS.TODAY_CHALLENGE_ID);
    storage.delete(KEYS.SELECTED_DIFFICULTY);
    storage.delete(KEYS.COMPLETION_HISTORY);
    storage.delete(KEYS.ONBOARDING_SEEN);
  },
};
