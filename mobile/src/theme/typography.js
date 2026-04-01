import { Platform } from 'react-native';

// Font families – uses system fonts for reliability
// Add custom fonts via expo-font if desired
export const FontFamily = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif' }),
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  bold: Platform.select({ ios: 'System', android: 'sans-serif' }),
  light: Platform.select({ ios: 'System', android: 'sans-serif-light' }),
};

// Font sizes (scaled for mobile)
export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 26,
  '4xl': 30,
  '5xl': 36,
};

// Font weights
export const FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Line heights
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Common text styles
export const TextStyles = {
  h1: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
  },
  h4: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
  },
  body: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
  },
  bodyMedium: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
};

export default { FontFamily, FontSize, FontWeight, LineHeight, TextStyles };
