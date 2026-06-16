import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { sectorById, sectors } from '../../src/data/sectors';
import { exams } from '../../src/data/exams';
import { badges } from '../../src/data/badges';
import { Panda } from '../../src/components/Panda';
import { SectorIcon } from '../../src/components/SectorIcon';
import { ActivityCalendar } from '../../src/components/ActivityCalendar';
import { H2, Card, Small, Button } from '../../src/components/ui';
import { colors, fonts, radius } from '../../src/theme';
import { Goal } from '../../src/types';

const goals = [15, 30, 50];

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setDailyGoal, updateLearning, reset } = useApp();
  const sector = sectorById(profile.sector);
  const earned = new Set(profile.badges);

  // Learning settings draft (mode + sector/exam) — applied on save.
  const [mode, setMode] = useState<Goal>(profile.goal);
  const [draftSector, setDraftSector] = useState(profile.sector || 'tech');
  const [draftExam, setDraftExam] = useState(profile.currentExam || 'toefl');
  const dirty = mode !== profile.goal || draftSector !== profile.sector || draftExam !== profile.currentExam;

  const saveLearning = async () => {
    await updateLearning({ goal: mode, sector: draftSector, currentExam: draftExam });
    Alert.alert('Kaydedildi', 'Öğrenme ayarların güncellendi ✓');
  };

  const confirmReset = () => {
    Alert.alert('Sıfırla', 'Tüm ilerlemen silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sıfırla',
        style: 'destructive',
        onPress: async () => {
          await reset();
          router.replace('/onboarding/sector');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Panda streak={profile.currentStreak} size={96} showLabel />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>
            {profile.goal === 'exam'
              ? `📋 ${exams.find((e) => e.id === profile.currentExam)?.name ?? 'Sınav Hazırlığı'}`
              : `${sector.emoji} ${sector.name}`}
          </Text>
        </View>

        <View style={{ padding: 20, gap: 16, marginTop: -16 }}>
          <Card>
            <View style={styles.statsRow}>
              <Stat value={profile.totalXP} label="Toplam XP" />
              <Stat value={profile.longestStreak} label="En uzun seri" />
              <Stat value={profile.diamonds} label="Elmas" />
            </View>
          </Card>

          <Card>
            <H2>🐼 Öğrenme Ayarları</H2>

            <Small style={{ marginTop: 14, marginBottom: 8 }}>Mod</Small>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {([['business', 'İş Hayatı'], ['exam', 'Eğitim Modu']] as const).map(([m, label]) => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                >
                  <Text style={[styles.modeText, mode === m && { color: colors.onAccent }]}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {mode === 'business' ? (
              <>
                <Small style={{ marginTop: 16, marginBottom: 8 }}>Sektörüm</Small>
                <View style={styles.chipWrap}>
                  {sectors.map((s) => {
                    const on = draftSector === s.id;
                    return (
                      <Pressable key={s.id} onPress={() => setDraftSector(s.id)} style={[styles.chip, on && styles.chipActive]}>
                        <SectorIcon id={s.id} color={on ? colors.onAccent : s.iconColor} size={16} />
                        <Text style={[styles.chipText, on && { color: colors.onAccent }]} numberOfLines={1}>{s.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
                <Small style={{ marginTop: 16, marginBottom: 8 }}>Sınavım</Small>
                <View style={styles.chipWrap}>
                  {exams.map((e) => {
                    const on = draftExam === e.id;
                    return (
                      <Pressable key={e.id} onPress={() => setDraftExam(e.id)} style={[styles.chip, on && styles.chipActive]}>
                        <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={16} color={on ? colors.onAccent : colors.primary} />
                        <Text style={[styles.chipText, on && { color: colors.onAccent }]} numberOfLines={1}>{e.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            <Small style={{ marginTop: 14 }}>⚠️ Mod değiştirilse de her modun ilerlemesi ayrı saklanır, kaybolmaz.</Small>
            <Button title="Kaydet ve Devam Et" disabled={!dirty} style={{ marginTop: 14 }} onPress={saveLearning} />
          </Card>

          <Card>
            <H2>Günlük hedef</H2>
            <View style={styles.goalRow}>
              {goals.map((g) => {
                const active = profile.dailyGoal === g;
                return (
                  <Pressable key={g} onPress={() => setDailyGoal(g)} style={[styles.goal, active && styles.goalActive]}>
                    <Text style={[styles.goalText, active && { color: colors.onAccent }]}>{g} XP</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card>
            <H2>Aktivite takvimi</H2>
            <Small style={{ marginTop: 4, marginBottom: 14 }}>Her dolu kare bir çalışma günün 🐼</Small>
            <ActivityCalendar activityLog={profile.activityLog} />
          </Card>

          <Card>
            <H2>Rozetler</H2>
            <View style={styles.badgeGrid}>
              {badges.map((b) => {
                const has = earned.has(b.id);
                return (
                  <View key={b.id} style={[styles.badge, !has && { opacity: 0.35 }]}>
                    <Text style={{ fontSize: 30 }}>{has ? b.emoji : '🔒'}</Text>
                    <Text style={styles.badgeName}>{b.name}</Text>
                    <Small style={{ textAlign: 'center' }}>{b.desc}</Small>
                  </View>
                );
              })}
            </View>
          </Card>

          <Button title="İlerlemeyi sıfırla" variant="ghost" onPress={confirmReset} />
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Small style={{ textAlign: 'center' }}>{label}</Small>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 34,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    gap: 8,
  },
  name: { fontFamily: fonts.bold, fontSize: 24, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: '#bbb' },
  statsRow: { flexDirection: 'row' },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.primary },
  goalRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  goal: { flex: 1, paddingVertical: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  goalActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  goalText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary },
  modeBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  modeText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, maxWidth: 150 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  badge: { width: '33.33%', alignItems: 'center', paddingVertical: 12, gap: 4 },
  badgeName: { fontFamily: fonts.semibold, fontSize: 12, color: colors.primary, textAlign: 'center' },
});
