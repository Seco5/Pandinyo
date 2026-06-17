import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, Level, Goal, StoryMap, StoryProgress } from './types';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  defaultProfile,
  ProgressMap,
  resetAll,
  loadStory,
  saveStory,
  defaultStoryProgress,
  loadFavorites,
  saveFavorites,
} from './storage';
import { todayStr, daysBetween } from './date';
import { earnedBadgeIds } from './data/badges';
import { modules } from './data/modules';
import { fullModule } from './data/full';
import { scheduleStreakReminder } from './notifications';

// Lessons per module depend on the content source: rich (full) sectors
// override the generic module's lesson count.
export function moduleLessonCount(sector: string, moduleId: string): number {
  const full = fullModule(sector, moduleId);
  if (full) return full.lessons.length;
  return modules.find((m) => m.id === moduleId)?.lessons.length ?? 0;
}

interface CompleteResult {
  xpEarned: number;
  newDiamonds: number;
  streak: number;
  streakWasBroken: boolean;
}

interface AppState {
  ready: boolean;
  profile: UserProfile;
  progress: ProgressMap;
  streakBrokenNotice: boolean; // true if streak was lost since last open
  completeOnboarding: (sector: string, level: Level, name?: string, goal?: Goal, character?: 'alex' | 'sara') => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  completeLesson: (
    progressKey: string,
    lessonIndex: number,
    correct: number,
    total: number,
    mistakes: string[]
  ) => Promise<CompleteResult>;
  updateLearning: (next: { goal?: Goal; sector?: string; currentExam?: string }) => Promise<void>;
  recordVocab: (known: string[], repeat: string[]) => Promise<void>;
  recordVocabScore: (score: number) => Promise<void>;
  setStoryCharacter: (id: 'alex' | 'sara') => Promise<void>;
  freezeStreak: () => Promise<boolean>;
  reset: () => Promise<void>;
  // ---- Story Mode ----
  story: StoryMap;
  storyProgress: (storyId: string) => StoryProgress;
  updateStory: (storyId: string, updater: (prev: StoryProgress) => StoryProgress) => Promise<StoryProgress>;
  addStoryXP: (amount: number) => Promise<void>;
  resetStory: (storyId: string) => Promise<void>;
  // ---- Phrasebook favorites ----
  favoritePhrases: string[];
  toggleFavoritePhrase: (id: string) => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}

// Progress is namespaced per mode + track so each sector / exam keeps its own
// completion. Sector (work) modules: w_<sector>_<moduleId>; exam: e_<moduleId>.
export const workKey = (sector: string, moduleId: string) => `w_${sector}_${moduleId}`;
export const examKey = (moduleId: string) => `e_${moduleId}`;

// Locks removed — every module and lesson is freely accessible.
export function isModuleUnlocked(_progress: ProgressMap, _sector: string, _moduleId: string): boolean {
  return true;
}

