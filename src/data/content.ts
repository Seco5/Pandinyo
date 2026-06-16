import {
  VocabCard,
  QuizQuestion,
  Dialogue,
  EmailScenario,
} from '../types';

export interface SectorContent {
  vocabulary: VocabCard[];
  quiz: QuizQuestion[];
  dialogues: Dialogue[];
  emails: EmailScenario[];
}

// Shared business-English content used as the base for every sector.
const baseVocabulary: VocabCard[] = [
  { id: 'v1', english: 'reschedule', turkish: 'yeniden planlamak', example: 'Could we reschedule our meeting to tomorrow?' },
  { id: 'v2', english: 'deadline', turkish: 'son teslim tarihi', example: 'The deadline for this report is Friday.' },
  { id: 'v3', english: 'follow up', turkish: 'takip etmek', example: "I'll follow up with you after the call." },
  { id: 'v4', english: 'agenda', turkish: 'gündem', example: 'Let me share the agenda for today’s meeting.' },
  { id: 'v5', english: 'stakeholder', turkish: 'paydaş', example: 'We need approval from every stakeholder.' },
  { id: 'v6', english: 'on board', turkish: 'aynı fikirde / dahil', example: 'Is everyone on board with this plan?' },
  { id: 'v7', english: 'roll out', turkish: 'devreye almak', example: 'We will roll out the new feature next week.' },
  { id: 'v8', english: 'leverage', turkish: 'değerlendirmek / faydalanmak', example: 'We can leverage our existing data.' },
  { id: 'v9', english: 'touch base', turkish: 'kısaca görüşmek', example: 'Let’s touch base on Monday morning.' },
  { id: 'v10', english: 'bandwidth', turkish: 'kapasite / vakit', example: 'I don’t have the bandwidth for that this week.' },
  { id: 'v11', english: 'scope', turkish: 'kapsam', example: 'That request is out of scope for this project.' },
  { id: 'v12', english: 'milestone', turkish: 'kilometre taşı', example: 'We just hit an important milestone.' },
];

const baseQuiz: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'A colleague asks if you can move a meeting to a later time. You reply:',
    options: [
      'Sure, can we reschedule to 4 PM?',
      'Sure, can we reorder to 4 PM?',
      'Sure, can we replan to 4 PM?',
      'Sure, can we rebook to 4 PM?',
    ],
    answer: 0,
    explanation: '“Reschedule” is the natural verb for moving a meeting to a new time.',
  },
  {
    id: 'q2',
    prompt: 'You want to politely ask for an update on a task. The best phrasing is:',
    options: [
      'Give me the status now.',
      'I just wanted to follow up on the task.',
      'Where is my task?',
      'Why is the task not done?',
    ],
    answer: 1,
    explanation: '“Follow up” is polite and professional for chasing an update.',
  },
  {
    id: 'q3',
    prompt: 'Choose the correct closing for a formal email:',
    options: ['See ya,', 'Best regards,', 'Later,', 'Bye bye,'],
    answer: 1,
    explanation: '“Best regards,” is a standard professional sign-off.',
  },
  {
    id: 'q4',
    prompt: 'In a meeting you disagree politely. You say:',
    options: [
      'You are wrong.',
      'That’s a bad idea.',
      'I see your point, but I’d suggest a different approach.',
      'No.',
    ],
    answer: 2,
    explanation: 'Acknowledging then proposing an alternative keeps it collaborative.',
  },
  {
    id: 'q5',
    prompt: '“We don’t have the bandwidth this week” means:',
    options: [
      'Our internet is slow.',
      'We don’t have the capacity/time.',
      'We don’t have the budget.',
      'We don’t have the data.',
    ],
    answer: 1,
    explanation: '“Bandwidth” in business slang means available time/capacity.',
  },
  {
    id: 'q6',
    prompt: 'A good way to introduce yourself in a first meeting:',
    options: [
      'Hi, I’m Alex. I’m on the product team.',
      'Hello me Alex product.',
      'I Alex, product.',
      'Alex here, what you want?',
    ],
    answer: 0,
    explanation: 'Clear, friendly, and states your role — the natural pattern.',
  },
];

const baseDialogues: Dialogue[] = [
  {
    id: 'd1',
    title: 'Toplantı erteleme',
    turns: [
      { speaker: 'other', text: 'Hi Alex, are we still on for 2 PM?' },
      { speaker: 'user', text: 'Actually, could we reschedule? I have an urgent client call.' },
      { speaker: 'other', text: 'Of course. How about tomorrow at the same time?' },
      { speaker: 'user', text: 'That works perfectly. Thank you for understanding.' },
    ],
  },
  {
    id: 'd2',
    title: 'Telefonda kendini tanıtma',
    turns: [
      { speaker: 'other', text: 'Hello, this is Sarah from the finance team.' },
      { speaker: 'user', text: 'Hi Sarah, this is Alex. How can I help you today?' },
      { speaker: 'other', text: 'I have a quick question about the latest invoice.' },
      { speaker: 'user', text: 'Sure, let me pull it up and walk you through it.' },
    ],
  },
];

const baseEmails: EmailScenario[] = [
  {
    id: 'e1',
    title: 'Toplantı erteleme e-postası',
    scenario:
      "Müdürün Sarah Johnson'a bugünkü 14:00 toplantısını ertelemek istiyorsun. Acil bir müşteri görüşmesi çıktı. Yarın aynı saate almak istiyorsun.",
    referenceEmail:
      'Dear Sarah,\n\nI hope this email finds you well. I am writing to request a reschedule of our meeting that is currently set for today at 2:00 PM.\n\nUnfortunately, an urgent client call has come up that conflicts with our scheduled time. Would it be possible to move our meeting to tomorrow at the same time?\n\nI apologize for any inconvenience this may cause and appreciate your understanding.\n\nBest regards,\nAlex',
  },
  {
    id: 'e2',
    title: 'Teşekkür e-postası',
    scenario:
      'Bir iş görüşmesi sonrası seni ağırlayan İK yöneticisi Mr. Lee’ye kısa bir teşekkür e-postası yaz.',
    referenceEmail:
      'Dear Mr. Lee,\n\nThank you for taking the time to meet with me today. I really enjoyed our conversation and learning more about the role and your team.\n\nI am very excited about the opportunity and confident that I can contribute to your goals.\n\nPlease let me know if you need any further information from me.\n\nBest regards,\nAlex',
  },
];

import { sectorFlavor } from './full';

// Content is universal. The sector only swaps the company name / character role
// inside dialogues via the {company} / {role} tokens.
function flavorDialogues(dialogues: Dialogue[], sectorId: string): Dialogue[] {
  const f = sectorFlavor(sectorId);
  const sub = (t: string) => t.replace(/\{company\}/g, f.company).replace(/\{role\}/g, f.role);
  return dialogues.map((d) => ({ ...d, turns: d.turns.map((tn) => ({ ...tn, text: sub(tn.text) })) }));
}

export function getContent(sectorId: string): SectorContent {
  return {
    vocabulary: baseVocabulary,
    quiz: baseQuiz,
    dialogues: flavorDialogues(baseDialogues, sectorId),
    emails: baseEmails,
  };
}
