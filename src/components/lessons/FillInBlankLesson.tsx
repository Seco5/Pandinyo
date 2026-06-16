import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RichLesson } from '../../data/full';
import { Button, Small, Card } from '../ui';
import { PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

interface Props {
  lesson: RichLesson;
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

export function FillInBlankLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const blanks = lesson.blanks ?? [];
  const sentences = lesson.sentenceOrder ?? [];
  const correctOrder = lesson.correctOrder ?? [];

  const [phase, setPhase] = useState<'read' | 'blanks' | 'order'>('read');
  const [bi, setBi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const correct = React.useRef(0);
  const mistakes = React.useRef<string[]>([]);
  const [orderPick, setOrderPick] = useState<number[]>([]);

  const totalSteps = blanks.length + (sentences.length ? 1 : 0);
  const optionsFor = useMemo(() => {
    return blanks.map((b) => {
      const distractors = shuffle(blanks.filter((x) => x !== b)).slice(0, 3);
      return shuffle([b, ...distractors]);
    });
  }, [lesson.id]);

  const finishAll = () => {
    const total = totalSteps;
    onFinish(correct.current, total, mistakes.current);
  };

  // ---- READ ----
  if (phase === 'read') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <Small>Model tanıtım metni — oku ve aklında tut</Small>
          <Card style={{ marginTop: 12 }}>
            <Text style={styles.model}>{lesson.modelText}</Text>
          </Card>
        </ScrollView>
        <Button title="Hazırım" onPress={() => { setPhase('blanks'); setProgress(0.1); }} />
      </View>
    );
  }

  // ---- FILL BLANKS ----
  if (phase === 'blanks') {
    const target = blanks[bi];
    const answered = picked !== null;
    const pick = (opt: string) => {
      if (answered) return;
      setPicked(opt);
      if (opt === target) { correct.current += 1; pandaRef.current?.celebrate(); }
      else { mistakes.current.push(target); pandaRef.current?.shake(); }
    };
    const next = () => {
      const ni = bi + 1;
      setProgress((ni) / totalSteps);
      setPicked(null);
      if (ni < blanks.length) setBi(ni);
      else if (sentences.length) setPhase('order');
      else finishAll();
    };
    return (
      <View style={styles.container}>
        <Small>Boşluk {bi + 1} / {blanks.length}</Small>
        <Text style={styles.prompt}>Cümledeki boşluğa hangisi gelmeli?</Text>
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.model}>
            {lesson.modelText?.replace(target, ' ______ ')}
          </Text>
        </Card>
        <View style={{ gap: 10 }}>
          {optionsFor[bi].map((o) => {
            let s = styles.opt;
            if (answered && o === target) s = { ...styles.opt, ...styles.correct };
            else if (answered && o === picked) s = { ...styles.opt, ...styles.wrong };
            return (
              <Pressable key={o} onPress={() => pick(o)} style={s}>
                <Text style={styles.optText}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1 }} />
        <Button title={bi + 1 < blanks.length ? 'Devam et' : sentences.length ? 'Sıralamaya geç' : 'Bitir'} disabled={!answered} onPress={next} />
      </View>
    );
  }

  // ---- ORDER SENTENCES ----
  const allPicked = orderPick.length === sentences.length;
  const toggle = (idx: number) => {
    if (orderPick.includes(idx)) setOrderPick(orderPick.filter((x) => x !== idx));
    else setOrderPick([...orderPick, idx]);
  };
  const checkOrder = () => {
    const ok = JSON.stringify(orderPick) === JSON.stringify(correctOrder);
    if (ok) { correct.current += 1; pandaRef.current?.celebrate(); }
    else { mistakes.current.push('Cümle sırası'); pandaRef.current?.shake(); }
    setProgress(1);
    setTimeout(finishAll, 500);
  };
  return (
    <View style={styles.container}>
      <Small>Cümleleri doğru sıraya koy (sırayla dokun)</Small>
      <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 12 }}>
        {sentences.map((s, idx) => {
          const order = orderPick.indexOf(idx);
          const on = order >= 0;
          return (
            <Pressable key={idx} onPress={() => toggle(idx)} style={[styles.sentence, on && styles.sentenceOn]}>
              {on && <View style={styles.numBadge}><Text style={styles.numText}>{order + 1}</Text></View>}
              <Text style={styles.sentenceText}>{s}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Button title="Kontrol et" disabled={!allPicked} onPress={checkOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  model: { fontFamily: fonts.regular, fontSize: 15, color: colors.secondary, lineHeight: 23 },
  prompt: { fontFamily: fonts.semibold, fontSize: 17, color: colors.primary, marginTop: 8, marginBottom: 14 },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 15 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  sentence: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 14 },
  sentenceOn: { borderColor: colors.accent, backgroundColor: '#FFF4D6' },
  sentenceText: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.primary, lineHeight: 20 },
  numBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.bold, fontSize: 13, color: colors.onAccent },
});
