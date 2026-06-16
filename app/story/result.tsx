import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { endingFor } from '../../src/data/story';
import { characterImage } from '../../src/data/characters';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { fonts, radius } from '../../src/theme';

const BG = '#0a0a0f';
const PURPLE = '#7C3AED';
const GOLD = '#FFC83D';

export default function StoryResult() {
  const { story: storyParam } = useLocalSearchParams<{ story: string }>();
  const storyId = storyParam ?? 'career';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { storyProgress, resetStory, profile } = useApp();
  const pandaRef = useRef<PandaHandle>(null);

  const prog = storyProgress(storyId);
  const ending = endingFor(prog.hiddenScore);
  const charImg = characterImage(profile.storyCharacter);

  useEffect(() => {
    if (ending.id !== 'fired') pandaRef.current?.celebrate();
  }, []);

  const replay = async () => {
    await resetStory(storyId);
    router.replace({ pathname: '/story/chapter', params: { story: storyId } } as any);
  };

  return (
    <ImageBackground source={charImg} style={{ flex: 1, backgroundColor: BG }} resizeMode="cover">
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <SvgGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={BG} stopOpacity="0.55" />
            <Stop offset="0.5" stopColor={BG} stopOpacity="0.85" />
            <Stop offset="1" stopColor={BG} stopOpacity="0.98" />
          </SvgGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g)" />
      </Svg>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 28, flexGrow: 1, justifyContent: 'flex-end' }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={{ alignItems: 'center' }}>
          <Panda ref={pandaRef} streak={ending.id === 'fired' ? 0 : 7} size={92} showLabel />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(150)} style={styles.kicker}>
          {ending.id === 'ceo' ? 'CEO' : ending.id === 'director' ? 'DİREKTÖR' : ending.id === 'manager' ? 'MÜDÜR' : 'SON'}
        </Animated.Text>
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
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Tekrar oyna</Text>
          </Pressable>
          {ending.id === 'fired' && (
            <Pressable style={styles.goldBtn} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.goldText}>Öğrenmeye Devam Et</Text>
            </Pressable>
          )}
          <Pressable style={styles.ghostBtn} onPress={() => router.replace('/(tabs)/story' as any)}>
            <Text style={styles.ghostText}>Story'ye dön</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  kicker: { color: GOLD, fontFamily: fonts.bold, fontSize: 13, letterSpacing: 3, textAlign: 'center', marginTop: 18 },
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 27, textAlign: 'center', marginTop: 6 },
  text: { color: '#D9D9E8', fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12 },
  details: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 18 },
  detailChip: { backgroundColor: 'rgba(124,58,237,0.20)', borderColor: PURPLE, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  detailText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: PURPLE, borderRadius: radius.md, paddingVertical: 16 },
  primaryBtnText: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  goldBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: GOLD, paddingVertical: 15 },
  goldText: { color: BG, fontFamily: fonts.bold, fontSize: 15 },
  ghostBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1.5, borderColor: '#2A2A3A', paddingVertical: 15 },
  ghostText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 15 },
});
