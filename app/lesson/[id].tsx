import React, { useRef, useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp, workKey } from '../../src/state';
import { lessonById } from '../../src/data/modules';
import { getContent } from '../../src/data/content';
import { LessonShell } from '../../src/components/lessons/LessonShell';
import { VocabLesson } from '../../src/components/lessons/VocabLesson';
import { QuizLesson } from '../../src/components/lessons/QuizLesson';
import { DialogueLesson } from '../../src/components/lessons/DialogueLesson';
import { EmailLesson } from '../../src/components/lessons/EmailLesson';
import { PandaHandle } from '../../src/components/Panda';

function slice<T>(arr: T[], offset: number, n: number): T[] {
  if (arr.length === 0) return [];
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, arr.length); i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

export default function LessonRunner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, completeLesson } = useApp();
  const pandaRef = useRef<PandaHandle>(null);
  const [progress, setProgress] = useState(0.02);

  const found = lessonById(id);
  const content = useMemo(() => getContent(profile.sector), [profile.sector]);

  if (!found) {
    return <View><Text>Ders bulunamadı</Text></View>;
  }
  const { module, lesson } = found;

  const onFinish = async (correct: number, total: number, mistakes: string[]) => {
    const reward = await completeLesson(workKey(profile.sector, module.id), lesson.index, correct, total, mistakes);
    router.replace({
      pathname: '/lesson/result',
      params: {
        moduleId: module.id,
        lessonId: lesson.id,
        correct: String(correct),
        total: String(total),
        xp: String(reward.xpEarned),
        diamonds: String(reward.newDiamonds),
        streak: String(reward.streak),
        learned: JSON.stringify(deriveLearned(lesson.type)),
      },
    });
  };

  function deriveLearned(type: string): string[] {
    if (type === 'vocab') return slice(content.vocabulary, lesson.index * 5, 5).map((v) => `${v.english} — ${v.turkish}`);
    if (type === 'quiz') return slice(content.quiz, lesson.index * 5, 5).map((q) => q.explanation);
    if (type === 'dialogue') return [content.dialogues[lesson.index % content.dialogues.length]?.title ?? ''];
    return [content.emails[lesson.index % content.emails.length]?.title ?? ''];
  }

  return (
    <LessonShell
      title={`${module.emoji} ${module.name}`}
      subtitle={lesson.title}
      progress={progress}
      streak={profile.currentStreak || 1}
      pandaRef={pandaRef}
    >
      {lesson.type === 'vocab' && (
        <VocabLesson
          cards={slice(content.vocabulary, lesson.index * 5, 5)}
          pandaRef={pandaRef}
          setProgress={setProgress}
          onFinish={onFinish}
        />
      )}
      {lesson.type === 'quiz' && (
        <QuizLesson
          questions={slice(content.quiz, lesson.index * 5, 5)}
          pandaRef={pandaRef}
          setProgress={setProgress}
          onFinish={onFinish}
        />
      )}
      {lesson.type === 'dialogue' && (
        <DialogueLesson
          dialogue={content.dialogues[lesson.index % content.dialogues.length]}
          pandaRef={pandaRef}
          setProgress={setProgress}
          onFinish={onFinish}
        />
      )}
      {lesson.type === 'email' && (
        <EmailLesson
          email={content.emails[lesson.index % content.emails.length]}
          pandaRef={pandaRef}
          setProgress={setProgress}
          onFinish={onFinish}
        />
      )}
    </LessonShell>
  );
}
