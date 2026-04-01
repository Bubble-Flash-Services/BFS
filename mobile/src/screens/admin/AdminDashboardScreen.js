import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard, getAllAdminOrders } from '../../api/admin';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { StatCard } from '../../components/Cards';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

export default function AdminDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { adminToken, adminUser, adminLogout, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchDashboard();
    else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashData, ordersData] = await Promise.allSettled([
        getAdminDashboard(adminToken),
        getAllAdminOrders(adminToken, { limit: 10 }),
      ]);
      if (dashData.status === 'fulfilled') setStats(dashData.value);
      if (ordersData.status === 'fulfilled') {
        const list = ordersData.value?.orders || ordersData.value;
        setRecentOrders(Array.isArray(list) ? list.slice(0, 10) : []);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Log out from admin portal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await adminLogout();
        navigation.replace('Profile');
      }},
    ]);
  };

  if (!isAdmin) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.centerEmoji}>🔐</Text>
          <Text style={styles.centerText}>Admin access required</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('AdminLogin')}>
            <Text style={styles.loginBtnText}>Admin Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>{adminUser?.name || adminUser?.email || 'Administrator'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard
                label="Total Orders"
                value={stats?.totalOrders ?? recentOrders.length}
                icon="📦"
                color={Colors.info}
                style={styles.statCard}
              />
              <StatCard
                label="Revenue"
                value={`₹${stats?.totalRevenue ?? 0}`}
                icon="💰"
                color={Colors.success}
                style={styles.statCard}
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard
                label="Users"
                value={stats?.totalUsers ?? '—'}
                icon="👥"
                color={Colors.warning}
                style={styles.statCard}
              />
              <StatCard
                label="Pending"
                value={stats?.pendingOrders ?? recentOrders.filter(o => o.status === 'pending').length}
                icon="⏳"
                color={Colors.statusPending}
                style={styles.statCard}
              />
            </View>
          </View>

          {/* Recent Orders */}
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            recentOrders.map((order) => (
              <AdminOrderRow key={order._id} order={order} adminToken={adminToken} onRefresh={fetchDashboard} />
            ))
          )}

          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ─── Admin Order Row ──────────────────────────────────────────────────────────
function AdminOrderRow({ order, adminToken, onRefresh }) {
  const statusColor = {
    pending: Colors.statusPending,
    confirmed: Colors.statusConfirmed,
    'in-progress': Colors.statusInProgress,
    completed: Colors.statusCompleted,
    cancelled: Colors.statusCancelled,
  };
  const status = order.status?.toLowerCase() || 'pending';
  const color = statusColor[status] || Colors.textMuted;

  return (
    <View style={styles.orderRow}>
      <View style={styles.orderRowLeft}>
        <Text style={styles.orderRowId}>#{order._id?.slice(-6).toUpperCase()}</Text>
        <Text style={styles.orderRowName} numberOfLines={1}>
          {order.user?.name || order.userName || 'Customer'}
        </Text>
        <Text style={styles.orderRowAmount}>₹{order.totalAmount || 0}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
        <Text style={[styles.statusText, { color }]}>{order.status}</Text>
      </View>
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
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.error + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  centerEmoji: { fontSize: 54, marginBottom: 16 },
  centerText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginBottom: 24 },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 12, paddingHorizontal: 28, ...Shadows.button,
  },
  loginBtnText: { fontSize: 15, fontWeight: '700', color: Colors.secondary },
  content: { padding: Spacing.base },
  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: Colors.textPrimary,
    marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  statsGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1 },
  emptyCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.xl, alignItems: 'center', ...Shadows.card,
  },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  orderRowLeft: { flex: 1 },
  orderRowId: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  orderRowName: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  orderRowAmount: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginTop: 3 },
  statusBadge: {
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, marginLeft: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
