import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

const MENU_ITEMS = [
  {id: 'notifications', icon: 'bell-outline', label: 'Notifications', badge: true},
  {id: 'addresses', icon: 'map-marker-outline', label: 'Saved Addresses'},
  {id: 'vehicles', icon: 'car-outline', label: 'My Vehicles'},
  {id: 'payments', icon: 'credit-card-outline', label: 'Payment Methods'},
  {id: 'referral', icon: 'gift-outline', label: 'Refer & Earn'},
  {id: 'support', icon: 'headset', label: 'Help & Support'},
  {id: 'about', icon: 'information-outline', label: 'About Us'},
  {id: 'privacy', icon: 'shield-outline', label: 'Privacy Policy'},
];

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  const handleMenuPress = (item) => {
    if (item.id === 'support') {
      Alert.alert('Support', 'Email us at support@bubbleflashservices.in');
    } else {
      Alert.alert(item.label, 'Coming soon!');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Icon name="camera" size={14} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.userMobile}>
          {user?.mobile ? `+91 ${user.mobile}` : 'Not logged in'}
        </Text>
        <TouchableOpacity style={styles.editProfileBtn}>
          <Icon name="pencil" size={14} color={colors.secondary} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            {label: 'Bookings', value: '12'},
            {label: 'Completed', value: '10'},
            {label: 'Points', value: '540'},
          ].map((stat, i) => (
            <View key={i} style={[styles.statItem, i === 1 && styles.statItemMiddle]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, i === MENU_ITEMS.length - 1 && styles.menuItemLast]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconWrap}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                )}
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Bubble Flash Services v1.0.0</Text>
        <View style={{height: spacing.xl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: 4,
  },
  userMobile: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editProfileText: {
    color: colors.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    marginLeft: 4,
  },
  content: {
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statItemMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeights.bold,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.error + '40',
  },
  logoutText: {
    fontSize: fontSizes.md,
    color: colors.error,
    fontWeight: fontWeights.bold,
    marginLeft: spacing.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});

export default ProfileScreen;
