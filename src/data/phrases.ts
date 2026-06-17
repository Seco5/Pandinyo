import data from './phrases.json';

export interface Phrase {
  id: string;
  english: string;
  turkish: string;
  context: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface PhraseCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  phrases: Phrase[];
}

export const phraseCategories: PhraseCategory[] = (data as { categories: PhraseCategory[] }).categories;

// Map a phrase id -> its category (for showing source labels & favorites).
const PHRASE_INDEX: Record<string, { phrase: Phrase; category: PhraseCategory }> = {};
for (const c of phraseCategories) {
  for (const p of c.phrases) PHRASE_INDEX[p.id] = { phrase: p, category: c };
}

export function categoryById(id: string): PhraseCategory | undefined {
  return phraseCategories.find((c) => c.id === id);
}

export function phraseById(id: string): { phrase: Phrase; category: PhraseCategory } | undefined {
  return PHRASE_INDEX[id];
}

export interface PhraseHit extends Phrase {
  categoryId: string;
  categoryTitle: string;
  categoryColor: string;
}

// Global search across every category (English or Turkish).
export function searchPhrases(query: string): PhraseHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: PhraseHit[] = [];
  for (const c of phraseCategories) {
    for (const p of c.phrases) {
      if (p.english.toLowerCase().includes(q) || p.turkish.toLowerCase().includes(q)) {
        out.push({ ...p, categoryId: c.id, categoryTitle: c.title, categoryColor: c.color });
      }
    }
  }
  return out;
}
