import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { endingFor } from '../../src/data/story';
import { StoryScene } from '../../src/components/StoryScene';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { fonts, radius } from '../../src/theme';

const BG = '#111111';
const ACCENT = '#FFC83D';

export default function StoryResult() {
  const { story: storyParam } = useLocalSearchParams<{ story: string }>();
  const storyId = storyParam ?? 'career';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { storyProgress, resetStory } = useApp();
  const pandaRef = useRef<PandaHandle>(null);

  const prog = storyProgress(storyId);
  const ending = endingFor(prog.hiddenScore);

  useEffect(() => {
    if (ending.id !== 'fired') pandaRef.current?.celebrate();
  }, []);

  const replay = async () => {
    await resetStory(storyId);
    router.replace({ pathname: '/story/chapter', params: { story: storyId } } as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn}>
          <StoryScene scene={ending.scene} revealed height={230} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120)} style={{ alignItems: 'center', marginTop: 18 }}>
          <Panda ref={pandaRef} streak={ending.id === 'fired' ? 0 : 7} size={96} showLabel />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>{ending.title}</Animated.Text>
        <Animated.Text entering={FadeInDown.delay(280)} style={styles.text}>{ending.text}</Animated.Text>

        {ending.details && (
          <Animated.View entering={FadeInDown.delay(340)} style={styles.details}>
            {ending.details.map((d) => (
              <View key={d} style={styles.detailChip}><Text style={styles.detailText}>{d}</Text></View>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 28, gap: 12 }}>
          <Pressable style={styles.primaryBtn} onPress={replay}>
            <Ionicons name="refresh" size={18} color={BG} />
            <Text style={styles.primaryBtnText}>Tekrar oyna</Text>
          </Pressable>
          {ending.id === 'fired' && (
            <Pressable style={styles.ghostBtn} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.ghostText}>Öğrenmeye Devam Et</Text>
            </Pressable>
          )}
          <Pressable style={styles.ghostBtn} onPress={() => router.replace('/(tabs)/story' as any)}>
            <Text style={styles.ghostText}>Story'ye dön</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 26, textAlign: 'center', marginTop: 16 },
  text: { color: '#C9C9C9', fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12 },
  details: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 18 },
  detailChip: { backgroundColor: ACCENT + '22', borderColor: ACCENT + '55', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  detailText: { color: ACCENT, fontFamily: fonts.semibold, fontSize: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 16 },
  primaryBtnText: { color: BG, fontFamily: fonts.bold, fontSize: 16 },
  ghostBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1.5, borderColor: '#2A2A2A', paddingVertical: 15 },
  ghostText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 15 },
});
