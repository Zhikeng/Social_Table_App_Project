import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import PostCard from '../../components/PostCard';
import { useApp } from '../../context/AppContext';

export default function FeedScreen({ navigation }) {
  const { posts, toggleLike } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={typography.h1}>Feed</Text>
        <TouchableOpacity
          style={styles.newPostBtn}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={toggleLike}
            onOpen={(post) => navigation.navigate('PostDetail', { postId: post.id })}
            onOpenRestaurant={(r) => navigation.navigate('RestaurantDetail', { restaurantId: r.id })}
            onOpenProfile={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  newPostBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
});
