import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import Avatar from '@/shared/components/Avatar';
import Header from '@/shared/components/Header';
import StarRating from '@/shared/components/StarRating';
import { useApp } from '@/shared/context/AppContext';
import { getRestaurantById, getUserById } from '@/shared/data/mockData';
import type { Comment } from '@/shared/models/types';
import { colors, radius, spacing, typography } from '@/shared/theme';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { posts, toggleLike, addComment } = useApp();
  const post = posts.find((item) => item.id === postId);
  const [commentText, setCommentText] = useState('');
  if (!post) return <View style={styles.container}><Text style={typography.body}>Post not found.</Text></View>;
  const author = getUserById(post.userId);
  const restaurant = getRestaurantById(post.restaurantId);
  const sendComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <Header title="Post" onBack={() => router.back()} />
      <FlatList<Comment> data={post.comments} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: spacing.xl }}
        ListHeaderComponent={<View>
          <View style={styles.authorRow}><Avatar uri={author?.avatar} size={38} /><View style={styles.author}>
            <Text style={typography.h3}>{author?.name}</Text>
            {restaurant ? <TouchableOpacity onPress={() => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: restaurant.id } })}><Text style={styles.restaurant}>{restaurant.name}</Text></TouchableOpacity> : null}
          </View><StarRating rating={post.rating} size={14} /></View>
          <Image source={{ uri: post.image }} style={styles.image} />
          <View style={styles.caption}>
            <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.likes}><Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={24} color={post.liked ? colors.primary : colors.text} /><Text style={styles.likeText}>{post.likes} likes</Text></TouchableOpacity>
            <Text style={typography.body}><Text style={styles.bold}>{author?.username} </Text>{post.caption}</Text>
          </View>
          <Text style={styles.commentsHeader}>Comments ({post.comments.length})</Text>
        </View>}
        renderItem={({ item }: ListRenderItemInfo<Comment>) => {
          const commenter = getUserById(item.userId);
          return <View style={styles.comment}><Avatar uri={commenter?.avatar} size={30} /><Text style={styles.commentText}><Text style={styles.bold}>{commenter?.name} </Text>{item.text}</Text></View>;
        }}
        ListEmptyComponent={<Text style={styles.noComments}>No comments yet. Say something nice!</Text>} />
      <View style={styles.inputBar}>
        <TextInput style={styles.input} placeholder="Add a comment..." placeholderTextColor={colors.textMuted} value={commentText} onChangeText={setCommentText} />
        <TouchableOpacity onPress={sendComment} style={styles.send}><Ionicons name="send" size={18} color={colors.white} /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  authorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  author: { marginLeft: spacing.sm, flex: 1 },
  restaurant: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },
  image: { width: '100%', height: 360, backgroundColor: colors.border },
  caption: { padding: spacing.lg },
  likes: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  likeText: { fontWeight: '700', color: colors.text },
  bold: { fontWeight: '700' },
  commentsHeader: { ...typography.h3, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  comment: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, alignItems: 'center' },
  commentText: { ...typography.body, marginLeft: spacing.sm, flex: 1 },
  noComments: { ...typography.bodyMuted, paddingHorizontal: spacing.lg },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  input: { flex: 1, backgroundColor: colors.card, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm, color: colors.text },
  send: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
