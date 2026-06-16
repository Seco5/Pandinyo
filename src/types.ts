export type Level = 'beginner' | 'intermediate' | 'advanced';

export type Goal = 'business' | 'exam';

export interface UserProfile {
  name: string;
  sector: string; // sector id
  goal: Goal; // learning focus
  level: Level;
  totalXP: number;
  diamonds: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date (YYYY-MM-DD)
  activityLog: string[]; // ['2026-06-01', ...]
  dailyGoal: number; // 15 | 30 | 50
  xpToday: number;
  xpTodayDate: string; // YYYY-MM-DD the xpToday counter belongs to
  badges: string[]; // earned badge ids
  onboarded: boolean;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: number[];
  totalLessons: number;
  isUnlocked: boolean;
}

export interface LessonResult {
  lessonId: string;
  score: number; // 0..1
  xpEarned: number;
  completedAt: string;
  mistakes: string[];
}

export type LessonType = 'vocab' | 'quiz' | 'dialogue' | 'email';

export interface Sector {
  id: string;
  emoji: string;
  name: string;
}

export interface VocabCard {
  id: string;
  english: string;
  turkish: string;
  example: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index
  explanation: string;
  passage?: string; // optional reading passage shown above the question
}

export interface DialogueTurn {
  speaker: 'other' | 'user';
  text: string;
}

export interface Dialogue {
  id: string;
  title: string;
  turns: DialogueTurn[];
}

export interface EmailScenario {
  id: string;
  title: string;
  scenario: string;
  referenceEmail: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  index: number; // position within module (0-based)
  type: LessonType;
  title: string;
}

export interface Module {
  id: string;
  emoji: string;
  icon: string; // Ionicons name
  name: string;
  lessons: Lesson[];
}
