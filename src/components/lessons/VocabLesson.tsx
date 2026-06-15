import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { VocabCard } from '../../types';
import { Button, Small } from '../ui';
import { PandaHandle } from '../Panda';
import { colors, fonts, radius, shadow } from '../../theme';

export function VocabLesson({
  cards,
  pandaRef,
  setProgress,
  onFinish,
}: {
  cards: VocabCard[];
  pandaRef: React.RefObject<PandaHandle | null>;
  setProgress: (n: number) => void;
  onFinish: (correct: number, total: number, mistakes: string[]) => void;
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const mistakes = React.useRef<string[]>([]);
  const card = cards[i];

  const next = (known: boolean) => {
    if (known) {
      setCorrect((c) => c + 1);
      pandaRef.current?.celebrate();
    } else {
      mistakes.current.push(card.english);
      pandaRef.current?.shake();
    }
    const nextI = i + 1;
    setProgress(nextI / cards.length);
    if (nextI >= cards.length) {
      onFinish(known ? correct + 1 : correct, cards.length, mistakes.current);
    } else {
      setI(nextI);
      setFlipped(false);
    }
  };

  return (
    <View style={styles.container}>
      <Small style={{ marginBottom: 12 }}>Kelime {i + 1} / {cards.length}</Small>
      <Pressable style={{ flex: 1 }} onPress={() => setFlipped((f) => !f)}>
        <Animated.View key={`${i}-${flipped}`} entering={FadeIn.duration(220)} style={styles.card}>
          {!flipped ? (
            <>
              <Text style={styles.en}>{card.english}</Text>
              <Small style={{ marginTop: 16 }}>Anlamını düşün, kartı çevirmek için dokun 👆</Small>
            </>
          ) : (
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <Text style={styles.tr}>{card.turkish}</Text>
              <Text style={styles.example}>“{card.example}”</Text>
            </ScrollView>
          )}
        </Animated.View>
      </Pressable>

      <View style={styles.footer}>
        {!flipped ? (
          <Button title="Cevabı göster" variant="primary" onPress={() => setFlipped(true)} />
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button title="Tekrar göster" variant="ghost" style={{ flex: 1 }} onPress={() => next(false)} />
            <Button title="Öğrendim ✓" variant="success" style={{ flex: 1 }} onPress={() => next(true)} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...shadow,
  },
  en: { fontFamily: fonts.bold, fontSize: 34, color: colors.primary, textAlign: 'center' },
  tr: { fontFamily: fonts.bold, fontSize: 26, color: colors.primary, textAlign: 'center' },
  example: { fontFamily: fonts.regular, fontSize: 15, color: colors.secondary, textAlign: 'center', marginTop: 18, lineHeight: 22 },
  footer: { paddingTop: 16 },
});
