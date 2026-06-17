import React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/state';
import { phraseById } from '../../src/data/phrases';
import { PhraseCard } from '../../src/components/PhraseCard';
import { useToast } from '../../src/components/Toast';
import { colors, fonts, radius } from '../../src/theme';

export default function PhraseFavorites() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favoritePhrases } = useApp();
  const { show, node } = useToast();

  const items = favoritePhrases.map((id) => phraseById(id)).filter(Boolean) as NonNullable<ReturnType<typeof phraseById>>[];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backText}>Geri</Text>
        </Pressable>
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.count}>{items.length} kalıp</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyText}>Henüz favori eklemediniz. ❤️ butonuna basarak kalıpları kaydedin.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
          {items.map(({ phrase, category }) => (
            <PhraseCard
              key={phrase.id}
              id={phrase.id}
              english={phrase.english}
              turkish={phrase.turkish}
              context={phrase.context}
              accent={category.color}
              sourceLabel={category.title}
              onCopied={() => show('Kopyalandı ✓')}
            />
          ))}
        </ScrollView>
      )}
      {node}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#EF4444', paddingHorizontal: 20, paddingBottom: 22, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backText: { color: '#fff', fontFamily: fonts.medium, fontSize: 15 },
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 24 },
  count: { color: '#FFFFFFDD', fontFamily: fonts.medium, fontSize: 13, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 50, gap: 14, marginTop: -40 },
  emptyText: { fontFamily: fonts.regular, fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
});
