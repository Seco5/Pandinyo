import examData from './examContent.json';
import {
  LessonType,
  VocabCard,
  QuizQuestion,
  Dialogue,
  EmailScenario,
} from '../types';

export interface ExamLesson {
  id: string;
  title: string;
  type: LessonType;
  vocab?: VocabCard[];
  questions?: QuizQuestion[];
  dialogue?: Dialogue;
  email?: EmailScenario;
}

export interface ExamModule {
  id: string;
  title: string;
  lessons: ExamLesson[];
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  targetScore: string;
  sections: string[];
  icon: string; // Ionicons name
  modules: ExamModule[];
}

// Raw JSON shapes (the exam content model differs from the sector model).
interface RawLesson {
  id: string;
  title: string;
  type: 'vocabulary' | 'multipleChoice' | 'emailWriting' | 'dialogue';
  words?: { english: string; turkish: string; example: string }[];
  questions?: { id: string; passage?: string; question: string; options: string[]; correct: number; explanation: string }[];
  turns?: { speaker: 'other' | 'user'; text: string }[];
  scenario?: string;
  referenceEmail?: string;
}
interface RawModule { id: string; title: string; lessons: RawLesson[] }
interface RawExam {
  id: string;
  name: string;
  description: string;
  targetScore: string;
  sections: string[];
  modules: RawModule[];
}

const TYPE_MAP: Record<RawLesson['type'], LessonType> = {
  vocabulary: 'vocab',
  multipleChoice: 'quiz',
  emailWriting: 'email',
  dialogue: 'dialogue',
};

const EXAM_ICONS: Record<string, string> = {
  toefl: 'school',
  ielts: 'globe',
  yds: 'ribbon',
  toeic: 'briefcase',
};

function normalizeLesson(raw: RawLesson): ExamLesson {
  const type = TYPE_MAP[raw.type];
  const base: ExamLesson = { id: raw.id, title: raw.title, type };

  if (raw.words) {
    base.vocab = raw.words.map((w, i) => ({
      id: `${raw.id}_w${i}`,
      english: w.english,
      turkish: w.turkish,
      example: w.example,
    }));
  }
  if (raw.questions) {
    base.questions = raw.questions.map((q) => ({
      id: q.id,
      prompt: q.question,
      options: q.options,
      answer: q.correct,
      explanation: q.explanation,
      passage: q.passage,
    }));
  }
  if (raw.turns) {
    base.dialogue = { id: raw.id, title: raw.title, turns: raw.turns };
  }
  if (raw.scenario != null && raw.referenceEmail != null) {
    base.email = {
      id: raw.id,
      title: raw.title,
      scenario: raw.scenario,
      referenceEmail: raw.referenceEmail,
    };
  }
  return base;
}

const rawExams = (examData as { examPrep: Record<string, RawExam> }).examPrep;

export const exams: Exam[] = Object.values(rawExams).map((e) => ({
  id: e.id,
  name: e.name,
  description: e.description,
  targetScore: e.targetScore,
  sections: e.sections,
  icon: EXAM_ICONS[e.id] ?? 'document-text',
  modules: e.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map(normalizeLesson),
  })),
}));

export function examById(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}

export function examLessonById(
  examId: string,
  lessonId: string
): { exam: Exam; module: ExamModule; lesson: ExamLesson } | undefined {
  const exam = examById(examId);
  if (!exam) return undefined;
  for (const module of exam.modules) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) return { exam, module, lesson };
  }
  return undefined;
}
