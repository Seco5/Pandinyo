import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { VocabCard } from '../../types';
import { Button, Small } from '../ui';
import { useLessonStats } from './LessonShell';
import { PandaHandle } from '../Panda';
import { useApp } from '../../state';
import { playCorrect, playWrong } from '../../sounds';
import { colors, fonts, radius, shadow } from '../../theme';

// Normalize for write-mode comparison: lowercase, trim, collapse inner spaces.
function norm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}
// A Turkish meaning may list alternatives ("a / b", "a, b"); accept any of them.
function answerMatches(input: string, turkish: string): boolean {
  const got = norm(input);
  return turkish
    .split(/[\/,;]/)
    .map((x) => norm(x))
    .some((opt) => opt.length > 0 && opt === got);
}

interface Props {
  cards: VocabCard[];
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const comboMessage = (combo: number): string | null => {
  if (combo >= 5) return 'Unstoppable! ⚡';
  if (combo >= 3) return '3 combo! 🎯';
  if (combo >= 2) return 'İyi gidiyorsun! 🔥';
  return null;
};

type Phase = 'cards' | 'predict' | 'quiz' | 'result';

export function VocabLesson({ cards, pandaRef, setProgress, onFinish }: Props) {
  const { recordVocab, recordVocabScore } = useApp();

  const [phase, setPhase] = useState<Phase>('cards');

  // ---- card phase state (spaced repetition) ----
  const [working, setWorking] = useState<VocabCard[]>(cards);
  const [ci, setCi] = useState(0);
  const repeatQueue = useRef<VocabCard[]>([]);
  const secondPass = useRef(false);
  const knownIds = useRef<Set<string>>(new Set());
  const repeatIds = useRef<Set<string>>(new Set());

  // answer interaction on the card (write / select modes + direction)
  const [answerMode, setAnswerMode] = useState<'select' | 'write'>('select');
  const [direction, setDirection] = useState<'en2tr' | 'tr2en'>('en2tr');
  const [cardAnswered, setCardAnswered] = useState(false);
  const [cardCorrect, setCardCorrect] = useState(false);
  const [typed, setTyped] = useState('');
  const [pickedTr, setPickedTr] = useState<string | null>(null);

  // Prompt = the side shown; answer = the side the user must supply.
  const promptOf = (c: VocabCard) => (direction === 'en2tr' ? c.english : c.turkish);
  const answerOf = (c: VocabCard) => (direction === 'en2tr' ? c.turkish : c.english);
  const answerLabel = direction === 'en2tr' ? 'Türkçe' : 'İngilizce';

  const card = working[ci];

  // 4 options for select mode (correct + 3 distractors) in the answer language.
  const cardOptions = useMemo(() => {
    const distractors = shuffle(cards.filter((x) => x.id !== card.id)).slice(0, 3).map(answerOf);
    return shuffle([answerOf(card), ...distractors]);
  }, [card.id, direction]);

  const resetCardAnswer = () => {
    setCardAnswered(false);
    setCardCorrect(false);
    setTyped('');
    setPickedTr(null);
  };

  const handleAnswer = (correct: boolean) => {
    setCardAnswered(true);
    setCardCorrect(correct);
    if (correct) {
      playCorrect();
      pandaRef.current?.celebrate();
    } else {
      playWrong();
      pandaRef.current?.shake();
    }
  };
  const submitWrite = () => {
    if (cardAnswered || !typed.trim()) return;
    handleAnswer(answerMatches(typed, answerOf(card)));
  };
  const pickOption = (opt: string) => {
    if (cardAnswered) return;
    setPickedTr(opt);
    handleAnswer(opt === answerOf(card));
  };

  const advanceCard = () => {
    resetCardAnswer();
    const ni = ci + 1;
    if (ni < working.length) {
      setCi(ni);
      setProgress((ni / working.length) * 0.5);
    } else if (!secondPass.current && repeatQueue.current.length > 0) {
      // Second pass over the "tekrar göster" words.
      secondPass.current = true;
      setWorking(repeatQueue.current);
      repeatQueue.current = [];
      setCi(0);
    } else {
      finishCards();
    }
  };

  const onKnown = () => {
    knownIds.current.add(card.id);
    repeatIds.current.delete(card.id);
    advanceCard();
  };
  const onRepeat = () => {
    if (!secondPass.current) {
      repeatQueue.current.push(card);
      repeatIds.current.add(card.id);
    }
    advanceCard();
  };

  const finishCards = () => {
    recordVocab(Array.from(knownIds.current), Array.from(repeatIds.current));
    setProgress(0.5);
    setPhase('predict');
  };

  // ---- quiz state ----
  const quizCount = Math.min(10, cards.length);
  const quizCards = useMemo(() => shuffle(cards).slice(0, quizCount), [cards]);
  const quizOptions = useMemo(
    () =>
      quizCards.map((c) => {
        const distractors = shuffle(cards.filter((x) => x.id !== c.id)).slice(0, 3).map(answerOf);
        return shuffle([answerOf(c), ...distractors]);
      }),
    [quizCards, direction]
  );
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [comboKey, setComboKey] = useState(0);
  const quizCorrect = useRef(0);
  const quizMistakes = useRef<string[]>([]);
  const [prediction, setPrediction] = useState(Math.ceil(quizCount / 2));

  const q = quizCards[qi];
  const answered = picked !== null;

  const pickQuiz = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    if (opt === answerOf(q)) {
      quizCorrect.current += 1;
      setCombo((c) => { const n = c + 1; setComboKey((k) => k + 1); return n; });
      pandaRef.current?.celebrate();
    } else {
      quizMistakes.current.push(q.english);
      setCombo(0);
      pandaRef.current?.shake();
    }
  };
  const nextQuiz = () => {
    const ni = qi + 1;
    setProgress(0.5 + (ni / quizCount) * 0.5);
    if (ni < quizCount) {
      setQi(ni);
      setPicked(null);
    } else {
      recordVocabScore(quizCorrect.current);
      setPhase('result');
    }
  };

