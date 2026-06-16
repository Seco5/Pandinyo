import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import {
  chaptersFor,
  challengePoints,
  retryPenalty,
  endingFor,
  CHALLENGE_PASS_THRESHOLD,
} from '../../src/data/story';
import { StoryScene } from '../../src/components/StoryScene';
import { Panda, PandaHandle } from '../../src/components/Panda';
import { playCorrect, playWrong } from '../../src/sounds';
import { fonts, radius } from '../../src/theme';

const BG = '#111111';
const ACCENT = '#FFC83D';
const CARD = '#1A1A1A';
const BORDER = '#2A2A2A';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Step = 'scene' | 'challenge' | 'summary' | 'choice' | 'choiceResult';

export default function StoryChapterRunner() {
  const { story: storyParam } = useLocalSearchParams<{ story: string }>();
  const storyId = storyParam ?? 'career';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { storyProgress, updateStory, addStoryXP, resetStory } = useApp();
  const pandaRef = useRef<PandaHandle>(null);

  const chapters = chaptersFor(storyId);
  const initial = useMemo(() => {
    const p = storyProgress(storyId);
    return p.completed ? 0 : Math.min(p.currentChapter, chapters.length - 1);
  }, []);

  // If the story was completed, replaying resets the hidden score.
  useEffect(() => {
    if (storyProgress(storyId).completed) resetStory(storyId);
  }, []);

  const [chapterIndex, setChapterIndex] = useState(initial);
  const [step, setStep] = useState<Step>('scene');

  // challenge state
  const [attempts, setAttempts] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  // choice state
  const [chosen, setChosen] = useState<number | null>(null);

  const chapter = chapters[chapterIndex];
  const isLast = chapterIndex === chapters.length - 1;

  // shuffled options for the current question + attempt
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
    // passed the challenge — award hidden challenge points once
    await updateStory(storyId, (prev) => ({ ...prev, hiddenScore: prev.hiddenScore + challengePoints(correctCount) }));
    setChosen(null);
    setStep('choice');
  };

  const makeChoice = async (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const choice = chapter.choices[idx];
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
    await addStoryXP(isLast ? 550 : 50); // +50 chapter, +500 completion bonus on the last
    pandaRef.current?.celebrate();
    setStep('choiceResult');
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

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* top bar */}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle}>Bölüm {chapterIndex + 1} / {chapters.length}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 28 }} showsVerticalScrollIndicator={false}>
        {/* ---- STEP: SCENE ---- */}
        {step === 'scene' && (
          <Animated.View entering={FadeIn} key="scene">
            <StoryScene scene={chapter.scene} revealed={false} height={210} />
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.storyText}>{chapter.story}</Text>
            <Pressable style={styles.primaryBtn} onPress={startChallenge}>
              <Text style={styles.primaryBtnText}>Devam</Text>
              <Ionicons name="arrow-forward" size={18} color={BG} />
            </Pressable>
          </Animated.View>
        )}

        {/* ---- STEP: CHALLENGE ---- */}
        {step === 'challenge' && (
          <Animated.View entering={FadeIn} key={`ch-${qIndex}-${attempts}`}>
            <Text style={styles.kicker}>{chapter.challengeIntro}</Text>
            <View style={styles.dots}>
              {chapter.questions.map((_, i) => (
                <View key={i} style={[styles.dot, i === qIndex && styles.dotActive, i < qIndex && styles.dotDone]} />
              ))}
            </View>
            <Text style={styles.qText}>{question.prompt}</Text>
            <View style={{ gap: 10, marginTop: 14 }}>
              {shuffledOptions[qIndex].map((o) => {
                const isCorrect = answered && o === correctText;
                const isWrongPick = answered && o === picked && o !== correctText;
                return (
                  <Pressable
                    key={o}
                    onPress={() => pick(o)}
                    style={[styles.opt, isCorrect && styles.optCorrect, isWrongPick && styles.optWrong]}
                  >
                    <Text style={[styles.optText, (isCorrect || isWrongPick) && { color: '#fff' }]}>{o}</Text>
                  </Pressable>
                );
              })}
            </View>
            {answered && (
              <Pressable style={styles.primaryBtn} onPress={nextQuestion}>
                <Text style={styles.primaryBtnText}>
                  {qIndex + 1 < chapter.questions.length ? 'Sonraki soru' : 'Sonucu gör'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={BG} />
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* ---- STEP: SUMMARY ---- */}
        {step === 'summary' && (
          <Animated.View entering={ZoomIn} key="summary" style={{ alignItems: 'center', paddingTop: 30 }}>
            <View style={[styles.scoreRing, { borderColor: passed ? ACCENT : '#EF4444' }]}>
              <Text style={styles.scoreBig}>{correctCount}/5</Text>
            </View>
            <Text style={styles.summaryTitle}>
              {correctCount === 5 ? 'Mükemmel! 🎯' : passed ? 'Geçtin! ✨' : 'Yetersiz 😕'}
            </Text>
            <Text style={styles.summarySub}>
              {passed ? 'Sahne açılıyor — şimdi en önemli kısım: seçimin.' : 'Sahneyi açmak için en az 3 doğru gerekiyor. Tekrar dene.'}
            </Text>
            {passed ? (
              <Pressable style={[styles.primaryBtn, { alignSelf: 'stretch' }]} onPress={openScene}>
                <Text style={styles.primaryBtnText}>Sahneyi aç</Text>
                <Ionicons name="lock-open" size={18} color={BG} />
              </Pressable>
            ) : (
              <Pressable style={[styles.retryBtn, { alignSelf: 'stretch' }]} onPress={retry}>
                <Ionicons name="refresh" size={18} color={ACCENT} />
                <Text style={styles.retryText}>Tekrar dene</Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* ---- STEP: CHOICE ---- */}
        {step === 'choice' && (
          <Animated.View entering={FadeIn} key="choice">
            <StoryScene scene={chapter.scene} revealed height={190} />
            <View style={styles.npcBubble}>
              <Ionicons name="person-circle" size={22} color={ACCENT} />
              <Text style={styles.npcText}>{chapter.npc}</Text>
            </View>
            <Text style={styles.kicker}>Ne cevap verirsin?</Text>
            <View style={{ gap: 12, marginTop: 12 }}>
              {chapter.choices.map((c, idx) => (
                <Pressable key={idx} style={styles.choiceBtn} onPress={() => makeChoice(idx)}>
                  <Text style={styles.choiceText}>{c.text}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* ---- STEP: CHOICE RESULT ---- */}
        {step === 'choiceResult' && chosen !== null && (
          <Animated.View entering={ZoomIn} key="cresult" style={{ alignItems: 'center', paddingTop: 24 }}>
            <StoryScene scene={chapter.scene} revealed height={170} />
            <Text style={styles.resultText}>{chapter.choices[chosen].result}</Text>
            <View style={styles.xpPill}>
              <Ionicons name="star" size={15} color={ACCENT} />
              <Text style={styles.xpText}>+{isLast ? 550 : 50} XP</Text>
            </View>
            <Pressable style={[styles.primaryBtn, { alignSelf: 'stretch' }]} onPress={goNext}>
              <Text style={styles.primaryBtnText}>{isLast ? 'Sonu gör' : 'Sonraki bölüm'}</Text>
              <Ionicons name="arrow-forward" size={18} color={BG} />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      <View pointerEvents="none" style={[styles.pandaWrap, { bottom: insets.bottom + 16 }]}>
        <Panda ref={pandaRef} streak={5} size={48} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF14', alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14 },
  chapterTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 24, marginTop: 18 },
  storyText: { color: '#C9C9C9', fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, marginTop: 10 },
  kicker: { color: ACCENT, fontFamily: fonts.semibold, fontSize: 13 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 12 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#2A2A2A' },
  dotActive: { backgroundColor: ACCENT },
  dotDone: { backgroundColor: '#5A5024' },
  qText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26, marginTop: 16 },
  opt: { backgroundColor: CARD, borderRadius: radius.md, borderWidth: 1.5, borderColor: BORDER, padding: 15 },
  optCorrect: { backgroundColor: '#16341F', borderColor: '#22C55E' },
  optWrong: { backgroundColor: '#3A1A1A', borderColor: '#EF4444' },
  optText: { color: '#E5E5E5', fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 16, marginTop: 22 },
  primaryBtnText: { color: BG, fontFamily: fonts.bold, fontSize: 16 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'transparent', borderRadius: radius.md, borderWidth: 1.5, borderColor: ACCENT, paddingVertical: 16, marginTop: 22 },
  retryText: { color: ACCENT, fontFamily: fonts.bold, fontSize: 16 },
  scoreRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  scoreBig: { color: '#fff', fontFamily: fonts.bold, fontSize: 34 },
  summaryTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 22, marginTop: 18 },
  summarySub: { color: '#9A9A9A', fontFamily: fonts.regular, fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22, marginBottom: 6 },
  npcBubble: { flexDirection: 'row', gap: 10, backgroundColor: CARD, borderRadius: radius.md, borderWidth: 1, borderColor: BORDER, padding: 14, marginTop: 16, alignItems: 'flex-start' },
  npcText: { color: '#fff', fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, flex: 1 },
  choiceBtn: { backgroundColor: CARD, borderRadius: radius.md, borderWidth: 1.5, borderColor: BORDER, padding: 16 },
  choiceText: { color: '#E5E5E5', fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  resultText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 17, textAlign: 'center', lineHeight: 25, marginTop: 20 },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ACCENT + '22', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, marginTop: 14 },
  xpText: { color: ACCENT, fontFamily: fonts.bold, fontSize: 14 },
  pandaWrap: { position: 'absolute', right: 14, zIndex: 5 },
});
