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
  TOTAL_WORDS_SPOKEN: 'saywise.total_words_spoken',
  TOTAL_XP: 'saywise.total_xp',
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
 * Cumulative XP Thresholds for Levels 1 - 10
 */
const LEVEL_XP_THRESHOLDS = [
  0,     // Level 1: 0 XP
  200,   // Level 2: 200 XP (1st challenge + 100 boost = 200 XP -> Instant Level 2!)
  450,   // Level 3: 450 XP (250 XP needed: 3 without streak, 2 with streak)
  750,   // Level 4: 750 XP (300 XP needed: 3 without streak, 2 with streak)
  1100,  // Level 5: 1100 XP -> Intermediate Tier Unlocked ⚡
  1500,  // Level 6: 1500 XP
  1950,  // Level 7: 1950 XP
  2450,  // Level 8: 2450 XP
  3000,  // Level 9: 3000 XP
  3600,  // Level 10: 3600 XP -> Advanced Tier Unlocked 👑
];

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

export interface DayStreakItem {
  dayName: string;
  shortLabel: string;
  dateStr: string;
  isToday: boolean;
  completed: boolean;
}

export interface ActivityDay {
  dateStr: string;
  completed: boolean;
  score?: number;
}

export interface UserLevelInfo {
  level: number;
  title: string;
  totalCompleted: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  levelProgressPercent: number;
  activeDifficulty: Difficulty;
  isIntermediateUnlocked: boolean;
  isAdvancedUnlocked: boolean;
  nextUnlockName: string | null;
  nextUnlockLevel: number;
  hasStreakBonus: boolean;
}

