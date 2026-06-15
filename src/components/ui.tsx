import React from 'react';
import {
  Text,
  TextProps,
  View,
  ViewProps,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors, radius, shadow, fonts } from '../theme';

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger' | 'success';

export function Button({
  title,
  onPress,
  variant = 'accent',
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'accent'
      ? colors.accent
      : variant === 'danger'
      ? colors.danger
      : variant === 'success'
      ? colors.success
      : 'transparent';
  const fg = variant === 'accent' ? colors.onAccent : variant === 'ghost' ? colors.primary : colors.onPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg },
        variant === 'ghost' && styles.btnGhost,
        (disabled || loading) && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function H1(props: TextProps) {
  return <Text {...props} style={[styles.h1, props.style]} />;
}
export function H2(props: TextProps) {
  return <Text {...props} style={[styles.h2, props.style]} />;
}
export function Body(props: TextProps) {
  return <Text {...props} style={[styles.body, props.style]} />;
}
export function Small(props: TextProps) {
  return <Text {...props} style={[styles.small, props.style]} />;
}

export function ProgressBar({ value, height = 12 }: { value: number; height?: number }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, borderRadius: height }]} />
    </View>
  );
}

export function StreakDots({ streak, count = 7 }: { streak: number; count?: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i < Math.min(streak, count) ? styles.dotOn : styles.dotOff]} />
      ))}
    </View>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  btn: {
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnGhost: { borderWidth: 1.5, borderColor: colors.border },
  btnText: { fontFamily: fonts.bold, fontSize: 16 },
  h1: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary },
  h2: { fontFamily: fonts.semibold, fontSize: 18, color: colors.primary },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.secondary, lineHeight: 22 },
  small: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  track: { backgroundColor: colors.border, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', backgroundColor: colors.accent },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotOn: { backgroundColor: colors.accent },
  dotOff: { backgroundColor: '#3A3A3A55' },
  pill: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: { fontFamily: fonts.bold, fontSize: 13, color: colors.onAccent },
});
