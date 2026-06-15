import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/state';
import { modules } from '../../src/data/modules';
import { H1, H2, Card, Small, ProgressBar } from '../../src/components/ui';
import { ActivityCalendar } from '../../src/components/ActivityCalendar';
import { colors, fonts } from '../../src/theme';

export default function Score() {
  const insets = useSafeAreaInsets();
  const { profile, progress } = useApp();

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce((s, a) => s + a.length, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        <H1>Skor</H1>

        <View style={styles.row}>
          <Metric emoji="⭐" value={profile.totalXP} label="Toplam XP" />
          <Metric emoji="💎" value={profile.diamonds} label="Elmas" />
        </View>
        <View style={styles.row}>
          <Metric emoji="🔥" value={profile.currentStreak} label="Güncel seri" />
          <Metric emoji="🏆" value={profile.longestStreak} label="En uzun seri" />
        </View>

        <Card>
          <H2>Ders ilerlemesi</H2>
          <Small style={{ marginTop: 4 }}>{completedLessons} / {totalLessons} ders</Small>
          <View style={{ marginTop: 12 }}>
            <ProgressBar value={totalLessons ? completedLessons / totalLessons : 0} />
          </View>
        </Card>

        <Card>
          <H2>Aktivite</H2>
          <Small style={{ marginTop: 4, marginBottom: 14 }}>Son 12 hafta</Small>
          <ActivityCalendar activityLog={profile.activityLog} />
        </Card>

        <Card>
          <H2>Modüller</H2>
          <View style={{ marginTop: 12, gap: 14 }}>
            {modules.map((m) => {
              const done = progress[m.id]?.length ?? 0;
              return (
                <View key={m.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.modName}>{m.emoji} {m.name}</Text>
                    <Small>{done}/{m.lessons.length}</Small>
                  </View>
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar value={done / m.lessons.length} height={8} />
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function Metric({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 22 }}>
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Small>{label}</Small>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16 },
  metricValue: { fontFamily: fonts.bold, fontSize: 26, color: colors.primary, marginTop: 6 },
  modName: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
});
