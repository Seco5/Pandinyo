import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { stories, chaptersFor, endingFor } from '../../src/data/story';
import { StoryScene } from '../../src/components/StoryScene';
import { fonts, radius } from '../../src/theme';

const BG = '#111111';
const ACCENT = '#FFC83D';

export default function StoryTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { storyProgress } = useApp();
  const [locked, setLocked] = useState<{ title: string; quarter?: string } | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>STORY MODE</Text>
        <Text style={styles.h1}>İngilizceni hikayede yaşa</Text>
        <Text style={styles.sub}>Seçimlerin geleceğini belirler. Doğru kelimeler doğru kapıları açar.</Text>

        {stories.map((s, i) => {
          if (!s.free) {
            return (
              <Animated.View key={s.id} entering={FadeInDown.delay(i * 60)}>
                <Pressable onPress={() => setLocked({ title: s.title, quarter: s.quarter })} style={styles.card}>
                  <View style={styles.blurred}>
                    <StoryScene scene={s.cover} revealed={false} height={150} />
                  </View>
                  <View style={styles.lockRow}>
                    <Ionicons name="lock-closed" size={16} color="#fff" />
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    {s.quarter ? <Text style={styles.quarter}>{s.quarter}</Text> : null}
                  </View>
                  <Text style={styles.cardSub}>{s.subtitle}</Text>
                </Pressable>
              </Animated.View>
            );
          }

          const prog = storyProgress(s.id);
          const total = chaptersFor(s.id).length;
          const done = prog.completed ? total : prog.currentChapter;
          const ending = prog.completed && prog.finalEnding ? endingFor(prog.hiddenScore) : null;

          return (
            <Animated.View key={s.id} entering={FadeInDown.delay(i * 60)}>
              <Pressable
                onPress={() => router.push({ pathname: '/story/chapter', params: { story: s.id } } as any)}
                style={[styles.card, styles.freeCard]}
              >
                <StoryScene scene={s.cover} revealed height={150} />
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>ÜCRETSİZ</Text></View>
                  </View>
                  <Text style={styles.cardSub}>{s.subtitle}</Text>

                  <View style={styles.track}>
                    <View style={[styles.trackFill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
                  </View>

                  <View style={styles.ctaRow}>
                    <Text style={styles.progressText}>
                      {prog.completed ? `Tamamlandı · ${ending?.title ?? ''}` : `Bölüm ${Math.min(done + 1, total)} / ${total}`}
                    </Text>
                    <View style={styles.cta}>
                      <Ionicons name={prog.completed ? 'refresh' : done > 0 ? 'play' : 'sparkles'} size={15} color={BG} />
                      <Text style={styles.ctaText}>
                        {prog.completed ? 'Tekrar oyna' : done > 0 ? 'Devam et' : 'Başla'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Locked story bottom sheet */}
      <Modal visible={!!locked} transparent animationType="none" onRequestClose={() => setLocked(null)}>
        <Pressable style={styles.backdrop} onPress={() => setLocked(null)}>
          <Animated.View entering={FadeIn.duration(150)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        </Pressable>
        <Animated.View entering={SlideInDown.duration(220)} style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grabber} />
          <View style={styles.sheetIcon}><Ionicons name="time" size={26} color={ACCENT} /></View>
          <Text style={styles.sheetTitle}>Bu hikaye yakında geliyor</Text>
          <Text style={styles.sheetSub}>
            “{locked?.title}” {locked?.quarter ? `${locked.quarter}'te ` : ''}premium olarak açılacak. Şimdilik “Sıfırdan Zirveye” ile başla!
          </Text>
          <Pressable style={styles.sheetBtn} onPress={() => setLocked(null)}>
            <Text style={styles.sheetBtnText}>Anladım</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  kicker: { color: ACCENT, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2 },
  h1: { color: '#fff', fontFamily: fonts.bold, fontSize: 26, marginTop: 6 },
  sub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 14, marginTop: 6, marginBottom: 22, lineHeight: 20 },
  card: { backgroundColor: '#1A1A1A', borderRadius: radius.lg, borderWidth: 1, borderColor: '#262626', overflow: 'hidden', marginBottom: 18 },
  freeCard: { borderColor: '#3A3322' },
  blurred: { opacity: 0.5 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 14 },
  quarter: { marginLeft: 'auto', color: ACCENT, fontFamily: fonts.semibold, fontSize: 12 },
  cardTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 18 },
  cardSub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 13, paddingHorizontal: 16, paddingBottom: 16, marginTop: 4 },
  freeBadge: { backgroundColor: ACCENT, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  freeBadgeText: { color: BG, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#2A2A2A', overflow: 'hidden', marginTop: 14 },
  trackFill: { height: '100%', borderRadius: 4, backgroundColor: ACCENT },
  ctaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  progressText: { color: '#C9C9C9', fontFamily: fonts.medium, fontSize: 13, flex: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ACCENT, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  ctaText: { color: BG, fontFamily: fonts.bold, fontSize: 13 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000AA' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#1A1A1A', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: 24, alignItems: 'center' },
  grabber: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#3A3A3A', marginBottom: 18 },
  sheetIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: ACCENT + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  sheetTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 19, textAlign: 'center' },
  sheetSub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  sheetBtn: { backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 40, marginTop: 20, alignSelf: 'stretch', alignItems: 'center' },
  sheetBtnText: { color: BG, fontFamily: fonts.bold, fontSize: 15 },
});
