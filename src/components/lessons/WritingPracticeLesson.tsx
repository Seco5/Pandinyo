import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PracticeLesson } from '../../data/examMode';
import { compareText } from '../../compare';
import { Button, Small, Card } from '../ui';
import { PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

interface Props {
  lesson: PracticeLesson;
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}

export function WritingPracticeLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const task = lesson.task!;
  const [phase, setPhase] = useState<'read' | 'write' | 'result'>('read');
  const [text, setText] = useState('');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const finish = () => {
    // Score on overlap with the model answer (rough proxy).
    const { accuracy } = compareText(task.modelAnswer, text);
    const ok = accuracy >= 0.3 && wordCount >= 50;
    if (ok) pandaRef.current?.celebrate();
    else pandaRef.current?.shake();
    onFinish(ok ? 1 : 0, 1, ok ? [] : [task.title]);
  };

  if (phase === 'read') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{task.title}</Text>
          {task.readingPassage ? (
            <>
              <Small style={{ marginTop: 12, marginBottom: 6 }}>📄 Okuma parçası</Small>
              <Card><Text style={styles.body}>{task.readingPassage}</Text></Card>
            </>
          ) : null}
          {task.listeningTranscript ? (
            <>
              <Small style={{ marginTop: 14, marginBottom: 6 }}>🎧 Dinleme transkripti</Small>
              <Card><Text style={styles.body}>{task.listeningTranscript}</Text></Card>
            </>
          ) : null}
          <Small style={{ marginTop: 14, marginBottom: 6 }}>✍️ Görev</Small>
          <Card style={{ borderColor: colors.accent }}><Text style={styles.prompt}>{task.prompt}</Text></Card>
        </ScrollView>
        <Button title="Yazmaya başla" onPress={() => { setPhase('write'); setProgress(0.5); }} />
      </View>
    );
  }

  if (phase === 'write') {
    return (
      <View style={styles.container}>
        <Card style={{ marginBottom: 12 }}><Text style={styles.prompt}>{task.prompt}</Text></Card>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Small style={{ color: wordCount >= 100 ? colors.success : colors.muted }}>{wordCount} kelime</Small>
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Cevabını buraya yaz..."
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Button title="Kontrol et" disabled={wordCount < 20} onPress={() => { setProgress(1); setPhase('result'); }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn}>
          <Text style={styles.title}>Senin cevabın ({wordCount} kelime)</Text>
          <Card style={{ marginTop: 8 }}><Text style={styles.body}>{text}</Text></Card>
          <Small style={{ marginTop: 16, marginBottom: 6 }}>Model cevap</Small>
          <Card><Text style={styles.body}>{task.modelAnswer}</Text></Card>
        </Animated.View>
      </ScrollView>
      <Button title="Bitir" onPress={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  prompt: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary, lineHeight: 21 },
  body: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.secondary, lineHeight: 21 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 14,
    marginTop: 10,
    marginBottom: 12,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
    textAlignVertical: 'top',
    minHeight: 200,
  },
});
