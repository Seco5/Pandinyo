import { Sector } from '../types';

export const sectors: Sector[] = [
  { id: 'tech', emoji: '💻', name: 'Teknoloji / Yazılım', sub: 'Sprint, backlog, deployment', color: '#EFF6FF', iconColor: '#1D4ED8' },
  { id: 'finance', emoji: '🏦', name: 'Finans / Bankacılık', sub: 'Revenue, audit, portfolio', color: '#F0FDF4', iconColor: '#15803D' },
  { id: 'health', emoji: '🏥', name: 'Sağlık', sub: 'Diagnosis, protocol, referral', color: '#FEF2F2', iconColor: '#DC2626' },
  { id: 'retail', emoji: '🛒', name: 'Perakende / E-ticaret', sub: 'Inventory, conversion, SKU', color: '#FFF7ED', iconColor: '#C2410C' },
  { id: 'marketing', emoji: '📢', name: 'Pazarlama / Reklam', sub: 'ROI, KPI, engagement', color: '#FAF5FF', iconColor: '#7C3AED' },
  { id: 'aviation', emoji: '✈️', name: 'Havayolu / Havacılık', sub: 'Boarding, crew, clearance', color: '#F0F9FF', iconColor: '#0369A1' },
  { id: 'culinary', emoji: '👨‍🍳', name: 'Aşçılık / Gastronomi', sub: 'Mise en place, plating, yield', color: '#ECFDF5', iconColor: '#059669' },
];

export function sectorById(id: string): Sector {
  return sectors.find((s) => s.id === id) ?? sectors[0];
}
