import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import StarRating from './StarRating';
import { colors, radius, shadow, spacing } from '../theme/colors';
import { typography } from '../theme/typography';
import { getUserById, getRestaurantById } from '../data/mockData';

export default function PostCard({ post, onLike, onOpen, onOpenRestaurant, onOpenProfile }) {
  const author = getUserById(post.userId);
  const restaurant = getRestaurantById(post.restaurantId);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => onOpenProfile?.(author)}>
        <Avatar uri={author?.avatar} size={38} />
        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
          <Text style={typography.h3}>{author?.name}</Text>
          <TouchableOpacity onPress={() => onOpenRestaurant?.(restaurant)}>
            <Text style={styles.restaurantLink}>
              <Ionicons name="location-sharp" size={11} color={colors.primary} /> {restaurant?.name}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={typography.caption}>{post.timestamp}</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen?.(post)}>
        <Image source={{ uri: post.image }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onLike?.(post.id)}>
            <Ionicons
              name={post.liked ? 'heart' : 'heart-outline'}
              size={22}
              color={post.liked ? colors.primary : colors.text}
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onOpen?.(post)}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <StarRating rating={post.rating} size={14} />
        </View>
        <Text style={typography.body}>
          <Text style={{ fontWeight: '700' }}>{author?.username} </Text>
          {post.caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingBottom: spacing.sm },
  restaurantLink: { fontSize: 12, fontWeight: '600', color: colors.primaryDark, marginTop: 1 },
  image: { width: '100%', height: 320, backgroundColor: colors.border },
  body: { padding: spacing.md },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.lg },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, fontWeight: '600', color: colors.text },
});
