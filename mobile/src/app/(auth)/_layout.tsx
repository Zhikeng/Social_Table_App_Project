import { Redirect, Stack } from 'expo-router';
import { useApp } from '@/shared/context/AppContext';

export default function AuthLayout() {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) return <Redirect href="/(tabs)/discover" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}