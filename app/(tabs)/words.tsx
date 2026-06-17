import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text, TextInput, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import businessVocab from '../../src/data/business-vocab.json';
import { playCorrect, playWrong } from '../../src/sounds';
import { H1, Small } from '../../src/components/ui';
import { colors, fonts, radius, shadow } from '../../src/theme';

const PANDA_HERO = require('../../src/assets/story/panda_hero.png');

interface Word { id: string; english: string; turkish: string; example: string }
const ALL: Word[] = (businessVocab as { vocabulary: Word[] }).vocabulary;
const BY_ID: Record<string, Word> = Object.fromEntries(ALL.map((w) => [w.id, w]));

function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

export default function Words() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [quizWord, setQuizWord] = useState<Word | null>(null);

  // Learned words come from the vocabKnown id list (newest first).
  const learned = useMemo(() => {
    console.log('vocabKnown okunan veri:', profile.vocabKnown);
    const resolved = [...profile.vocabKnown].reverse().map((id) => BY_ID[id]).filter(Boolean) as Word[];
    console.log('Kelimeler sekmesi çözümlenen:', resolved.length, '/', profile.vocabKnown.length);
    return resolved;
  }, [profile.vocabKnown]);

  const filtered = learned.filter(
    (v) =>
      v.english.toLowerCase().includes(query.toLowerCase()) ||
      v.turkish.toLowerCase().includes(query.toLowerCase())
  );

  // ---- Empty state ----
  if (learned.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
          <H1>Kelimeler</H1>
          <Small style={{ marginTop: 4 }}>Öğrendiğin 0 kelime</Small>
        </View>
        <View style={styles.empty}>
          <Image source={PANDA_HERO} style={{ width: 170, height: 150 }} resizeMode="contain" />
          <Text style={styles.emptyTitle}>Henüz kelime öğrenmedin</Text>
          <Text style={styles.emptySub}>Derslere başla, öğrendiğin kelimeler burada birikecek.</Text>
          <Pressable style={styles.startBtn} onPress={() => router.push({ pathname: '/module/[id]', params: { id: 'vocab' } })}>
            <Ionicons name="play" size={16} color={colors.onAccent} />
            <Text style={styles.startText}>Öğrenmeye Başla</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
        <H1>Kelimeler</H1>
        <Small style={{ marginTop: 4 }}>Öğrendiğin {learned.length} kelime · tekrar için</Small>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Kelime ara..."
          placeholderTextColor={colors.muted}
          style={styles.search}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 24, gap: 12 }} showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <View style={styles.info}>
          <View style={styles.infoIcon}>
            <Ionicons name="book" size={18} color="#D9A300" />
          </View>
          <Text style={styles.infoText}>Bu bölümde derslerden öğrendiğin kelimeler birikir. Tekrar ederek kalıcı hale getir.</Text>
        </View>

        {filtered.map((v) => {
          const isOpen = open === v.id;
          return (
            <Pressable key={v.id} onPress={() => setOpen(isOpen ? null : v.id)} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.en}>{v.english}</Text>
                </View>
                <Text style={styles.tr}>{v.turkish}</Text>
                <Pressable onPress={() => setQuizWord(v)} hitSlop={8} style={styles.repeatBtn}>
                  <Ionicons name="refresh" size={18} color={colors.accent} />
                </Pressable>
              </View>
              {isOpen && <Text style={styles.example}>“{v.example}”</Text>}
            </Pressable>
          );
        })}
        {filtered.length === 0 && <Small style={{ textAlign: 'center', marginTop: 20 }}>Eşleşen kelime yok.</Small>}
      </ScrollView>

      <RepeatQuiz word={quizWord} onClose={() => setQuizWord(null)} />
    </View>
  );
}

function RepeatQuiz({ word, onClose }: { word: Word | null; onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!word) return [];
    const distractors = shuffle(ALL.filter((w) => w.id !== word.id)).slice(0, 3).map((w) => w.turkish);
    return shuffle([word.turkish, ...distractors]);
  }, [word?.id]);

  if (!word) return null;
  const answered = picked !== null;

  const pick = (o: string) => {
    if (answered) return;
    setPicked(o);
    if (o === word.turkish) playCorrect();
    else playWrong();
  };
  const close = () => { setPicked(null); onClose(); };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={styles.sheet}>
        <Animated.View entering={ZoomIn.duration(180)}>
          <Text style={styles.quizKicker}>Tekrar çalış</Text>
          <Text style={styles.quizWord}>{word.english}</Text>
          <Small style={{ textAlign: 'center', marginBottom: 14 }}>Türkçe karşılığı?</Small>
          <View style={{ gap: 10 }}>
            {options.map((o) => {
              let s = styles.opt;
              if (answered && o === word.turkish) s = { ...styles.opt, ...styles.optCorrect };
              else if (answered && o === picked) s = { ...styles.opt, ...styles.optWrong };
              return (
                <Pressable key={o} onPress={() => pick(o)} style={s}>
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              );
            })}
          </View>
          {answered && (
            <Pressable style={styles.quizClose} onPress={close}>
              <Text style={styles.quizCloseText}>Kapat</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 48,
    marginTop: 16,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF8E1', borderRadius: radius.md, borderLeftWidth: 4, borderLeftColor: colors.accent, padding: 14 },
  infoIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFEFC2', alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: '#7A5C00', lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16, ...shadow },
  en: { fontFamily: fonts.bold, fontSize: 17, color: colors.primary },
  tr: { fontFamily: fonts.medium, fontSize: 14, color: colors.secondary, marginRight: 12 },
  repeatBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF4D6', alignItems: 'center', justifyContent: 'center' },
  example: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: 10, lineHeight: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 6, marginTop: -40 },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginTop: 8 },
  emptySub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 21 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 28, marginTop: 18 },
  startText: { fontFamily: fonts.bold, fontSize: 15, color: colors.onAccent },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000088' },
  sheet: { position: 'absolute', left: 24, right: 24, top: '30%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 22 },
  quizKicker: { fontFamily: fonts.semibold, fontSize: 13, color: colors.accent, textAlign: 'center' },
  quizWord: { fontFamily: fonts.bold, fontSize: 26, color: colors.primary, textAlign: 'center', marginTop: 6, marginBottom: 4 },
  opt: { backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 14 },
  optCorrect: { borderColor: colors.success, backgroundColor: '#22C55E18' },
  optWrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
  optText: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  quizClose: { alignItems: 'center', paddingVertical: 14, marginTop: 6 },
  quizCloseText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
});
