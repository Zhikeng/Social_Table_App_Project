import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function StarRating({ rating = 0, size = 14, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: 'row' }}>
      {stars.map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-outline'}
          size={size}
          color={colors.accent}
          style={{ marginRight: 2 }}
          onPress={onChange ? () => onChange(s) : undefined}
        />
      ))}
    </View>
  );
}
