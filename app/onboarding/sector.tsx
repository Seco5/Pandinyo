import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { sectors } from '../../src/data/sectors';
import { SectorIcon } from '../../src/components/SectorIcon';
import { H1, Body, Button } from '../../src/components/ui';
import { colors, radius, fonts, shadow } from '../../src/theme';

interface Choice {
  id: string;
  name: string;
  sub: string;
  color: string;
  iconColor: string;
}

const examChoice: Choice = {
  id: 'exam',
  name: 'Sınav Hazırlığı',
  sub: 'TOEFL, IELTS, YDS, TOEIC',
  color: '#FFFBEB',
  iconColor: '#D97706',
};

export default function SectorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  const choices: Choice[] = [
    ...sectors.map((s) => ({ id: s.id, name: s.name, sub: s.sub, color: s.color, iconColor: s.iconColor })),
    examChoice,
  ];

  const onContinue = () => {
    if (!selected) return;
    if (selected === 'exam') {
      // Exam track: default sector for general content, goal preselected.
      router.push({ pathname: '/onboarding/level', params: { sector: 'tech', goal: 'exam' } });
    } else {
      router.push({ pathname: '/onboarding/level', params: { sector: selected, goal: 'business' } });
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <H1>Hangi alanda çalışıyorsun?</H1>
        <Body style={{ marginTop: 8 }}>İçeriğini seçimine göre hazırlayacağız.</Body>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {choices.map((c, i) => {
          const active = selected === c.id;
          return (
            <Animated.View key={c.id} entering={FadeInDown.delay(i * 40)}>
              <Pressable onPress={() => setSelected(c.id)} style={[styles.card, active && styles.cardActive]}>
                <View style={[styles.iconWrap, { backgroundColor: c.color }]}>
                  <SectorIcon id={c.id} color={c.iconColor} size={26} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.sub}>{c.sub}</Text>
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
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: insets.bottom + 16 }}>
        <Button title="Devam et" disabled={!selected} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    ...shadow,
  },
  cardActive: { borderColor: colors.accent },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
});
