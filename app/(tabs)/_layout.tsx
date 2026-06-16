import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="words" options={{ title: 'Kelimeler' }} />
      <Tabs.Screen name="story" options={{ title: 'Story' }} />
      <Tabs.Screen name="score" options={{ title: 'Skor' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
