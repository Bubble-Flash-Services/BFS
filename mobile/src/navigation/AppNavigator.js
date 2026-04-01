import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddressesScreen from '../screens/profile/AddressesScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import EmployeeLoginScreen from '../screens/employee/EmployeeLoginScreen';
import EmployeeDashboardScreen from '../screens/employee/EmployeeDashboardScreen';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Colors from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
function MainTabs() {
  const { totalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Services: focused ? 'grid' : 'grid-outline',
            Cart: focused ? 'cart' : 'cart-outline',
            Orders: focused ? 'receipt' : 'receipt-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={23} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Stack Navigator ─────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* Main App (with Bottom Tabs) */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />

        {/* Additional Screens */}
        <Stack.Screen name="Addresses" component={AddressesScreen} />

        {/* Admin */}
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />

        {/* Employee */}
        <Stack.Screen
          name="EmployeeLogin"
          component={EmployeeLoginScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} />

        {/* Order Detail (placeholder) */}
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Order Detail Screen (simple) ────────────────────────────────────────────
function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params || {};
  const statusColor = {
    pending: Colors.statusPending,
    confirmed: Colors.statusConfirmed,
    'in-progress': Colors.statusInProgress,
    completed: Colors.statusCompleted,
    cancelled: Colors.statusCancelled,
  };
  const status = order?.status?.toLowerCase() || 'pending';
  const color = statusColor[status] || Colors.textMuted;

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <Text style={styles.backArrow} onPress={() => navigation.goBack()}>← Back</Text>
        <Text style={styles.detailTitle}>Order Details</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.orderId}>#{order?._id?.slice(-8).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.statusText, { color }]}>{order?.status || 'Pending'}</Text>
        </View>
        <Text style={styles.detailDate}>
          {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) : ''}
        </Text>

        {order?.items?.map((item, i) => (
          <View key={i} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.serviceName || item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price} × {item.quantity || 1}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹{order?.totalAmount || 0}</Text>
        </View>

        {order?.address && (
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>📍 Delivery Address</Text>
            <Text style={styles.addressText}>
              {order.address.street}, {order.address.city} – {order.address.pincode}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 6,
    paddingBottom: 4,
    height: 62,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  badge: {
    backgroundColor: Colors.error,
    fontSize: 10,
    fontWeight: '700',
  },

  // Order detail
  detailContainer: { flex: 1, backgroundColor: Colors.background },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backArrow: { fontSize: 15, color: Colors.primary, fontWeight: '700', width: 60 },
  detailTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  detailCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderId: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  statusBadge: {
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, alignSelf: 'flex-start', marginBottom: 8,
  },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  detailDate: { fontSize: 13, color: Colors.textMuted, marginBottom: 16 },
  orderItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  itemName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', flex: 1 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 12, marginTop: 4,
  },
  totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  totalAmount: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  addressBlock: {
    marginTop: 16, backgroundColor: Colors.sectionBg,
    borderRadius: 10, padding: 12,
  },
  addressTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  addressText: { fontSize: 13, color: Colors.textSecondary },
});
