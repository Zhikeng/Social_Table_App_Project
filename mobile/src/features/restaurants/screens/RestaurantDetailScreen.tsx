import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Avatar from '@/shared/components/Avatar';
import StarRating from '@/shared/components/StarRating';
import { useApp } from '@/shared/context/AppContext';
import { getRestaurantById, getUserById } from '@/shared/data/mockData';
import { colors, radius, spacing, typography } from '@/shared/theme';

export default function RestaurantDetailScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const restaurant = getRestaurantById(restaurantId);
  const { posts, savedSpots, toggleSaved } = useApp();
  if (!restaurant) return <View style={styles.container}><Text style={typography.body}>Restaurant not found.</Text></View>;
  const saved = savedSpots.includes(restaurantId);
  const relatedPosts = posts.filter((post) => post.restaurantId === restaurantId);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: restaurant.image }} style={styles.image} />
          <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={colors.white} /></TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={() => toggleSaved(restaurantId)}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? colors.primary : colors.white} /></TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}><Text style={typography.h1}>{restaurant.name}</Text><View style={styles.rating}><Ionicons name="star" size={14} color={colors.accent} /><Text style={styles.ratingText}>{restaurant.rating}</Text></View></View>
          <Text style={styles.muted}>{restaurant.cuisine} · {restaurant.priceLevel} · {restaurant.reviewCount} reviews</Text>
          <Text style={styles.muted}>⌖ {restaurant.address}</Text>
          <View style={styles.tags}>{restaurant.tags.map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
          <Text style={[typography.body, { marginTop: spacing.md }]}>{restaurant.description}</Text>
          <Text style={[typography.h3, styles.section]}>Menu Highlights</Text>
          {restaurant.menuHighlights.map((item) => <View key={item.id} style={styles.menu}><Text style={typography.body}>{item.name}</Text><Text style={styles.price}>{item.price}</Text></View>)}
          <Text style={[typography.h3, styles.section]}>Recent Reviews ({relatedPosts.length})</Text>
          {relatedPosts.length === 0 ? <Text style={typography.bodyMuted}>No reviews yet — be the first to post!</Text> : relatedPosts.map((post) => {
            const author = getUserById(post.userId);
            return <View key={post.id} style={styles.review}>
              <View style={styles.reviewHead}><Avatar uri={author?.avatar} size={30} /><Text style={styles.author}>{author?.name}</Text><View style={styles.spacer} /><StarRating rating={post.rating} size={12} /></View>
              <Text style={[typography.bodyMuted, { marginTop: 6 }]}>{post.caption}</Text>
            </View>;
          })}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
      <View style={styles.bookBar}>
        <View><Text style={typography.caption}>From</Text><Text style={typography.h3}>{restaurant.priceLevel}</Text></View>
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push({ pathname: '/restaurants/[restaurantId]/booking', params: { restaurantId } })}>
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
  back: { position: 'absolute', top: 48, left: 16, backgroundColor: colors.overlay, padding: 8, borderRadius: radius.pill },
  save: { position: 'absolute', top: 48, right: 16, backgroundColor: colors.overlay, padding: 8, borderRadius: radius.pill },
  content: { padding: spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  ratingText: { fontWeight: '700', fontSize: 13, color: colors.text },
  muted: { ...typography.bodyMuted, marginTop: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  tag: { backgroundColor: '#F2E9E3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, color: colors.secondary, fontSize: 12, fontWeight: '600' },
  section: { marginTop: spacing.lg, marginBottom: spacing.sm },
  menu: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  price: { fontWeight: '700', color: colors.primaryDark },
  review: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  reviewHead: { flexDirection: 'row', alignItems: 'center' },
  author: { ...typography.body, fontWeight: '700', marginLeft: 8 },
  spacer: { flex: 1 },
  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  bookButton: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: radius.md },
});
