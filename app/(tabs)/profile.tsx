import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { exams } from '../../src/data/exams';
import { badges } from '../../src/data/badges';
import { ProgressBar } from '../../src/components/ui';
import { colors, fonts, radius } from '../../src/theme';
import { Goal } from '../../src/types';

const PANDA_HERO = require('../../src/assets/story/panda_hero.png');

const goals = [15, 30, 50];

// Colour palette for achievement badge bubbles.
const BADGE_COLORS = ['#FF7A45', '#FFC83D', '#7C3AED', '#22C55E', '#5AC8FA', '#EC4899', '#14B8A6'];

// Professional Ionicons per achievement (replaces emoji).
const BADGE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  first_lesson: 'leaf', streak_3: 'flame', streak_7: 'flame', streak_30: 'medal',
  xp_100: 'diamond', xp_500: 'rocket', module_done: 'trophy',
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setDailyGoal, updateLearning, reset } = useApp();
  const earned = new Set(profile.badges);

  const [mode, setMode] = useState<Goal>(profile.goal);
  const [draftExam, setDraftExam] = useState(profile.currentExam || 'toefl');
  const dirty = mode !== profile.goal || draftExam !== profile.currentExam;

  const saveLearning = async () => {
    await updateLearning({ goal: mode, currentExam: draftExam });
    Alert.alert('Kaydedildi', 'Öğrenme ayarların güncellendi ✓');
  };

  const confirmReset = () => {
    Alert.alert('Sıfırla', 'Tüm ilerlemen silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sıfırla', style: 'destructive', onPress: async () => { await reset(); router.replace('/onboarding/sector'); } },
    ]);
  };

  const goalPct = profile.dailyGoal > 0 ? Math.min(1, profile.xpToday / profile.dailyGoal) : 0;
  const isExam = profile.goal === 'exam';
  const modeIcon: keyof typeof Ionicons.glyphMap = isExam ? 'school' : 'briefcase';
  const modeText = isExam
    ? (exams.find((e) => e.id === profile.currentExam)?.name ?? 'Sınav Hazırlığı')
    : 'İş İngilizcesi';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* ---- HERO ---- */}
        <View style={[styles.hero, { paddingTop: insets.top + 18 }]}>
          <Image source={PANDA_HERO} style={styles.heroPanda} resizeMode="contain" />
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Canlı Mod</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.modeRow}>
            <Ionicons name={modeIcon} size={14} color="#C9C9D8" />
            <Text style={styles.modeLabel}>{modeText}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          {/* ---- STATS ---- */}
          <Text style={styles.section}>İstatistikler</Text>
          <View style={styles.statRow}>
            <StatCard bg="#7C3AED" value={profile.totalXP.toLocaleString()} label="Toplam XP" main="star" badge="flash" />
            <StatCard bg="#F5A623" value={`${profile.longestStreak}`} label="En Uzun Seri (Gün)" main="flame" badge="time" />
            <StatCard bg="#14B8A6" value={`${profile.diamonds}`} label="Elmas" main="diamond" />
          </View>

          {/* ---- BEST WORD SCORE ---- */}
          <View style={styles.bestCard}>
            <Ionicons name="trophy" size={20} color={colors.accent} />
            <Text style={styles.bestText}>Best word score</Text>
            <Text style={styles.bestValue}>{profile.bestVocabScore}/10</Text>
          </View>

          {/* ---- LEARNING SETTINGS ---- */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="school" size={18} color={colors.primary} />
              <Text style={styles.cardTitle}>Öğrenme Ayarları</Text>
            </View>
            <Text style={styles.subLabel}>Mod</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {([['business', 'İş Hayatı', 'briefcase'], ['exam', 'Eğitim Modu', 'school']] as const).map(([m, label, icon]) => {
                const on = mode === m;
                return (
                  <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, on && styles.modeBtnOn]}>
                    <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={16} color={on ? colors.onAccent : colors.primary} />
                    <Text style={[styles.modeText, on && { color: colors.onAccent }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {mode === 'exam' && (
              <View style={styles.chipWrap}>
                {exams.map((e) => {
                  const on = draftExam === e.id;
                  return (
                    <Pressable key={e.id} onPress={() => setDraftExam(e.id)} style={[styles.chip, on && styles.chipOn]}>
                      <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={15} color={on ? colors.onAccent : colors.primary} />
                      <Text style={[styles.chipText, on && { color: colors.onAccent }]}>{e.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View style={styles.warnRow}>
              <Ionicons name="information-circle-outline" size={15} color={colors.muted} />
              <Text style={styles.warn}>Mod değiştirilse de her modun ilerlemesi ayrı saklanır, kaybolmaz.</Text>
            </View>
            <Pressable style={[styles.saveBtn, !dirty && { opacity: 0.5 }]} disabled={!dirty} onPress={saveLearning}>
              <Text style={styles.saveText}>Kaydet ve Devam Et</Text>
            </Pressable>
          </View>

          {/* ---- ACHIEVEMENTS ---- */}
          <View style={styles.achHead}>
            <Text style={styles.section}>Başarımlar</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4, paddingVertical: 2 }}>
            {badges.map((b, i) => {
              const has = earned.has(b.id);
              return (
                <View key={b.id} style={[styles.badgeCard, !has && { opacity: 0.4 }]}>
                  <View style={[styles.badgeBubble, { backgroundColor: has ? BADGE_COLORS[i % BADGE_COLORS.length] : '#D1D1D6' }]}>
                    <Ionicons name={has ? (BADGE_ICONS[b.id] ?? 'ribbon') : 'lock-closed'} size={24} color="#fff" />
                  </View>
                  <Text style={styles.badgeName} numberOfLines={2}>{b.name}</Text>
                </View>
              );
            })}
          </ScrollView>

          {/* ---- DAILY GOAL ---- */}
          <View style={[styles.card, { marginTop: 18 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.cardTitle}>Günlük hedef</Text>
              <Text style={styles.goalXp}>{profile.xpToday} / {profile.dailyGoal} XP</Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <ProgressBar value={goalPct} />
            </View>
            <View style={styles.goalRow}>
              {goals.map((g) => {
                const on = profile.dailyGoal === g;
                return (
                  <Pressable key={g} onPress={() => setDailyGoal(g)} style={[styles.goalBtn, on && styles.goalBtnOn]}>
                    <Text style={[styles.goalBtnText, on && { color: colors.onAccent }]}>{g} XP</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable style={styles.resetBtn} onPress={confirmReset}>
            <Text style={styles.resetText}>İlerlemeyi sıfırla</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ bg, value, label, main, badge }: { bg: string; value: string; label: string; main: keyof typeof Ionicons.glyphMap; badge?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={styles.statIconWrap}>
        <Ionicons name={main} size={30} color="#fff" />
        {badge && (
          <View style={styles.statBadge}>
            <Ionicons name={badge} size={13} color={bg} />
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#0A0A0A',
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  heroPanda: { width: 150, height: 140 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { color: '#C9C9D8', fontFamily: fonts.medium, fontSize: 13 },
  name: { color: '#fff', fontFamily: fonts.bold, fontSize: 28, marginTop: 6 },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  modeLabel: { color: '#C9C9D8', fontFamily: fonts.regular, fontSize: 14 },
  section: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginBottom: 14 },
  statRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, borderRadius: radius.md, padding: 14, minHeight: 120, justifyContent: 'space-between' },
  statIconWrap: { width: 40, height: 40 },
  statBadge: { position: 'absolute', right: -4, top: -4, backgroundColor: '#fff', borderRadius: 9, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  statValue: { color: '#fff', fontFamily: fonts.bold, fontSize: 24, marginTop: 12 },
  statLabel: { color: '#FFFFFFDD', fontFamily: fonts.medium, fontSize: 12, marginTop: 2 },
  bestCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, paddingHorizontal: 16, marginTop: 12 },
  bestText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary, flex: 1 },
  bestValue: { fontFamily: fonts.bold, fontSize: 16, color: colors.accent },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16, marginTop: 18 },
  cardTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.primary },
  subLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, marginTop: 14, marginBottom: 8 },
  modeBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 13, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border },
  modeBtnOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  modeText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  warnRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 14 },
  warn: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17, flex: 1 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', marginTop: 14 },
  saveText: { fontFamily: fonts.bold, fontSize: 16, color: colors.onAccent },
  achHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  badgeCard: { width: 92, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', paddingVertical: 14, gap: 8 },
  badgeBubble: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  badgeName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.primary, textAlign: 'center', paddingHorizontal: 4 },
  goalXp: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  goalRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  goalBtn: { flex: 1, paddingVertical: 13, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  goalBtnOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  goalBtnText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  resetBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 10 },
  resetText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.muted },
});
