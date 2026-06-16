import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { RichLesson } from '../../data/full';
import { Button, Small } from '../ui';
import { PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

interface Props {
  lesson: RichLesson;
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function PresentationFlowLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const sections = lesson.sections ?? [];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const correct = React.useRef(0);
  const mistakes = React.useRef<string[]>([]);

  const sec = sections[i];
  const opts = useMemo(() => shuffle(sec.options), [i, lesson.id]);
  const answered = picked !== null;

  const pick = (o: string) => {
    if (answered) return;
    setPicked(o);
    if (o === sec.correctExpression) { correct.current += 1; pandaRef.current?.celebrate(); }
    else { mistakes.current.push(sec.title); pandaRef.current?.shake(); }
  };
  const next = () => {
    const ni = i + 1;
    setProgress(ni / sections.length);
    if (ni < sections.length) { setI(ni); setPicked(null); }
    else onFinish(correct.current, sections.length, mistakes.current);
  };

  return (
    <View style={styles.container}>
      <Small>{lesson.presentationType} · Bölüm {i + 1} / {sections.length}</Small>
      <Text style={styles.title}>{sec.title}</Text>
      <Small style={{ marginBottom: 12 }}>Bu bölüm için en uygun ifadeyi seç:</Small>
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        {opts.map((o) => {
          let s = styles.opt;
          if (answered && o === sec.correctExpression) s = { ...styles.opt, ...styles.correct };
          else if (answered && o === picked) s = { ...styles.opt, ...styles.wrong };
          return (
            <Pressable key={o} onPress={() => pick(o)} style={s}>
              <Text style={styles.optText}>{o}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Button title={i + 1 < sections.length ? 'Devam et' : 'Bitir'} disabled={!answered} onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginTop: 6, marginBottom: 4 },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 14 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary, lineHeight: 20 },
});
