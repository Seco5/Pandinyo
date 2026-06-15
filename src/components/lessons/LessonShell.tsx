import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from '../ui';
import { Panda, PandaHandle } from '../Panda';
import { colors, fonts, radius } from '../../theme';

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
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 14 }}>
            <ProgressBar value={progress} height={10} />
          </View>
          <Text style={styles.streak}>🔥 {streak}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={{ flex: 1 }}>{children}</View>

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
  topRow: { flexDirection: 'row', alignItems: 'center' },
  close: { color: '#fff', fontSize: 20, fontFamily: fonts.bold },
  streak: { color: colors.accent, fontFamily: fonts.bold, fontSize: 15 },
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 20, marginTop: 14 },
  subtitle: { color: '#bbb', fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  pandaWrap: { position: 'absolute', right: 16, zIndex: 5 },
});
