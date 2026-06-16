import React, { useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp, examKey } from '../../src/state';
import { practiceLesson } from '../../src/data/examMode';
import { examById } from '../../src/data/exams';
import { LessonShell } from '../../src/components/lessons/LessonShell';
import { QuizLesson } from '../../src/components/lessons/QuizLesson';
import { ReadingPracticeLesson } from '../../src/components/lessons/ReadingPracticeLesson';
import { WritingPracticeLesson } from '../../src/components/lessons/WritingPracticeLesson';
import { PandaHandle } from '../../src/components/Panda';

export const practiceKey = (examId: string, moduleId: string) => examKey(`practice_${examId}_${moduleId}`);

export default function PracticeRunner() {
  const { examId, module: moduleId, lessonId } = useLocalSearchParams<{ examId: string; module: string; lessonId: string }>();
  const router = useRouter();
  const { profile, completeLesson } = useApp();
  const pandaRef = useRef<PandaHandle>(null);
  const [progress, setProgress] = useState(0.02);

  const found = practiceLesson(examId, moduleId, lessonId);
  if (!found) return <View><Text>Ders bulunamadı</Text></View>;
  const { module, lesson, index } = found;

  const onFinish = async (correct: number, total: number, mistakes: string[]) => {
    const reward = await completeLesson(practiceKey(examId, moduleId), index, correct, total, mistakes);
    router.replace({
      pathname: '/lesson/result',
      params: {
        correct: String(correct),
        total: String(total),
        xp: String(reward.xpEarned),
        diamonds: String(reward.newDiamonds),
        streak: String(reward.streak),
        learned: JSON.stringify(lesson.kind === 'writing' ? [lesson.title] : (lesson.questions ?? []).map((q) => q.explanation).filter(Boolean)),
      },
    });
  };

  const shared = { pandaRef, setProgress, onFinish };

  return (
    <LessonShell
      title={examById(examId)?.name ?? 'Sınav'}
      subtitle={`${module.title} · ${lesson.title}`}
      progress={progress}
      streak={profile.currentStreak || 1}
      pandaRef={pandaRef}
    >
      {(lesson.kind === 'reading' || lesson.kind === 'listening') && (
        <ReadingPracticeLesson lesson={lesson} {...shared} />
      )}
      {lesson.kind === 'writing' && <WritingPracticeLesson lesson={lesson} {...shared} />}
      {lesson.kind === 'quiz' && lesson.questions && <QuizLesson questions={lesson.questions} {...shared} />}
    </LessonShell>
  );
}
