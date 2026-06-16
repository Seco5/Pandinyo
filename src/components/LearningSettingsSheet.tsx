import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../state';
import { sectors } from '../data/sectors';
import { exams } from '../data/exams';
import { SectorIcon } from './SectorIcon';
import { Button, H2, Small } from './ui';
import { Goal } from '../types';
import { colors, fonts, radius } from '../theme';

export function LearningSettingsSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { profile, updateLearning } = useApp();
  const [mode, setMode] = useState<Goal>(profile.goal);
  const [draftSector, setDraftSector] = useState(profile.sector || 'tech');
  const [draftExam, setDraftExam] = useState(profile.currentExam || 'toefl');

  // Sync draft with the latest profile each time the sheet opens.
  useEffect(() => {
    if (visible) {
      setMode(profile.goal);
      setDraftSector(profile.sector || 'tech');
      setDraftExam(profile.currentExam || 'toefl');
    }
  }, [visible]);

  const dirty = mode !== profile.goal || draftSector !== profile.sector || draftExam !== profile.currentExam;

  const save = async () => {
    await updateLearning({ goal: mode, sector: draftSector, currentExam: draftExam });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={styles.backdropFill} />
      </Pressable>
      <Animated.View
        entering={SlideInDown.duration(220)}
        exiting={SlideOutDown.duration(180)}
        style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={styles.grabber} />
        <H2>🐼 Öğrenme Ayarları</H2>

        <Small style={{ marginTop: 16, marginBottom: 8 }}>Mod</Small>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {([['business', 'İş Hayatı'], ['exam', 'Eğitim Modu']] as const).map(([m, label]) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, mode === m && styles.modeBtnActive]}>
              <Text style={[styles.modeText, mode === m && { color: colors.onAccent }]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {mode === 'business' ? (
          <>
            <Small style={{ marginTop: 16, marginBottom: 8 }}>Sektörüm</Small>
            <View style={styles.chipWrap}>
              {sectors.map((s) => {
                const on = draftSector === s.id;
                return (
                  <Pressable key={s.id} onPress={() => setDraftSector(s.id)} style={[styles.chip, on && styles.chipActive]}>
                    <SectorIcon id={s.id} color={on ? colors.onAccent : s.iconColor} size={16} />
                    <Text style={[styles.chipText, on && { color: colors.onAccent }]} numberOfLines={1}>{s.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <Small style={{ marginTop: 16, marginBottom: 8 }}>Sınavım</Small>
            <View style={styles.chipWrap}>
              {exams.map((e) => {
                const on = draftExam === e.id;
                return (
                  <Pressable key={e.id} onPress={() => setDraftExam(e.id)} style={[styles.chip, on && styles.chipActive]}>
                    <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={16} color={on ? colors.onAccent : colors.primary} />
                    <Text style={[styles.chipText, on && { color: colors.onAccent }]} numberOfLines={1}>{e.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        <Button title="Kaydet" disabled={!dirty} style={{ marginTop: 18 }} onPress={save} />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backdropFill: { flex: 1, backgroundColor: '#00000066' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 14 },
  modeBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  modeText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, maxWidth: 150 },
});
