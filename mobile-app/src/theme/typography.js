import {StyleSheet} from 'react-native';

const typography = StyleSheet.create({
  // Font sizes
  xs: {fontSize: 10},
  sm: {fontSize: 12},
  base: {fontSize: 14},
  md: {fontSize: 16},
  lg: {fontSize: 18},
  xl: {fontSize: 20},
  '2xl': {fontSize: 24},
  '3xl': {fontSize: 30},
  '4xl': {fontSize: 36},
});

export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export default typography;
