import React, { useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp, workKey } from '../../src/state';
import { richLesson } from '../../src/data/full';
import { LessonShell } from '../../src/components/lessons/LessonShell';
import { VocabLesson } from '../../src/components/lessons/VocabLesson';
import { DialogueLesson } from '../../src/components/lessons/DialogueLesson';
import { EmailLesson } from '../../src/components/lessons/EmailLesson';
import { FillInBlankLesson } from '../../src/components/lessons/FillInBlankLesson';
import { InterviewQALesson } from '../../src/components/lessons/InterviewQALesson';
import { StrategyDialogueLesson } from '../../src/components/lessons/StrategyDialogueLesson';
import { ExpressionMatchLesson } from '../../src/components/lessons/ExpressionMatchLesson';
import { PresentationFlowLesson } from '../../src/components/lessons/PresentationFlowLesson';
import { PandaHandle } from '../../src/components/Panda';

export default function LearnLessonRunner() {
  const { sector, module: moduleId, lessonId } = useLocalSearchParams<{ sector: string; module: string; lessonId: string }>();
  const router = useRouter();
  const { profile, completeLesson } = useApp();
  const pandaRef = useRef<PandaHandle>(null);
  const [progress, setProgress] = useState(0.02);

  const found = richLesson(sector, moduleId, lessonId);
  if (!found) return <View><Text>Ders bulunamadı</Text></View>;
  const { module, lesson, index } = found;

  const learned =
    lesson.type === 'flashcard'
      ? (lesson.vocab ?? []).map((v) => `${v.english} — ${v.turkish}`)
      : lesson.type === 'expressionMatch'
      ? (lesson.expressions ?? []).map((e) => `${e.english} — ${e.turkish}`)
      : lesson.type === 'interviewQA'
      ? (lesson.questions ?? []).flatMap((q) => q.keyPhrases)
      : [lesson.title];

  const onFinish = async (correct: number, total: number, mistakes: string[]) => {
    const reward = await completeLesson(workKey(sector, moduleId), index, correct, total, mistakes);
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

  const shared = { pandaRef, setProgress, onFinish };

  return (
    <LessonShell
      title={lesson.title}
      subtitle={module.title}
      progress={progress}
      streak={profile.currentStreak || 1}
      pandaRef={pandaRef}
    >
      {lesson.type === 'flashcard' && lesson.vocab && <VocabLesson cards={lesson.vocab} {...shared} />}
      {lesson.type === 'dialogue' && lesson.turns && (
        <DialogueLesson dialogue={{ id: lesson.id, title: lesson.title, turns: lesson.turns }} {...shared} />
      )}
      {lesson.type === 'emailWrite' && lesson.referenceEmail != null && (
        <EmailLesson
          email={{ id: lesson.id, title: lesson.title, scenario: lesson.scenario ?? '', referenceEmail: lesson.referenceEmail }}
          {...shared}
        />
      )}
      {lesson.type === 'fillInTheBlank' && <FillInBlankLesson lesson={lesson} {...shared} />}
      {lesson.type === 'interviewQA' && <InterviewQALesson lesson={lesson} {...shared} />}
      {lesson.type === 'strategyDialogue' && <StrategyDialogueLesson lesson={lesson} {...shared} />}
      {lesson.type === 'expressionMatch' && <ExpressionMatchLesson lesson={lesson} {...shared} />}
      {lesson.type === 'presentationFlow' && <PresentationFlowLesson lesson={lesson} {...shared} />}
    </LessonShell>
  );
}
