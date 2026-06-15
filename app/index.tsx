import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useApp } from '../src/state';
import { Panda } from '../src/components/Panda';
import { colors, fonts } from '../src/theme';

export default function Splash() {
  const { ready, profile } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (profile.onboarded) router.replace('/(tabs)');
      else router.replace('/onboarding/sector');
    }, 1800);
    return () => clearTimeout(t);
  }, [ready, profile.onboarded]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Panda streak={profile.currentStreak || 1} size={110} />
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.logo}>
        Pandinyo
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(500).duration(600)} style={styles.tag}>
        İş İngilizcesi, her gün biraz 🐼
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: 14 },
  logo: { fontFamily: fonts.bold, fontSize: 40, color: '#fff', letterSpacing: 0.5 },
  tag: { fontFamily: fonts.regular, fontSize: 14, color: colors.accent },
});
