import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { getRestaurantById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function MyBookingsScreen({ navigation }) {
  const { bookings, cancelBooking } = useApp();
  const [tab, setTab] = useState('upcoming');

  const filtered = bookings.filter((b) =>
    tab === 'upcoming' ? b.status === 'upcoming' : b.status === 'past'
  );

  const handleCancel = (id) => {
    Alert.alert('Cancel Reservation?', 'This action cannot be undone.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel Reservation', style: 'destructive', onPress: () => cancelBooking(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>My Bookings</Text>
      </View>

      <View style={styles.tabRow}>
        {['upcoming', 'past'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: spacing.xl }]}>
            No {tab} reservations.
          </Text>
        }
        renderItem={({ item }) => {
          const restaurant = getRestaurantById(item.restaurantId);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.restaurantId })}
            >
              <Image source={{ uri: restaurant.image }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={typography.h3}>{restaurant.name}</Text>
                <Text style={typography.bodyMuted}>{item.date} · {item.time}</Text>
                <Text style={typography.bodyMuted}>{item.partySize} guests</Text>
              </View>
              {item.status === 'upcoming' && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
                  <Ionicons name="close" size={18} color={colors.danger} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
  tab: {
    paddingVertical: 8, paddingHorizontal: 18, borderRadius: radius.pill,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  tabText: { fontWeight: '600', color: colors.text, fontSize: 13 },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md, ...shadow.card,
  },
  image: { width: 64, height: 64, borderRadius: radius.sm },
  cancelBtn: {
    padding: 8, backgroundColor: '#FCEBEB', borderRadius: radius.pill,
  },
});
