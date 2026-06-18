import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Panda } from '../../src/components/Panda';
import { Confetti } from '../../src/components/Confetti';
import { Button } from '../../src/components/ui';
import { colors, fonts, radius } from '../../src/theme';
import { ZumrutIcon } from '../../src/components/ZumrutIcon';

export default function Result() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const p = useLocalSearchParams<{
    correct: string; total: string; xp: string; diamonds: string; streak: string; learned: string;
  }>();

  const correct = Number(p.correct ?? 0);
  const total = Number(p.total ?? 0);
  const xp = Number(p.xp ?? 0);
  const diamonds = Number(p.diamonds ?? 0);
  const streak = Number(p.streak ?? 0);
  let learned: string[] = [];
  try { learned = JSON.parse(p.learned ?? '[]'); } catch {}

  const success = total === 0 || correct / total >= 0.6;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
      {success && <Confetti />}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(500)}>
          <Panda streak={streak || 3} size={120} />
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(150)} style={styles.title}>
          Ders tamamlandı! 🎉
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsRow}>
          <Stat label="Kazanılan" value={`+${xp} XP`} />
          <Stat label="Doğru" value={`${correct}/${total}`} />
          <Stat label="Seri" value={`${streak}🔥`} />
        </Animated.View>

        {diamonds > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.diamondRow}>
            <ZumrutIcon size={20} />
            <Text style={styles.diamond}>+{diamonds} mor zümrüt kazandın!</Text>
          </Animated.View>
        )}

        {learned.filter(Boolean).length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)} style={styles.learnedCard}>
            <Text style={styles.learnedTitle}>Bu derste öğrendiklerin</Text>
            {learned.filter(Boolean).map((l, i) => (
              <Text key={i} style={styles.learnedItem}>• {l}</Text>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: insets.bottom + 16 }}>
        <Button title="Devam et" variant="accent" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  title: { fontFamily: fonts.bold, fontSize: 26, color: '#fff', marginTop: 18 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  stat: {
    backgroundColor: '#1d1d1d',
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 92,
  },
  statValue: { fontFamily: fonts.bold, fontSize: 20, color: colors.accent },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: '#aaa', marginTop: 4 },
  diamondRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  diamond: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff' },
  learnedCard: {
    backgroundColor: '#1d1d1d',
    borderRadius: radius.lg,
    padding: 20,
    marginTop: 28,
    width: '90%',
  },
  learnedTitle: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff', marginBottom: 12 },
  learnedItem: { fontFamily: fonts.regular, fontSize: 14, color: '#ddd', marginBottom: 8, lineHeight: 20 },
});
