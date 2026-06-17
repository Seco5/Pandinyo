import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { phraseCategories, searchPhrases } from '../../src/data/phrases';
import { PhraseCard } from '../../src/components/PhraseCard';
import { useToast } from '../../src/components/Toast';
import { H1, Small } from '../../src/components/ui';
import { colors, fonts, radius } from '../../src/theme';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  meeting: 'people', online_meeting: 'videocam', email: 'mail', phone: 'call',
  interview: 'clipboard', salary: 'cash', presentation: 'easel', office: 'business',
};

export default function PhrasesTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show, node } = useToast();
  const [query, setQuery] = useState('');

  const results = searchPhrases(query);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <H1>Hazır Kalıplar</H1>
            <Small style={{ marginTop: 4 }}>İş hayatında hemen kullan</Small>
          </View>
          <Pressable style={styles.favBtn} onPress={() => router.push('/phrases/favorites' as any)} hitSlop={8}>
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.favBtnText}>Favorilerim</Text>
          </Pressable>
        </View>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tüm kalıplarda ara..."
            placeholderTextColor={colors.muted}
            style={styles.search}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {query.trim() ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Small>{results.length} sonuç</Small>
          {results.map((p) => (
            <PhraseCard
              key={p.id}
              id={p.id}
              english={p.english}
              turkish={p.turkish}
              context={p.context}
              accent={p.categoryColor}
              sourceLabel={p.categoryTitle}
              onCopied={() => show('Kopyalandı ✓')}
            />
          ))}
          {results.length === 0 && <Small style={{ textAlign: 'center', marginTop: 24 }}>Sonuç bulunamadı.</Small>}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {phraseCategories.map((c, i) => (
              <Animated.View key={c.id} entering={FadeInDown.delay(i * 40)} style={styles.gridItem}>
                <Pressable
                  style={[styles.catCard, { backgroundColor: c.color }]}
                  onPress={() => router.push({ pathname: '/phrases/[id]', params: { id: c.id } } as any)}
                >
                  <View style={styles.catIcon}>
                    <Ionicons name={CATEGORY_ICONS[c.id] ?? 'chatbubbles'} size={22} color="#fff" />
                  </View>
                  <Text style={styles.catTitle}>{c.title}</Text>
                  <Text style={styles.catCount}>{c.phrases.length} kalıp</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}
      {node}
    </View>
  );
}

const styles = StyleSheet.create({
  favBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
  favBtnText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 14, height: 48, marginTop: 16 },
  search: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 14 },
  catCard: { borderRadius: radius.md, padding: 16, minHeight: 120, justifyContent: 'space-between' },
  catIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF2A', alignItems: 'center', justifyContent: 'center' },
  catTitle: { fontFamily: fonts.bold, fontSize: 16, color: '#fff', marginTop: 14 },
  catCount: { fontFamily: fonts.medium, fontSize: 12, color: '#FFFFFFDD', marginTop: 2 },
});
