import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: undefined as string | undefined,
  medium: undefined as string | undefined,
  semibold: undefined as string | undefined,
  bold: undefined as string | undefined,
};

export const typography = {
  display: {
    fontSize: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -1,
    lineHeight: 48,
  },
  displaySmall: {
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
