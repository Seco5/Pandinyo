import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: { type: 'tabPress'; target?: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

const ICONS: Record<string, { active: IconName; inactive: IconName; label: string }> = {
  index: { active: 'home', inactive: 'home-outline', label: 'Ana Sayfa' },
  words: { active: 'book', inactive: 'book-outline', label: 'Kelimeler' },
  story: { active: 'film', inactive: 'film-outline', label: 'Story' },
  score: { active: 'stats-chart', inactive: 'stats-chart-outline', label: 'Skor' },
  profile: { active: 'happy', inactive: 'happy-outline', label: 'Profil' },
};

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
      {state.routes.map((route, index) => {
        const meta = ICONS[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const tint = focused ? colors.accent : colors.muted;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
            hitSlop={6}
          >
            <Ionicons name={focused ? meta.active : meta.inactive} size={24} color={tint} />
            <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontFamily: fonts.medium, fontSize: 11 },
});
