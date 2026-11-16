import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/shared/theme';

type Props = { title: string; onBack?: () => void; right?: ReactNode };

export default function Header({ title, onBack, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? <TouchableOpacity onPress={onBack} hitSlop={10}><Ionicons name="chevron-back" size={26} color={colors.text} /></TouchableOpacity> : null}
      </View>
      <Text style={[typography.h3, styles.title]} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: colors.bg },
  side: { width: 40 },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
