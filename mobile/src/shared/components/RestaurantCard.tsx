import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import type { Restaurant } from '@/shared/models/types';
import { colors, radius, shadow, spacing, typography } from '@/shared/theme';

type Props = { restaurant: Restaurant; saved: boolean; onToggleSave: () => void; onPress: () => void };

export default function RestaurantCard({ restaurant, saved, onToggleSave, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <TouchableOpacity style={styles.save} onPress={(event) => { event.stopPropagation(); onToggleSave(); }} hitSlop={8}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? colors.primary : colors.white} />
        </TouchableOpacity>
        <View style={styles.price}><Text style={styles.priceText}>{restaurant.priceLevel}</Text></View>
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={typography.h3} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.rating}><Ionicons name="star" size={13} color={colors.accent} /><Text style={styles.ratingText}>{restaurant.rating}</Text></View>
        </View>
        <Text style={typography.bodyMuted}>{restaurant.cuisine} · {restaurant.distanceKm} km away</Text>
        <View style={styles.tags}>{restaurant.tags.slice(0, 2).map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.md, marginBottom: spacing.md, overflow: 'hidden', ...shadow.card },
  imageWrap: { height: 160, position: 'relative' },
  image: { width: '100%', height: '100%' },
  save: { position: 'absolute', top: 10, right: 10, backgroundColor: colors.overlay, padding: 7, borderRadius: radius.pill },
  price: { position: 'absolute', bottom: 10, left: 10, backgroundColor: colors.overlay, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm },
  priceText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  info: { padding: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '700', color: colors.text, marginLeft: 3 },
  tags: { flexDirection: 'row', marginTop: spacing.sm, gap: 6 },
  tag: { backgroundColor: '#F2E9E3', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, color: colors.secondary, fontSize: 11, fontWeight: '600' },
});
