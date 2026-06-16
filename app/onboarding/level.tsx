import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { H1, H2, Body, Button, ProgressBar } from '../../src/components/ui';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { colors, radius, fonts } from '../../src/theme';
import { useApp } from '../../src/state';
import { Level } from '../../src/types';

const questions = [
  { q: 'Choose the correct: "I ___ in the marketing team."', opts: ['work', 'working', 'works', 'worked'], a: 0 },
  { q: '"Could you ___ the meeting to Friday?"', opts: ['move', 'moving', 'moved', 'to move'], a: 0 },
  { q: 'Pick the most formal closing:', opts: ['Cheers', 'Best regards', 'Bye', 'Later'], a: 1 },
  { q: '"We need to ___ our quarterly targets."', opts: ['reach', 'arrive', 'get to there', 'come'], a: 0 },
  { q: '"I look forward to ___ from you."', opts: ['hear', 'hearing', 'heard', 'be hearing'], a: 1 },
];

function levelFor(correct: number): Level {
  if (correct >= 4) return 'advanced';
  if (correct >= 2) return 'intermediate';
  return 'beginner';
}

const levelText: Record<Level, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
};

export default function LevelScreen() {
  const { sector } = useLocalSearchParams<{ sector: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const pandaRef = useRef<PandaHandle>(null);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [name, setName] = useState('');

  const current = questions[idx];
  const level = levelFor(correct);

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === current.a;
    if (ok) {
      setCorrect((c) => c + 1);
      pandaRef.current?.celebrate();
    } else {
      pandaRef.current?.shake();
    }
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
      }
    }, 700);
  };

  const finish = async () => {
    await completeOnboarding(sector, level, name);
    router.replace('/(tabs)');
  };

  if (done) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 30, justifyContent: 'center' }]}>
        <Animated.View entering={FadeIn} style={{ alignItems: 'center', gap: 14 }}>
          <Panda streak={3} size={110} />
          <H1>Seviyen: {levelText[level]}</H1>
          <Body style={{ textAlign: 'center', paddingHorizontal: 20 }}>
            {correct}/{questions.length} doğru. Sana uygun derslerle başlayacağız!
          </Body>
          <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
            <H2 style={{ marginBottom: 8 }}>Sana nasıl hitap edelim?</H2>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Adın"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              returnKeyType="done"
              style={styles.nameInput}
            />
          </View>
        </Animated.View>
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 16 }}>
          <Button title="Başla 🐼" disabled={!name.trim()} onPress={finish} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <ProgressBar value={(idx) / questions.length} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>Seviye testi</H2>
          <Panda ref={pandaRef} streak={2} size={44} />
        </View>
        <Body>Soru {idx + 1} / {questions.length}</Body>
        <H2 style={{ fontSize: 20, lineHeight: 28 }}>{current.q}</H2>
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 12 }}>
        {current.opts.map((o, i) => {
          const isPicked = picked === i;
          const isAnswer = current.a === i;
          let state = styles.opt;
          if (picked !== null && isAnswer) state = { ...styles.opt, ...styles.optCorrect };
          else if (isPicked && !isAnswer) state = { ...styles.opt, ...styles.optWrong };
          return (
            <Pressable key={i} onPress={() => onPick(i)} style={state}>
              <Text style={styles.optText}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  opt: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 18,
  },
  optCorrect: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  optWrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  nameInput: {
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
});
