import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../state';
import { speakPhrase, copyPhrase } from '../phrases-util';
import { colors, fonts, radius } from '../theme';

interface Props {
  id: string;
  english: string;
  turkish: string;
  context: string;
  accent: string;
  sourceLabel?: string; // shown for search/favorite lists (category name)
  onCopied: () => void;
}

export function PhraseCard({ id, english, turkish, context, accent, sourceLabel, onCopied }: Props) {
  const { favoritePhrases, toggleFavoritePhrase } = useApp();
  const fav = favoritePhrases.includes(id);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.ctx, { backgroundColor: accent + '1A' }]}>
          <Text style={[styles.ctxText, { color: accent }]}>{context}</Text>
        </View>
        {sourceLabel ? <Text style={styles.source}>{sourceLabel}</Text> : null}
      </View>

      <Text style={styles.en}>{english}</Text>
      <Text style={styles.tr}>{turkish}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => speakPhrase(english)} hitSlop={6}>
          <Ionicons name="volume-high" size={18} color={colors.secondary} />
          <Text style={styles.actionText}>Dinle</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={async () => { await copyPhrase(english); onCopied(); }} hitSlop={6}>
          <Ionicons name="copy-outline" size={17} color={colors.secondary} />
          <Text style={styles.actionText}>Kopyala</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => toggleFavoritePhrase(id)} hitSlop={8} style={styles.heart}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#EF4444' : colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctx: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  ctxText: { fontFamily: fonts.semibold, fontSize: 11 },
  source: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  en: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary, marginTop: 12, lineHeight: 25 },
  tr: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: 6, lineHeight: 20 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontFamily: fonts.medium, fontSize: 13, color: colors.secondary },
  heart: { padding: 2 },
});
