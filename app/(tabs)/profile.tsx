import React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/state';
import { sectorById } from '../../src/data/sectors';
import { badges } from '../../src/data/badges';
import { Panda } from '../../src/components/Panda';
import { ActivityCalendar } from '../../src/components/ActivityCalendar';
import { H2, Card, Small, Button } from '../../src/components/ui';
import { colors, fonts, radius } from '../../src/theme';

const goals = [15, 30, 50];

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setDailyGoal, reset } = useApp();
  const sector = sectorById(profile.sector);
  const earned = new Set(profile.badges);

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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Panda streak={profile.currentStreak} size={96} showLabel />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>{sector.emoji} {sector.name}</Text>
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
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  badge: { width: '33.33%', alignItems: 'center', paddingVertical: 12, gap: 4 },
  badgeName: { fontFamily: fonts.semibold, fontSize: 12, color: colors.primary, textAlign: 'center' },
});
