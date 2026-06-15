import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';
import { todayStr, addDays } from '../date';

// Renders the last `weeks` weeks as a GitHub-style contribution grid.
export function ActivityCalendar({ activityLog, weeks = 12 }: { activityLog: string[]; weeks?: number }) {
  const active = new Set(activityLog);
  const today = todayStr();
  const totalDays = weeks * 7;
  // Start so that the grid ends on today, aligned to columns of 7.
  const start = addDays(today, -(totalDays - 1));

  const columns: string[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: string[] = [];
    for (let d = 0; d < 7; d++) {
      col.push(addDays(start, w * 7 + d));
    }
    columns.push(col);
  }

  return (
    <View>
      <View style={styles.grid}>
        {columns.map((col, ci) => (
          <View key={ci} style={styles.col}>
            {col.map((day) => {
              const on = active.has(day);
              const future = day > today;
              return (
                <View
                  key={day}
                  style={[styles.cell, on ? styles.on : styles.off, future && styles.future]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Az</Text>
        <View style={[styles.cell, styles.off]} />
        <View style={[styles.cell, styles.on]} />
        <Text style={styles.legendText}>Çok</Text>
      </View>
    </View>
  );
}

const CELL = 14;
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 4 },
  col: { gap: 4 },
  cell: { width: CELL, height: CELL, borderRadius: 4 },
  on: { backgroundColor: colors.accent },
  off: { backgroundColor: colors.border },
  future: { opacity: 0.3 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  legendText: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
});
