import React, { useState } from 'react';
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

const effColor = (e: string) => (e === 'yüksek' ? colors.success : e === 'orta' ? colors.accent : colors.danger);

export function StrategyDialogueLesson({ lesson, pandaRef, setProgress, onFinish }: Props) {
  const strategies = lesson.strategies ?? [];
  const dialogue = lesson.dialogue;
  const [picked, setPicked] = useState<string | null>(null);
  const best = strategies.find((s) => s.effectiveness === 'yüksek');

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    setProgress(0.6);
    if (id === best?.id) pandaRef.current?.celebrate();
    else pandaRef.current?.shake();
  };

  const finish = () => {
    const ok = picked === best?.id;
    onFinish(ok ? 1 : 0, 1, ok ? [] : [lesson.title]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: 16 }}>
          <Small>Senaryo</Small>
          <Text style={styles.scenario}>{lesson.scenario}</Text>
        </Card>

        <Text style={styles.q}>Nasıl bir strateji izlersin?</Text>
        <View style={{ gap: 10 }}>
          {strategies.map((s) => {
            const isPicked = picked === s.id;
            const showEval = picked !== null;
            return (
              <Pressable
                key={s.id}
                onPress={() => pick(s.id)}
                style={[
                  styles.strat,
                  showEval && s.id === best?.id && styles.stratBest,
                  isPicked && s.id !== best?.id && styles.stratWrong,
                ]}
              >
                <Text style={styles.stratLabel}>{s.label}</Text>
                <Text style={styles.stratDesc}>{s.description}</Text>
                {showEval && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.eff, { color: effColor(s.effectiveness) }]}>Etkililik: {s.effectiveness}</Text>
                    <Text style={styles.note}>{s.note}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {picked && dialogue && (
          <Animated.View entering={FadeIn} style={{ marginTop: 18 }}>
            <Small style={{ marginBottom: 8 }}>En etkili stratejiyle örnek diyalog</Small>
            <View style={{ gap: 8 }}>
              {dialogue.turns.map((t, i) => (
                <View key={i} style={[styles.bubble, t.speaker === 'user' ? styles.user : styles.other]}>
                  <Text style={styles.bubbleText}>{t.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
      <Button title="Bitir" disabled={!picked} onPress={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scenario: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginTop: 6, lineHeight: 22 },
  q: { fontFamily: fonts.semibold, fontSize: 17, color: colors.primary, marginBottom: 12 },
  strat: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 15 },
  stratBest: { borderColor: colors.success, backgroundColor: '#22C55E12' },
  stratWrong: { borderColor: colors.danger, backgroundColor: '#EF444412' },
  stratLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary },
  stratDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 3 },
  eff: { fontFamily: fonts.bold, fontSize: 13 },
  note: { fontFamily: fonts.regular, fontSize: 13, color: colors.secondary, marginTop: 4, lineHeight: 19 },
  bubble: { borderRadius: radius.md, padding: 12, maxWidth: '88%' },
  other: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' },
  user: { backgroundColor: colors.accent, alignSelf: 'flex-end' },
  bubbleText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary, lineHeight: 20 },
});
