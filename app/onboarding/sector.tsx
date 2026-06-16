import React, { useRef, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { H1, H2, Body, Button } from '../../src/components/ui';
import { useApp } from '../../src/state';
import { Level, Goal } from '../../src/types';
import { colors, radius, fonts } from '../../src/theme';

const levels: { id: Level; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'beginner', label: 'Başlangıç', sub: 'Temelden başlayalım', icon: 'leaf-outline' },
  { id: 'intermediate', label: 'Orta', sub: 'Biraz biliyorum', icon: 'trending-up-outline' },
  { id: 'advanced', label: 'İleri', sub: 'Akıcıya yakınım', icon: 'rocket-outline' },
];

const modeOptions: { id: Goal; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'business', label: 'İş İngilizcesi', icon: 'briefcase-outline' },
  { id: 'exam', label: 'Sınav Hazırlığı', icon: 'school-outline' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pandaRef = useRef<PandaHandle>(null);
  const { completeOnboarding } = useApp();

  const [name, setName] = useState('');
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal>('business');

  const ready = name.trim().length > 0 && level !== null;

  const finish = async () => {
    if (!ready) return;
    // Content is universal; sector is cosmetic and defaults to the first one.
    await completeOnboarding('tech', level!, name, goal);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, paddingBottom: 120, gap: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Panda ref={pandaRef} streak={3} size={84} />
        </View>
        <H1>Tanışalım 🐼</H1>
        <Body style={{ marginTop: 4 }}>Birkaç soruyla sana en uygun başlangıcı hazırlayalım.</Body>

        <H2 style={{ marginTop: 24, marginBottom: 10 }}>İsmin ne?</H2>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Adın"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          returnKeyType="done"
          style={styles.nameInput}
        />

        <H2 style={{ marginTop: 24, marginBottom: 10 }}>Seviyeni seç</H2>
        <View style={{ gap: 12 }}>
          {levels.map((l, i) => {
            const active = level === l.id;
            return (
              <Animated.View key={l.id} entering={FadeInDown.delay(i * 40)}>
                <Pressable onPress={() => setLevel(l.id)} style={[styles.card, active && styles.cardActive]}>
                  <View style={[styles.iconWrap, active && { backgroundColor: colors.accent }]}>
                    <Ionicons name={l.icon} size={24} color={active ? colors.onAccent : colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{l.label}</Text>
                    <Text style={styles.sub}>{l.sub}</Text>
                  </View>
                  <Ionicons
                    name={active ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={active ? colors.accent : colors.border}
                  />
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <H2 style={{ marginTop: 24, marginBottom: 10 }}>Önceliğin ne?</H2>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {modeOptions.map((m) => {
            const active = goal === m.id;
            return (
              <Pressable key={m.id} onPress={() => setGoal(m.id)} style={[styles.modeCard, active && styles.modeCardActive]}>
                <Ionicons name={m.icon} size={26} color={active ? colors.onAccent : colors.primary} />
                <Text style={[styles.modeText, active && { color: colors.onAccent }]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 16 }}>
        <Button title="Başla 🐼" disabled={!ready} onPress={finish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    paddingHorizontal: 16,
    height: 52,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
  },
  cardActive: { borderColor: colors.accent },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  modeCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  modeCardActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  modeText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, textAlign: 'center' },
});
