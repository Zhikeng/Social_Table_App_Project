import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.brandWrap}>
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={30} color={colors.white} />
        </View>
        <Text style={styles.brand}>Social Table</Text>
        <Text style={typography.bodyMuted}>Book tables. Share bites. Follow flavors.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={() => login(email || 'jordan@example.com')}>
          <Text style={typography.button}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.secondaryText}>New here? Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestBtn} onPress={() => login()}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  brandWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: { ...typography.h1, marginBottom: 4 },
  form: { width: '100%' },
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
  secondaryBtn: { alignItems: 'center', marginTop: spacing.md },
  secondaryText: { color: colors.primaryDark, fontWeight: '700', fontSize: 14 },
  guestBtn: { alignItems: 'center', marginTop: spacing.sm, padding: spacing.sm },
  guestText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
});
