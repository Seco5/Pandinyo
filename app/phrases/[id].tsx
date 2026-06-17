import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { categoryById } from '../../src/data/phrases';
import { PhraseCard } from '../../src/components/PhraseCard';
import { useToast } from '../../src/components/Toast';
import { colors, fonts, radius } from '../../src/theme';

export default function PhraseCategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show, node } = useToast();
  const [query, setQuery] = useState('');

  const category = categoryById(id);
  if (!category) return null;

  const q = query.trim().toLowerCase();
  const phrases = q
    ? category.phrases.filter((p) => p.english.toLowerCase().includes(q) || p.turkish.toLowerCase().includes(q))
    : category.phrases;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: category.color, paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backText}>Geri</Text>
        </Pressable>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.count}>{category.phrases.length} kalıp</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: -18 }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Bu kategoride ara..."
            placeholderTextColor={colors.muted}
            style={styles.search}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 14, gap: 12, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {phrases.map((p) => (
          <PhraseCard
            key={p.id}
            id={p.id}
            english={p.english}
            turkish={p.turkish}
            context={p.context}
            accent={category.color}
            onCopied={() => show('Kopyalandı ✓')}
          />
        ))}
        {phrases.length === 0 && <Text style={styles.empty}>Eşleşen kalıp yok.</Text>}
      </ScrollView>
      {node}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backText: { color: '#fff', fontFamily: fonts.medium, fontSize: 15 },
  title: { color: '#fff', fontFamily: fonts.bold, fontSize: 24 },
  count: { color: '#FFFFFFDD', fontFamily: fonts.medium, fontSize: 13, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 14, height: 48 },
  search: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 24 },
});
