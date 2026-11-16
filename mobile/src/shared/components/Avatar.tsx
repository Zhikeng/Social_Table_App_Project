import { Image, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';

type Props = { uri?: string; size?: number };

export default function Avatar({ uri, size = 40 }: Props) {
  return <Image source={uri ? { uri } : undefined} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />;
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border, borderWidth: 1, borderColor: colors.border },
});
