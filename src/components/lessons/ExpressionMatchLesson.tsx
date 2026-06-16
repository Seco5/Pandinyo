import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
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

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function ExpressionMatchLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const expr = lesson.expressions ?? [];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const correct = React.useRef(0);
  const mistakes = React.useRef<string[]>([]);

  const cur = expr[i];
  const options = useMemo(() => {
    const others = shuffle(expr.filter((e) => e.turkish !== cur.turkish)).slice(0, 3).map((e) => e.turkish);
    return shuffle([cur.turkish, ...others]);
  }, [i, lesson.id]);

  const answered = picked !== null;
  const pick = (o: string) => {
    if (answered) return;
    setPicked(o);
    if (o === cur.turkish) { correct.current += 1; pandaRef.current?.celebrate(); }
    else { mistakes.current.push(cur.english); pandaRef.current?.shake(); }
  };
  const next = () => {
    const ni = i + 1;
    setProgress(ni / expr.length);
    if (ni < expr.length) { setI(ni); setPicked(null); }
    else onFinish(correct.current, expr.length, mistakes.current);
  };

  return (
    <View style={styles.container}>
      <Small>İfade {i + 1} / {expr.length}</Small>
      <Card style={{ marginTop: 12, marginBottom: 16 }}>
        <Text style={styles.en}>{cur.english}</Text>
      </Card>
      <Small style={{ marginBottom: 10 }}>Türkçe karşılığı hangisi?</Small>
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {options.map((o) => {
          let s = styles.opt;
          if (answered && o === cur.turkish) s = { ...styles.opt, ...styles.correct };
          else if (answered && o === picked) s = { ...styles.opt, ...styles.wrong };
          return (
            <Pressable key={o} onPress={() => pick(o)} style={s}>
              <Text style={styles.optText}>{o}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Button title={i + 1 < expr.length ? 'Devam et' : 'Bitir'} disabled={!answered} onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  en: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, textAlign: 'center' },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 15 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
});
