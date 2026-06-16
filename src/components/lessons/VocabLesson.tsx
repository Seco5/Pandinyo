import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { VocabCard } from '../../types';
import { Button, Small } from '../ui';
import { PandaHandle } from '../Panda';
import { useApp } from '../../state';
import { colors, fonts, radius, shadow } from '../../theme';

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
  const [flipped, setFlipped] = useState(false);
  const repeatQueue = useRef<VocabCard[]>([]);
  const secondPass = useRef(false);
  const knownIds = useRef<Set<string>>(new Set());
  const repeatIds = useRef<Set<string>>(new Set());

  const card = working[ci];

  const advanceCard = () => {
    const ni = ci + 1;
    if (ni < working.length) {
      setCi(ni);
      setFlipped(false);
      setProgress((ni / working.length) * 0.5);
    } else if (!secondPass.current && repeatQueue.current.length > 0) {
      // Second pass over the "tekrar göster" words.
      secondPass.current = true;
      setWorking(repeatQueue.current);
      repeatQueue.current = [];
      setCi(0);
      setFlipped(false);
    } else {
      finishCards();
    }
  };

  const onKnown = () => {
    knownIds.current.add(card.id);
    repeatIds.current.delete(card.id);
    pandaRef.current?.celebrate();
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
        const distractors = shuffle(cards.filter((x) => x.id !== c.id)).slice(0, 3).map((x) => x.turkish);
        return shuffle([c.turkish, ...distractors]);
      }),
    [quizCards]
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
    if (opt === q.turkish) {
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

  // ============ RENDER ============
  if (phase === 'cards') {
    return (
      <View style={styles.container}>
        <Small style={{ marginBottom: 12 }}>
          {secondPass.current ? 'Tekrar 🔁 ' : ''}Kelime {ci + 1} / {working.length}
        </Small>
        <Pressable style={{ flex: 1 }} onPress={() => setFlipped((f) => !f)}>
          <Animated.View key={`${card.id}-${flipped}`} entering={FadeIn.duration(200)} style={styles.card}>
            {!flipped ? (
              <>
                <Text style={styles.en}>{card.english}</Text>
                <Small style={{ marginTop: 16 }}>Anlamını düşün, çevirmek için dokun 👆</Small>
              </>
            ) : (
              <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Text style={styles.tr}>{card.turkish}</Text>
                <Text style={styles.example}>“{card.example}”</Text>
              </ScrollView>
            )}
          </Animated.View>
        </Pressable>
        <View style={styles.footer}>
          {!flipped ? (
            <Button title="Cevabı göster" variant="primary" onPress={() => setFlipped(true)} />
          ) : (
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
        <Text style={styles.quizWord}>{q.english}</Text>
        <Small style={{ marginBottom: 12 }}>Türkçe karşılığı?</Small>
        <View style={{ gap: 10 }}>
          {quizOptions[qi].map((o) => {
            let s = styles.opt;
            if (answered && o === q.turkish) s = { ...styles.opt, ...styles.correct };
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
