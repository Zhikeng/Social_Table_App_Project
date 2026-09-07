import React, { useState } from 'react';
import {
  View, Text, Image, FlatList, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import StarRating from '../../components/StarRating';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { getUserById, getRestaurantById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const { posts, toggleLike, addComment } = useApp();
  const post = posts.find((p) => p.id === postId);
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const author = getUserById(post.userId);
  const restaurant = getRestaurantById(post.restaurantId);

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Header title="Post" onBack={() => navigation.goBack()} />
      <FlatList
        data={post.comments}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        ListHeaderComponent={
          <View>
            <View style={styles.authorRow}>
              <Avatar uri={author?.avatar} size={38} />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={typography.h3}>{author?.name}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id })}
                >
                  <Text style={styles.restaurantLink}>{restaurant?.name}</Text>
                </TouchableOpacity>
              </View>
              <StarRating rating={post.rating} size={14} />
            </View>
            <Image source={{ uri: post.image }} style={styles.image} />
            <View style={styles.captionWrap}>
              <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.likeRow}>
                <Ionicons
                  name={post.liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={post.liked ? colors.primary : colors.text}
                />
                <Text style={styles.likeText}>{post.likes} likes</Text>
              </TouchableOpacity>
              <Text style={typography.body}>
                <Text style={{ fontWeight: '700' }}>{author?.username} </Text>
                {post.caption}
              </Text>
            </View>
            <Text style={styles.commentsHeader}>Comments ({post.comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => {
          const commenter = getUserById(item.userId);
          return (
            <View style={styles.commentRow}>
              <Avatar uri={commenter?.avatar} size={30} />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={typography.body}>
                  <Text style={{ fontWeight: '700' }}>{commenter?.name} </Text>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[typography.bodyMuted, { paddingHorizontal: spacing.lg }]}>
            No comments yet. Say something nice!
          </Text>
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  authorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  restaurantLink: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },
  image: { width: '100%', height: 360, backgroundColor: colors.border },
  captionWrap: { padding: spacing.lg },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  likeText: { fontWeight: '700', color: colors.text },
  commentsHeader: { ...typography.h3, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  commentRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg,
  },
  input: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: colors.border,
    marginRight: spacing.sm,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
