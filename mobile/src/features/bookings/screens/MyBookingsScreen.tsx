import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Image, Text, TouchableOpacity, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useApp } from '@/shared/context/AppContext';
import { getRestaurantById } from '@/shared/data/mockData';
import type { Booking } from '@/shared/models/types';
import { colors, radius, shadow, spacing, typography } from '@/shared/theme';

export default function MyBookingsScreen() {
  const { bookings, cancelBooking } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const filtered = bookings.filter((booking) => booking.status === tab);
  const confirmCancel = (id: string) => Alert.alert('Cancel Reservation?', 'This action cannot be undone.', [
    { text: 'Keep it', style: 'cancel' },
    { text: 'Cancel Reservation', style: 'destructive', onPress: () => cancelBooking(id) },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={typography.h1}>My Bookings</Text></View>
      <View style={styles.tabs}>{(['upcoming', 'past'] as const).map((value) => <TouchableOpacity key={value} style={[styles.tab, tab === value && styles.tabActive]} onPress={() => setTab(value)}>
        <Text style={[styles.tabText, tab === value && styles.tabTextActive]}>{value === 'upcoming' ? 'Upcoming' : 'Past'}</Text>
      </TouchableOpacity>)}</View>
      <FlatList<Booking> data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No {tab} reservations.</Text>}
        renderItem={({ item }: ListRenderItemInfo<Booking>) => {
          const restaurant = getRestaurantById(item.restaurantId);
          if (!restaurant) return null;
          return <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: item.restaurantId } })}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <View style={styles.info}><Text style={typography.h3}>{restaurant.name}</Text><Text style={typography.bodyMuted}>{item.date} · {item.time}</Text><Text style={typography.bodyMuted}>{item.partySize} guests</Text></View>
            {item.status === 'upcoming' && <TouchableOpacity style={styles.cancel} onPress={() => confirmCancel(item.id)}><Ionicons name="close" size={18} color={colors.danger} /></TouchableOpacity>}
          </TouchableOpacity>;
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
  tab: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  tabText: { fontWeight: '600', color: colors.text, fontSize: 13 },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md, ...shadow.card },
  image: { width: 64, height: 64, borderRadius: radius.sm },
  info: { flex: 1, marginLeft: spacing.md },
  cancel: { padding: 8, backgroundColor: '#FCEBEB', borderRadius: radius.pill },
});
