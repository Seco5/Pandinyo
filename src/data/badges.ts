import { UserProfile } from '../types';
import { ProgressMap } from '../storage';

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  earned: (p: UserProfile, progress: ProgressMap) => boolean;
}

export const badges: Badge[] = [
  { id: 'first_lesson', emoji: '🌱', name: 'İlk Adım', desc: 'İlk dersini tamamla', earned: (_p, pr) => Object.values(pr).some((a) => a.length > 0) },
  { id: 'streak_3', emoji: '🔥', name: 'Ateşli', desc: '3 günlük seri', earned: (p) => p.longestStreak >= 3 },
  { id: 'streak_7', emoji: '🕶️', name: 'Güneşli', desc: '7 günlük seri', earned: (p) => p.longestStreak >= 7 },
  { id: 'streak_30', emoji: '🥇', name: 'Şampiyon', desc: '30 günlük seri', earned: (p) => p.longestStreak >= 30 },
  { id: 'xp_100', emoji: '💎', name: 'İlk Elmas', desc: '100 XP kazan', earned: (p) => p.totalXP >= 100 },
  { id: 'xp_500', emoji: '🚀', name: 'Roket', desc: '500 XP kazan', earned: (p) => p.totalXP >= 500 },
  { id: 'module_done', emoji: '🏆', name: 'Modül Ustası', desc: 'Bir modülü bitir', earned: (_p, pr) => Object.values(pr).some((a) => a.length >= 4) },
];

export function earnedBadgeIds(p: UserProfile, progress: ProgressMap): string[] {
  return badges.filter((b) => b.earned(p, progress)).map((b) => b.id);
}
