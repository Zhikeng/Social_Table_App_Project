import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import StarRating from '../../components/StarRating';
import Avatar from '../../components/Avatar';
import { getRestaurantById, getUserById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const restaurant = getRestaurantById(restaurantId);
  const { posts, savedSpots, toggleSaved } = useApp();
  const saved = savedSpots.includes(restaurantId);
  const relatedPosts = posts.filter((p) => p.restaurantId === restaurantId);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: restaurant.image }} style={styles.image} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => toggleSaved(restaurantId)}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? colors.primary : colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={typography.h1}>{restaurant.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={colors.accent} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>
          <Text style={[typography.bodyMuted, { marginTop: 4 }]}>
            {restaurant.cuisine} · {restaurant.priceLevel} · {restaurant.reviewCount} reviews
          </Text>
          <Text style={[typography.bodyMuted, { marginTop: 2 }]}>
            <Ionicons name="location-sharp" size={13} color={colors.textMuted} /> {restaurant.address}
          </Text>

          <View style={styles.tagsRow}>
            {restaurant.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[typography.body, { marginTop: spacing.md }]}>{restaurant.description}</Text>

          <Text style={[typography.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>Menu Highlights</Text>
          {restaurant.menuHighlights.map((m) => (
            <View key={m.id} style={styles.menuRow}>
              <Text style={typography.body}>{m.name}</Text>
              <Text style={styles.menuPrice}>{m.price}</Text>
            </View>
          ))}

          <Text style={[typography.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>
            Recent Reviews ({relatedPosts.length})
          </Text>
          {relatedPosts.length === 0 && (
            <Text style={typography.bodyMuted}>No reviews yet — be the first to post!</Text>
          )}
          {relatedPosts.map((p) => {
            const author = getUserById(p.userId);
            return (
              <View key={p.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar uri={author?.avatar} size={30} />
                  <Text style={[typography.body, { fontWeight: '700', marginLeft: 8 }]}>
                    {author?.name}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <StarRating rating={p.rating} size={12} />
                </View>
                <Text style={[typography.bodyMuted, { marginTop: 6 }]}>{p.caption}</Text>
              </View>
            );
          })}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bookBar}>
        <View>
          <Text style={typography.caption}>From</Text>
          <Text style={typography.h3}>{restaurant.priceLevel}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { restaurantId })}
        >
          <Text style={typography.button}>Reserve a Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  imageWrap: { width: '100%', height: 260 },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute', top: 48, left: 16,
    backgroundColor: colors.overlay, padding: 8, borderRadius: radius.pill,
  },
  saveBtn: {
    position: 'absolute', top: 48, right: 16,
    backgroundColor: colors.overlay, padding: 8, borderRadius: radius.pill,
  },
  content: { padding: spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm,
  },
  ratingText: { fontWeight: '700', fontSize: 13, color: colors.text },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  tag: { backgroundColor: '#F2E9E3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  tagText: { fontSize: 12, fontWeight: '600', color: colors.secondary },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuPrice: { fontWeight: '700', color: colors.primaryDark },
  reviewCard: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, ...shadow.card,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  bookBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, padding: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  bookBtn: {
    backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: radius.md,
  },
});
