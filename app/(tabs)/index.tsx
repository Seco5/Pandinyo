import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ZumrutIcon, ZUMRUT_COLOR } from '../../src/components/ZumrutIcon';
import { Ionicons } from '@expo/vector-icons';
import { useApp, workKey, moduleLessonCount } from '../../src/state';
import { modules } from '../../src/data/modules';
import { exams } from '../../src/data/exams';
import { chaptersFor } from '../../src/data/story';
import { Card, Body, Small, Button } from '../../src/components/ui';

const PANDA_HERO = require('../../src/assets/story/panda_hero.png');
import { LearningSettingsSheet } from '../../src/components/LearningSettingsSheet';
import { colors, radius, fonts } from '../../src/theme';

const HEADER_BG = '#111111';

// Per-module accent colours (left border + pastel icon bubble).
const MODULE_COLORS: Record<string, { border: string; bg: string; icon: string }> = {
  vocab: { border: '#FFC83D', bg: '#FFF4D6', icon: '#D9A300' },
  intro: { border: '#22C55E', bg: '#DCFCE7', icon: '#16A34A' },
  phone: { border: '#3B82F6', bg: '#DBEAFE', icon: '#2563EB' },
  interview: { border: '#7C3AED', bg: '#EDE9FE', icon: '#7C3AED' },
  salary: { border: '#F59E0B', bg: '#FEF3C7', icon: '#D97706' },
  meeting: { border: '#EC4899', bg: '#FCE7F3', icon: '#DB2777' },
  email: { border: '#06B6D4', bg: '#CFFAFE', icon: '#0891B2' },
  presentation: { border: '#EF4444', bg: '#FEE2E2', icon: '#DC2626' },
};
const FALLBACK_COLOR = { border: '#9A9A9A', bg: '#EEEEEE', icon: '#6B7280' };

const LEVEL_LABEL: Record<string, string> = { beginner: 'Junior', intermediate: 'Mid-Level', advanced: 'Senior' };

// Milestone icons for the "CEO Yolculuğu" strip.
const JOURNEY_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  'briefcase', 'call', 'school', 'people', 'mail', 'easel', 'trending-up', 'star', 'trophy',
];

