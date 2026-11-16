import { Redirect } from 'expo-router';
import { useApp } from '@/shared/context/AppContext';

export default function IndexRoute() {
  const { isAuthenticated } = useApp();
  return <Redirect href={isAuthenticated ? '/(tabs)/discover' : '/(auth)/login'} />;
}
