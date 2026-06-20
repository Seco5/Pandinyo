import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, StoryMap, StoryProgress } from './types';

const PROFILE_KEY = '@pandinyo/profile';
const PROGRESS_KEY = '@pandinyo/progress';
const RESULTS_KEY = '@pandinyo/results';
const STORY_KEY = '@pandinyo/story';
const FAVORITES_KEY = '@pandinyo/favorites';

export async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function saveFavorites(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export type ProgressMap = Record<string, number[]>; // moduleId -> completed lesson indexes

export function defaultStoryProgress(): StoryProgress {
  return {
    currentChapter: 0,
    hiddenScore: 0,
    chapterResults: [],
    completed: false,
    finalEnding: null,
    cardResult: null,
    completedAt: null,
  };
}

export async function loadStory(): Promise<StoryMap> {
  const raw = await AsyncStorage.getItem(STORY_KEY);
  return raw ? (JSON.parse(raw) as StoryMap) : {};
}

export async function saveStory(s: StoryMap): Promise<void> {
  await AsyncStorage.setItem(STORY_KEY, JSON.stringify(s));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveProfile(p: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export async function loadProgress(): Promise<ProgressMap> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  return raw ? (JSON.parse(raw) as ProgressMap) : {};
}

export async function saveProgress(p: ProgressMap): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export async function appendResult(r: unknown): Promise<void> {
  const raw = await AsyncStorage.getItem(RESULTS_KEY);
  const list = raw ? JSON.parse(raw) : [];
  list.push(r);
  await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(list));
}

export async function resetAll(): Promise<void> {
  await AsyncStorage.multiRemove([PROFILE_KEY, PROGRESS_KEY, RESULTS_KEY, STORY_KEY, FAVORITES_KEY]);
}

export function defaultProfile(): UserProfile {
  return {
    name: 'Sercan',
    sector: '',
    currentExam: 'toefl',
    goal: 'business',
    level: 'beginner',
    totalXP: 0,
    diamonds: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activityLog: [],
    dailyGoal: 30,
    xpToday: 0,
    xpTodayDate: '',
    badges: [],
    onboarded: false,
    vocabKnown: [],
    vocabRepeat: [],
    bestVocabScore: 0,
    storyCharacter: 'alex',
  };
}
