import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../theme';

const DANGER = '#EF4444';
const TICK_MS = 50;

/**
 * Thin per-question countdown bar. Starts full and melts left→right as time
 * runs out. In the last 5 seconds it turns red and pulses haptics once per
 * second. Calls onExpire exactly once when it hits zero.
 *
 * `resetKey` should change on every new question to restart the countdown.
 * `paused` freezes the bar (e.g. once the question is answered).
 */
export function QuestionTimer({
  seconds,
  resetKey,
  paused,
  onExpire,
}: {
  seconds: number;
  resetKey: string | number;
  paused: boolean;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const remainingRef = useRef(seconds);
  const expiredRef = useRef(false);
  const lastHapticSec = useRef<number>(-1);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Restart whenever the question changes.
  useEffect(() => {
    remainingRef.current = seconds;
    setRemaining(seconds);
    expiredRef.current = false;
    lastHapticSec.current = -1;
  }, [resetKey, seconds]);

  useEffect(() => {
    if (paused || expiredRef.current) return;
    const id = setInterval(() => {
      const next = Math.max(0, remainingRef.current - TICK_MS / 1000);
      remainingRef.current = next;
      setRemaining(next);

      const wholeSec = Math.ceil(next);
      // Haptic pulse once per second in the final 5 seconds.
      if (next > 0 && next <= 5 && wholeSec !== lastHapticSec.current) {
        lastHapticSec.current = wholeSec;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpireRef.current();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, resetKey, seconds]);

  const pct = Math.max(0, Math.min(1, remaining / seconds));
  const danger = remaining <= 5;

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${pct * 100}%`, backgroundColor: danger ? DANGER : colors.accent },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    borderRadius: radius.pill ?? 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: { height: '100%', borderRadius: 999 },
});
