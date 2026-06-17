import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { fonts, radius } from '../theme';

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string) => {
    setMsg(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 1500);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const node = msg ? (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.toast} pointerEvents="none">
      <Text style={styles.text}>{msg}</Text>
    </Animated.View>
  ) : null;

  return { show, node };
}

const styles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 28, alignSelf: 'center', backgroundColor: '#111111', borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 11, alignItems: 'center' },
  text: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14, textAlign: 'center' },
});
