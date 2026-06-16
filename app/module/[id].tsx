import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp, isLessonUnlocked, workKey } from '../../src/state';
import { moduleById } from '../../src/data/modules';
import { Small } from '../../src/components/ui';
import { colors, radius, fonts } from '../../src/theme';

const typeIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  vocab: 'albums',
  quiz: 'help-circle',
  dialogue: 'chatbubble-ellipses',
  email: 'mail',
};

export default function ModuleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, profile } = useApp();
  const module = moduleById(id);

  if (!module) return null;
  const completed = progress[workKey(profile.sector, module.id)] ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.accent} />
          <Text style={styles.back}>Geri</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name={module.icon as keyof typeof Ionicons.glyphMap} size={26} color={colors.accent} />
          <Text style={styles.title}>{module.name}</Text>
        </View>
        <Small style={{ color: '#bbb' }}>{completed.length}/{module.lessons.length} ders tamamlandı</Small>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {module.lessons.map((lesson) => {
          const isDone = completed.includes(lesson.index);
          const unlocked = isLessonUnlocked(progress, profile.sector, module.id, lesson.index);
          return (
            <Pressable
              key={lesson.id}
              disabled={!unlocked}
              onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
              style={[styles.lesson, !unlocked && { opacity: 0.45 }]}
            >
              <View style={[styles.badge, isDone && { backgroundColor: colors.success }]}>
                <Ionicons
                  name={isDone ? 'checkmark' : unlocked ? typeIcon[lesson.type] : 'lock-closed'}
                  size={20}
                  color={isDone ? '#fff' : unlocked ? colors.primary : colors.muted}
                />
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
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  back: { fontFamily: fonts.medium, fontSize: 15, color: colors.accent },
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
