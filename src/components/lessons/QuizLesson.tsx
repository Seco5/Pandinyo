import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { QuizQuestion } from '../../types';
import { Button, Small } from '../ui';
import { PandaHandle } from '../Panda';
import { QuestionTimer } from '../QuestionTimer';
import { colors, fonts, radius } from '../../theme';

const QUIZ_SECONDS = 15;

export function QuizLesson({
  questions,
  pandaRef,
  setProgress,
  onFinish,
}: {
  questions: QuizQuestion[];
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const mistakes = React.useRef<string[]>([]);
  const q = questions[i];
  const answered = picked !== null;
  const isRight = picked === q.answer;

  const pick = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    if (idx === q.answer) {
      setCorrect((c) => c + 1);
      pandaRef.current?.celebrate();
    } else {
      mistakes.current.push(q.prompt);
      pandaRef.current?.shake();
    }
  };

  // Time ran out → count as wrong, reveal the answer, then auto-advance.
  const onExpire = () => {
    if (answered) return;
    setPicked(-1);
    mistakes.current.push(q.prompt);
    pandaRef.current?.shake();
    setTimeout(next, 1500);
  };

  const next = () => {
    const nextI = i + 1;
    setProgress(nextI / questions.length);
    if (nextI >= questions.length) {
      onFinish(correct, questions.length, mistakes.current);
    } else {
      setI(nextI);
      setPicked(null);
    }
  };

  return (
    <View style={styles.container}>
      <QuestionTimer seconds={QUIZ_SECONDS} resetKey={i} paused={answered} onExpire={onExpire} />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Small>Soru {i + 1} / {questions.length}</Small>
        {q.passage ? (
          <View style={styles.passage}>
            <Text style={styles.passageText}>{q.passage}</Text>
          </View>
        ) : null}
        <Text style={styles.prompt}>{q.prompt}</Text>
        <View style={{ gap: 12, marginTop: 8 }}>
          {q.options.map((o, idx) => {
            let s = styles.opt;
            if (answered && idx === q.answer) s = { ...styles.opt, ...styles.correct };
            else if (answered && idx === picked) s = { ...styles.opt, ...styles.wrong };
            return (
              <Pressable key={idx} onPress={() => pick(idx)} style={s}>
                <Text style={styles.optText}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
        {answered && (
          <Animated.View entering={FadeIn} style={[styles.explain, isRight ? styles.explainOk : styles.explainBad]}>
            <Text style={styles.explainTitle}>{isRight ? 'Harika! Doğru cevap 🎉' : 'Doğru cevabı gör 👇'}</Text>
            <Text style={styles.explainText}>{q.explanation}</Text>
          </Animated.View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button title={i + 1 >= questions.length ? 'Bitir' : 'Devam et'} disabled={!answered} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  passage: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    padding: 14,
    marginTop: 12,
  },
  passageText: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary, lineHeight: 21 },
  prompt: { fontFamily: fonts.semibold, fontSize: 19, color: colors.primary, marginTop: 8, marginBottom: 18, lineHeight: 26 },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 16 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  explain: { marginTop: 18, borderRadius: radius.md, padding: 16, borderWidth: 1 },
  explainOk: { backgroundColor: '#22C55E12', borderColor: colors.success },
  explainBad: { backgroundColor: '#FFC83D18', borderColor: colors.accent },
  explainTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary },
  explainText: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary, marginTop: 6, lineHeight: 20 },
  footer: { paddingTop: 8 },
});
