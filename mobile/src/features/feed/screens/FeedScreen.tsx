import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import PostCard from '@/shared/components/PostCard';
import { useApp } from '@/shared/context/AppContext';
import type { FeedPost } from '@/shared/models/types';
import { colors, spacing, typography } from '@/shared/theme';

export default function FeedScreen() {
  const { posts, toggleLike } = useApp();
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={typography.h1}>Feed</Text>
        <TouchableOpacity style={styles.newPost} onPress={() => router.push('/feed/create')}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <FlatList<FeedPost> data={posts} keyExtractor={(post) => post.id} contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: ListRenderItemInfo<FeedPost>) => <PostCard post={item} onLike={toggleLike}
          onOpen={(post) => router.push({ pathname: '/feed/[postId]', params: { postId: post.id } })}
          onOpenRestaurant={(restaurant) => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: restaurant.id } })} />}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet. Share your first meal.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  newPost: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xl },
});
