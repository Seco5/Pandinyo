import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { EmailScenario } from '../../types';
import { Button, Small, Card } from '../ui';
import { PandaHandle } from '../Panda';
import { compareText, WordDiff } from '../../compare';
import { colors, fonts, radius } from '../../theme';

type Phase = 'study' | 'write' | 'result';

const diffColor = (s: WordDiff['status']) =>
  s === 'correct' ? colors.success : s === 'wrong' ? colors.danger : colors.accent;

export function EmailLesson({
  email,
  pandaRef,
  setProgress,
  onFinish,
}: {
  email: EmailScenario;
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}) {
  const [phase, setPhase] = useState<Phase>('study');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ diff: WordDiff[]; accuracy: number } | null>(null);

  const check = () => {
    const r = compareText(email.referenceEmail, input);
    setResult(r);
    setProgress(1);
    if (r.accuracy >= 0.6) pandaRef.current?.celebrate();
    else pandaRef.current?.shake();
    setPhase('result');
  };

  if (phase === 'study') {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <Text style={styles.title}>{email.title}</Text>
          <Card style={{ marginTop: 12 }}>
            <Small>Senaryo</Small>
            <Text style={styles.scenario}>{email.scenario}</Text>
          </Card>
          <Small style={{ marginTop: 18, marginBottom: 8 }}>Örnek e-posta — oku ve aklında tut</Small>
          <Card>
            <Text style={styles.reference}>{email.referenceEmail}</Text>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Hazırım, yazmaya başla" onPress={() => { setPhase('write'); setProgress(0.5); }} />
        </View>
      </View>
    );
  }

  if (phase === 'write') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{email.title}</Text>
        <Card style={{ marginTop: 10 }}>
          <Small>Senaryo</Small>
          <Text style={styles.scenario}>{email.scenario}</Text>
        </Card>
        <Small style={{ marginTop: 16, marginBottom: 8 }}>Kendi e-postanı yaz ✍️</Small>
        <TextInput
          value={input}
          onChangeText={setInput}
          multiline
          placeholder="Dear ..."
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <View style={styles.footer}>
          <Button title="Kontrol et" disabled={!input.trim()} onPress={check} />
        </View>
      </View>
    );
  }

  const acc = result?.accuracy ?? 0;
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <Animated.View entering={FadeIn}>
          <Text style={styles.title}>Doğruluk: %{Math.round(acc * 100)}</Text>
          <Small style={{ marginTop: 4 }}>
            🟢 doğru · 🔴 hatalı · 🟡 eksik kelimeler
          </Small>
          <Card style={{ marginTop: 14 }}>
            <Text style={styles.diffText}>
              {result?.diff.map((d, k) => (
                <Text key={k} style={{ color: diffColor(d.status), textDecorationLine: d.status === 'missing' ? 'underline' : 'none' }}>
                  {d.word}{' '}
                </Text>
              ))}
            </Text>
          </Card>
          <Small style={{ marginTop: 16, marginBottom: 6 }}>Referans e-posta</Small>
          <Card>
            <Text style={styles.reference}>{email.referenceEmail}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Bitir"
          onPress={() => onFinish(acc >= 0.6 ? 1 : 0, 1, acc >= 0.6 ? [] : [email.title])}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  scenario: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginTop: 6, lineHeight: 22 },
  reference: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary, lineHeight: 22 },
  diffText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 24 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 14,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
    textAlignVertical: 'top',
    minHeight: 160,
  },
  footer: { paddingTop: 12 },
});
