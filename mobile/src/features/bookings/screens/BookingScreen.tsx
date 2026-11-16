import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import Header from '@/shared/components/Header';
import { DatePillRow, PartySizeStepper, TimeSlotPicker } from '@/shared/components/BookingControls';
import { useApp } from '@/shared/context/AppContext';
import { getRestaurantById } from '@/shared/data/mockData';
import { colors, radius, spacing, typography } from '@/shared/theme';

const dates = [
  { label: 'Today', day: 'Mon', num: 7 }, { label: 'Tomorrow', day: 'Tue', num: 8 },
  { label: 'Wed 9', day: 'Wed', num: 9 }, { label: 'Thu 10', day: 'Thu', num: 10 },
  { label: 'Fri 11', day: 'Fri', num: 11 }, { label: 'Sat 12', day: 'Sat', num: 12 },
];

export default function BookingScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const restaurant = getRestaurantById(restaurantId);
  const { addBooking } = useApp();
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState(restaurant?.availableSlots[0] ?? '');
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState('');
  if (!restaurant) return <View style={styles.container}><Text style={typography.body}>Restaurant not found.</Text></View>;

  const handleConfirm = () => {
    addBooking({ restaurantId, date, time, partySize, note });
    Alert.alert('Reservation Confirmed 🎉', `Table for ${partySize} at ${restaurant.name} on ${date} at ${time}.`, [
      { text: 'View My Bookings', onPress: () => router.replace('/(tabs)/bookings') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Reserve a Table" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.h2}>{restaurant.name}</Text>
        <Text style={typography.bodyMuted}>{restaurant.address}</Text>
        <Text style={styles.label}>Select Date</Text>
        <DatePillRow dates={dates} selected={date} onSelect={setDate} />
        <Text style={styles.label}>Select Time</Text>
        <TimeSlotPicker slots={restaurant.availableSlots} selected={time} onSelect={setTime} />
        <Text style={styles.label}>Party Size</Text>
        <PartySizeStepper value={partySize} onChange={setPartySize} />
        <Text style={styles.label}>Special Requests (optional)</Text>
        <TextInput style={styles.note} placeholder="e.g. window seat, allergy info, celebration..." placeholderTextColor={colors.textMuted} multiline value={note} onChangeText={setNote} />
      </ScrollView>
      <View style={styles.footer}><TouchableOpacity style={styles.confirm} onPress={handleConfirm}><Text style={typography.button}>Confirm Reservation</Text></TouchableOpacity></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: 120 },
  label: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.sm },
  note: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, minHeight: 70, color: colors.text, textAlignVertical: 'top' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  confirm: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
});
