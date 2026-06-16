import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const COLORS = ['#FFC83D', '#22C55E', '#EF4444', '#5AC8FA', '#FF7A45', '#FFFFFF'];

function Piece({ index }: { index: number }) {
  const startX = Math.random() * width;
  const color = COLORS[index % COLORS.length];
  const size = 7 + Math.random() * 7;
  const duration = 2200 + Math.random() * 1500;
  const delay = Math.random() * 600;
  const drift = (Math.random() - 0.5) * 120;
  const round = index % 2 === 0;

  const progress = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.linear }));
    spin.value = withDelay(delay, withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -40 + progress.value * (height + 80) },
      { translateX: progress.value * drift },
      { rotate: `${spin.value * 360}deg` },
    ],
    opacity: progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: 0,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: round ? size / 2 : 2,
        },
        style,
      ]}
    />
  );
}

export function Confetti({ count = 70 }: { count?: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} index={i} />
      ))}
    </View>
  );
}
