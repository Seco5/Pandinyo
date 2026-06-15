import { Sector } from '../types';

export const sectors: Sector[] = [
  { id: 'tech', emoji: '💻', name: 'Teknoloji / Yazılım' },
  { id: 'finance', emoji: '🏦', name: 'Finans / Bankacılık' },
  { id: 'health', emoji: '🏥', name: 'Sağlık' },
  { id: 'retail', emoji: '🛒', name: 'Perakende / E-ticaret' },
  { id: 'logistics', emoji: '🏭', name: 'Üretim / Lojistik' },
  { id: 'marketing', emoji: '📢', name: 'Pazarlama / Reklam' },
  { id: 'law', emoji: '⚖️', name: 'Hukuk' },
  { id: 'education', emoji: '🎓', name: 'Eğitim' },
];

export function sectorById(id: string): Sector {
  return sectors.find((s) => s.id === id) ?? sectors[0];
}
