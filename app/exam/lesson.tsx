import React, { useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../src/state';
import { examLessonById } from '../../src/data/exams';
import { LessonShell } from '../../src/components/lessons/LessonShell';
import { VocabLesson } from '../../src/components/lessons/VocabLesson';
import { QuizLesson } from '../../src/components/lessons/QuizLesson';
import { DialogueLesson } from '../../src/components/lessons/DialogueLesson';
import { EmailLesson } from '../../src/components/lessons/EmailLesson';
import { PandaHandle } from '../../src/components/Panda';

export default function ExamLessonRunner() {
  const { examId, lessonId } = useLocalSearchParams<{ examId: string; lessonId: string }>();
  const router = useRouter();
  const { profile, completeLesson } = useApp();
  const pandaRef = useRef<PandaHandle>(null);
  const [progress, setProgress] = useState(0.02);

  const found = examLessonById(examId, lessonId);
  if (!found) {
    return <View><Text>Ders bulunamadı</Text></View>;
  }
  const { exam, module, lesson } = found;
  const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);

  const learned =
    lesson.type === 'vocab'
      ? (lesson.vocab ?? []).map((v) => `${v.english} — ${v.turkish}`)
      : lesson.type === 'quiz'
      ? (lesson.questions ?? []).map((q) => q.explanation)
      : [lesson.title];

  const onFinish = async (correct: number, total: number, mistakes: string[]) => {
    const reward = await completeLesson(module.id, lessonIndex, correct, total, mistakes);
    router.replace({
      pathname: '/lesson/result',
      params: {
        correct: String(correct),
        total: String(total),
        xp: String(reward.xpEarned),
        diamonds: String(reward.newDiamonds),
        streak: String(reward.streak),
        learned: JSON.stringify(learned),
      },
    });
  };

  return (
    <LessonShell
      title={exam.name}
      subtitle={`${module.title} · ${lesson.title}`}
      progress={progress}
      streak={profile.currentStreak || 1}
      pandaRef={pandaRef}
    >
      {lesson.type === 'vocab' && lesson.vocab && (
        <VocabLesson cards={lesson.vocab} pandaRef={pandaRef} setProgress={setProgress} onFinish={onFinish} />
      )}
      {lesson.type === 'quiz' && lesson.questions && (
        <QuizLesson questions={lesson.questions} pandaRef={pandaRef} setProgress={setProgress} onFinish={onFinish} />
      )}
      {lesson.type === 'dialogue' && lesson.dialogue && (
        <DialogueLesson dialogue={lesson.dialogue} pandaRef={pandaRef} setProgress={setProgress} onFinish={onFinish} />
      )}
      {lesson.type === 'email' && lesson.email && (
        <EmailLesson email={lesson.email} pandaRef={pandaRef} setProgress={setProgress} onFinish={onFinish} />
      )}
    </LessonShell>
  );
}
