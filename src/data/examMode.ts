import data from './examMode.json';
import { QuizQuestion } from '../types';

export type PracticeKind = 'reading' | 'listening' | 'writing' | 'quiz';

export interface WritingTask {
  title: string;
  prompt: string;
  readingPassage?: string;
  listeningTranscript?: string;
  modelAnswer: string;
}

export interface PracticeLesson {
  id: string;
  title: string;
  kind: PracticeKind;
  passageTitle?: string;
  passage?: string; // reading text / listening transcript
  questions?: QuizQuestion[];
  task?: WritingTask;
}

export interface PracticeModule {
  id: string;
  title: string;
  icon: string; // Ionicons
  lessons: PracticeLesson[];
}

// --- raw shapes (loose) ---
interface RawQ { id: string; question: string; options: string[]; correct: number; explanation?: string }
const mapQ = (q: RawQ): QuizQuestion => ({
  id: q.id,
  prompt: q.question,
  options: q.options,
  answer: q.correct,
  explanation: q.explanation ?? '',
});

const examMode = (data as any).examMode as Record<string, any>;

function buildToefl(ex: any): PracticeModule[] {
  const mods: PracticeModule[] = [];
  const s = ex.sections ?? {};
  if (s.reading) {
    mods.push({
      id: 'reading',
      title: 'Reading Practice',
      icon: 'document-text',
      lessons: s.reading.passages.map((p: any) => ({
        id: p.id,
        title: p.title,
        kind: 'reading' as const,
        passageTitle: p.title,
        passage: p.text,
        questions: p.questions.map(mapQ),
      })),
    });
  }
  if (s.listening) {
    mods.push({
      id: 'listening',
      title: 'Listening Practice',
      icon: 'headset',
      lessons: s.listening.transcripts.map((t: any) => ({
        id: t.id,
        title: `${t.subject ?? ''} ${t.type ?? ''}`.trim() || 'Listening',
        kind: 'listening' as const,
        passageTitle: `${t.subject ?? ''} — ${t.type ?? ''}`,
        passage: t.transcript,
        questions: t.questions.map(mapQ),
      })),
    });
  }
  if (s.writing) {
    mods.push({
      id: 'writing',
      title: 'Writing Practice',
      icon: 'create',
      lessons: s.writing.tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        kind: 'writing' as const,
        task: {
          title: t.title,
          prompt: t.prompt,
          readingPassage: t.readingPassage,
          listeningTranscript: t.listeningTranscript,
          modelAnswer: t.modelAnswer,
        },
      })),
    });
  }
  return mods;
}

// YDS / TOEIC store practice content under fullTest.sections.
function buildFromSections(ex: any): PracticeModule[] {
  const mods: PracticeModule[] = [];
  const ft = ex.fullTest;
  if (!ft) return mods;
  const sections = ft.sections;

  const pushQuizModule = (id: string, title: string, icon: string, questions: any[]) => {
    if (!questions?.length) return;
    // 10 questions per lesson
    const lessons: PracticeLesson[] = [];
    for (let i = 0; i < questions.length; i += 10) {
      lessons.push({
        id: `${id}_${i / 10}`,
        title: `${title} ${Math.floor(i / 10) + 1}`,
        kind: 'quiz',
        questions: questions.slice(i, i + 10).map(mapQ),
      });
    }
    mods.push({ id, title, icon, lessons });
  };

  const pushReadingModule = (id: string, title: string, passages: any[]) => {
    if (!passages?.length) return;
    mods.push({
      id,
      title,
      icon: 'document-text',
      lessons: passages.map((p: any) => ({
        id: p.id,
        title: p.title ?? 'Reading',
        kind: 'reading' as const,
        passageTitle: p.title,
        passage: p.text,
        questions: (p.questions ?? []).map(mapQ),
      })),
    });
  };

  if (Array.isArray(sections)) {
    // YDS: [vocab, grammar, reading]
    for (const sec of sections) {
      if (sec.questions) pushQuizModule(sec.id, sec.title ?? sec.id, sec.id.includes('grammar') ? 'construct' : 'book', sec.questions);
      else if (sec.passages) pushReadingModule(sec.id, sec.title ?? 'Reading', sec.passages);
    }
  } else if (sections) {
    // TOEIC: { reading: { part5, part7 } }
    const r = sections.reading;
    if (r?.part5?.questions) pushQuizModule('part5', 'Part 5 — Cümle Tamamlama', 'construct', r.part5.questions);
    if (r?.part7?.passages) pushReadingModule('part7', 'Part 7 — Metin Anlama', r.part7.passages);
    if (r?.part7?.texts) pushReadingModule('part7', 'Part 7 — Metin Anlama', r.part7.texts);
  }
  return mods;
}

const practiceByExam: Record<string, PracticeModule[]> = {};
for (const [eid, ex] of Object.entries(examMode)) {
  practiceByExam[eid] = ex.sections ? buildToefl(ex) : buildFromSections(ex);
}

export function hasPractice(examId: string): boolean {
  return (practiceByExam[examId]?.length ?? 0) > 0;
}

export function practiceModules(examId: string): PracticeModule[] {
  return practiceByExam[examId] ?? [];
}

export function practiceLesson(
  examId: string,
  moduleId: string,
  lessonId: string
): { module: PracticeModule; lesson: PracticeLesson; index: number } | undefined {
  const mod = practiceByExam[examId]?.find((m) => m.id === moduleId);
  if (!mod) return undefined;
  const index = mod.lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return undefined;
  return { module: mod, lesson: mod.lessons[index], index };
}
