import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/shared/theme';

type SlotProps = { slots: string[]; selected: string; onSelect: (slot: string) => void };
export function TimeSlotPicker({ slots, selected, onSelect }: SlotProps) {
  return <View style={styles.grid}>{slots.map((slot) => <TouchableOpacity key={slot} style={[styles.slot, slot === selected && styles.active]} onPress={() => onSelect(slot)}>
    <Text style={[styles.slotText, slot === selected && styles.activeText]}>{slot}</Text>
  </TouchableOpacity>)}</View>;
}

type StepperProps = { value: number; onChange: (value: number) => void; min?: number; max?: number };
export function PartySizeStepper({ value, onChange, min = 1, max = 12 }: StepperProps) {
  return <View style={styles.stepper}>
    <TouchableOpacity style={styles.stepButton} onPress={() => onChange(Math.max(min, value - 1))}><Text style={styles.stepText}>−</Text></TouchableOpacity>
    <Text style={typography.h3}>{value} {value === 1 ? 'guest' : 'guests'}</Text>
    <TouchableOpacity style={styles.stepButton} onPress={() => onChange(Math.min(max, value + 1))}><Text style={styles.stepText}>+</Text></TouchableOpacity>
  </View>;
}

type DateItem = { label: string; day: string; num: number };
type DateProps = { dates: DateItem[]; selected: string; onSelect: (date: string) => void };
export function DatePillRow({ dates, selected, onSelect }: DateProps) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{dates.map((date) => <TouchableOpacity key={date.label} style={[styles.date, date.label === selected && styles.active]} onPress={() => onSelect(date.label)}>
    <Text style={[styles.dateText, date.label === selected && styles.activeText]}>{date.day}{'\n'}{date.num}</Text>
  </TouchableOpacity>)}</ScrollView>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotText: { ...typography.caption, color: colors.text, fontSize: 13, fontWeight: '600' },
  activeText: { color: colors.white },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  stepButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  stepText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  date: { alignItems: 'center', justifyContent: 'center', width: 56, height: 64, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginRight: spacing.sm },
  dateText: { textAlign: 'center', fontSize: 13, fontWeight: '700', color: colors.text },
});
