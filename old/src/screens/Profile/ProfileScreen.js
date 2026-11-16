import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { getRestaurantById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { user, posts, bookings, savedSpots, restaurants, logout } = useApp();
  const [tab, setTab] = useState('posts');

  const myPosts = posts.filter((p) => p.userId === user.id);
  const savedRestaurants = restaurants.filter((r) => savedSpots.includes(r.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar uri={user.avatar} size={80} />
        <Text style={[typography.h2, { marginTop: spacing.sm }]}>{user.name}</Text>
        <Text style={typography.bodyMuted}>{user.username}</Text>
        <Text style={[typography.body, { textAlign: 'center', marginTop: spacing.sm }]}>{user.bio}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={typography.h3}>{myPosts.length}</Text>
            <Text style={typography.caption}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={typography.h3}>{user.followers}</Text>
            <Text style={typography.caption}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={typography.h3}>{user.following}</Text>
            <Text style={typography.caption}>Following</Text>
          </View>
        </View>

        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabRow}>
        {[
          { key: 'posts', label: 'Posts', icon: 'grid-outline' },
          { key: 'saved', label: 'Saved', icon: 'bookmark-outline' },
          { key: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Ionicons name={t.icon} size={18} color={tab === t.key ? colors.primary : colors.textMuted} />
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'posts' && (
        <FlatList
          data={myPosts}
          keyExtractor={(p) => p.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={<Text style={styles.emptyText}>You haven't posted yet.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.gridImage} />
            </TouchableOpacity>
          )}
        />
      )}

      {tab === 'saved' && (
        <FlatList
          data={savedRestaurants}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved restaurants yet.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.rowImage} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={typography.h3}>{item.name}</Text>
                <Text style={typography.bodyMuted}>{item.cuisine} · {item.priceLevel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}

      {tab === 'bookings' && (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookings yet.</Text>}
          renderItem={({ item }) => {
            const restaurant = getRestaurantById(item.restaurantId);
            return (
              <TouchableOpacity
                style={styles.listRow}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.restaurantId })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.rowImage} />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={typography.h3}>{restaurant.name}</Text>
                  <Text style={typography.bodyMuted}>{item.date} · {item.time} · {item.partySize} guests</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'upcoming' ? styles.statusUpcoming : styles.statusPast]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  statItem: { alignItems: 'center' },
  headerBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, width: '100%' },
  editBtn: {
    flex: 1, backgroundColor: colors.secondary, borderRadius: radius.md,
    paddingVertical: 10, alignItems: 'center',
  },
  editBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  logoutBtn: {
    width: 42, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  tabRow: {
    flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.primary },
  gridContent: { padding: 2 },
  gridItem: { width: '33.33%', aspectRatio: 1, padding: 2 },
  gridImage: { width: '100%', height: '100%', borderRadius: 4 },
  listContent: { padding: spacing.lg },
  listRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  rowImage: { width: 56, height: 56, borderRadius: radius.sm },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusUpcoming: { backgroundColor: '#E7F4EC' },
  statusPast: { backgroundColor: '#F0E4DC' },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  emptyText: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xl },
});
