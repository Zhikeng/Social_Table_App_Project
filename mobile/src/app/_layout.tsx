import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/shared/context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="restaurants/[restaurantId]" />
          <Stack.Screen name="restaurants/[restaurantId]/booking" />
          <Stack.Screen name="feed/[postId]" />
          <Stack.Screen name="feed/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
