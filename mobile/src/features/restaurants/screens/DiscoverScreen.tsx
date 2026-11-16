import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import RestaurantCard from '@/shared/components/RestaurantCard';
import { useApp } from '@/shared/context/AppContext';
import { cuisines } from '@/shared/data/mockData';
import { colors, radius, spacing, typography } from '@/shared/theme';
import type { Restaurant } from '@/shared/models/types';

export default function DiscoverScreen() {
  const { restaurants, savedSpots, toggleSaved, user } = useApp();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const filtered = useMemo(() => restaurants.filter((restaurant) =>
    (cuisine === 'All' || restaurant.cuisine === cuisine) &&
    restaurant.name.toLowerCase().includes(query.toLowerCase())),
  [restaurants, query, cuisine]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={typography.bodyMuted}>Good evening,</Text>
        <Text style={typography.h1}>{user.name.split(' ')[0]} 👋</Text>
      </View>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search restaurants..." placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery} />
      </View>
      <FlatList<string> horizontal showsHorizontalScrollIndicator={false} data={cuisines} keyExtractor={(item) => item}
        style={styles.cuisines} contentContainerStyle={styles.chips}
        renderItem={({ item }: ListRenderItemInfo<string>) => <TouchableOpacity style={[styles.chip, cuisine === item && styles.chipActive]} onPress={() => setCuisine(item)}>
          <Text style={[styles.chipText, cuisine === item && styles.chipTextActive]}>{item}</Text>
        </TouchableOpacity>} />
      <FlatList<Restaurant> data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: ListRenderItemInfo<Restaurant>) => <RestaurantCard restaurant={item} saved={savedSpots.includes(item.id)}
          onToggleSave={() => toggleSaved(item.id)}
          onPress={() => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: item.id } })} />}
        ListEmptyComponent={<Text style={styles.empty}>No restaurants match your search.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  cuisines: { marginTop: spacing.md, marginBottom: spacing.sm, flexGrow: 0 },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  chipTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xl },
});
