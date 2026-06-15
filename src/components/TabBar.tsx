import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, fonts, radius, shadow } from '../theme';

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
  score: { active: 'stats-chart', inactive: 'stats-chart-outline', label: 'Skor' },
  profile: { active: 'happy', inactive: 'happy-outline', label: 'Profil' },
};

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom > 0 ? insets.bottom - 6 : 12 }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const meta = ICONS[route.name];
          if (!meta) return null;
          const focused = state.index === index;

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
              style={({ pressed }) => [
                focused ? styles.itemActive : styles.itemInactive,
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
              hitSlop={8}
            >
              <View style={[styles.pill, focused && styles.pillActive]}>
                <Ionicons
                  name={focused ? meta.active : meta.inactive}
                  size={22}
                  color={focused ? colors.onAccent : colors.muted}
                />
                {focused && (
                  <Animated.Text
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(120)}
                    style={styles.label}
                    numberOfLines={1}
                  >
                    {meta.label}
                  </Animated.Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  itemActive: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  itemInactive: { width: 54, alignItems: 'center', justifyContent: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    gap: 8,
  },
  pillActive: {
    backgroundColor: colors.accent,
    ...shadow,
    shadowOpacity: 0.18,
    shadowColor: colors.accent,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.onAccent,
  },
});
