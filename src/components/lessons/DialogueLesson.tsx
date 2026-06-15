import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Dialogue } from '../../types';
import { Button, Small } from '../ui';
import { PandaHandle } from '../Panda';
import { compareText, WordDiff } from '../../compare';
import { colors, fonts, radius } from '../../theme';

interface Rendered {
  speaker: 'other' | 'user';
  text: string;
  diff?: WordDiff[];
  accuracy?: number;
}

const diffColor = (s: WordDiff['status']) =>
  s === 'correct' ? colors.success : s === 'wrong' ? colors.danger : colors.accent;

export function DialogueLesson({
  dialogue,
  pandaRef,
  setProgress,
  onFinish,
}: {
  dialogue: Dialogue;
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}) {
  const [phase, setPhase] = useState<'study' | 'play'>('study');
  const [idx, setIdx] = useState(0);
  const [rendered, setRendered] = useState<Rendered[]>([]);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState<Rendered | null>(null);
  const stats = useRef({ correct: 0, total: 0, mistakes: [] as string[] });
  const userTurns = dialogue.turns.filter((t) => t.speaker === 'user').length;

  const start = () => {
    setPhase('play');
    advanceUntilUser(0, []);
  };

  // Reveal "other" turns automatically until the next user turn (or the end).
  const advanceUntilUser = (from: number, acc: Rendered[]) => {
    let i = from;
    const items = [...acc];
    while (i < dialogue.turns.length && dialogue.turns[i].speaker === 'other') {
      items.push({ speaker: 'other', text: dialogue.turns[i].text });
      i++;
    }
    setRendered(items);
    setIdx(i);
    setProgress(Math.min(1, i / dialogue.turns.length));
    if (i >= dialogue.turns.length) {
      finish();
    }
  };

  const check = () => {
    const ref = dialogue.turns[idx].text;
    const { diff, accuracy } = compareText(ref, input);
    const ok = accuracy >= 0.6;
    stats.current.total += 1;
    if (ok) {
      stats.current.correct += 1;
      pandaRef.current?.celebrate();
    } else {
      stats.current.mistakes.push(ref);
      pandaRef.current?.shake();
    }
    setChecked({ speaker: 'user', text: ref, diff, accuracy });
  };

  const continueAfterCheck = () => {
    const item = checked!;
    setChecked(null);
    setInput('');
    advanceUntilUser(idx + 1, [...rendered, item]);
  };

  const finish = () => {
    setTimeout(() => onFinish(stats.current.correct, Math.max(stats.current.total, userTurns), stats.current.mistakes), 200);
  };

  if (phase === 'study') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{dialogue.title}</Text>
        <Small style={{ marginBottom: 12 }}>Diyaloğu oku ve ezberle. Hazır olunca başla — senin replikler gizlenecek.</Small>
        <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 16 }}>
          {dialogue.turns.map((t, i) => (
            <View key={i} style={[styles.bubble, t.speaker === 'user' ? styles.user : styles.other]}>
              <Small style={{ color: t.speaker === 'user' ? '#111' : colors.muted }}>
                {t.speaker === 'user' ? 'Sen' : 'Karşı taraf'}
              </Small>
              <Text style={styles.bubbleText}>{t.text}</Text>
            </View>
          ))}
        </ScrollView>
        <Button title="Başla 🎬" onPress={start} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {rendered.map((r, i) => (
          <View key={i} style={[styles.bubble, r.speaker === 'user' ? styles.user : styles.other]}>
            <Small style={{ color: r.speaker === 'user' ? '#111' : colors.muted }}>
              {r.speaker === 'user' ? 'Sen' : 'Karşı taraf'}
            </Small>
            {r.diff ? (
              <View>
                <Text style={styles.bubbleText}>
                  {r.diff.map((d, k) => (
                    <Text key={k} style={{ color: diffColor(d.status), textDecorationLine: d.status === 'missing' ? 'underline' : 'none' }}>
                      {d.word}{' '}
                    </Text>
                  ))}
                </Text>
                <Small style={{ marginTop: 4 }}>Doğruluk: %{Math.round((r.accuracy ?? 0) * 100)}</Small>
              </View>
            ) : (
              <Text style={styles.bubbleText}>{r.text}</Text>
            )}
          </View>
        ))}

        {idx < dialogue.turns.length && dialogue.turns[idx]?.speaker === 'user' && (
          <Animated.View entering={FadeInDown} style={styles.inputCard}>
            <Small>Senin replik — hatırlamaya çalış ✍️</Small>
            <TextInput
              value={input}
              onChangeText={setInput}
              editable={!checked}
              multiline
              placeholder="Repliğini yaz..."
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {checked ? (
          <Button title="Devam et" onPress={continueAfterCheck} />
        ) : (
          <Button title="Kontrol et" disabled={!input.trim()} onPress={check} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginBottom: 6 },
  bubble: { borderRadius: radius.md, padding: 14, maxWidth: '88%' },
  other: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' },
  user: { backgroundColor: colors.accent, alignSelf: 'flex-end' },
  bubbleText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginTop: 4, lineHeight: 21 },
  inputCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.accent, padding: 14, alignSelf: 'stretch' },
  input: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginTop: 8, minHeight: 60, textAlignVertical: 'top' },
  footer: { paddingTop: 8 },
});
