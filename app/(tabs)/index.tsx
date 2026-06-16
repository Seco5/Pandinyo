import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp, isModuleUnlocked, workKey, moduleLessonCount } from '../../src/state';
import { modules } from '../../src/data/modules';
import { exams } from '../../src/data/exams';
import { sectorById } from '../../src/data/sectors';
import { Panda } from '../../src/components/Panda';
import { Card, Body, Small, ProgressBar, StreakDots, Button } from '../../src/components/ui';
import { LearningSettingsSheet } from '../../src/components/LearningSettingsSheet';
import { colors, radius, fonts, spacing } from '../../src/theme';

function StatBadge({ icon, value, color }: { icon: keyof typeof Ionicons.glyphMap; value: string; color: string }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={15} color={color} />
      <Text style={styles.badgeText}>{value}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, progress, streakBrokenNotice, freezeStreak } = useApp();
  const sector = sectorById(profile.sector);
  const goalPct = profile.dailyGoal > 0 ? profile.xpToday / profile.dailyGoal : 0;
  const [sheetOpen, setSheetOpen] = useState(false);

  const examSection = (
    <View key="exams">
      <Text style={styles.sectionTitle}>Sınava Hazırlık</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
        {exams.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => router.push({ pathname: '/exam/[id]', params: { id: e.id } })}
            style={styles.examCard}
          >
            <View style={styles.examIcon}>
              <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.onAccent} />
            </View>
            <Text style={styles.examName}>{e.name}</Text>
            <Small numberOfLines={1}>{e.targetScore}</Small>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const modulesSection = (
    <View key="modules">
      <Text style={styles.sectionTitle}>Modüller</Text>
      {modules.map((m, i) => {
        const total = moduleLessonCount(profile.sector, m.id);
        const completed = progress[workKey(profile.sector, m.id)]?.length ?? 0;
        const unlocked = isModuleUnlocked(progress, profile.sector, m.id);
        const pct = total ? completed / total : 0;
        return (
          <Animated.View key={m.id} entering={FadeInDown.delay(i * 40)}>
            <Pressable
              disabled={!unlocked}
              onPress={() => router.push({ pathname: '/module/[id]', params: { id: m.id } })}
              style={[styles.module, !unlocked && { opacity: 0.5 }]}
            >
              <View style={[styles.moduleIcon, unlocked && styles.moduleIconActive]}>
                <Ionicons
                  name={(unlocked ? m.icon : 'lock-closed') as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={unlocked ? colors.primary : colors.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleName}>{m.name}</Text>
                <Small style={{ marginTop: 2 }}>{completed}/{total} ders</Small>
                <View style={{ marginTop: 8 }}>
                  <ProgressBar value={pct} height={8} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );

  // Exam mode: only the exam cards (no sector modules). Work mode: modules first.
  const orderedSections = profile.goal === 'exam'
    ? [examSection]
    : [modulesSection, examSection];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Merhaba, {profile.name} 👋</Text>
              <Pressable onPress={() => setSheetOpen(true)} style={styles.sectorRow} hitSlop={8}>
                <Text style={styles.sector}>
                  {profile.goal === 'exam'
                    ? `📋 ${exams.find((e) => e.id === profile.currentExam)?.name ?? 'Sınav Hazırlığı'}`
                    : `${sector.emoji} ${sector.name}`}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#bbb" />
              </Pressable>
              <View style={styles.statsRow}>
                <StatBadge icon="flame" value={`${profile.currentStreak} gün`} color="#FF7A45" />
                <StatBadge icon="star" value={`${profile.totalXP} XP`} color={colors.accent} />
                <StatBadge icon="diamond" value={`${profile.diamonds}`} color="#5AC8FA" />
              </View>
              <View style={{ marginTop: 14 }}>
                <StreakDots streak={profile.currentStreak} />
              </View>
            </View>
            <Panda streak={profile.currentStreak} size={64} showLabel />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -18 }}>
          {streakBrokenNotice && (
            <Animated.View entering={FadeInDown}>
              <Card style={{ borderColor: colors.danger, marginBottom: 16 }}>
                <Text style={styles.cardTitle}>Serin kırıldı 😢</Text>
                <Body style={{ marginTop: 4 }}>Panda seni özledi. Bir elmas ile seriyi dondurabilirsin.</Body>
                <Button
                  title={`Seriyi dondur (💎 1) · Sende ${profile.diamonds}`}
                  variant="primary"
                  disabled={profile.diamonds < 1}
                  style={{ marginTop: 14 }}
                  onPress={freezeStreak}
                />
              </Card>
            </Animated.View>
          )}

          {/* Daily goal */}
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.cardTitle}>Günlük hedef</Text>
              <Small>{profile.xpToday} / {profile.dailyGoal} XP</Small>
            </View>
            <View style={{ marginTop: 12 }}>
              <ProgressBar value={goalPct} />
            </View>
            <Small style={{ marginTop: 8 }}>
              {goalPct >= 1 ? 'Bugünkü hedefini tamamladın! 🎉' : 'Bir ders daha yap, hedefe yaklaş.'}
            </Small>
          </Card>

          {orderedSections}
        </View>
      </ScrollView>
      <LearningSettingsSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 36,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  hello: { fontFamily: fonts.bold, fontSize: 24, color: '#fff' },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sector: { fontFamily: fonts.regular, fontSize: 13, color: '#bbb' },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF14',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  badgeText: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginTop: 28, marginBottom: 14 },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: spacing.lg,
  },
  moduleIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconActive: { backgroundColor: '#FFF4D6' },
  examCard: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  examIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  examName: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  moduleName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
});
