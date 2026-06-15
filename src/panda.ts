export type PandaState =
  | 'sleeping'
  | 'normal'
  | 'fired'
  | 'sunny'
  | 'studious'
  | 'champion'
  | 'graduate'
  | 'crying';

export interface PandaLook {
  state: PandaState;
  face: string; // emoji rendered as the panda
  accessory: string; // small emoji badge for the costume
  label: string;
  dim: boolean;
}

export function pandaForStreak(streak: number, broken = false): PandaLook {
  if (broken) {
    return { state: 'crying', face: '🐼', accessory: '😢', label: 'Beni bırakma!', dim: true };
  }
  if (streak >= 60) {
    return { state: 'graduate', face: '🐼', accessory: '🎓', label: 'Mezun', dim: false };
  }
  if (streak >= 30) {
    return { state: 'champion', face: '🐼', accessory: '🥇', label: 'Şampiyon', dim: false };
  }
  if (streak >= 14) {
    return { state: 'studious', face: '🐼', accessory: '💻', label: 'Çalışkan', dim: false };
  }
  if (streak >= 7) {
    return { state: 'sunny', face: '🐼', accessory: '🕶️', label: 'Güneşli', dim: false };
  }
  if (streak >= 3) {
    return { state: 'fired', face: '🐼', accessory: '🔥', label: 'Ateşli', dim: false };
  }
  if (streak >= 1) {
    return { state: 'normal', face: '🐼', accessory: '✨', label: 'Normal', dim: false };
  }
  return { state: 'sleeping', face: '🐼', accessory: '💤', label: 'Uyuyor', dim: true };
}

// Backpack fills up every 100 XP — returns 0..1 fill of the current 100-XP band.
export function backpackFill(totalXP: number): number {
  return (totalXP % 100) / 100;
}
