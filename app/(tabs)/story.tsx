import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Modal, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { chaptersFor, card2Unlocked, card3Unlocked } from '../../src/data/story';
import { fonts, radius } from '../../src/theme';

const BG = '#0E0E0E';
const ACCENT = '#FFC83D';

const SUIT = require('../../src/assets/story/pandinyo_suit.png');
const HERO = require('../../src/assets/story/story_hero.png');
const LADDER = require('../../src/assets/story/career_ladder.png');
const GLOBAL_LOCKED = require('../../src/assets/story/global_manager_locked.png');
const STARTUP_LOCKED = require('../../src/assets/story/startup_founder_locked.png');

// Career ladder titles, from bottom to top.
const LEVELS = ['Intern', 'Junior Analyst', 'Manager', 'Director', 'CEO'];

const CATEGORIES: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { label: 'Toplantılar', icon: 'chatbubbles', color: '#8B5CF6' },
  { label: 'E-postalar', icon: 'mail', color: '#3B82F6' },
  { label: 'Telefon', icon: 'call', color: '#22C55E' },
  { label: 'Sunumlar', icon: 'bar-chart', color: '#F97316' },
  { label: 'Müzakereler', icon: 'people', color: '#EC4899' },
];

export default function StoryTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { storyProgress, profile } = useApp();
  const [locked, setLocked] = useState<{ title: string; message: string } | null>(null);

  const prog = storyProgress('career');
  const total = chaptersFor('career').length;
  const done = prog.completed ? total : prog.currentChapter;
  const card2Open = card2Unlocked(prog.cardResult);
  const card3Open = card3Unlocked(storyProgress('career2').cardResult);

  // Career level derived from XP (1000 XP per level).
  const levelIdx = Math.min(Math.floor(profile.totalXP / 1000), LEVELS.length - 1);
  const withinXP = profile.totalXP % 1000;
  const nextTitle = LEVELS[Math.min(levelIdx + 1, LEVELS.length - 1)];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* ---- Header ---- */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            <Image source={SUIT} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Merhaba, {profile.name || 'Pandinyo'} 👋</Text>
              <Text style={styles.helloSub}>Kariyer yolculuğuna devam et!</Text>
            </View>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{profile.currentStreak}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{profile.totalXP}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ---- Hero ---- */}
          <View style={styles.hero}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.heroKicker}>STORY MODE</Text>
              <Text style={styles.heroTitle}>İngilizceyi yaşayarak öğren</Text>
              <Text style={styles.heroSub}>Toplantılara katıl, doğru seçimler yap ve kariyer basamaklarını çık.</Text>
            </View>
            <Image source={HERO} style={styles.heroImg} resizeMode="contain" />
          </View>

          {/* ---- Career level card ---- */}
          <View style={styles.levelCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelLabel}>Kariyer Seviyen</Text>
              <View style={styles.levelTrack}>
                <View style={[styles.levelFill, { width: `${(withinXP / 1000) * 100}%` }]} />
              </View>
              <Text style={styles.levelNext}>
                Sonraki hedef: <Text style={{ color: ACCENT }}>{nextTitle}</Text>
              </Text>
            </View>
            <View style={styles.levelRight}>
              <Ionicons name="ribbon" size={26} color={ACCENT} />
              <Text style={styles.levelNum}>Seviye {levelIdx + 1}</Text>
              <Text style={styles.levelXp}>{withinXP} / 1000 XP</Text>
            </View>
          </View>

          {/* ---- Categories ---- */}
          <Text style={styles.sectionTitle}>Gerçek iş senaryolarında İngilizce öğren</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((c) => (
              <View key={c.label} style={styles.cat}>
                <View style={[styles.catIcon, { backgroundColor: c.color + '22' }]}>
                  <Ionicons name={c.icon} size={22} color={c.color} />
                </View>
                <Text style={styles.catLabel} numberOfLines={1}>{c.label}</Text>
              </View>
            ))}
          </View>

          {/* ---- Main story: Sıfırdan Zirveye ---- */}
          <Animated.View entering={FadeInDown}>
            <Pressable
              style={styles.mainCard}
              onPress={() => router.push({ pathname: '/story/chapter', params: { story: 'career' } } as any)}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={styles.cardChips}>
                  <View style={styles.freePill}><Text style={styles.freePillText}>ÜCRETSİZ</Text></View>
                  <View style={styles.kademePill}><Text style={styles.kademeText}>KART 1</Text></View>
                </View>
                <Text style={styles.mainTitle}>İlk Adım</Text>
                <Text style={styles.mainDesc}>Genel Yetenek Programı. Farklı departmanları dolaş, doğru kararlar ver ve Junior ol.</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="book-outline" size={13} color="#9A9A9A" />
                  <Text style={styles.metaText}>10 Bölüm</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Ionicons name="trending-up-outline" size={13} color="#9A9A9A" />
                  <Text style={styles.metaText}>Intern → Junior</Text>
                </View>
                <View style={styles.startBtn}>
                  <Ionicons name={prog.completed ? 'refresh' : done > 0 ? 'play' : 'sparkles'} size={15} color={BG} />
                  <Text style={styles.startText}>
                    {prog.completed ? 'Tekrar oyna' : done > 0 ? `Devam et · Bölüm ${Math.min(done + 1, total)}` : 'Başla'}
                  </Text>
                </View>
              </View>
              <Image source={LADDER} style={styles.ladderImg} resizeMode="contain" />
            </Pressable>
          </Animated.View>

          {/* ---- Career chain: Card 2 & Card 3 (free, unlocked by performance) ---- */}
          <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Kariyer Serisi</Text>
          <View style={styles.lockedRow}>
            <LockedCard
              image={SUIT}
              title="Yöneticilik Yolu"
              desc="Junior → Müdür. Ekibini yönet, zor kararlar al."
              pillText={card2Open ? 'AÇILDI' : 'KART 2'}
              pillColor={card2Open ? '#22C55E' : '#8B5CF6'}
              locked={!card2Open}
              onPress={() =>
                card2Open
                  ? router.push({ pathname: '/story/chapter', params: { story: 'career2' } } as any)
                  : setLocked({ title: 'Yöneticilik Yolu', message: "Bu bölüme ulaşmak için 'İlk Adım' hikayesini Yükselen Yıldız (★★★) performansıyla tamamlamalısın." })
              }
            />
            <LockedCard
              image={LADDER}
              title="Zirveye Son Adım"
              desc="Müdür → CEO. Şirketi zirveye taşı."
              pillText={card3Open ? 'AÇILDI' : 'KART 3'}
              pillColor={card3Open ? '#22C55E' : '#8B5CF6'}
              locked={!card3Open}
              onPress={() =>
                setLocked(
                  card3Open
                    ? { title: 'Zirveye Son Adım', message: 'Tebrikler, bu hikayenin kilidini açtın! İçerik çok yakında geliyor.' }
                    : { title: 'Zirveye Son Adım', message: "Bu bölüme ulaşmak için 'Yöneticilik Yolu' hikayesini Yükselen Yıldız (★★★) performansıyla tamamlamalısın." }
                )
              }
            />
          </View>

          {/* ---- Premium stories (paid, not unlocked by progress) ---- */}
          <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Premium Hikayeler</Text>
          <View style={styles.lockedRow}>
            <LockedCard
              image={GLOBAL_LOCKED}
              title="Global Manager"
              desc="Londra ofisinde global bir ekibi yönet."
              pillText="PREMIUM"
              pillColor="#8B5CF6"
              locked
              onPress={() => setLocked({ title: 'Global Manager', message: 'Bu premium hikaye. Satın alarak kilidini açabilirsin — çok yakında!' })}
            />
            <LockedCard
              image={STARTUP_LOCKED}
              title="Startup Founder"
              desc="Kendi girişimini kur, yatırım turunu kapat."
              pillText="PREMIUM"
              pillColor="#22C55E"
              locked
              onPress={() => setLocked({ title: 'Startup Founder', message: 'Bu premium hikaye. Satın alarak kilidini açabilirsin — çok yakında!' })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Locked story bottom sheet */}
      <Modal visible={!!locked} transparent animationType="none" onRequestClose={() => setLocked(null)}>
        <Pressable style={styles.backdrop} onPress={() => setLocked(null)}>
          <Animated.View entering={FadeIn.duration(150)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        </Pressable>
        <Animated.View entering={SlideInDown.duration(220)} style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grabber} />
          <View style={styles.sheetIcon}><Ionicons name="lock-closed" size={26} color={ACCENT} /></View>
          <Text style={styles.sheetTitle}>{locked?.title}</Text>
          <Text style={styles.sheetSub}>{locked?.message}</Text>
          <Pressable style={styles.sheetBtn} onPress={() => setLocked(null)}>
            <Text style={styles.sheetBtnText}>Anladım</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
}

