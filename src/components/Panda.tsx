import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { pandaForStreak, PandaLook } from '../panda';

export interface PandaHandle {
  celebrate: () => void;
  shake: () => void;
}

interface Props {
  streak: number;
  broken?: boolean;
  size?: number;
  style?: ViewStyle;
  showLabel?: boolean;
}

export const Panda = forwardRef<PandaHandle, Props>(function Panda(
  { streak, broken = false, size = 72, style, showLabel = false },
  ref
) {
  const look: PandaLook = pandaForStreak(streak, broken);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useImperativeHandle(ref, () => ({
    celebrate: () => {
      scale.value = withSequence(
        withSpring(1.25, { damping: 5, stiffness: 180 }),
        withSpring(1, { damping: 8 })
      );
    },
    shake: () => {
      translateX.value = withSequence(
        withTiming(-8, { duration: 50, easing: Easing.linear }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    },
  }));

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <View style={[styles.wrap, style]}>
      <Animated.View style={[styles.bubble, animStyle, look.dim && styles.dim]}>
        <Text style={{ fontSize: size }}>{look.face}</Text>
        <View style={[styles.badge, { width: size * 0.42, height: size * 0.42 }]}>
          <Text style={{ fontSize: size * 0.28 }}>{look.accessory}</Text>
        </View>
      </Animated.View>
      {showLabel && <Text style={styles.label}>{look.label}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  bubble: { alignItems: 'center', justifyContent: 'center' },
  dim: { opacity: 0.55 },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginTop: 6,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#3A3A3A',
  },
});
