import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
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

export function InterviewQALesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const questions = lesson.questions ?? [];
  const [qi, setQi] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const correct = React.useRef(0);
  const mistakes = React.useRef<string[]>([]);

  const q = questions[qi];
  const lower = answer.toLowerCase();
  const used = q.keyPhrases.filter((k) => lower.includes(k.toLowerCase()));

  const reveal = () => {
    setRevealed(true);
    const hit = used.length >= Math.ceil(q.keyPhrases.length / 2);
    if (hit) { correct.current += 1; pandaRef.current?.celebrate(); }
    else { mistakes.current.push(q.question); pandaRef.current?.shake(); }
  };

  const next = () => {
    const ni = qi + 1;
    setProgress(ni / questions.length);
    if (ni < questions.length) {
      setQi(ni);
      setAnswer('');
      setRevealed(false);
    } else {
      onFinish(correct.current, questions.length, mistakes.current);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Small>Soru {qi + 1} / {questions.length}</Small>
        <Text style={styles.question}>{q.question}</Text>

        {!revealed ? (
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            multiline
            placeholder="Cevabını İngilizce yaz..."
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        ) : (
          <Animated.View entering={FadeIn}>
            <Small style={{ marginBottom: 6 }}>Senin cevabın</Small>
            <Card style={{ marginBottom: 14 }}>
              <Text style={styles.userAns}>{answer || '—'}</Text>
            </Card>
            <Small style={{ marginBottom: 6 }}>Model cevap</Small>
            <Card>
              <Text style={styles.model}>{q.modelAnswer}</Text>
            </Card>
            <Small style={{ marginTop: 14, marginBottom: 8 }}>Anahtar ifadeler ({used.length}/{q.keyPhrases.length})</Small>
            <View style={styles.chips}>
              {q.keyPhrases.map((k) => {
                const on = used.some((u) => u.toLowerCase() === k.toLowerCase());
                return (
                  <View key={k} style={[styles.chip, on ? styles.chipOn : styles.chipOff]}>
                    <Text style={[styles.chipText, on && { color: '#fff' }]}>{on ? '✓ ' : ''}{k}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>
      <View style={{ paddingTop: 8 }}>
        {!revealed ? (
          <Button title="Model cevabı gör" disabled={!answer.trim()} onPress={reveal} />
        ) : (
          <Button title={qi + 1 < questions.length ? 'Sonraki soru' : 'Bitir'} onPress={next} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  question: { fontFamily: fonts.semibold, fontSize: 18, color: colors.primary, marginTop: 8, marginBottom: 14, lineHeight: 25 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 14,
    minHeight: 150,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
    textAlignVertical: 'top',
  },
  userAns: { fontFamily: fonts.medium, fontSize: 14, color: colors.secondary, lineHeight: 21 },
  model: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary, lineHeight: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1 },
  chipOn: { backgroundColor: colors.success, borderColor: colors.success },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.border },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.secondary },
});
