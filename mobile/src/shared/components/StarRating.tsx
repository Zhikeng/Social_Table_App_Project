import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { colors } from '@/shared/theme';

type Props = { rating?: number; size?: number; onChange?: (rating: number) => void };

export default function StarRating({ rating = 0, size = 14, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons key={star} name={star <= Math.round(rating) ? 'star' : 'star-outline'} size={size}
          color={colors.accent} style={{ marginRight: 2 }} onPress={onChange ? () => onChange(star) : undefined} />
      ))}
    </View>
  );
}
