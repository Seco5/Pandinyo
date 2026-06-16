import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PracticeLesson } from '../../data/examMode';
import { Button, Small, Card } from '../ui';
import { PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

interface Props {
  lesson: PracticeLesson;
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}

export function ReadingPracticeLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const questions = lesson.questions ?? [];
  const isListening = lesson.kind === 'listening';
  const [showText, setShowText] = useState(true);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const correct = React.useRef(0);
  const mistakes = React.useRef<string[]>([]);

  const q = questions[i];
  const answered = picked !== null;

  const pick = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    if (idx === q.answer) { correct.current += 1; pandaRef.current?.celebrate(); }
    else { mistakes.current.push(q.prompt); pandaRef.current?.shake(); }
  };
  const next = () => {
    const ni = i + 1;
    setProgress(ni / questions.length);
    if (ni < questions.length) { setI(ni); setPicked(null); }
    else onFinish(correct.current, questions.length, mistakes.current);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Small>{isListening ? 'Transcript' : 'Pasaj'}{lesson.passageTitle ? ` · ${lesson.passageTitle}` : ''}</Small>
          {isListening && (
            <Pressable onPress={() => setShowText((s) => !s)} hitSlop={8} style={styles.toggle}>
              <Ionicons name={showText ? 'eye-off' : 'eye'} size={14} color={colors.primary} />
              <Text style={styles.toggleText}>{showText ? 'Gizle' : 'Göster'}</Text>
            </Pressable>
          )}
        </View>

        {showText && (
          <Card style={{ marginTop: 10, maxHeight: 260 }}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              <Text style={[styles.passage, isListening && { fontSize: 13 }]}>{lesson.passage}</Text>
            </ScrollView>
          </Card>
        )}

        <Small style={{ marginTop: 18 }}>Soru {i + 1} / {questions.length}</Small>
        <Text style={styles.prompt}>{q.prompt}</Text>
        <View style={{ gap: 10 }}>
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
        {answered && q.explanation ? (
          <Animated.View entering={FadeIn} style={styles.explain}>
            <Text style={styles.explainText}>{q.explanation}</Text>
          </Animated.View>
        ) : null}
      </ScrollView>
      <Button title={i + 1 < questions.length ? 'Devam et' : 'Bitir'} disabled={!answered} onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  toggleText: { fontFamily: fonts.medium, fontSize: 12, color: colors.primary },
  passage: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary, lineHeight: 22 },
  prompt: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary, marginTop: 8, marginBottom: 14, lineHeight: 23 },
  opt: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 14 },
  correct: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  wrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary, lineHeight: 20 },
  explain: { marginTop: 14, borderRadius: radius.md, padding: 14, backgroundColor: '#FFC83D18', borderWidth: 1, borderColor: colors.accent },
  explainText: { fontFamily: fonts.regular, fontSize: 13, color: colors.secondary, lineHeight: 20 },
});
