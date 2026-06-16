import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Panda, PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

// ---- Live lesson stats (cards/questions) reported by the active lesson ----
export interface LessonStats { label: string; done: number; total: number }
const StatsCtx = createContext<(s: LessonStats | null) => void>(() => {});
export function useLessonStats() {
  return useContext(StatsCtx);
}

function StatChip({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={13} color={colors.accent} />
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

export function LessonShell({
  title,
  subtitle,
  progress,
  streak,
  pandaRef,
  children,
}: {
  title: string;
  subtitle: string;
  progress: number;
  streak: number;
  pandaRef: React.RefObject<PandaHandle | null>;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [stats, setStats] = useState<LessonStats | null>(null);

  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const fill = useAnimatedStyle(() => ({ width: withTiming(`${pct}%`, { duration: 300 }) }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
          <View style={styles.barWrap}>
            <View style={styles.barTrack}>
              <Animated.View style={[styles.barFill, fill]} />
            </View>
            <Text style={styles.pct}>%{pct}</Text>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color="#FF7A45" />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <View style={styles.statsRow}>
          {subtitle ? <StatChip icon="book" text={subtitle} /> : null}
          {stats && <StatChip icon="layers" text={`${stats.done}/${stats.total} ${stats.label.toLowerCase()}`} />}
          {stats && stats.total - stats.done > 0 && (
            <StatChip icon="time" text={`${stats.total - stats.done} kaldı`} />
          )}
        </View>
      </View>

      <StatsCtx.Provider value={setStats}>
        <View style={{ flex: 1 }}>{children}</View>
      </StatsCtx.Provider>

      <View pointerEvents="none" style={[styles.pandaWrap, { bottom: insets.bottom + 96 }]}>
        <Panda ref={pandaRef} streak={streak} size={52} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF1A', alignItems: 'center', justifyContent: 'center' },
  barWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF24', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: colors.accent },
  pct: { color: '#fff', fontFamily: fonts.bold, fontSize: 12, minWidth: 34, textAlign: 'right' },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF1A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  streakText: { color: '#fff', fontFamily: fonts.bold, fontSize: 14 },
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 22, marginTop: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF14', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  chipText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 12 },
  pandaWrap: { position: 'absolute', right: 16, zIndex: 5 },
});
