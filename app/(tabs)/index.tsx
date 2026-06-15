import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp, isModuleUnlocked } from '../../src/state';
import { modules } from '../../src/data/modules';
import { sectorById } from '../../src/data/sectors';
import { Panda } from '../../src/components/Panda';
import { Card, Body, Small, ProgressBar, StreakDots, Button } from '../../src/components/ui';
import { colors, radius, fonts, spacing } from '../../src/theme';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, progress, streakBrokenNotice, freezeStreak } = useApp();
  const sector = sectorById(profile.sector);
  const goalPct = profile.dailyGoal > 0 ? profile.xpToday / profile.dailyGoal : 0;

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
              <Text style={styles.sector}>{sector.emoji} {sector.name}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>🔥 {profile.currentStreak} gün</Text>
                <Text style={styles.stat}>⭐ {profile.totalXP} XP</Text>
                <Text style={styles.stat}>💎 {profile.diamonds}</Text>
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

          <Text style={styles.sectionTitle}>Modüller</Text>

          {modules.map((m, i) => {
            const completed = progress[m.id]?.length ?? 0;
            const unlocked = isModuleUnlocked(progress, m.id);
            const pct = completed / m.lessons.length;
            return (
              <Animated.View key={m.id} entering={FadeInDown.delay(i * 40)}>
                <Pressable
                  disabled={!unlocked}
                  onPress={() => router.push({ pathname: '/module/[id]', params: { id: m.id } })}
                  style={[styles.module, !unlocked && { opacity: 0.5 }]}
                >
                  <View style={styles.moduleIcon}>
                    <Text style={{ fontSize: 26 }}>{unlocked ? m.emoji : '🔒'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.moduleName}>{m.name}</Text>
                    <Small style={{ marginTop: 2 }}>{completed}/{m.lessons.length} ders</Small>
                    <View style={{ marginTop: 8 }}>
                      <ProgressBar value={pct} height={8} />
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
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
  sector: { fontFamily: fonts.regular, fontSize: 13, color: '#bbb', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 14 },
  stat: { fontFamily: fonts.semibold, fontSize: 14, color: colors.accent },
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
  moduleName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
});
