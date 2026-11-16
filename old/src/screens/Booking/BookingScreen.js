import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../../components/Header';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { TimeSlotPicker, PartySizeStepper, DatePillRow } from '../../components/TimeSlotPicker';
import { getRestaurantById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const upcomingDates = [
  { label: 'Today', day: 'Mon', num: 7 },
  { label: 'Tomorrow', day: 'Tue', num: 8 },
  { label: 'Wed 9', day: 'Wed', num: 9 },
  { label: 'Thu 10', day: 'Thu', num: 10 },
  { label: 'Fri 11', day: 'Fri', num: 11 },
  { label: 'Sat 12', day: 'Sat', num: 12 },
];

export default function BookingScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const restaurant = getRestaurantById(restaurantId);
  const { addBooking } = useApp();

  const [date, setDate] = useState('Today');
  const [time, setTime] = useState(restaurant.availableSlots[0]);
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    addBooking({
      restaurantId,
      date,
      time,
      partySize,
      note,
    });
    Alert.alert(
      'Reservation Confirmed 🎉',
      `Table for ${partySize} at ${restaurant.name} on ${date} at ${time}.`,
      [{ text: 'View My Bookings', onPress: () => navigation.navigate('MyBookings') }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Reserve a Table" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.h2}>{restaurant.name}</Text>
        <Text style={typography.bodyMuted}>{restaurant.address}</Text>

        <Text style={styles.sectionLabel}>Select Date</Text>
        <DatePillRow dates={upcomingDates} selected={date} onSelect={setDate} />

        <Text style={styles.sectionLabel}>Select Time</Text>
        <TimeSlotPicker slots={restaurant.availableSlots} selected={time} onSelect={setTime} />

        <Text style={styles.sectionLabel}>Party Size</Text>
        <PartySizeStepper value={partySize} onChange={setPartySize} />

        <Text style={styles.sectionLabel}>Special Requests (optional)</Text>
        <View style={styles.noteBox}>
          <Text style={typography.bodyMuted}>
            {note || 'e.g. window seat, allergy info, celebration...'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={typography.button}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: 120 },
  sectionLabel: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.sm },
  noteBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 60,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.lg, backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center',
  },
});
