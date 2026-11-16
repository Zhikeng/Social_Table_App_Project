import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Avatar({ uri, size = 40 }) {
  return (
    <Image
      source={{ uri }}
      style={[
        styles.img,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
