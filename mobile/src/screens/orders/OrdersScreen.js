import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getUserOrders } from '../../api/orders';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { OrderCard } from '../../components/Cards';
import { EmptyState } from '../../components/UI';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function OrdersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'All') return true;
    return o.status?.toLowerCase() === activeFilter.toLowerCase().replace(' ', '-');
  });

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <EmptyState
          emoji="🔐"
          title="Sign in to view orders"
          subtitle="Track your bookings, view history and more"
          actionText="Log In"
          onAction={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading orders…</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          emoji={activeFilter === 'All' ? '📦' : '🔍'}
          title={activeFilter === 'All' ? 'No orders yet' : `No ${activeFilter} orders`}
          subtitle={activeFilter === 'All' ? 'Book a service to see your orders here' : 'Try a different filter'}
          actionText={activeFilter === 'All' ? 'Browse Services' : undefined}
          onAction={() => navigation.navigate('Services')}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchOrders}
        >
          <Text style={styles.countText}>
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </Text>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order._id, order })}
            />
          ))}
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      )}
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
  refreshBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.sectionBg,
  },
  filtersRow: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: 8,
  },
  filterChip: {
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.textPrimary },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  list: { padding: Spacing.base },
  countText: { fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.md },
});
