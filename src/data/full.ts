import techFull from './full/tech.json';
import { VocabCard } from '../types';

// ---- Rich lesson model (the new content format) ----
export type RichType =
  | 'flashcard'
  | 'fillInTheBlank'
  | 'dialogue'
  | 'interviewQA'
  | 'strategyDialogue'
  | 'expressionMatch'
  | 'emailWrite'
  | 'presentationFlow';

export interface RichTurn { speaker: 'user' | 'other'; text: string }

export interface RichLesson {
  id: string;
  title: string;
  type: RichType;
  // flashcard
  vocab?: VocabCard[];
  // fillInTheBlank
  modelText?: string;
  blanks?: string[];
  sentenceOrder?: string[];
  correctOrder?: number[];
  // dialogue / expressionMatch dialogue
  turns?: RichTurn[];
  // interviewQA
  questions?: { id: string; question: string; modelAnswer: string; keyPhrases: string[] }[];
  // strategyDialogue
  scenario?: string;
  strategies?: { id: string; label: string; description: string; effectiveness: string; note: string }[];
  dialogue?: { strategyId?: string; turns: RichTurn[] };
  // expressionMatch
  expressions?: { english: string; turkish: string }[];
  // emailWrite
  readingTime?: number;
  referenceEmail?: string;
  // presentationFlow
  presentationType?: string;
  sections?: { id: string; title: string; correctExpression: string; options: string[] }[];
}

export interface RichModule {
  id: string; // normalized to match modules.ts ids
  title: string;
  lessons: RichLesson[];
}

// Map the full-content module ids onto the app's canonical module ids.
const MODULE_ID_MAP: Record<string, string> = {
  introduction: 'intro',
  phone: 'phone',
  interview: 'interview',
  salary: 'salary',
  meeting: 'meeting',
  email: 'email',
  presentation: 'presentation',
};

interface RawFull {
  id: string;
  name: string;
  vocabulary: VocabCard[];
  modules: Record<string, { title: string; lessons: any[] }>;
}

function buildSector(raw: RawFull): RichModule[] {
  const out: RichModule[] = [];

  // Module 1 — Kelimeler: synthesize flashcard lessons from the 50-word list (10 per lesson).
  const vocab = raw.vocabulary;
  const vocabLessons: RichLesson[] = [];
  for (let i = 0; i < vocab.length; i += 10) {
    const group = vocab.slice(i, i + 10).map((v) => ({ ...v, example: v.example.replace(/\*\*/g, '') }));
    vocabLessons.push({
      id: `vocab_${i / 10}`,
      title: `Kelime grubu ${i / 10 + 1}`,
      type: 'flashcard',
      vocab: group,
    });
  }
  out.push({ id: 'vocab', title: 'Kelimeler', lessons: vocabLessons });

  // Remaining modules in canonical order.
  const order = ['introduction', 'phone', 'interview', 'salary', 'meeting', 'email', 'presentation'];
  for (const rawId of order) {
    const mod = raw.modules[rawId];
    if (!mod) continue;
    out.push({
      id: MODULE_ID_MAP[rawId] ?? rawId,
      title: mod.title,
      lessons: mod.lessons as RichLesson[],
    });
  }
  return out;
}

const fullSectors: Record<string, RichModule[]> = {
  tech: buildSector(techFull as unknown as RawFull),
};

export function hasFullContent(sectorId: string): boolean {
  return !!fullSectors[sectorId];
}

export function fullModules(sectorId: string): RichModule[] | undefined {
  return fullSectors[sectorId];
}

export function fullModule(sectorId: string, moduleId: string): RichModule | undefined {
  return fullSectors[sectorId]?.find((m) => m.id === moduleId);
}

export function richLesson(
  sectorId: string,
  moduleId: string,
  lessonId: string
): { module: RichModule; lesson: RichLesson; index: number } | undefined {
  const mod = fullModule(sectorId, moduleId);
  if (!mod) return undefined;
  const index = mod.lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return undefined;
  return { module: mod, lesson: mod.lessons[index], index };
}
