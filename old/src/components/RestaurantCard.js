import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../theme/colors';
import { typography } from '../theme/typography';

export default function RestaurantCard({ restaurant, onPress, onToggleSave, saved }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <TouchableOpacity style={styles.saveBtn} onPress={onToggleSave} hitSlop={8}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? colors.primary : colors.white}
          />
        </TouchableOpacity>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{restaurant.priceLevel}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.rowBetween}>
          <Text style={typography.h3} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingWrap}>
            <Ionicons name="star" size={13} color={colors.accent} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
        <Text style={typography.bodyMuted} numberOfLines={1}>
          {restaurant.cuisine} · {restaurant.distanceKm} km away
        </Text>
        <View style={styles.tagsRow}>
          {restaurant.tags.slice(0, 2).map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: { width: '100%', height: 160, position: 'relative' },
  image: { width: '100%', height: '100%' },
  saveBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.overlay,
    padding: 7,
    borderRadius: radius.pill,
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: colors.overlay,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  priceText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  info: { padding: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '700', color: colors.text, marginLeft: 3 },
  tagsRow: { flexDirection: 'row', marginTop: spacing.sm, gap: 6 },
  tag: {
    backgroundColor: '#F2E9E3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
});
