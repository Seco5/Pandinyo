import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, Level } from './types';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  defaultProfile,
  ProgressMap,
  resetAll,
} from './storage';
import { todayStr, daysBetween } from './date';
import { earnedBadgeIds } from './data/badges';
import { modules } from './data/modules';
import { scheduleStreakReminder } from './notifications';

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
  completeOnboarding: (sector: string, level: Level, name?: string) => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  completeLesson: (
    moduleId: string,
    lessonIndex: number,
    correct: number,
    total: number,
    mistakes: string[]
  ) => Promise<CompleteResult>;
  freezeStreak: () => Promise<boolean>;
  reset: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}

export function isModuleUnlocked(progress: ProgressMap, moduleId: string): boolean {
  const idx = modules.findIndex((m) => m.id === moduleId);
  if (idx <= 0) return true;
  const prev = modules[idx - 1];
  return (progress[prev.id]?.length ?? 0) >= prev.lessons.length;
}

export function isLessonUnlocked(progress: ProgressMap, moduleId: string, lessonIndex: number): boolean {
  if (!isModuleUnlocked(progress, moduleId)) return false;
  if (lessonIndex === 0) return true;
  return (progress[moduleId] ?? []).includes(lessonIndex - 1);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile());
  const [progress, setProgress] = useState<ProgressMap>({});
  const [streakBrokenNotice, setStreakBrokenNotice] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, pr] = await Promise.all([loadProfile(), loadProgress()]);
      let prof = p ?? defaultProfile();
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
    async (sector: string, level: Level, name?: string) => {
      const prof: UserProfile = {
        ...profile,
        sector,
        level,
        name: name?.trim() ? name.trim() : profile.name,
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

  const completeLesson = useCallback<AppState['completeLesson']>(
    async (moduleId, lessonIndex, correct, total, mistakes) => {
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
      const completed = new Set(progress[moduleId] ?? []);
      completed.add(lessonIndex);
      const pr: ProgressMap = { ...progress, [moduleId]: Array.from(completed).sort((a, b) => a - b) };

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
    setStreakBrokenNotice(false);
  }, []);

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
        freezeStreak,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
