import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import RestaurantCard from '../../components/RestaurantCard';
import { cuisines } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function DiscoverScreen({ navigation }) {
  const { restaurants, savedSpots, toggleSaved, user } = useApp();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('All');

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesCuisine = cuisine === 'All' || r.cuisine === cuisine;
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      return matchesCuisine && matchesQuery;
    });
  }, [restaurants, query, cuisine]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={typography.bodyMuted}>Good evening,</Text>
          <Text style={typography.h1}>{user.name.split(' ')[0]} 👋</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={cuisines}
        keyExtractor={(c) => c}
        style={styles.cuisineList}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => {
          const active = item === cuisine;
          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCuisine(item)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            saved={savedSpots.includes(item.id)}
            onToggleSave={() => toggleSaved(item.id)}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: spacing.xl }]}>
            No restaurants match your search.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  cuisineList: { marginTop: spacing.md, marginBottom: spacing.sm, flexGrow: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  chipTextActive: { color: colors.white },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
});
