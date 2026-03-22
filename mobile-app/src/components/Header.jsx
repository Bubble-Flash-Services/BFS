import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing} from '../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Header = ({
  title,
  showBack = false,
  onBackPress,
  showProfile = false,
  onProfilePress,
  location,
  onLocationPress,
  rightComponent,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top || spacing[4]},
        transparent && styles.transparent,
        style,
      ]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBackPress}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="arrow-left" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          {location !== undefined && (
            <TouchableOpacity style={styles.locationRow} onPress={onLocationPress}>
              <Icon name="map-marker" size={16} color={colors.secondary} />
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Your Location</Text>
                <Text style={styles.locationName} numberOfLines={1}>
                  {location || 'Select Location'}
                </Text>
              </View>
              <Icon name="chevron-down" size={16} color={colors.white} />
            </TouchableOpacity>
          )}
          {title && !location && (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>
        <View style={styles.right}>
          {rightComponent}
          {showProfile && (
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={onProfilePress}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="account-circle" size={32} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingBottom: spacing[4],
    paddingHorizontal: spacing.md,
  },
  transparent: {
    backgroundColor: colors.transparent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[2],
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: spacing[3],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: spacing[1],
    marginRight: spacing[1],
    flex: 1,
  },
  locationLabel: {
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: fontWeights.medium,
  },
  locationName: {
    fontSize: fontSizes.base,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
