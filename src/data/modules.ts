import { Module, Lesson, LessonType } from '../types';

interface ModuleDef {
  id: string;
  emoji: string;
  name: string;
  // sequence of lesson types within the module
  pattern: LessonType[];
}

const moduleDefs: ModuleDef[] = [
  { id: 'vocab', emoji: '📚', name: 'Kelimeler', pattern: ['vocab', 'vocab', 'quiz', 'vocab', 'quiz'] },
  { id: 'intro', emoji: '👋', name: 'Kendini tanıtma', pattern: ['vocab', 'quiz', 'dialogue', 'quiz'] },
  { id: 'phone', emoji: '📞', name: 'Telefon görüşmeleri', pattern: ['vocab', 'dialogue', 'quiz', 'dialogue'] },
  { id: 'interview', emoji: '💼', name: 'İş mülakatı', pattern: ['vocab', 'quiz', 'email', 'quiz'] },
  { id: 'salary', emoji: '💰', name: 'Ücret görüşmesi', pattern: ['vocab', 'quiz', 'dialogue', 'quiz'] },
  { id: 'meeting', emoji: '🗣️', name: 'Toplantı dili', pattern: ['vocab', 'quiz', 'dialogue', 'quiz', 'dialogue'] },
  { id: 'email', emoji: '📧', name: 'E-posta yazma', pattern: ['vocab', 'quiz', 'email', 'email'] },
  { id: 'presentation', emoji: '📊', name: 'Sunum yapma', pattern: ['vocab', 'quiz', 'dialogue', 'email'] },
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
  return { id: def.id, emoji: def.emoji, name: def.name, lessons };
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
