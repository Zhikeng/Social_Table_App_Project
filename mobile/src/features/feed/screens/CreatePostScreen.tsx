import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import Header from '@/shared/components/Header';
import StarRating from '@/shared/components/StarRating';
import { useApp } from '@/shared/context/AppContext';
import { colors, radius, spacing, typography } from '@/shared/theme';

export default function CreatePostScreen() {
  const { restaurants, addPost } = useApp();
  const initialRestaurant = restaurants[0];
  const [restaurantId, setRestaurantId] = useState(initialRestaurant.id);
  const [rating, setRating] = useState(5);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(initialRestaurant.image);
  const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === restaurantId) ?? initialRestaurant;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to choose an image for your post.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };
  const publish = () => {
    addPost({ restaurantId, image, caption: caption || 'Great meal!', rating });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="New Post" onBack={() => router.back()} right={<TouchableOpacity onPress={publish}><Text style={styles.postAction}>Post</Text></TouchableOpacity>} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.preview} />
          <View style={styles.overlay}><Ionicons name="camera" size={22} color={colors.white} /><Text style={styles.overlayText}>Change Photo</Text></View>
        </TouchableOpacity>
        <Text style={styles.label}>Where did you eat?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>{restaurants.map((restaurant) => {
          const active = restaurant.id === restaurantId;
          return <TouchableOpacity key={restaurant.id} style={[styles.chip, active && styles.chipActive]} onPress={() => { setRestaurantId(restaurant.id); setImage(restaurant.image); }}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{restaurant.name}</Text>
          </TouchableOpacity>;
        })}</ScrollView>
        <Text style={styles.label}>Your Rating</Text>
        <StarRating rating={rating} size={28} onChange={setRating} />
        <Text style={styles.label}>Caption</Text>
        <TextInput style={styles.caption} placeholder="Tell your followers about the experience..." placeholderTextColor={colors.textMuted} multiline value={caption} onChangeText={setCaption} />
        <Text style={styles.selected}>Selected restaurant: {selectedRestaurant.name}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  postAction: { color: colors.primaryDark, fontWeight: '700', fontSize: 15 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  imagePicker: { width: '100%', height: 220, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.lg },
  preview: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.overlay, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  overlayText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  label: { ...typography.h3, marginBottom: spacing.sm, marginTop: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  chipTextActive: { color: colors.white },
  caption: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, minHeight: 100, textAlignVertical: 'top', fontSize: 15, color: colors.text, marginTop: spacing.md },
  selected: { ...typography.caption, marginTop: spacing.md },
});
