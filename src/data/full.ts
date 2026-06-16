import universalContent from './universal-content.json';
import businessVocab from './business-vocab.json';
import { VocabCard } from '../types';

// ---- Business-English vocabulary, grouped into themed lessons by category ----
interface RawVocabWord { id: string; english: string; turkish: string; example: string; category: string }

const CATEGORY_TITLES: Record<string, string> = {
  meetings: 'Toplantılar', project: 'Proje Yönetimi', communication: 'İletişim',
  negotiation: 'Müzakere', finance: 'Finans', hr: 'İnsan Kaynakları', strategy: 'Strateji',
  sales: 'Satış', marketing: 'Pazarlama', presentations: 'Sunumlar', interview: 'Mülakat',
  teamwork: 'Takım Çalışması', legal: 'Hukuk', operations: 'Operasyon', workplace: 'İş Yeri',
  action_verbs: 'Eylem Fiilleri', phrases: 'İş Deyimleri', email_phrases: 'E-posta Kalıpları',
  leadership: 'Liderlik', salary: 'Maaş ve Ücret', soft_skills: 'Sosyal Beceriler',
  business_writing: 'İş Yazışması', networking: 'Networking', customer_service: 'Müşteri Hizmetleri',
  innovation: 'İnovasyon', tech_business: 'Teknoloji ve İş', esg: 'Sürdürülebilirlik',
  adjectives: 'Sıfatlar', adverbs: 'Zarflar', finance_advanced: 'İleri Finans',
  management: 'Yönetim', advanced_phrases: 'İleri Deyimler', strategy_advanced: 'İleri Strateji',
  sales_advanced: 'İleri Satış', marketing_advanced: 'İleri Pazarlama', risk: 'Risk Yönetimi',
  business_general: 'Genel İş', idioms: 'Deyimler', polite_expressions: 'Nazik İfadeler',
  workplace_culture: 'İş Kültürü', organization: 'Organizasyon', development: 'Gelişim',
  professional: 'Profesyonel',
};

interface VocabTheme { id: string; title: string; words: VocabCard[] }

function buildVocabThemes(): VocabTheme[] {
  const words = (businessVocab as { vocabulary: RawVocabWord[] }).vocabulary;
  const order: string[] = [];
  const groups: Record<string, VocabCard[]> = {};
  for (const w of words) {
    if (!groups[w.category]) {
      groups[w.category] = [];
      order.push(w.category);
    }
    groups[w.category].push({ id: w.id, english: w.english, turkish: w.turkish, example: w.example });
  }
  return order.map((cat) => ({ id: cat, title: CATEGORY_TITLES[cat] ?? cat, words: groups[cat] }));
}

const vocabThemes = buildVocabThemes();

// ---- Rich lesson model (the universal content format) ----
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

// Map the universal content module ids onto the app's canonical module ids.
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

// ---- Sector flavour (cosmetic only) ----
// The content is universal; selecting a sector only swaps the company name and
// the character's profession inside dialogues. Author content with the tokens
// {company} and {role} and they get replaced based on the active sector.
interface SectorFlavor { company: string; role: string }
const SECTOR_FLAVOR: Record<string, SectorFlavor> = {
  tech: { company: 'TechNova', role: 'software engineer' },
  finance: { company: 'FinTrust Bank', role: 'financial analyst' },
  health: { company: 'MediCare Clinic', role: 'healthcare specialist' },
  retail: { company: 'ShopRight', role: 'store manager' },
  marketing: { company: 'BrandWave', role: 'marketing specialist' },
  aviation: { company: 'SkyLine Airways', role: 'flight operations officer' },
  culinary: { company: 'Le Gourmet', role: 'head chef' },
};
const DEFAULT_FLAVOR: SectorFlavor = { company: 'the company', role: 'team member' };

export function sectorFlavor(sectorId: string): SectorFlavor {
  return SECTOR_FLAVOR[sectorId] ?? DEFAULT_FLAVOR;
}

function applyFlavor(text: string, f: SectorFlavor): string {
  return text.replace(/\{company\}/g, f.company).replace(/\{role\}/g, f.role);
}

function flavorLesson(lesson: RichLesson, f: SectorFlavor): RichLesson {
  if (!lesson.turns) return lesson;
  return { ...lesson, turns: lesson.turns.map((t) => ({ ...t, text: applyFlavor(t.text, f) })) };
}

function buildUniversal(raw: RawFull): RichModule[] {
  const out: RichModule[] = [];

  // Module 1 — Kelimeler: one flashcard lesson per theme (Teknoloji ve Bilim,
  // Sağlıklı Yaşam, Spor, Kültür-Sanat, Tarih, Genel Kültür).
  const vocabLessons: RichLesson[] = vocabThemes.map((theme) => ({
    id: `vocab_${theme.id}`,
    title: theme.title,
    type: 'flashcard',
    vocab: theme.words.map((v) => ({ ...v, example: (v.example ?? '').replace(/\*\*/g, '') })),
  }));
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

// One universal content set, shared by every sector.
const universalModules: RichModule[] = buildUniversal(universalContent as unknown as RawFull);

// Content is universal for every sector now — always available.
export function hasFullContent(_sectorId: string): boolean {
  return true;
}

export function fullModules(sectorId: string): RichModule[] {
  const f = sectorFlavor(sectorId);
  return universalModules.map((m) => ({ ...m, lessons: m.lessons.map((l) => flavorLesson(l, f)) }));
}

export function fullModule(sectorId: string, moduleId: string): RichModule | undefined {
  return fullModules(sectorId).find((m) => m.id === moduleId);
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
