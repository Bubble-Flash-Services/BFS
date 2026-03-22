import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {colors, fontSizes, fontWeights, borderRadius, spacing} from '../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyle = () => {
    const base = [styles.base, styles[`size_${size}`]];
    if (variant === 'primary') {
      base.push(styles.primary);
    } else if (variant === 'secondary') {
      base.push(styles.secondary);
    } else if (variant === 'outline') {
      base.push(styles.outline);
    } else if (variant === 'ghost') {
      base.push(styles.ghost);
    } else if (variant === 'accent') {
      base.push(styles.accent);
    }
    if (isDisabled) {
      base.push(styles.disabled);
    }
    if (style) {
      base.push(style);
    }
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.textBase, styles[`textSize_${size}`]];
    if (variant === 'outline' || variant === 'ghost') {
      base.push(styles.textOutline);
    } else {
      base.push(styles.textSolid);
    }
    if (textStyle) {
      base.push(textStyle);
    }
    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  accent: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.3,
  },
  textSize_sm: {fontSize: fontSizes.sm},
  textSize_md: {fontSize: fontSizes.md},
  textSize_lg: {fontSize: fontSizes.lg},
  textSolid: {color: colors.white},
  textOutline: {color: colors.primary},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {marginRight: spacing[2]},
  iconRight: {marginLeft: spacing[2]},
});

export default Button;