function LockedCard({
  image, title, desc, pillText, pillColor, locked = true, onPress,
}: {
  image: any; title: string; desc: string; pillText: string; pillColor: string; locked?: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={styles.lockedCard} onPress={onPress}>
      <ImageBackground source={image} style={styles.lockedImg} imageStyle={{ borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }} resizeMode="cover">
        <View style={styles.lockedShade} />
        <View style={styles.lockBadge}><Ionicons name={locked ? 'lock-closed' : 'lock-open'} size={16} color="#fff" /></View>
      </ImageBackground>
      <View style={{ padding: 12 }}>
        <View style={[styles.premiumPill, { backgroundColor: pillColor }]}><Text style={styles.premiumText}>{pillText}</Text></View>
        <Text style={styles.lockedTitle}>{title}</Text>
        <Text style={styles.lockedDesc} numberOfLines={2}>{desc}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1A1A1A', borderWidth: 1.5, borderColor: ACCENT },
  hello: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  helloSub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  headerStats: { flexDirection: 'row', gap: 8 },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1A1A1A', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  statEmoji: { fontSize: 12 },
  statValue: { color: ACCENT, fontFamily: fonts.bold, fontSize: 13 },
  // Hero
  hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: radius.lg, borderWidth: 1, borderColor: '#262626', padding: 16, marginBottom: 16 },
  heroKicker: { color: ACCENT, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5 },
  heroTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 22, marginTop: 6, lineHeight: 28 },
  heroSub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 13, marginTop: 6, lineHeight: 19 },
  heroImg: { width: 110, height: 110 },
  // Level card
  levelCard: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: radius.lg, borderWidth: 1, borderColor: '#262626', padding: 16, gap: 14, marginBottom: 22 },
  levelLabel: { color: '#fff', fontFamily: fonts.semibold, fontSize: 15 },
  levelTrack: { height: 8, borderRadius: 4, backgroundColor: '#2A2A2A', overflow: 'hidden', marginTop: 12 },
  levelFill: { height: '100%', borderRadius: 4, backgroundColor: ACCENT },
  levelNext: { color: '#9A9A9A', fontFamily: fonts.medium, fontSize: 12, marginTop: 10 },
  levelRight: { alignItems: 'center', justifyContent: 'center', minWidth: 86 },
  levelNum: { color: '#fff', fontFamily: fonts.bold, fontSize: 14, marginTop: 4 },
  levelXp: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 11, marginTop: 2 },
  // Categories
  sectionTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 16, marginBottom: 14 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  cat: { alignItems: 'center', width: 60 },
  catIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  catLabel: { color: '#C9C9C9', fontFamily: fonts.medium, fontSize: 10, marginTop: 6, textAlign: 'center' },
  // Main card
  mainCard: { flexDirection: 'row', backgroundColor: '#1A1710', borderRadius: radius.lg, borderWidth: 1.5, borderColor: ACCENT, padding: 16, overflow: 'hidden' },
  cardChips: { flexDirection: 'row', gap: 6 },
  freePill: { alignSelf: 'flex-start', backgroundColor: ACCENT, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  freePillText: { color: BG, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  kademePill: { alignSelf: 'flex-start', backgroundColor: '#2A2418', borderWidth: 1, borderColor: ACCENT, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  kademeText: { color: ACCENT, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  mainTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 22, marginTop: 10 },
  mainDesc: { color: '#C9C9C9', fontFamily: fonts.regular, fontSize: 13, marginTop: 6, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12 },
  metaText: { color: '#9A9A9A', fontFamily: fonts.medium, fontSize: 12 },
  metaDot: { color: '#5A5A5A', marginHorizontal: 2 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: ACCENT, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginTop: 16 },
  startText: { color: BG, fontFamily: fonts.bold, fontSize: 13 },
  ladderImg: { width: 120, height: 200, alignSelf: 'center' },
  // Locked
  lockedRow: { flexDirection: 'row', gap: 12 },
  lockedCard: { flex: 1, backgroundColor: '#161616', borderRadius: radius.lg, borderWidth: 1, borderColor: '#262626', overflow: 'hidden' },
  lockedImg: { height: 96, justifyContent: 'center', alignItems: 'center' },
  lockedShade: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000066' },
  lockBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00000099', alignItems: 'center', justifyContent: 'center' },
  premiumPill: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  premiumText: { color: '#fff', fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.5 },
  lockedTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 15, marginTop: 8 },
  lockedDesc: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 11, marginTop: 4, lineHeight: 16 },
  // Sheet
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000AA' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#1A1A1A', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: 24, alignItems: 'center' },
  grabber: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#3A3A3A', marginBottom: 18 },
  sheetIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: ACCENT + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  sheetTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 19, textAlign: 'center' },
  sheetSub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  sheetBtn: { backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 40, marginTop: 20, alignSelf: 'stretch', alignItems: 'center' },
  sheetBtnText: { color: BG, fontFamily: fonts.bold, fontSize: 15 },
});
