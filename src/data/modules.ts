import { Module, Lesson, LessonType } from '../types';

interface ModuleDef {
  id: string;
  emoji: string;
  icon: string; // Ionicons name
  name: string;
  // sequence of lesson types within the module
  pattern: LessonType[];
}

const moduleDefs: ModuleDef[] = [
  { id: 'vocab', emoji: '📚', icon: 'library', name: 'Kelimeler', pattern: ['vocab', 'vocab', 'quiz', 'vocab', 'quiz'] },
  { id: 'intro', emoji: '👋', icon: 'person', name: 'Kendini tanıtma', pattern: ['vocab', 'quiz', 'dialogue', 'quiz'] },
  { id: 'phone', emoji: '📞', icon: 'call', name: 'Telefon görüşmeleri', pattern: ['vocab', 'dialogue', 'quiz', 'dialogue'] },
  { id: 'interview', emoji: '💼', icon: 'briefcase', name: 'İş mülakatı', pattern: ['vocab', 'quiz', 'email', 'quiz'] },
  { id: 'salary', emoji: '💰', icon: 'cash', name: 'Ücret görüşmesi', pattern: ['vocab', 'quiz', 'dialogue', 'quiz'] },
  { id: 'meeting', emoji: '🗣️', icon: 'chatbubbles', name: 'Toplantı dili', pattern: ['vocab', 'quiz', 'dialogue', 'quiz', 'dialogue'] },
  { id: 'email', emoji: '📧', icon: 'mail', name: 'E-posta yazma', pattern: ['vocab', 'quiz', 'email', 'email'] },
  { id: 'presentation', emoji: '📊', icon: 'easel', name: 'Sunum yapma', pattern: ['vocab', 'quiz', 'dialogue', 'email'] },
];

const typeTitle: Record<LessonType, string> = {
  vocab: 'Kelime kartları',
  quiz: 'Çoktan seçmeli',
  dialogue: 'Diyalog pratiği',
  email: 'E-posta yazma',
};

export const modules: Module[] = moduleDefs.map((def) => {
  const lessons: Lesson[] = def.pattern.map((type, i) => ({
    id: `${def.id}_${i}`,
    moduleId: def.id,
    index: i,
    type,
    title: `Ders ${i + 1}: ${typeTitle[type]}`,
  }));
  return { id: def.id, emoji: def.emoji, icon: def.icon, name: def.name, lessons };
});

export function moduleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function lessonById(id: string): { module: Module; lesson: Lesson } | undefined {
  for (const m of modules) {
    const lesson = m.lessons.find((l) => l.id === id);
    if (lesson) return { module: m, lesson };
  }
  return undefined;
}
