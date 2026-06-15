import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/state';
import { getContent } from '../../src/data/content';
import { sectorById } from '../../src/data/sectors';
import { H1, Small } from '../../src/components/ui';
import { colors, fonts, radius, shadow } from '../../src/theme';

export default function Words() {
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const sector = sectorById(profile.sector);
  const content = useMemo(() => getContent(profile.sector), [profile.sector]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = content.vocabulary.filter(
    (v) =>
      v.english.toLowerCase().includes(query.toLowerCase()) ||
      v.turkish.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
        <H1>Kelimeler</H1>
        <Small style={{ marginTop: 4 }}>{sector.emoji} {sector.name} · {content.vocabulary.length} kelime</Small>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Kelime ara..."
          placeholderTextColor={colors.muted}
          style={styles.search}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {filtered.map((v) => {
          const isOpen = open === v.id;
          return (
            <Pressable key={v.id} onPress={() => setOpen(isOpen ? null : v.id)} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.en}>{v.english}</Text>
                <Text style={styles.tr}>{v.turkish}</Text>
              </View>
              {isOpen && <Text style={styles.example}>“{v.example}”</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 48,
    marginTop: 16,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16, ...shadow },
  en: { fontFamily: fonts.bold, fontSize: 17, color: colors.primary },
  tr: { fontFamily: fonts.medium, fontSize: 14, color: colors.secondary },
  example: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: 10, lineHeight: 20 },
});
