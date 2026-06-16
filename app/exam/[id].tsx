import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { examById } from '../../src/data/exams';
import { Small } from '../../src/components/ui';
import { colors, radius, fonts } from '../../src/theme';

const typeIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  vocab: 'albums',
  quiz: 'help-circle',
  dialogue: 'chatbubble-ellipses',
  email: 'mail',
};

export default function ExamDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress } = useApp();
  const exam = examById(id);

  if (!exam) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.accent} />
          <Text style={styles.back}>Geri</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name={exam.icon as keyof typeof Ionicons.glyphMap} size={28} color={colors.accent} />
          <Text style={styles.title}>{exam.name}</Text>
        </View>
        <Small style={{ color: '#ccc', marginTop: 6 }}>{exam.description}</Small>
        <View style={styles.scorePill}>
          <Ionicons name="trophy" size={14} color={colors.onAccent} />
          <Text style={styles.scoreText}>Hedef: {exam.targetScore}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {exam.modules.map((module) => {
          const done = progress[module.id] ?? [];
          return (
            <View key={module.id} style={{ marginBottom: 26 }}>
              <View style={styles.moduleHead}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Small>{done.length}/{module.lessons.length}</Small>
              </View>
              {module.lessons.map((lesson, idx) => {
                const isDone = done.includes(idx);
                const unlocked = idx === 0 || done.includes(idx - 1);
                return (
                  <Pressable
                    key={lesson.id}
                    disabled={!unlocked}
                    onPress={() =>
                      router.push({
                        pathname: '/exam/lesson',
                        params: { examId: exam.id, lessonId: lesson.id },
                      })
                    }
                    style={[styles.lesson, !unlocked && { opacity: 0.5 }]}
                  >
                    <View style={[styles.badge, isDone && { backgroundColor: colors.success }]}>
                      <Ionicons
                        name={isDone ? 'checkmark' : unlocked ? typeIcon[lesson.type] : 'lock-closed'}
                        size={18}
                        color={isDone ? '#fff' : unlocked ? colors.primary : colors.muted}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Small style={{ marginTop: 2 }}>
                        {isDone ? 'Tamamlandı' : unlocked ? 'Başlamak için dokun' : 'Önceki dersi bitir'}
                      </Small>
                    </View>
                    {unlocked && <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  back: { fontFamily: fonts.medium, fontSize: 15, color: colors.accent },
  title: { fontFamily: fonts.bold, fontSize: 24, color: '#fff' },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 14,
  },
  scoreText: { fontFamily: fonts.bold, fontSize: 13, color: colors.onAccent },
  moduleHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  moduleTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
});
