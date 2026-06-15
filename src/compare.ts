export interface WordDiff {
  word: string;
  status: 'correct' | 'wrong' | 'missing';
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-zçğıöşü0-9\s']/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Compares the user's text against a reference, word by word (order-independent
// multiset match). Returns a diff list and an accuracy score (0..1).
export function compareText(reference: string, user: string): { diff: WordDiff[]; accuracy: number } {
  const refTokens = tokenize(reference);
  const userTokens = tokenize(user);
  const refCount = new Map<string, number>();
  for (const t of refTokens) refCount.set(t, (refCount.get(t) ?? 0) + 1);

  const diff: WordDiff[] = [];
  let matched = 0;
  const remaining = new Map(refCount);
  for (const t of userTokens) {
    const left = remaining.get(t) ?? 0;
    if (left > 0) {
      remaining.set(t, left - 1);
      matched++;
      diff.push({ word: t, status: 'correct' });
    } else {
      diff.push({ word: t, status: 'wrong' });
    }
  }
  for (const [word, left] of remaining) {
    for (let i = 0; i < left; i++) diff.push({ word, status: 'missing' });
  }
  const accuracy = refTokens.length ? matched / refTokens.length : 0;
  return { diff, accuracy };
}
