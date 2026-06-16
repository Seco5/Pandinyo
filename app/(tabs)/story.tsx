import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Modal, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { stories, chaptersFor, endingFor } from '../../src/data/story';
import { characterImage, characters } from '../../src/data/characters';
import { fonts, radius } from '../../src/theme';

const BG = '#111111';
const ACCENT = '#FFC83D';

export default function StoryTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { storyProgress, profile, setStoryCharacter } = useApp();
  const charImg = characterImage(profile.storyCharacter);
  const [locked, setLocked] = useState<{ title: string; quarter?: string } | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>STORY MODE</Text>
        <Text style={styles.h1}>İngilizceni hikayede yaşa</Text>
        <Text style={styles.sub}>Seçimlerin geleceğini belirler. Doğru kelimeler doğru kapıları açar.</Text>

        {/* Character picker */}
        <Text style={styles.pickLabel}>KARAKTERİNİ SEÇ</Text>
        <View style={styles.charRow}>
          {characters.map((c) => {
            const active = profile.storyCharacter === c.id;
            return (
              <Pressable key={c.id} onPress={() => setStoryCharacter(c.id)} style={[styles.charCard, active && styles.charCardActive]}>
                <ImageBackground source={c.image} style={styles.charImg} imageStyle={{ opacity: active ? 1 : 0.55 }} resizeMode="cover">
                  <View style={styles.charShade} />
                  <Text style={styles.charLabel}>{c.id === 'alex' ? 'Erkek' : 'Kadın'}</Text>
                  <Text style={styles.charName}>{c.name}</Text>
                  {active && (
                    <View style={styles.charCheck}>
                      <Ionicons name="checkmark-circle" size={22} color={ACCENT} />
                    </View>
                  )}
                </ImageBackground>
              </Pressable>
            );
          })}
        </View>

        {stories.map((s, i) => {
          if (!s.free) {
            return (
              <Animated.View key={s.id} entering={FadeInDown.delay(i * 60)}>
                <Pressable onPress={() => setLocked({ title: s.title, quarter: s.quarter })} style={styles.card}>
                  <ImageBackground source={charImg} style={styles.lockedBg} imageStyle={{ opacity: 0.18 }} resizeMode="cover" blurRadius={8}>
                    <View style={styles.lockBadge}><Ionicons name="lock-closed" size={22} color="#fff" /></View>
                    {s.quarter ? <Text style={styles.quarterTag}>{s.quarter}</Text> : null}
                  </ImageBackground>
                  <View style={{ padding: 16 }}>
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    <Text style={styles.cardSubInline}>{s.subtitle} · Yakında</Text>
                  </View>
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
                <ImageBackground source={charImg} style={styles.freeBg} resizeMode="cover">
                  <View style={styles.freeOverlay} />
                  <View style={styles.freeTop}>
                    <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>ÜCRETSİZ</Text></View>
                  </View>
                  <View style={styles.freeBottom}>
                    <Text style={styles.freeTitle}>{s.title}</Text>
                    <Text style={styles.freeSub}>{s.subtitle}</Text>
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
                </ImageBackground>
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
  pickLabel: { color: '#9A9A9A', fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.5, marginBottom: 10 },
  charRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  charCard: { flex: 1, height: 150, borderRadius: radius.md, borderWidth: 2, borderColor: '#262626', overflow: 'hidden' },
  charCardActive: { borderColor: ACCENT },
  charImg: { flex: 1, justifyContent: 'flex-end', padding: 12 },
  charShade: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000044' },
  charLabel: { color: ACCENT, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1 },
  charName: { color: '#fff', fontFamily: fonts.bold, fontSize: 18 },
  charCheck: { position: 'absolute', top: 8, right: 8, backgroundColor: '#000', borderRadius: 12 },
  card: { backgroundColor: '#1A1A1A', borderRadius: radius.lg, borderWidth: 1, borderColor: '#262626', overflow: 'hidden', marginBottom: 18 },
  freeCard: { borderColor: '#3A3322' },
  cardTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 18 },
  cardSubInline: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 13, marginTop: 4 },
  lockedBg: { height: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0E0E' },
  lockBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00000088', alignItems: 'center', justifyContent: 'center' },
  quarterTag: { position: 'absolute', top: 12, right: 12, color: ACCENT, fontFamily: fonts.bold, fontSize: 12 },
  freeBg: { height: 300, justifyContent: 'space-between', backgroundColor: '#0E0E0E' },
  freeOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000055' },
  freeTop: { flexDirection: 'row', justifyContent: 'flex-end', padding: 14 },
  freeBottom: { padding: 16, backgroundColor: 'rgba(0,0,0,0.55)' },
  freeTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 24 },
  freeSub: { color: '#D9D9D9', fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
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
