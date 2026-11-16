import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#FFF8F3', card: '#FFFFFF', primary: '#FF6B4A', primaryDark: '#E4502F',
  secondary: '#2F5D50', accent: '#F4B942', text: '#241C1A', textMuted: '#8A7B75',
  border: '#F0E4DC', overlay: 'rgba(36,28,26,0.55)', danger: '#D64545',
  success: '#3E8E5B', white: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 14, lg: 20, pill: 999 } as const;
export const shadow = {
  card: { shadowColor: '#241C1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text, lineHeight: 21 },
  bodyMuted: { fontSize: 14, fontWeight: '400', color: colors.textMuted, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  button: { fontSize: 15, fontWeight: '700', color: colors.white },
  tag: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
} satisfies Record<string, TextStyle>;

export type AppColor = (typeof colors)[keyof typeof colors];
