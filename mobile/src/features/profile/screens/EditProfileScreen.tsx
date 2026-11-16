import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import Header from '@/shared/components/Header';
import { useApp } from '@/shared/context/AppContext';
import { colors, radius, spacing, typography } from '@/shared/theme';

export default function EditProfileScreen() {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [username, setUsername] = useState(user.username);
  const save = () => {
    updateUser({ name, bio, username: username.startsWith('@') ? username : `@${username}` });
    router.back();
  };
  return (
    <View style={styles.container}>
      <Header title="Edit Profile" onBack={() => router.back()} right={<TouchableOpacity onPress={save}><Text style={styles.save}>Save</Text></TouchableOpacity>} />
      <View style={styles.content}>
        <View style={styles.avatar}><Image source={{ uri: user.avatar }} style={styles.image} /><Text style={styles.changePhoto}>Change Photo</Text></View>
        <Text style={styles.label}>Name</Text><TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Username</Text><TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Text style={styles.label}>Bio</Text><TextInput style={[styles.input, styles.bio]} value={bio} onChangeText={setBio} multiline />
        <Text style={styles.note}>Profile photo editing can be added with the image picker.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  avatar: { alignItems: 'center', marginBottom: spacing.lg },
  image: { width: 90, height: 90, borderRadius: 45, marginBottom: spacing.sm },
  changePhoto: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  label: { ...typography.caption, marginBottom: 6, marginTop: spacing.md },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15, color: colors.text },
  bio: { minHeight: 80, textAlignVertical: 'top' },
  save: { color: colors.primaryDark, fontWeight: '700', fontSize: 15 },
  note: { ...typography.caption, marginTop: spacing.md },
});
