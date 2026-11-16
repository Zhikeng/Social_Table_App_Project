import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import Avatar from '@/shared/components/Avatar';
import { useApp } from '@/shared/context/AppContext';
import { getRestaurantById } from '@/shared/data/mockData';
import type { Booking, FeedPost, Restaurant } from '@/shared/models/types';
import { colors, radius, spacing, typography } from '@/shared/theme';

type ProfileTab = 'posts' | 'saved' | 'bookings';

export default function ProfileScreen() {
  const { user, posts, bookings, savedSpots, restaurants, logout } = useApp();
  const [tab, setTab] = useState<ProfileTab>('posts');
  const myPosts = posts.filter((post) => post.userId === user.id);
  const savedRestaurants = restaurants.filter((restaurant) => savedSpots.includes(restaurant.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar uri={user.avatar} size={80} />
        <Text style={[typography.h2, { marginTop: spacing.sm }]}>{user.name}</Text>
        <Text style={typography.bodyMuted}>{user.username}</Text>
        <Text style={[typography.body, styles.bio]}>{user.bio}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={typography.h3}>{myPosts.length}</Text><Text style={typography.caption}>Posts</Text></View>
          <View style={styles.stat}><Text style={typography.h3}>{user.followers ?? 0}</Text><Text style={typography.caption}>Followers</Text></View>
          <View style={styles.stat}><Text style={typography.h3}>{user.following ?? 0}</Text><Text style={typography.caption}>Following</Text></View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.edit} onPress={() => router.push('/profile/edit')}><Text style={styles.editText}>Edit Profile</Text></TouchableOpacity>
          <TouchableOpacity style={styles.logout} onPress={logout}><Ionicons name="log-out-outline" size={18} color={colors.danger} /></TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabs}>{([
        { key: 'posts', label: 'Posts', icon: 'grid-outline' },
        { key: 'saved', label: 'Saved', icon: 'bookmark-outline' },
        { key: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
      ] as const).map((item) => <TouchableOpacity key={item.key} style={[styles.tab, tab === item.key && styles.tabActive]} onPress={() => setTab(item.key)}>
        <Ionicons name={item.icon} size={18} color={tab === item.key ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabLabel, tab === item.key && styles.tabLabelActive]}>{item.label}</Text>
      </TouchableOpacity>)}</View>
      {tab === 'posts' && <FlatList<FeedPost> data={myPosts} keyExtractor={(post) => post.id} numColumns={3} contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.empty}>You haven&apos;t posted yet.</Text>}
        renderItem={({ item }: ListRenderItemInfo<FeedPost>) => <TouchableOpacity style={styles.gridItem} onPress={() => router.push({ pathname: '/feed/[postId]', params: { postId: item.id } })}><Image source={{ uri: item.image }} style={styles.gridImage} /></TouchableOpacity>} />}
      {tab === 'saved' && <FlatList<Restaurant> data={savedRestaurants} keyExtractor={(restaurant) => restaurant.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No saved restaurants yet.</Text>}
        renderItem={({ item }: ListRenderItemInfo<Restaurant>) => <TouchableOpacity style={styles.row} onPress={() => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: item.id } })}>
          <Image source={{ uri: item.image }} style={styles.rowImage} /><View style={styles.rowInfo}><Text style={typography.h3}>{item.name}</Text><Text style={typography.bodyMuted}>{item.cuisine} · {item.priceLevel}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>} />}
      {tab === 'bookings' && <FlatList<Booking> data={bookings} keyExtractor={(booking) => booking.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
        renderItem={({ item }: ListRenderItemInfo<Booking>) => {
          const restaurant = getRestaurantById(item.restaurantId);
          if (!restaurant) return null;
          return <TouchableOpacity style={styles.row} onPress={() => router.push({ pathname: '/restaurants/[restaurantId]', params: { restaurantId: item.restaurantId } })}>
            <Image source={{ uri: restaurant.image }} style={styles.rowImage} /><View style={styles.rowInfo}><Text style={typography.h3}>{restaurant.name}</Text><Text style={typography.bodyMuted}>{item.date} · {item.time} · {item.partySize} guests</Text></View><View style={[styles.badge, item.status === 'upcoming' ? styles.upcoming : styles.past]}><Text style={styles.badgeText}>{item.status}</Text></View>
          </TouchableOpacity>;
        }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', padding: spacing.lg },
  bio: { textAlign: 'center', marginTop: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  stat: { alignItems: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, width: '100%' },
  edit: { flex: 1, backgroundColor: colors.secondary, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center' },
  editText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  logout: { width: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  tabLabelActive: { color: colors.primary },
  grid: { padding: 2 },
  gridItem: { width: '33.33%', aspectRatio: 1, padding: 2 },
  gridImage: { width: '100%', height: '100%', borderRadius: 4 },
  list: { padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  rowImage: { width: 56, height: 56, borderRadius: radius.sm },
  rowInfo: { marginLeft: spacing.md, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  upcoming: { backgroundColor: '#E7F4EC' },
  past: { backgroundColor: '#F0E4DC' },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xl },
});
