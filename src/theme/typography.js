import { colors } from './colors';

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text, lineHeight: 21 },
  bodyMuted: { fontSize: 14, fontWeight: '400', color: colors.textMuted, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  button: { fontSize: 15, fontWeight: '700', color: colors.white },
  tag: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
};
