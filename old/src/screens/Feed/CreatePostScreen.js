import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';
import StarRating from '../../components/StarRating';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';

export default function CreatePostScreen({ navigation }) {
  const { restaurants, addPost } = useApp();
  const [restaurantId, setRestaurantId] = useState(restaurants[0].id);
  const [rating, setRating] = useState(5);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(restaurants[0].image);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    addPost({ restaurantId, image, caption: caption || 'Great meal!', rating });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="New Post"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={handlePost}>
            <Text style={styles.postAction}>Post</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={22} color={colors.white} />
            <Text style={styles.overlayText}>Change Photo</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Where did you eat?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {restaurants.map((r) => {
            const active = r.id === restaurantId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.restChip, active && styles.restChipActive]}
                onPress={() => { setRestaurantId(r.id); setImage(r.image); }}
              >
                <Text style={[styles.restChipText, active && styles.restChipTextActive]}>
                  {r.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Your Rating</Text>
        <StarRating rating={rating} size={28} onChange={setRating} />

        <Text style={styles.label}>Caption</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Tell your followers about the experience..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  postAction: { color: colors.primaryDark, fontWeight: '700', fontSize: 15 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  imagePicker: { width: '100%', height: 220, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.lg },
  previewImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.overlay, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  overlayText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  label: { ...typography.h3, marginBottom: spacing.sm, marginTop: spacing.sm },
  restChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
  },
  restChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  restChipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  restChipTextActive: { color: colors.white },
  captionInput: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md, minHeight: 100, textAlignVertical: 'top',
    fontSize: 15, color: colors.text, marginTop: spacing.md,
  },
});
