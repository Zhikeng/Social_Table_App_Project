import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Header from '../../components/Header';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { user } = useApp();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.saveAction}>Save</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  saveAction: { color: colors.primaryDark, fontWeight: '700', fontSize: 15 },
  content: { padding: spacing.lg },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: spacing.sm },
  changePhoto: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  label: { ...typography.caption, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12,
    fontSize: 15, color: colors.text,
  },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
});
