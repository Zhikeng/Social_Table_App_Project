import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { typography } from '../theme/typography';

export function TimeSlotPicker({ slots, selected, onSelect }) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const active = slot === selected;
        return (
          <TouchableOpacity
            key={slot}
            style={[styles.slot, active && styles.slotActive]}
            onPress={() => onSelect(slot)}
          >
            <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function PartySizeStepper({ value, onChange, min = 1, max = 12 }) {
  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - 1))}
      >
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value} {value === 1 ? 'guest' : 'guests'}</Text>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.min(max, value + 1))}
      >
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function DatePillRow({ dates, selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {dates.map((d) => {
        const active = d.label === selected;
        return (
          <TouchableOpacity
            key={d.label}
            style={[styles.datePill, active && styles.slotActive]}
            onPress={() => onSelect(d.label)}
          >
            <Text style={[styles.dateDay, active && styles.slotTextActive]}>{d.day}</Text>
            <Text style={[styles.dateNum, active && styles.slotTextActive]}>{d.num}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotText: { ...typography.caption, color: colors.text, fontSize: 13, fontWeight: '600' },
  slotTextActive: { color: colors.white },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  stepperValue: typography.h3,
  datePill: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: spacing.sm,
  },
  dateDay: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  dateNum: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 2 },
});
