import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useApp } from '../src/state';
import { colors, fonts } from '../src/theme';

const icon = require('../assets/icon.png');

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
      <Animated.View entering={FadeIn.duration(700)}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
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
  container: { flex: 1, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', gap: 12 },
  icon: { width: 160, height: 160, borderRadius: 36 },
  logo: { fontFamily: fonts.bold, fontSize: 40, color: colors.primary, letterSpacing: 0.5 },
  tag: { fontFamily: fonts.regular, fontSize: 14, color: colors.secondary },
});