export const challengeStorage = {
  /**
   * Calculate cumulative XP from completion history
   */
  getTotalXP(): number {
    const rawXP = storage.getString(KEYS.TOTAL_XP);
    if (rawXP) {
      const parsed = parseInt(rawXP, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    // Calculate dynamically from history
    const history = challengeStorage.getHistory();
    let xp = 0;
    history.forEach((h, index) => {
      let sessionXP = 100; // Base XP
      if (index === 0) sessionXP += 100; // 1st Challenge Boost (Level 1 -> 2)
      if (h.overallScore >= 85) sessionXP += 25; // Accuracy bonus
      sessionXP += 50; // Daily Consistency Bonus
      xp += sessionXP;
    });

    return xp;
  },

  /**
   * Get comprehensive User Level & Tier Progression with XP calculation
   */
  getLevelInfo(): UserLevelInfo {
    const history = challengeStorage.getHistory();
    const totalCompleted = history.length;
    const totalXP = challengeStorage.getTotalXP();
    const streakCount = challengeStorage.getStreakCount();
    const hasStreakBonus = streakCount > 0;

    // Determine Level based on XP thresholds
    let level = 1;
    for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_XP_THRESHOLDS[i]) {
        level = i + 1;
        break;
      }
    }

    const currentLevelBaseXP = LEVEL_XP_THRESHOLDS[level - 1] || 0;
    const nextLevelXP = LEVEL_XP_THRESHOLDS[level] || LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1];
    const xpIntoLevel = Math.max(0, totalXP - currentLevelBaseXP);
    const xpNeededForLevel = Math.max(1, nextLevelXP - currentLevelBaseXP);
    const levelProgressPercent = level >= 10 ? 100 : Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100));

    // Unlocks: Level 5 for Intermediate, Level 10 for Advanced
    const isIntermediateUnlocked = level >= 5;
    const isAdvancedUnlocked = level >= 10;

    let activeDifficulty: Difficulty = 'beginner';
    const saved = storage.getString(KEYS.SELECTED_DIFFICULTY);

    if (saved === 'advanced' && isAdvancedUnlocked) {
      activeDifficulty = 'advanced';
    } else if (saved === 'intermediate' && isIntermediateUnlocked) {
      activeDifficulty = 'intermediate';
    } else if (saved === 'beginner') {
      activeDifficulty = 'beginner';
    } else {
      activeDifficulty = isAdvancedUnlocked ? 'advanced' : isIntermediateUnlocked ? 'intermediate' : 'beginner';
    }

    let title = 'Novice Speaker 🌱';
    if (level >= 10) title = 'Mastery Speaker 👑';
    else if (level >= 7) title = 'Expert Speaker 🚀';
    else if (level >= 5) title = 'Fluent Speaker ⚡';
    else if (level >= 3) title = 'Rising Speaker 🌿';
    else if (level >= 2) title = 'Apprentice Speaker 🎯';

    let nextUnlockName: string | null = 'Intermediate ⚡';
    let nextUnlockLevel = 5;

    if (level >= 10) {
      nextUnlockName = null;
      nextUnlockLevel = 10;
    } else if (level >= 5) {
      nextUnlockName = 'Advanced 👑';
      nextUnlockLevel = 10;
    }

    return {
      level,
      title,
      totalCompleted,
      totalXP,
      currentLevelXP: totalXP,
      nextLevelXP,
      levelProgressPercent,
      activeDifficulty,
      isIntermediateUnlocked,
      isAdvancedUnlocked,
      nextUnlockName,
      nextUnlockLevel,
      hasStreakBonus,
    };
  },

  /**
   * Selected Difficulty
   */
  getSelectedDifficulty(): Difficulty {
    const info = challengeStorage.getLevelInfo();
    return info.activeDifficulty;
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
   * Save challenge result and record completion for today + compute XP rewards
   */
  saveChallengeResult(result: ChallengeResult): { xpEarned: number; isFirstBoost: boolean; hasStreakBonus: boolean } {
    const today = getTodayDateString();
    const existingHistory = challengeStorage.getHistory();
    const isFirstChallenge = existingHistory.length === 0;
    const currentStreak = challengeStorage.getStreakCount();
    const hasStreakBonus = currentStreak > 0;

    // Calculate XP earned in this session
    let sessionXP = 100; // Base challenge reward
    if (isFirstChallenge) sessionXP += 100; // First Challenge Kickstart Boost (100 -> 200 XP -> Instant Level 2!)
    if (hasStreakBonus) sessionXP += 50; // Daily Consistency Boost (+50 XP)
    if (result.overallScore >= 85) sessionXP += 25; // Accuracy Milestone Bonus (+25 XP)

    const currentTotalXP = challengeStorage.getTotalXP();
    const newTotalXP = currentTotalXP + sessionXP;
    storage.set(KEYS.TOTAL_XP, String(newTotalXP));

    storage.set(KEYS.LAST_COMPLETED_DATE, today);
    storage.set(KEYS.TODAY_RESULT, JSON.stringify(result));
    storage.set(KEYS.ONBOARDING_SEEN, 'true');

    // Estimate words in this session
    const currentWords = challengeStorage.getTotalWordsSpoken();
    const wordsInSession = result.difficulty === 'advanced' ? 45 : result.difficulty === 'intermediate' ? 35 : 25;
    storage.set(KEYS.TOTAL_WORDS_SPOKEN, String(currentWords + wordsInSession));

    // Append to history
    const updatedHistory = [result, ...existingHistory.filter((h) => h.completedAt !== result.completedAt)];
    storage.set(KEYS.COMPLETION_HISTORY, JSON.stringify(updatedHistory));

    return {
      xpEarned: sessionXP,
      isFirstBoost: isFirstChallenge,
      hasStreakBonus,
    };
  },

  /**
   * Total words spoken metric
   */
  getTotalWordsSpoken(): number {
    const val = storage.getString(KEYS.TOTAL_WORDS_SPOKEN);
    if (val) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) return parsed;
    }
    const history = challengeStorage.getHistory();
    return history.length * 30;
  },

  /**
   * Total minutes practiced
   */
  getTotalMinutesPracticed(): number {
    const history = challengeStorage.getHistory();
    return Math.max(1, Math.round(history.length * 2));
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
   * 30-Day Activity History Array
   */
  get30DayActivityMap(): ActivityDay[] {
    const history = challengeStorage.getHistory();
    const map = new Map<string, number>();
    history.forEach((h) => {
      if (h.completedAt) {
        const dateStr = h.completedAt.split('T')[0];
        map.set(dateStr, h.overallScore);
      }
    });

    const now = new Date();
    const result: ActivityDay[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      result.push({
        dateStr,
        completed: map.has(dateStr),
        score: map.get(dateStr),
      });
    }
    return result;
  },

  /**
   * Weekly streak matrix for Mon - Sun of the current week
   */
  getWeeklyStreakMatrix(): DayStreakItem[] {
    const history = challengeStorage.getHistory();
    const completedDateSet = new Set<string>();
    history.forEach((h) => {
      if (h.completedAt) {
        completedDateSet.add(h.completedAt.split('T')[0]);
      }
    });

    const now = new Date();
    const todayStr = getTodayDateString();
    const currentDayOfWeek = now.getDay();
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);

    const weekDays: DayStreakItem[] = [];
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const dayFullNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const year = dayDate.getFullYear();
      const month = String(dayDate.getMonth() + 1).padStart(2, '0');
      const day = String(dayDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      weekDays.push({
        dayName: dayFullNames[i],
        shortLabel: dayLabels[i],
        dateStr,
        isToday: dateStr === todayStr,
        completed: completedDateSet.has(dateStr),
      });
    }

    return weekDays;
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
      return 0;
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
    storage.delete(KEYS.TOTAL_WORDS_SPOKEN);
    storage.delete(KEYS.TOTAL_XP);
  },
};
