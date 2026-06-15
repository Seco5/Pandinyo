import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { sectors } from '../../src/data/sectors';
import { H1, Body, Button } from '../../src/components/ui';
import { colors, radius, fonts, shadow } from '../../src/theme';

export default function SectorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <H1>Hangi alanda çalışıyorsun?</H1>
        <Body style={{ marginTop: 8 }}>İçeriğini sektörüne göre seçeceğiz.</Body>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {sectors.map((s, i) => {
          const active = selected === s.id;
          return (
            <Animated.View key={s.id} entering={FadeInDown.delay(i * 50)} style={styles.cell}>
              <Pressable
                onPress={() => setSelected(s.id)}
                style={[styles.card, active && styles.cardActive]}
              >
                <Text style={styles.emoji}>{s.emoji}</Text>
                <Text style={[styles.name, active && { color: colors.onAccent }]}>{s.name}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: insets.bottom + 16 }}>
        <Button
          title="Devam et"
          disabled={!selected}
          onPress={() => router.push({ pathname: '/onboarding/level', params: { sector: selected! } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 0 },
  cell: { width: '50%', padding: 6 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 10,
    minHeight: 130,
    justifyContent: 'center',
    ...shadow,
  },
  cardActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  emoji: { fontSize: 40 },
  name: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, textAlign: 'center' },
});
