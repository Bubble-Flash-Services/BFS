import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/auth';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton } from '../../components/Buttons';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, updateAuth, token, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      if (updated && !updated.error) {
        await updateAuth(token, { ...user, ...updated });
        setEditing(false);
        Toast.show({ type: 'success', text1: 'Profile updated!' });
      } else {
        Toast.show({ type: 'error', text1: updated?.message || 'Update failed' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.guestState}>
          <Text style={styles.guestEmoji}>👤</Text>
          <Text style={styles.guestTitle}>Not signed in</Text>
          <Text style={styles.guestSub}>Log in to view and edit your profile</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>Log In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            if (editing) {
              setEditing(false);
              setForm({ name: user?.name || '', phone: user?.phone || '' });
            } else {
              setEditing(true);
            }
          }}
        >
          <Text style={styles.editBtnText}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Info</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={set('name')}
                placeholder="Your full name"
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.name || '—'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={set('phone')}
                placeholder="10-digit number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.phone || 'Not added'}</Text>
            )}
          </View>
        </View>

        {editing && (
          <PrimaryButton
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            style={styles.saveBtn}
          />
        )}

        {/* Quick Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          {[
            { icon: '📦', label: 'My Orders', onPress: () => navigation.navigate('Orders') },
            { icon: '📍', label: 'Saved Addresses', onPress: () => navigation.navigate('Addresses') },
            { icon: '🔔', label: 'Notifications', onPress: () => Toast.show({ type: 'info', text1: 'Coming soon!' }) },
            { icon: '❓', label: 'Help & Support', onPress: () => Toast.show({ type: 'info', text1: 'Email us at support@bubbleflash.in' }) },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i === arr.length - 1 && styles.menuItemLast]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Admin/Employee Login Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Staff Access</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Text style={styles.menuIcon}>🔐</Text>
            <Text style={styles.menuLabel}>Admin Portal</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => navigation.navigate('EmployeeLogin')}
          >
            <Text style={styles.menuIcon}>👷</Text>
            <Text style={styles.menuLabel}>Employee Portal</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Bubble Flash Services v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.full,
  },
  editBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  content: { padding: Spacing.base },

  // Guest state
  guestState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  guestEmoji: { fontSize: 64, marginBottom: 16 },
  guestTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  guestSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 24 },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 13,
    paddingHorizontal: 32,
    ...Shadows.button,
  },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: Colors.secondary },

  // Avatar
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl, marginBottom: Spacing.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Shadows.card,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.secondary },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  userEmail: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  verifiedBadge: {
    backgroundColor: Colors.success + '22',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  verifiedText: { fontSize: 12, fontWeight: '700', color: Colors.success },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  fieldGroup: { paddingVertical: Spacing.sm },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: Colors.divider },
  saveBtn: { marginBottom: Spacing.md },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: { fontSize: 20, marginRight: 12, width: 28 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingVertical: 14,
    marginBottom: Spacing.md,
    gap: 8,
    ...Shadows.card,
    borderWidth: 1.5,
    borderColor: Colors.error + '44',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: Colors.error },

  versionText: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: 4 },
});