function StatPill({ icon, custom, value, color }: { icon?: keyof typeof Ionicons.glyphMap; custom?: React.ReactNode; value: string; color: string }) {
  return (
    <View style={styles.pill}>
      {custom ?? <Ionicons name={icon!} size={15} color={color} />}
      <Text style={styles.pillText}>{value}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, progress, streakBrokenNotice, freezeStreak, storyProgress } = useApp();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const isExam = profile.goal === 'exam';

  // Pick the module the user should continue with (first incomplete, else first).
  const moduleStats = modules.map((m) => {
    const total = moduleLessonCount(profile.sector, m.id);
    const completed = progress[workKey(profile.sector, m.id)]?.length ?? 0;
    return { m, total, completed, pct: total ? completed / total : 0 };
  });
  const focus = moduleStats.find((s) => s.completed < s.total) ?? moduleStats[0];
  const focusMins = Math.max(2, (focus.total - focus.completed) * 2);

  // CEO journey progress comes from the career story.
  const story = storyProgress('career');
  const totalChapters = chaptersFor('career').length || 10;
  const journeyDone = story.completed ? totalChapters : story.currentChapter;
  const journeyPct = Math.round((journeyDone / totalChapters) * 100);

  const visibleModules = showAll ? moduleStats : moduleStats.slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* ---- HEADER ---- */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Merhaba, {profile.name} 👋</Text>
              <Text style={styles.helloSub}>Bugün yeni bir şey öğrenme zamanı!</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Pressable onPress={() => setSheetOpen(true)} style={styles.circleBtn} hitSlop={8}>
                <Ionicons name="settings-sharp" size={18} color="#fff" />
              </Pressable>
              <Pressable onPress={() => router.push('/(tabs)/story' as any)} style={styles.pandaCircle} hitSlop={8}>
                <Ionicons name="sparkles" size={18} color={colors.accent} />
              </Pressable>
            </View>
          </View>

          <View style={styles.pillRow}>
            <StatPill icon="flame" value={`${profile.currentStreak} gün`} color="#FF7A45" />
            <StatPill icon="star" value={`${profile.totalXP} XP`} color={colors.accent} />
            <StatPill custom={<ZumrutIcon size={15} />} value={`${profile.diamonds}`} color={ZUMRUT_COLOR} />
          </View>

          {/* ---- BUGÜNKÜ HEDEF (hero) ---- */}
          {!isExam && (
            <View style={styles.heroCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="locate" size={15} color="#bbb" />
                  <Text style={styles.heroKicker}>Bugünkü hedefin</Text>
                </View>
                <Text style={styles.heroTitle}>{focus.m.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.heroMins}>{focusMins} dk</Text>
                </View>
              </View>
              <Image source={PANDA_HERO} style={styles.heroPanda} resizeMode="contain" />
              <Pressable
                style={styles.continueBtn}
                onPress={() => router.push({ pathname: '/module/[id]', params: { id: focus.m.id } })}
              >
                <Ionicons name="play" size={16} color={colors.onAccent} />
                <Text style={styles.continueText}>Devam Et</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          {streakBrokenNotice && (
            <Animated.View entering={FadeInDown}>
              <Card style={{ borderColor: colors.danger, marginBottom: 16 }}>
                <Text style={styles.cardTitle}>Serin kırıldı 😢</Text>
                <Body style={{ marginTop: 4 }}>Panda seni özledi. Bir mor zümrüt ile seriyi dondurabilirsin.</Body>
                <Button
                  title={`Seriyi dondur (1 Mor Zümrüt) · Sende ${profile.diamonds}`}
                  variant="primary"
                  disabled={profile.diamonds < 1}
                  style={{ marginTop: 14 }}
                  onPress={freezeStreak}
                />
              </Card>
            </Animated.View>
          )}

          {/* ---- CEO YOLCULUĞU ---- */}
          {!isExam && (
            <Pressable style={styles.journeyCard} onPress={() => router.push('/(tabs)/story' as any)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.journeyTitle}>CEO Yolculuğu</Text>
                <Text style={styles.journeyLevel}>
                  Seviyen: <Text style={{ color: '#2563EB' }}>{LEVEL_LABEL[profile.level] ?? 'Junior'}</Text>
                </Text>
              </View>
              <View style={styles.journeyRow}>
                {JOURNEY_ICONS.map((ic, i) => {
                  const done = i < journeyDone;
                  const active = i === journeyDone;
                  const isCrown = i === JOURNEY_ICONS.length - 1;
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && <View style={[styles.jLine, i <= journeyDone && { backgroundColor: colors.accent }]} />}
                      <View
                        style={[
                          styles.jNode,
                          done && styles.jNodeDone,
                          active && styles.jNodeActive,
                        ]}
                      >
                        <Ionicons
                          name={done || active || isCrown ? ic : 'lock-closed'}
                          size={15}
                          color={done ? colors.onAccent : active ? '#fff' : colors.muted}
                        />
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
              <Text style={styles.journeyPct}>%{journeyPct}</Text>
            </Pressable>
          )}

          {/* ---- MODULES / EXAM ---- */}
          {isExam ? (
            <>
              <Text style={styles.sectionTitle}>Sınava Hazırlık</Text>
              <View style={styles.examGrid}>
                {exams.map((e) => (
                  <Pressable key={e.id} onPress={() => router.push({ pathname: '/exam/[id]', params: { id: e.id } })} style={styles.examCard}>
                    <View style={styles.examIcon}>
                      <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.onAccent} />
                    </View>
                    <Text style={styles.examName}>{e.name}</Text>
                    <Small numberOfLines={1}>{e.targetScore}</Small>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={styles.modulesHead}>
                <Text style={styles.sectionTitle}>Modüller</Text>
                <Pressable onPress={() => setShowAll((v) => !v)} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text style={styles.seeAll}>{showAll ? 'Daha az' : 'Tümünü gör'}</Text>
                  <Ionicons name={showAll ? 'chevron-up' : 'chevron-forward'} size={15} color="#2563EB" />
                </Pressable>
              </View>

              {visibleModules.map(({ m, total, completed, pct }, i) => {
                const c = MODULE_COLORS[m.id] ?? FALLBACK_COLOR;
                return (
                  <Animated.View key={m.id} entering={FadeInDown.delay(i * 40)}>
                    <Pressable
                      onPress={() => router.push({ pathname: '/module/[id]', params: { id: m.id } })}
                      style={styles.moduleCard}
                    >
                      <View style={[styles.moduleBorder, { backgroundColor: c.border }]} />
                      <View style={[styles.moduleIcon, { backgroundColor: c.bg }]}>
                        <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={22} color={c.icon} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.moduleName}>{m.name}</Text>
                        <Small style={{ marginTop: 2 }}>{completed}/{total} ders</Small>
                        <View style={styles.modTrack}>
                          <View style={[styles.modFill, { width: `${pct * 100}%`, backgroundColor: c.border }]} />
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                        <Text style={[styles.modPct, { color: c.icon }]}>%{Math.round(pct * 100)}</Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
      <LearningSettingsSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  hello: { fontFamily: fonts.bold, fontSize: 26, color: '#fff' },
  helloSub: { fontFamily: fonts.regular, fontSize: 13, color: '#9A9A9A', marginTop: 4 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  pandaCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: colors.accent, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill },
  pillText: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
  heroCard: { backgroundColor: '#1A1A1A', borderRadius: radius.md, padding: 16, marginTop: 18, overflow: 'hidden' },
  heroKicker: { fontFamily: fonts.medium, fontSize: 13, color: '#bbb' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: '#fff', marginTop: 6 },
  heroMins: { fontFamily: fonts.regular, fontSize: 13, color: '#888' },
  heroPanda: { position: 'absolute', right: 6, top: 6, width: 130, height: 118 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14, marginTop: 16 },
  continueText: { fontFamily: fonts.bold, fontSize: 16, color: colors.onAccent },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  journeyCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 8 },
  journeyTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  journeyLevel: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  journeyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  jNode: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center' },
  jNodeDone: { backgroundColor: colors.accent },
  jNodeActive: { backgroundColor: '#2563EB' },
  jLine: { flex: 1, height: 2, backgroundColor: '#E4E4E4' },
  journeyPct: { fontFamily: fonts.bold, fontSize: 14, color: colors.accent, marginTop: 10 },
  modulesHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 14 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginTop: 24, marginBottom: 14 },
  seeAll: { fontFamily: fonts.semibold, fontSize: 14, color: '#2563EB' },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingLeft: 18,
    marginBottom: 14,
    overflow: 'hidden',
  },
  moduleBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  moduleIcon: { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  moduleName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  modTrack: { height: 6, borderRadius: 3, backgroundColor: '#EEEEEE', overflow: 'hidden', marginTop: 8 },
  modFill: { height: '100%', borderRadius: 3 },
  modPct: { fontFamily: fonts.bold, fontSize: 12 },
  examGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  examCard: { width: '48%', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 6, marginBottom: 14 },
  examIcon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  examName: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
});
