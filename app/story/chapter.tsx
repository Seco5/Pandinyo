import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import {
  chaptersFor,
  challengePoints,
  retryPenalty,
  endingFor,
  CHALLENGE_PASS_THRESHOLD,
} from '../../src/data/story';
import { characterImage } from '../../src/data/characters';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { playCorrect, playWrong } from '../../src/sounds';
import { fonts, radius } from '../../src/theme';

const BG = '#0a0a0f';
const PURPLE = '#7C3AED';
const GOLD = '#FFC83D';
const CARD = '#1a1a2e';
const PURPLE_FAINT = 'rgba(124,58,237,0.20)';

const MOTIVATION = [
  'İlk adım her şeydir. Kendine güven.',
  "Keep going! You're becoming a leader.",
  'Sesini duyur — fikirlerin değerli.',
  'Detaylar fark yaratır.',
  'Değerini bil ve iste.',
  'Artık dünya sahnesindesin.',
  'Sahne senin. Parla.',
  'Kriz, gerçek liderin sınavıdır.',
  'Zirve çok yakın.',
  'Son karar. Tarihini yaz.',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Step = 'scene' | 'challenge' | 'summary' | 'choice' | 'choiceResult';

function BottomGradient() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BG} stopOpacity="0.35" />
          <Stop offset="0.45" stopColor={BG} stopOpacity="0.78" />
          <Stop offset="1" stopColor={BG} stopOpacity="0.97" />
        </SvgGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
}