  // ---- report live stats to the top bar ----
  const reportStats = useLessonStats();
  useEffect(() => {
    if (phase === 'cards') reportStats({ label: 'Kart', done: ci + 1, total: working.length });
    else if (phase === 'quiz') reportStats({ label: 'Soru', done: qi + 1, total: quizCount });
    else reportStats(null);
    return () => reportStats(null);
  }, [phase, ci, qi, working.length, quizCount]);

  // ============ RENDER ============
  if (phase === 'cards') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Small>{secondPass.current ? 'Tekrar turu 🔁' : 'Kelime kartı'}</Small>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* direction toggle (EN→TR / TR→EN) */}
            <Pressable
              onPress={() => { if (!cardAnswered) setDirection((d) => (d === 'en2tr' ? 'tr2en' : 'en2tr')); }}
              style={styles.dirPill}
              hitSlop={6}
            >
              <Text style={styles.dirText}>{direction === 'en2tr' ? 'EN→TR' : 'TR→EN'}</Text>
              <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
            </Pressable>
            {/* write / select mode toggle */}
            <View style={styles.modeToggle}>
              <Pressable
                onPress={() => setAnswerMode('write')}
                style={[styles.modeIcon, answerMode === 'write' && styles.modeIconOn]}
                hitSlop={6}
              >
                <Ionicons name="create-outline" size={18} color={answerMode === 'write' ? colors.onAccent : colors.secondary} />
              </Pressable>
              <Pressable
                onPress={() => setAnswerMode('select')}
                style={[styles.modeIcon, answerMode === 'select' && styles.modeIconOn]}
                hitSlop={6}
              >
                <Ionicons name="list-outline" size={18} color={answerMode === 'select' ? colors.onAccent : colors.secondary} />
              </Pressable>
            </View>
          </View>
        </View>

        <Animated.View key={`${card.id}-${direction}`} entering={FadeIn.duration(200)} style={styles.card}>
          <Text style={styles.en}>{promptOf(card)}</Text>
          {cardAnswered ? (
            <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ marginTop: 12 }}>
              <Text style={[styles.feedback, { color: cardCorrect ? colors.success : colors.danger }]}>
                {cardCorrect ? 'Doğru! ✓' : 'Yanlış'}
              </Text>
              <Text style={styles.tr}>{answerOf(card)}</Text>
              <Text style={styles.example}>“{card.example}”</Text>
            </ScrollView>
          ) : (
            <Small style={{ marginTop: 14 }}>
              {answerMode === 'write' ? `${answerLabel} karşılığını yaz` : `${answerLabel} karşılığını seç`}
            </Small>
          )}
        </Animated.View>

        <View style={styles.footer}>
          {!cardAnswered && answerMode === 'select' && (
            <View style={{ gap: 10 }}>
              {cardOptions.map((o) => (
                <Pressable key={o} onPress={() => pickOption(o)} style={styles.opt}>
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              ))}
            </View>
          )}
          {!cardAnswered && answerMode === 'write' && (
            <View style={{ gap: 12 }}>
              <TextInput
                value={typed}
                onChangeText={setTyped}
                placeholder={`${answerLabel} karşılığı...`}
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={submitWrite}
                style={styles.writeInput}
              />
              <Button title="Kontrol et" variant="primary" disabled={!typed.trim()} onPress={submitWrite} />
            </View>
          )}
          {cardAnswered && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button title="Tekrar göster ↺" variant="ghost" style={{ flex: 1 }} onPress={onRepeat} />
              <Button title="Öğrendim ✓" variant="success" style={{ flex: 1 }} onPress={onKnown} />
            </View>
          )}
        </View>
      </View>
    );
  }

  if (phase === 'predict') {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.predictTitle}>Kaçını bileceğini tahmin et 🤔</Text>
        <Small style={{ textAlign: 'center', marginTop: 6 }}>{quizCount} soruluk kelime testi geliyor.</Small>
        <Text style={styles.predictValue}>{prediction} / {quizCount}</Text>
        <View style={styles.predictChips}>
          {Array.from({ length: quizCount + 1 }).map((_, n) => (
            <Pressable key={n} onPress={() => setPrediction(n)} style={[styles.predChip, prediction === n && styles.predChipOn]}>
              <Text style={[styles.predChipText, prediction === n && { color: colors.onAccent }]}>{n}</Text>
            </Pressable>
          ))}
        </View>
        <Button title="Teste başla" style={{ marginTop: 28 }} onPress={() => { setPhase('quiz'); setProgress(0.5); }} />
      </View>
    );
  }

  if (phase === 'quiz') {
    const msg = comboMessage(combo);
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Small>Soru {qi + 1} / {quizCount}</Small>
          {combo >= 2 && <Small style={{ color: colors.accent, fontFamily: fonts.bold }}>🔥 {combo}</Small>}
        </View>
        {msg && (
          <Animated.View key={comboKey} entering={ZoomIn.duration(260)} style={styles.comboBanner}>
            <Text style={styles.comboText}>{msg}</Text>
          </Animated.View>
        )}
        <Text style={styles.quizWord}>{promptOf(q)}</Text>
        <Small style={{ marginBottom: 12 }}>{answerLabel} karşılığı?</Small>
        <View style={{ gap: 10 }}>
          {quizOptions[qi].map((o) => {
            let s = styles.opt;
            if (answered && o === answerOf(q)) s = { ...styles.opt, ...styles.correct };
            else if (answered && o === picked) s = { ...styles.opt, ...styles.wrong };
            return (
              <Pressable key={o} onPress={() => pickQuiz(o)} style={s}>
                <Text style={styles.optText}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1 }} />
        <Button title={qi + 1 < quizCount ? 'Devam et' : 'Sonucu gör'} disabled={!answered} onPress={nextQuiz} />
      </View>
    );
  }

  // ---- result ----
  const actual = quizCorrect.current;
  const verdict =
    actual > prediction
      ? 'Kendini küçümsüyorsun! 💪'
      : actual === prediction
      ? 'Tam isabet! 🎯'
      : 'Biraz daha çalışmalısın 📚';
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Animated.View entering={ZoomIn} style={{ alignItems: 'center' }}>
        <Text style={styles.resultScore}>{actual} / {quizCount}</Text>
        <Text style={styles.resultVerdict}>{verdict}</Text>
        <Small style={{ marginTop: 10 }}>Tahmin: {prediction} — Gerçek: {actual}</Small>
      </Animated.View>
      <Button
        title="Bitir"
        style={{ marginTop: 32, alignSelf: 'stretch' }}
        onPress={() => onFinish(actual, quizCount, quizMistakes.current)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...shadow,
  },
  en: { fontFamily: fonts.bold, fontSize: 34, color: colors.primary, textAlign: 'center' },
  feedback: { fontFamily: fonts.bold, fontSize: 18, marginBottom: 8 },
  modeToggle: { flexDirection: 'row', gap: 6, backgroundColor: colors.background, borderRadius: radius.pill, padding: 3 },
  dirPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  dirText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  modeIcon: { width: 34, height: 30, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  modeIconOn: { backgroundColor: colors.accent },
  writeInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    paddingHorizontal: 16,
    height: 52,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.primary,
  },
  tr: { fontFamily: fonts.bold, fontSize: 26, color: colors.primary, textAlign: 'center' },
  example: { fontFamily: fonts.regular, fontSize: 15, color: colors.secondary, textAlign: 'center', marginTop: 18, lineHeight: 22 },
  footer: { paddingTop: 16 },
  predictTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.primary, textAlign: 'center' },
  predictValue: { fontFamily: fonts.bold, fontSize: 40, color: colors.accent, textAlign: 'center', marginTop: 20 },
  predictChips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 18 },
  predChip: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  predChipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  predChipText: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  comboBanner: { alignSelf: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 8, marginVertical: 10 },
  comboText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  quizWord: { fontFamily: fonts.bold, fontSize: 30, color: colors.primary, textAlign: 'center', marginTop: 16, marginBottom: 6 },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 15 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  resultScore: { fontFamily: fonts.bold, fontSize: 52, color: colors.accent },
  resultVerdict: { fontFamily: fonts.semibold, fontSize: 18, color: colors.primary, marginTop: 8, textAlign: 'center' },
});