export function isLessonUnlocked(
  _progress: ProgressMap,
  _sector: string,
  _moduleId: string,
  _lessonIndex: number
): boolean {
  return true;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile());
  const [progress, setProgress] = useState<ProgressMap>({});
  const [story, setStory] = useState<StoryMap>({});
  const [favoritePhrases, setFavoritePhrases] = useState<string[]>([]);
  const [streakBrokenNotice, setStreakBrokenNotice] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, pr, st, fav] = await Promise.all([loadProfile(), loadProgress(), loadStory(), loadFavorites()]);
      setStory(st);
      setFavoritePhrases(fav);
      let prof = { ...defaultProfile(), ...(p ?? {}) }; // migrate older profiles to new fields
      const today = todayStr();
      // Streak expiry check on launch.
      if (prof.lastActiveDate && prof.currentStreak > 0) {
        const gap = daysBetween(prof.lastActiveDate, today);
        if (gap > 1) {
          setStreakBrokenNotice(true);
          prof = { ...prof, currentStreak: 0 };
        }
      }
      // Reset today's XP counter if it's a new day.
      if (prof.xpTodayDate !== today) {
        prof = { ...prof, xpToday: 0, xpTodayDate: today };
      }
      setProfile(prof);
      setProgress(pr);
      await saveProfile(prof);
      if (prof.onboarded) scheduleStreakReminder();
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (prof: UserProfile, pr: ProgressMap) => {
    setProfile(prof);
    setProgress(pr);
    await Promise.all([saveProfile(prof), saveProgress(pr)]);
  }, []);

  const completeOnboarding = useCallback(
    async (sector: string, level: Level, name?: string, goal?: Goal, character?: 'alex' | 'sara') => {
      const prof: UserProfile = {
        ...profile,
        sector,
        level,
        goal: goal ?? profile.goal,
        name: name?.trim() ? name.trim() : profile.name,
        storyCharacter: character ?? profile.storyCharacter,
        onboarded: true,
      };
      await persist(prof, progress);
      scheduleStreakReminder();
    },
    [profile, progress, persist]
  );

  const setDailyGoal = useCallback(
    async (goal: number) => {
      await persist({ ...profile, dailyGoal: goal }, progress);
    },
    [profile, progress, persist]
  );

  const recordVocab = useCallback<AppState['recordVocab']>(
    async (known, repeat) => {
      const knownSet = new Set([...profile.vocabKnown, ...known]);
      // A word that is now known shouldn't stay in the repeat list.
      const repeatSet = new Set([...profile.vocabRepeat, ...repeat].filter((id) => !knownSet.has(id)));
      const list = Array.from(knownSet);
      console.log('vocabKnown güncellendi, toplam:', list.length, list);
      await persist({ ...profile, vocabKnown: list, vocabRepeat: Array.from(repeatSet) }, progress);
    },
    [profile, progress, persist]
  );

  const recordVocabScore = useCallback<AppState['recordVocabScore']>(
    async (score) => {
      if (score <= profile.bestVocabScore) return;
      await persist({ ...profile, bestVocabScore: score }, progress);
    },
    [profile, progress, persist]
  );

  const setStoryCharacter = useCallback<AppState['setStoryCharacter']>(
    async (id) => {
      await persist({ ...profile, storyCharacter: id }, progress);
    },
    [profile, progress, persist]
  );

  const updateLearning = useCallback<AppState['updateLearning']>(
    async (next) => {
      await persist(
        {
          ...profile,
          goal: next.goal ?? profile.goal,
          sector: next.sector ?? profile.sector,
          currentExam: next.currentExam ?? profile.currentExam,
        },
        progress
      );
    },
    [profile, progress, persist]
  );

  const completeLesson = useCallback<AppState['completeLesson']>(
    async (progressKey, lessonIndex, correct, total, mistakes) => {
      const today = todayStr();
      let prof = { ...profile };

      // --- XP ---
      let xp = correct * 10; // +10 per correct answer
      xp += 20; // lesson completion
      if (mistakes.length === 0) xp += 30; // perfect lesson bonus

      const oldTotal = prof.totalXP;

      // --- Streak ---
      let streakWasBroken = false;
      if (prof.lastActiveDate !== today) {
        const gap = prof.lastActiveDate ? daysBetween(prof.lastActiveDate, today) : 999;
        if (gap === 1) {
          prof.currentStreak += 1;
        } else {
          if (prof.currentStreak > 0 && gap > 1) streakWasBroken = true;
          prof.currentStreak = 1;
        }
        prof.lastActiveDate = today;
        if (!prof.activityLog.includes(today)) prof.activityLog = [...prof.activityLog, today];
      }
      prof.longestStreak = Math.max(prof.longestStreak, prof.currentStreak);

      // --- daily XP counter + goal bonus ---
      if (prof.xpTodayDate !== today) {
        prof.xpToday = 0;
        prof.xpTodayDate = today;
      }
      const beforeGoal = prof.xpToday >= prof.dailyGoal;
      prof.xpToday += xp;
      if (!beforeGoal && prof.xpToday >= prof.dailyGoal) {
        xp += 50; // daily goal bonus
        prof.xpToday += 50;
      }

      prof.totalXP = oldTotal + xp;

      // --- diamonds: 1 per 100 XP crossed ---
      const newDiamonds = Math.floor(prof.totalXP / 100) - Math.floor(oldTotal / 100);
      prof.diamonds += newDiamonds;

      // --- progress ---
      const completed = new Set(progress[progressKey] ?? []);
      completed.add(lessonIndex);
      const pr: ProgressMap = { ...progress, [progressKey]: Array.from(completed).sort((a, b) => a - b) };

      // --- badges ---
      prof.badges = earnedBadgeIds(prof, pr);

      await persist(prof, pr);
      setStreakBrokenNotice(false);

      return { xpEarned: xp, newDiamonds, streak: prof.currentStreak, streakWasBroken };
    },
    [profile, progress, persist]
  );

  const freezeStreak = useCallback(async () => {
    if (profile.diamonds < 1) return false;
    const prof = {
      ...profile,
      diamonds: profile.diamonds - 1,
      currentStreak: Math.max(profile.currentStreak, 1),
      lastActiveDate: todayStr(),
    };
    await persist(prof, progress);
    setStreakBrokenNotice(false);
    return true;
  }, [profile, progress, persist]);

  const reset = useCallback(async () => {
    await resetAll();
    setProfile(defaultProfile());
    setProgress({});
    setStory({});
    setFavoritePhrases([]);
    setStreakBrokenNotice(false);
  }, []);

  // ---- Story Mode ----
  const storyProgress = useCallback(
    (storyId: string) => story[storyId] ?? defaultStoryProgress(),
    [story]
  );

  const updateStory = useCallback<AppState['updateStory']>(
    async (storyId, updater) => {
      const prev = story[storyId] ?? defaultStoryProgress();
      const next = updater(prev);
      const map = { ...story, [storyId]: next };
      setStory(map);
      await saveStory(map);
      return next;
    },
    [story]
  );

  const addStoryXP = useCallback<AppState['addStoryXP']>(
    async (amount) => {
      const today = todayStr();
      const prof = { ...profile };
      const oldTotal = prof.totalXP;
      prof.totalXP = oldTotal + amount;
      prof.diamonds += Math.floor(prof.totalXP / 100) - Math.floor(oldTotal / 100);
      if (prof.xpTodayDate !== today) {
        prof.xpToday = 0;
        prof.xpTodayDate = today;
      }
      prof.xpToday += amount;
      if (!prof.activityLog.includes(today)) prof.activityLog = [...prof.activityLog, today];
      await persist(prof, progress);
    },
    [profile, progress, persist]
  );

  const resetStory = useCallback<AppState['resetStory']>(
    async (storyId) => {
      const map = { ...story, [storyId]: defaultStoryProgress() };
      setStory(map);
      await saveStory(map);
    },
    [story]
  );

  const toggleFavoritePhrase = useCallback<AppState['toggleFavoritePhrase']>(
    async (id) => {
      const next = favoritePhrases.includes(id)
        ? favoritePhrases.filter((x) => x !== id)
        : [...favoritePhrases, id];
      setFavoritePhrases(next);
      await saveFavorites(next);
    },
    [favoritePhrases]
  );

  return (
    <Ctx.Provider
      value={{
        ready,
        profile,
        progress,
        streakBrokenNotice,
        completeOnboarding,
        setDailyGoal,
        completeLesson,
        updateLearning,
        recordVocab,
        recordVocabScore,
        setStoryCharacter,
        freezeStreak,
        reset,
        story,
        storyProgress,
        updateStory,
        addStoryXP,
        resetStory,
        favoritePhrases,
        toggleFavoritePhrase,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
