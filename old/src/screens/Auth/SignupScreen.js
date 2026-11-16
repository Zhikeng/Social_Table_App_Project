import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';

export default function SignupScreen({ navigation }) {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Header title="Create Account" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="Jordan Reyes" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={colors.textMuted} autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.primaryBtn} onPress={() => login(email || 'jordan@example.com')}>
          <Text style={typography.button}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  form: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  label: { ...typography.caption, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
