import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors, fonts } from '../../src/theme';

function Icon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 84,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Ana Sayfa', tabBarIcon: ({ focused }) => <Icon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="words"
        options={{ title: 'Kelimeler', tabBarIcon: ({ focused }) => <Icon emoji="📚" focused={focused} /> }}
      />
      <Tabs.Screen
        name="score"
        options={{ title: 'Skor', tabBarIcon: ({ focused }) => <Icon emoji="📊" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: ({ focused }) => <Icon emoji="🐼" focused={focused} /> }}
      />
    </Tabs>
  );
}
