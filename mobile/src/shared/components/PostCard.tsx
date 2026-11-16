import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { getRestaurantById, getUserById } from '@/shared/data/mockData';
import type { FeedPost, Restaurant, User } from '@/shared/models/types';
import { colors, radius, shadow, spacing, typography } from '@/shared/theme';
import Avatar from './Avatar';
import StarRating from './StarRating';

type Props = {
  post: FeedPost;
  onLike: (id: string) => void;
  onOpen: (post: FeedPost) => void;
  onOpenRestaurant: (restaurant: Restaurant) => void;
  onOpenProfile?: (user: User | undefined) => void;
};

export default function PostCard({ post, onLike, onOpen, onOpenRestaurant, onOpenProfile }: Props) {
  const author = getUserById(post.userId);
  const restaurant = getRestaurantById(post.restaurantId);
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => onOpenProfile?.(author)}>
        <Avatar uri={author?.avatar} size={38} />
        <View style={styles.author}>
          <Text style={typography.h3}>{author?.name}</Text>
          {restaurant ? <TouchableOpacity onPress={() => onOpenRestaurant(restaurant)}>
            <Text style={styles.restaurant}>⌖ {restaurant.name}</Text>
          </TouchableOpacity> : null}
        </View>
        <Text style={typography.caption}>{post.timestamp}</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(post)}>
        <Image source={{ uri: post.image }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.body}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={() => onLike(post.id)}>
            <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={22} color={post.liked ? colors.primary : colors.text} />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => onOpen(post)}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <StarRating rating={post.rating} size={14} />
        </View>
        <Text style={typography.body}><Text style={styles.bold}>{author?.username} </Text>{post.caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.md, marginBottom: spacing.lg, overflow: 'hidden', ...shadow.card },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingBottom: spacing.sm },
  author: { marginLeft: spacing.sm, flex: 1 },
  restaurant: { fontSize: 12, fontWeight: '600', color: colors.primaryDark, marginTop: 1 },
  image: { width: '100%', height: 320, backgroundColor: colors.border },
  body: { padding: spacing.md },
  actions: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.lg },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, fontWeight: '600', color: colors.text },
  spacer: { flex: 1 },
  bold: { fontWeight: '700' },
});