export default function StoryChapterRunner() {
  const { story: storyParam } = useLocalSearchParams<{ story: string }>();
  const storyId = storyParam ?? 'career';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, storyProgress, updateStory, addStoryXP, resetStory } = useApp();
  const pandaRef = useRef<PandaHandle>(null);

  const chapters = chaptersFor(storyId);
  const initial = useMemo(() => {
    const p = storyProgress(storyId);
    return p.completed ? 0 : Math.min(p.currentChapter, chapters.length - 1);
  }, []);

  useEffect(() => {
    if (storyProgress(storyId).completed) resetStory(storyId);
  }, []);

  const [chapterIndex, setChapterIndex] = useState(initial);
  const [step, setStep] = useState<Step>('scene');

  const [attempts, setAttempts] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);

  const chapter = chapters[chapterIndex];
  const isLast = chapterIndex === chapters.length - 1;
  const charImg = characterImage(profile.storyCharacter);

  const shuffledOptions = useMemo(
    () => chapter.questions.map((q) => shuffle(q.options)),
    [chapterIndex, attempts]
  );
  const question = chapter.questions[qIndex];
  const correctText = question.options[question.answer];
  const answered = picked !== null;

  const resetChallenge = () => {
    setQIndex(0);
    setPicked(null);
    setCorrectCount(0);
  };
  const startChallenge = () => {
    setAttempts(1);
    resetChallenge();
    setStep('challenge');
  };
  const pick = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    if (opt === correctText) {
      setCorrectCount((c) => c + 1);
      playCorrect();
      pandaRef.current?.celebrate();
    } else {
      playWrong();
      pandaRef.current?.shake();
    }
  };
  const nextQuestion = () => {
    if (qIndex + 1 < chapter.questions.length) {
      setQIndex(qIndex + 1);
      setPicked(null);
    } else {
      setStep('summary');
    }
  };
  const retry = async () => {
    const nextAttempt = attempts + 1;
    await updateStory(storyId, (prev) => ({ ...prev, hiddenScore: prev.hiddenScore + retryPenalty(nextAttempt) }));
    setAttempts(nextAttempt);
    resetChallenge();
    setStep('challenge');
  };
  const openScene = async () => {
    await updateStory(storyId, (prev) => ({ ...prev, hiddenScore: prev.hiddenScore + challengePoints(correctCount) }));
    setChosen(null);
    setStep('choice');
  };
  const makeChoice = async (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const choice = chapter.choices[idx];
    if (choice.score >= 0) { playCorrect(); pandaRef.current?.celebrate(); } else { playWrong(); pandaRef.current?.shake(); }
    await updateStory(storyId, (prev) => {
      const hiddenScore = prev.hiddenScore + choice.score;
      const chapterResults = [
        ...prev.chapterResults.filter((r) => r.chapterIndex !== chapterIndex),
        { chapterIndex, challengeScore: correctCount, choiceMade: idx === 0 ? 'A' : 'B', attempts } as const,
      ];
      const next = {
        ...prev,
        hiddenScore,
        chapterResults,
        currentChapter: isLast ? prev.currentChapter : chapterIndex + 1,
      };
      if (isLast) {
        next.completed = true;
        next.finalEnding = endingFor(hiddenScore).id;
        next.completedAt = new Date().toISOString();
      }
      return next;
    });
    await addStoryXP(isLast ? 550 : 50);
    setTimeout(() => setStep('choiceResult'), 650);
  };
  const goNext = () => {
    if (isLast) {
      router.replace({ pathname: '/story/result', params: { story: storyId } } as any);
      return;
    }
    setChapterIndex(chapterIndex + 1);
    setChosen(null);
    setStep('scene');
  };

  const passed = correctCount >= CHALLENGE_PASS_THRESHOLD;
  const showGoalCard = step === 'scene' || step === 'challenge';

  return (
    <ImageBackground source={charImg} style={{ flex: 1, backgroundColor: BG }} resizeMode="cover">
      <BottomGradient />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
            <Text style={styles.brand}>Pandinyo</Text>
          </Pressable>
          <View style={styles.headerRight}>
            <View style={styles.scorePill}>
              <Ionicons name="flash" size={14} color={GOLD} />
              <Text style={styles.scoreText}>{profile.totalXP}</Text>
            </View>
            <View style={styles.gearBtn}>
              <Ionicons name="settings-sharp" size={18} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.episode}>EPISODE {chapterIndex + 1} / {chapters.length}</Text>
        <Text style={styles.chapterTitle}>{chapter.title.toUpperCase()}</Text>

        {/* progress dots */}
        <View style={styles.dotsRow}>
          {chapters.map((_, i) => {
            const done = i < chapterIndex;
            const active = i === chapterIndex;
            return (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.dotLine, i <= chapterIndex && { backgroundColor: GOLD }]} />}
                <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                  {done ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
                </View>
              </React.Fragment>
            );
          })}
        </View>
        <Text style={styles.motivation}>{MOTIVATION[chapterIndex] ?? ''}</Text>
      </View>

      {/* GOAL CARD */}
      {showGoalCard && (
        <View style={[styles.goalCard, { top: insets.top + 150 }]} pointerEvents="none">
          <Text style={styles.goalKicker}>YOUR GOAL</Text>
          <View style={styles.goalRow}>
            <Ionicons name="trophy" size={20} color={GOLD} />
            <Text style={styles.goalName}>CEO</Text>
          </View>
          <Text style={styles.goalSub}>Answer well, earn points, climb the ladder!</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: insets.bottom + 24, paddingTop: 6, flexGrow: 1, justifyContent: 'flex-end' }}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP: SCENE */}
        {step === 'scene' && (
          <Animated.View entering={FadeIn} key="scene">
            <Text style={styles.storyText}>{chapter.story}</Text>
            <Pressable style={styles.primaryBtn} onPress={startChallenge}>
              <Text style={styles.primaryBtnText}>Devam</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </Animated.View>
        )}

        {/* STEP: CHALLENGE */}
        {step === 'challenge' && (
          <Animated.View entering={FadeIn} key={`ch-${qIndex}-${attempts}`}>
            <Bubble text={question.prompt} />
            <Divider label="CHOOSE YOUR ANSWER" />
            <View style={{ gap: 12 }}>
              {shuffledOptions[qIndex].map((o) => {
                const isPicked = picked === o;
                const isCorrect = answered && o === correctText;
                const isWrongPick = answered && isPicked && o !== correctText;
                return (
                  <Pressable
                    key={o}
                    onPress={() => pick(o)}
                    style={[styles.opt, isPicked && !answered && styles.optPicked, isCorrect && styles.optCorrect, isWrongPick && styles.optWrong]}
                  >
                    {isPicked && (
                      <Ionicons name="star" size={18} color={GOLD} style={{ marginRight: 10 }} />
                    )}
                    <Text style={styles.optText}>{o}</Text>
                  </Pressable>
                );
              })}
            </View>
            {answered && (
              <Pressable style={styles.primaryBtn} onPress={nextQuestion}>
                <Text style={styles.primaryBtnText}>
                  {qIndex + 1 < chapter.questions.length ? 'Sonraki soru' : 'Sonucu gör'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* STEP: SUMMARY */}
        {step === 'summary' && (
          <Animated.View entering={ZoomIn} key="summary" style={{ alignItems: 'center', paddingBottom: 20 }}>
            <View style={[styles.scoreRing, { borderColor: passed ? GOLD : '#EF4444' }]}>
              <Text style={styles.scoreBig}>{correctCount}/5</Text>
            </View>
            <Text style={styles.summaryTitle}>
              {correctCount === 5 ? 'Mükemmel! 🎯' : passed ? 'Geçtin! ✨' : 'Yetersiz 😕'}
            </Text>
            <Text style={styles.summarySub}>
              {passed ? 'Sahne açıldı — şimdi en önemli kısım: seçimin.' : 'Sahneyi açmak için en az 3 doğru gerek. Tekrar dene.'}
            </Text>
            {passed ? (
              <Pressable style={[styles.primaryBtn, { alignSelf: 'stretch' }]} onPress={openScene}>
                <Text style={styles.primaryBtnText}>Devam et</Text>
                <Ionicons name="lock-open" size={18} color="#fff" />
              </Pressable>
            ) : (
              <Pressable style={[styles.retryBtn, { alignSelf: 'stretch' }]} onPress={retry}>
                <Ionicons name="refresh" size={18} color={GOLD} />
                <Text style={styles.retryText}>Tekrar dene</Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* STEP: CHOICE */}
        {step === 'choice' && (
          <Animated.View entering={FadeIn} key="choice">
            <Bubble text={chapter.npc} />
            <Divider label="CHOOSE YOUR ANSWER" />
            <View style={{ gap: 12 }}>
              {chapter.choices.map((c, idx) => (
                <Pressable key={idx} style={styles.opt} onPress={() => makeChoice(idx)}>
                  <Text style={styles.optText}>{c.text}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* STEP: CHOICE RESULT */}
        {step === 'choiceResult' && chosen !== null && (
          <Animated.View entering={ZoomIn} key="cresult" style={{ alignItems: 'center', paddingBottom: 12 }}>
            <Text style={styles.resultText}>{chapter.choices[chosen].result}</Text>
            <View style={styles.xpPill}>
              <Ionicons name="star" size={15} color={GOLD} />
              <Text style={styles.xpText}>+{isLast ? 550 : 50} XP</Text>
            </View>
            <Pressable style={[styles.primaryBtn, { alignSelf: 'stretch' }]} onPress={goNext}>
              <Text style={styles.primaryBtnText}>{isLast ? 'Sonu gör' : 'Sonraki bölüm'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      <View pointerEvents="none" style={{ position: 'absolute', right: 12, bottom: insets.bottom + 6 }}>
        <Panda ref={pandaRef} streak={5} size={44} />
      </View>
    </ImageBackground>
  );
}

function Bubble({ text }: { text: string }) {
  return (
    <View style={styles.bubbleRow}>
      <View style={styles.bubbleIcon}>
        <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
      </View>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{text}</Text>
        <Ionicons name="volume-high" size={18} color="#9A9AB5" />
      </View>
    </View>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <View style={styles.divider}>
      <View style={styles.divLine} />
      <Text style={styles.divLabel}>{label}</Text>
      <View style={styles.divLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  brand: { color: '#fff', fontFamily: fonts.medium, fontSize: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scorePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: PURPLE, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  scoreText: { color: GOLD, fontFamily: fonts.bold, fontSize: 14 },
  gearBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' },
  episode: { color: GOLD, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, textAlign: 'center', marginTop: 8 },
  chapterTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 26, letterSpacing: 1, textAlign: 'center', marginTop: 2 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#2A2A3A', borderWidth: 2, borderColor: '#2A2A3A', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: GOLD, borderColor: GOLD },
  dotActive: { backgroundColor: PURPLE, borderColor: '#A78BFA' },
  dotLine: { width: 14, height: 2, backgroundColor: '#2A2A3A' },
  motivation: { color: '#D9D9E8', fontFamily: fonts.regular, fontStyle: 'italic', fontSize: 12, textAlign: 'center', marginTop: 10 },
  goalCard: { position: 'absolute', right: 16, width: 150, backgroundColor: 'rgba(20,20,35,0.85)', borderWidth: 1, borderColor: PURPLE, borderRadius: radius.md, padding: 12, zIndex: 6 },
  goalKicker: { color: '#A78BFA', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  goalName: { color: '#fff', fontFamily: fonts.bold, fontSize: 20 },
  goalSub: { color: '#9A9AB5', fontFamily: fonts.regular, fontSize: 11, marginTop: 6, lineHeight: 15 },
  storyText: { color: '#fff', fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, backgroundColor: 'rgba(20,20,35,0.6)', padding: 16, borderRadius: radius.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 18 },
  bubbleIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  bubble: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CARD, borderRadius: radius.md, padding: 16 },
  bubbleText: { color: '#fff', fontFamily: fonts.bold, fontSize: 19, lineHeight: 26, flex: 1 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.4)' },
  divLabel: { color: '#A78BFA', fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1 },
  opt: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 14, borderWidth: 1.5, borderColor: 'transparent', paddingVertical: 16, paddingHorizontal: 16 },
  optPicked: { borderColor: PURPLE, backgroundColor: PURPLE_FAINT },
  optCorrect: { borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.15)' },
  optWrong: { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.15)' },
  optText: { color: '#EDEDF5', fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, flex: 1 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: PURPLE, borderRadius: radius.md, paddingVertical: 16, marginTop: 18 },
  primaryBtnText: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: GOLD, paddingVertical: 16, marginTop: 18 },
  retryText: { color: GOLD, fontFamily: fonts.bold, fontSize: 16 },
  scoreRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(20,20,35,0.7)' },
  scoreBig: { color: '#fff', fontFamily: fonts.bold, fontSize: 34 },
  summaryTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 22, marginTop: 18 },
  summarySub: { color: '#C9C9D8', fontFamily: fonts.regular, fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22, marginBottom: 6 },
  resultText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 17, textAlign: 'center', lineHeight: 25, backgroundColor: 'rgba(20,20,35,0.7)', padding: 16, borderRadius: radius.md },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PURPLE_FAINT, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, marginTop: 14 },
  xpText: { color: GOLD, fontFamily: fonts.bold, fontSize: 14 },
});
