import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, isLessonUnlocked } from '../../src/state';
import { moduleById } from '../../src/data/modules';
import { Small } from '../../src/components/ui';
import { colors, radius, fonts } from '../../src/theme';

const typeEmoji: Record<string, string> = {
  vocab: '🃏',
  quiz: '❓',
  dialogue: '💬',
  email: '✉️',
};

export default function ModuleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress } = useApp();
  const module = moduleById(id);

  if (!module) return null;
  const completed = progress[module.id] ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Geri</Text>
        </Pressable>
        <Text style={styles.title}>{module.emoji} {module.name}</Text>
        <Small style={{ color: '#bbb' }}>{completed.length}/{module.lessons.length} ders tamamlandı</Small>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {module.lessons.map((lesson) => {
          const isDone = completed.includes(lesson.index);
          const unlocked = isLessonUnlocked(progress, module.id, lesson.index);
          return (
            <Pressable
              key={lesson.id}
              disabled={!unlocked}
              onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
              style={[styles.lesson, !unlocked && { opacity: 0.45 }]}
            >
              <View style={[styles.badge, isDone && { backgroundColor: colors.success }]}>
                <Text style={{ fontSize: 20 }}>
                  {isDone ? '✓' : unlocked ? typeEmoji[lesson.type] : '🔒'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Small style={{ marginTop: 2 }}>
                  {isDone ? 'Tamamlandı' : unlocked ? 'Başlamak için dokun' : 'Önceki dersi bitir'}
                </Small>
              </View>
            </Pressable>
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
    paddingBottom: 22,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    gap: 6,
  },
  back: { fontFamily: fonts.medium, fontSize: 15, color: colors.accent, marginBottom: 8 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: '#fff' },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary },
});
